import { TRPCError } from "@trpc/server";
import { and, desc, eq, isNull } from "drizzle-orm";
import { z } from "zod";
import { auditActions, linuxFixProposals, linuxFixes, userHardwareProfiles, users } from "../../drizzle/schema";
import { createRateWindowGate } from "../lib/requestRateLimit";
import { publicProcedure, router } from "../_core/trpc";
import { activeUserProcedure, moderatorProcedure, requireDatabase } from "./_guards";

const proposalGate = createRateWindowGate({ windowMs: 60 * 60 * 1000, maxRequests: 6 });
const fixIdInput = z.object({ fixId: z.number().int().positive() });
const proposalInput = fixIdInput.extend({
  title: z.string().trim().min(8).max(300),
  observation: z.string().trim().min(30).max(5000),
  reproduction: z.string().trim().min(20).max(5000),
  suggestedSteps: z.string().trim().min(30).max(8000),
  sourceUrl: z.string().trim().url().max(2048).nullable().optional(),
  shareTechnicalContext: z.boolean().default(false),
});
const reviewStatus = z.enum(["in_review", "accepted", "rejected"]);

export type SafeProposalContext = { distribution: string | null; kernel: string | null; driver: string | null; proton: string | null; wine: string | null; gpu: string | null };

export function toSafeProposalContext(profile: typeof userHardwareProfiles.$inferSelect): SafeProposalContext {
  return {
    distribution: profile.detectedDistribution ?? null,
    kernel: profile.kernelVersion ?? null,
    driver: profile.driverVersion ?? null,
    proton: profile.protonVersion ?? null,
    wine: profile.wineVersion ?? null,
    gpu: profile.detectedGpu ?? null,
  };
}

async function assertPublishedFix(fixId: number) {
  const db = await requireDatabase();
  const fix = (await db.select({ id: linuxFixes.id }).from(linuxFixes).where(and(eq(linuxFixes.id, fixId), eq(linuxFixes.status, "published"), isNull(linuxFixes.deletedAt))).limit(1))[0];
  if (!fix) throw new TRPCError({ code: "NOT_FOUND", message: "Runbook LinuxFix não encontrado ou indisponível." });
  return db;
}

export const linuxFixCommunityRouter = router({
  proposals: router({
    my: activeUserProcedure.query(async ({ ctx }) => {
      const db = await requireDatabase();
      return db.select({ proposal: linuxFixProposals, fixTitle: linuxFixes.title, fixSlug: linuxFixes.slug }).from(linuxFixProposals).innerJoin(linuxFixes, eq(linuxFixProposals.fixId, linuxFixes.id)).where(eq(linuxFixProposals.authorId, ctx.user.id)).orderBy(desc(linuxFixProposals.updatedAt)).limit(60);
    }),
    submit: activeUserProcedure.input(proposalInput).mutation(async ({ ctx, input }) => {
      const rate = proposalGate(`linuxfix-proposal:${ctx.user.id}`);
      if (!rate.allowed) throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: `Aguarde ${rate.retryAfterSeconds}s antes de enviar outra proposta.` });
      const db = await assertPublishedFix(input.fixId);
      const profile = input.shareTechnicalContext ? (await db.select().from(userHardwareProfiles).where(and(eq(userHardwareProfiles.userId, ctx.user.id), eq(userHardwareProfiles.isActive, true))).limit(1))[0] : undefined;
      const contextSnapshot = profile ? toSafeProposalContext(profile) : null;
      const result = await db.insert(linuxFixProposals).values({ fixId: input.fixId, authorId: ctx.user.id, title: input.title, observation: input.observation, reproduction: input.reproduction, suggestedSteps: input.suggestedSteps, sourceUrl: input.sourceUrl ?? null, contextSnapshot, contextSharedAt: contextSnapshot ? new Date() : null, status: "submitted" });
      const id = Number(result[0].insertId);
      await db.insert(auditActions).values({ actorId: ctx.user.id, action: "submit", entityType: "linux_fix_proposal", entityId: id, metadata: { fixId: input.fixId, contextShared: Boolean(contextSnapshot), sourceProvided: Boolean(input.sourceUrl) } });
      return { id, status: "submitted" as const };
    }),
    withdraw: activeUserProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const db = await requireDatabase();
      const proposal = (await db.select({ id: linuxFixProposals.id, status: linuxFixProposals.status }).from(linuxFixProposals).where(and(eq(linuxFixProposals.id, input.id), eq(linuxFixProposals.authorId, ctx.user.id))).limit(1))[0];
      if (!proposal) throw new TRPCError({ code: "NOT_FOUND", message: "Proposta não encontrada." });
      if (proposal.status !== "submitted") throw new TRPCError({ code: "CONFLICT", message: "Somente propostas ainda submetidas podem ser retiradas." });
      await db.update(linuxFixProposals).set({ status: "withdrawn" }).where(eq(linuxFixProposals.id, proposal.id));
      await db.insert(auditActions).values({ actorId: ctx.user.id, action: "withdraw", entityType: "linux_fix_proposal", entityId: proposal.id });
      return { withdrawn: true };
    }),
  }),
  moderation: router({
    list: moderatorProcedure.input(z.object({ status: z.enum(["submitted", "in_review", "accepted", "rejected", "withdrawn"]).optional() }).optional()).query(async ({ input }) => {
      const db = await requireDatabase();
      const conditions = input?.status ? [eq(linuxFixProposals.status, input.status)] : [and(eq(linuxFixProposals.status, "submitted"), isNull(linuxFixes.deletedAt))!];
      return db.select({ proposal: linuxFixProposals, fixTitle: linuxFixes.title, fixSlug: linuxFixes.slug, authorName: users.name }).from(linuxFixProposals).innerJoin(linuxFixes, eq(linuxFixProposals.fixId, linuxFixes.id)).innerJoin(users, eq(linuxFixProposals.authorId, users.id)).where(and(...conditions)).orderBy(desc(linuxFixProposals.createdAt)).limit(100);
    }),
    review: moderatorProcedure.input(z.object({ id: z.number().int().positive(), status: reviewStatus, reviewNote: z.string().trim().min(8).max(5000) })).mutation(async ({ ctx, input }) => {
      const db = await requireDatabase();
      const proposal = (await db.select({ id: linuxFixProposals.id, status: linuxFixProposals.status }).from(linuxFixProposals).where(eq(linuxFixProposals.id, input.id)).limit(1))[0];
      if (!proposal) throw new TRPCError({ code: "NOT_FOUND", message: "Proposta não encontrada." });
      if (proposal.status === "withdrawn") throw new TRPCError({ code: "CONFLICT", message: "Uma proposta retirada não pode ser revisada." });
      await db.update(linuxFixProposals).set({ status: input.status, reviewerId: ctx.user.id, reviewNote: input.reviewNote, reviewedAt: new Date() }).where(eq(linuxFixProposals.id, proposal.id));
      await db.insert(auditActions).values({ actorId: ctx.user.id, action: "review", entityType: "linux_fix_proposal", entityId: proposal.id, metadata: { status: input.status } });
      return { status: input.status };
    }),
  }),
});
