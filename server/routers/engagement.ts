import { and, desc, eq, isNull, sql } from "drizzle-orm";
import { z } from "zod";
import {
  linuxFixComments,
  linuxFixConfirmations,
  linuxFixSolutions,
  linuxFixVotes,
  linuxFixes,
  setupGuideStepProgress,
  setupGuideSteps,
  setupGuides,
  users,
} from "../../drizzle/schema";
import { publicProcedure, router } from "../_core/trpc";
import { activeUserProcedure, requireDatabase } from "./_guards";

const fixIdInput = z.object({ fixId: z.number().int().positive() });

async function assertPublishedFix(fixId: number) {
  const db = await requireDatabase();
  const fix = (
    await db
      .select({ id: linuxFixes.id })
      .from(linuxFixes)
      .where(and(eq(linuxFixes.id, fixId), eq(linuxFixes.status, "published"), isNull(linuxFixes.deletedAt)))
      .limit(1)
  )[0];
  if (!fix) throw new Error("Solução LinuxFix não encontrada ou indisponível.");
  return db;
}

export const engagementRouter = router({
  linuxFix: router({
    summary: publicProcedure.input(fixIdInput).query(async ({ input }) => {
      const db = await requireDatabase();
      const [votes, confirmations, comments] = await Promise.all([
        db
          .select({ score: sql<number>`coalesce(sum(${linuxFixVotes.value}), 0)`, total: sql<number>`count(*)` })
          .from(linuxFixVotes)
          .where(eq(linuxFixVotes.fixId, input.fixId)),
        db.select({ total: sql<number>`count(*)` }).from(linuxFixConfirmations).where(eq(linuxFixConfirmations.fixId, input.fixId)),
        db
          .select({ total: sql<number>`count(*)` })
          .from(linuxFixComments)
          .where(and(eq(linuxFixComments.fixId, input.fixId), isNull(linuxFixComments.deletedAt))),
      ]);
      return {
        score: Number(votes[0]?.score ?? 0),
        voteCount: Number(votes[0]?.total ?? 0),
        confirmationCount: Number(confirmations[0]?.total ?? 0),
        commentCount: Number(comments[0]?.total ?? 0),
      };
    }),
    comments: publicProcedure.input(fixIdInput.extend({ limit: z.number().int().min(1).max(50).default(20) })).query(async ({ input }) => {
      const db = await requireDatabase();
      return db
        .select({
          id: linuxFixComments.id,
          body: linuxFixComments.body,
          isSolution: linuxFixComments.isSolution,
          createdAt: linuxFixComments.createdAt,
          userName: users.name,
        })
        .from(linuxFixComments)
        .innerJoin(users, eq(linuxFixComments.userId, users.id))
        .where(and(eq(linuxFixComments.fixId, input.fixId), isNull(linuxFixComments.deletedAt)))
        .orderBy(desc(linuxFixComments.createdAt))
        .limit(input.limit);
    }),
    myState: activeUserProcedure.input(fixIdInput).query(async ({ ctx, input }) => {
      const db = await requireDatabase();
      const [vote, confirmation] = await Promise.all([
        db.select({ value: linuxFixVotes.value }).from(linuxFixVotes).where(and(eq(linuxFixVotes.fixId, input.fixId), eq(linuxFixVotes.userId, ctx.user.id))).limit(1),
        db.select({ id: linuxFixConfirmations.id }).from(linuxFixConfirmations).where(and(eq(linuxFixConfirmations.fixId, input.fixId), eq(linuxFixConfirmations.userId, ctx.user.id))).limit(1),
      ]);
      return { vote: vote[0]?.value ?? null, confirmed: Boolean(confirmation[0]) };
    }),
    vote: activeUserProcedure.input(fixIdInput.extend({ value: z.union([z.literal(-1), z.literal(1)] ) })).mutation(async ({ ctx, input }) => {
      const db = await assertPublishedFix(input.fixId);
      const existing = (
        await db.select({ id: linuxFixVotes.id }).from(linuxFixVotes).where(and(eq(linuxFixVotes.fixId, input.fixId), eq(linuxFixVotes.userId, ctx.user.id))).limit(1)
      )[0];
      if (existing) await db.update(linuxFixVotes).set({ value: input.value }).where(eq(linuxFixVotes.id, existing.id));
      else await db.insert(linuxFixVotes).values({ fixId: input.fixId, userId: ctx.user.id, value: input.value });
      return { value: input.value };
    }),
    confirm: activeUserProcedure.input(fixIdInput.extend({ solutionId: z.number().int().positive().nullable().optional() })).mutation(async ({ ctx, input }) => {
      const db = await assertPublishedFix(input.fixId);
      if (input.solutionId) {
        const solution = (await db.select({ id: linuxFixSolutions.id }).from(linuxFixSolutions).where(and(eq(linuxFixSolutions.id, input.solutionId), eq(linuxFixSolutions.fixId, input.fixId))).limit(1))[0];
        if (!solution) throw new Error("Etapa da solução não pertence a este diagnóstico.");
      }
      const existing = (await db.select({ id: linuxFixConfirmations.id }).from(linuxFixConfirmations).where(and(eq(linuxFixConfirmations.fixId, input.fixId), eq(linuxFixConfirmations.userId, ctx.user.id))).limit(1))[0];
      if (existing) {
        await db.delete(linuxFixConfirmations).where(eq(linuxFixConfirmations.id, existing.id));
        return { confirmed: false };
      }
      await db.insert(linuxFixConfirmations).values({ fixId: input.fixId, solutionId: input.solutionId ?? null, userId: ctx.user.id });
      return { confirmed: true };
    }),
    comment: activeUserProcedure.input(fixIdInput.extend({ body: z.string().trim().min(8).max(3000) })).mutation(async ({ ctx, input }) => {
      const db = await assertPublishedFix(input.fixId);
      const result = await db.insert(linuxFixComments).values({ fixId: input.fixId, userId: ctx.user.id, body: input.body, isSolution: false });
      return { id: Number(result[0].insertId) };
    }),
  }),
  guides: router({
    progress: activeUserProcedure.input(z.object({ guideId: z.number().int().positive() })).query(async ({ ctx, input }) => {
      const db = await requireDatabase();
      return db
        .select({ guideStepId: setupGuideStepProgress.guideStepId })
        .from(setupGuideStepProgress)
        .innerJoin(setupGuideSteps, eq(setupGuideStepProgress.guideStepId, setupGuideSteps.id))
        .where(and(eq(setupGuideStepProgress.userId, ctx.user.id), eq(setupGuideSteps.guideId, input.guideId)));
    }),
    toggleStep: activeUserProcedure.input(z.object({ guideStepId: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const db = await requireDatabase();
      const step = (
        await db
          .select({ id: setupGuideSteps.id })
          .from(setupGuideSteps)
          .innerJoin(setupGuides, eq(setupGuideSteps.guideId, setupGuides.id))
          .where(and(eq(setupGuideSteps.id, input.guideStepId), eq(setupGuides.status, "published"), isNull(setupGuides.deletedAt)))
          .limit(1)
      )[0];
      if (!step) throw new Error("Etapa de guia indisponível.");
      const existing = (await db.select({ id: setupGuideStepProgress.id }).from(setupGuideStepProgress).where(and(eq(setupGuideStepProgress.userId, ctx.user.id), eq(setupGuideStepProgress.guideStepId, input.guideStepId))).limit(1))[0];
      if (existing) {
        await db.delete(setupGuideStepProgress).where(eq(setupGuideStepProgress.id, existing.id));
        return { completed: false };
      }
      await db.insert(setupGuideStepProgress).values({ userId: ctx.user.id, guideStepId: input.guideStepId });
      return { completed: true };
    }),
  }),
});
