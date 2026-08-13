import { and, count, desc, eq, isNull, or } from "drizzle-orm";
import { z } from "zod";
import { auditActions, benchmarks, distributions, games, hardwareItems, reports, users } from "../../drizzle/schema";
import { router } from "../_core/trpc";
import { administratorProcedure, requireDatabase } from "./_guards";

const status = z.enum(["draft", "published", "archived"]);
const sourceUrl = z.string().trim().url().max(2048).nullable().optional();

function assertSourceWhenPublishing(nextStatus: "draft" | "published" | "archived", nextUrl: string | null | undefined, previousUrl?: string | null) {
  if (nextStatus === "published" && !nextUrl && !previousUrl) throw new Error("Conteúdo publicado exige uma URL de fonte registrada.");
}

export const adminRouter = router({
  overview: administratorProcedure.query(async () => {
    const db = await requireDatabase();
    const [[gameCount], [distroCount], [hardwareCount], [pendingBenchmarks], [openReports]] = await Promise.all([
      db.select({ total: count() }).from(games).where(isNull(games.deletedAt)),
      db.select({ total: count() }).from(distributions).where(isNull(distributions.deletedAt)),
      db.select({ total: count() }).from(hardwareItems).where(isNull(hardwareItems.deletedAt)),
      db.select({ total: count() }).from(benchmarks).where(eq(benchmarks.verificationStatus, "submitted")),
      db.select({ total: count() }).from(reports).where(eq(reports.status, "open")),
    ]);
    return { games: gameCount.total, distributions: distroCount.total, hardware: hardwareCount.total, pendingBenchmarks: pendingBenchmarks.total, openReports: openReports.total };
  }),

  games: router({
    list: administratorProcedure.query(async () => { const db = await requireDatabase(); return db.select().from(games).where(isNull(games.deletedAt)).orderBy(desc(games.updatedAt)).limit(100); }),
    save: administratorProcedure.input(z.object({ id: z.number().int().positive().optional(), slug: z.string().trim().min(2).max(220), title: z.string().trim().min(2).max(400), steamAppId: z.number().int().positive().nullable().optional(), shortDescription: z.string().trim().max(600).nullable().optional(), status, sourceUrl })).mutation(async ({ ctx, input }) => {
      const db = await requireDatabase(); const { id, ...value } = input;
      const existing = id ? (await db.select().from(games).where(eq(games.id, id)).limit(1))[0] : undefined;
      if (id && !existing) throw new Error("Jogo não encontrado.");
      assertSourceWhenPublishing(value.status, value.sourceUrl, existing?.sourceUrl);
      let entityId = id;
      if (id) await db.update(games).set(value).where(eq(games.id, id)); else { const result = await db.insert(games).values(value); entityId = Number(result[0].insertId); }
      await db.insert(auditActions).values({ actorId: ctx.user.id, action: id ? "update" : "create", entityType: "game", entityId: entityId!, metadata: { status: value.status } });
      return { id: entityId };
    }),
  }),

  distributions: router({
    list: administratorProcedure.query(async () => { const db = await requireDatabase(); return db.select().from(distributions).where(isNull(distributions.deletedAt)).orderBy(desc(distributions.updatedAt)).limit(100); }),
    save: administratorProcedure.input(z.object({ id: z.number().int().positive().optional(), slug: z.string().trim().min(2).max(120), name: z.string().trim().min(2).max(160), family: z.string().trim().max(120).nullable().optional(), packageManager: z.string().trim().max(120).nullable().optional(), officialUrl: sourceUrl, sourceUrl, status })).mutation(async ({ ctx, input }) => {
      const db = await requireDatabase(); const { id, ...value } = input;
      const existing = id ? (await db.select().from(distributions).where(eq(distributions.id, id)).limit(1))[0] : undefined;
      if (id && !existing) throw new Error("Distribuição não encontrada.");
      assertSourceWhenPublishing(value.status, value.sourceUrl, existing?.sourceUrl);
      let entityId = id;
      if (id) await db.update(distributions).set(value).where(eq(distributions.id, id)); else { const result = await db.insert(distributions).values(value); entityId = Number(result[0].insertId); }
      await db.insert(auditActions).values({ actorId: ctx.user.id, action: id ? "update" : "create", entityType: "distribution", entityId: entityId!, metadata: { status: value.status } });
      return { id: entityId };
    }),
  }),

  hardware: router({
    list: administratorProcedure.query(async () => { const db = await requireDatabase(); return db.select().from(hardwareItems).where(isNull(hardwareItems.deletedAt)).orderBy(desc(hardwareItems.updatedAt)).limit(120); }),
    save: administratorProcedure.input(z.object({ id: z.number().int().positive().optional(), slug: z.string().trim().min(2).max(220), kind: z.enum(["cpu", "gpu", "ram"]), manufacturer: z.string().trim().min(1).max(160), model: z.string().trim().min(1).max(255), architecture: z.string().trim().max(160).nullable().optional(), vramMb: z.number().int().positive().nullable().optional(), sourceUrl })).mutation(async ({ ctx, input }) => {
      const db = await requireDatabase(); const { id, ...value } = input;
      const existing = id ? (await db.select().from(hardwareItems).where(eq(hardwareItems.id, id)).limit(1))[0] : undefined;
      if (id && !existing) throw new Error("Hardware não encontrado.");
      let entityId = id;
      if (id) await db.update(hardwareItems).set(value).where(eq(hardwareItems.id, id)); else { const result = await db.insert(hardwareItems).values(value); entityId = Number(result[0].insertId); }
      await db.insert(auditActions).values({ actorId: ctx.user.id, action: id ? "update" : "create", entityType: "hardware", entityId: entityId!, metadata: { kind: value.kind } });
      return { id: entityId };
    }),
  }),

  moderation: router({
    benchmarks: administratorProcedure.query(async () => { const db = await requireDatabase(); return db.select({ benchmark: benchmarks, gameTitle: games.title }).from(benchmarks).innerJoin(games, eq(benchmarks.gameId, games.id)).where(eq(benchmarks.verificationStatus, "submitted")).orderBy(desc(benchmarks.createdAt)).limit(100); }),
    reports: administratorProcedure.query(async () => { const db = await requireDatabase(); return db.select({ report: reports, reporterName: users.name, reporterEmail: users.email }).from(reports).innerJoin(users, eq(reports.reporterId, users.id)).where(and(or(eq(reports.status, "open"), eq(reports.status, "in_review")))).orderBy(desc(reports.createdAt)).limit(100); }),
    reviewReport: administratorProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["in_review", "resolved", "rejected"]), resolution: z.string().trim().max(4000).nullable().optional() })).mutation(async ({ ctx, input }) => {
      const db = await requireDatabase(); await db.update(reports).set({ status: input.status, reviewerId: ctx.user.id, resolution: input.resolution, resolvedAt: input.status === "resolved" || input.status === "rejected" ? new Date() : null }).where(eq(reports.id, input.id)); await db.insert(auditActions).values({ actorId: ctx.user.id, action: "review", entityType: "report", entityId: input.id, metadata: { status: input.status } }); return { success: true };
    }),
  }),

  users: router({
    list: administratorProcedure.query(async () => { const db = await requireDatabase(); return db.select({ id: users.id, name: users.name, email: users.email, role: users.role, isBanned: users.isBanned, createdAt: users.createdAt, lastSignedIn: users.lastSignedIn }).from(users).orderBy(desc(users.lastSignedIn)).limit(100); }),
    setRole: administratorProcedure.input(z.object({ userId: z.number().int().positive(), role: z.enum(["user", "moderator", "admin"]) })).mutation(async ({ ctx, input }) => { const db = await requireDatabase(); await db.update(users).set({ role: input.role }).where(eq(users.id, input.userId)); await db.insert(auditActions).values({ actorId: ctx.user.id, action: "set_role", entityType: "user", entityId: input.userId, metadata: { role: input.role } }); return { success: true }; }),
    setBan: administratorProcedure.input(z.object({ userId: z.number().int().positive(), isBanned: z.boolean() })).mutation(async ({ ctx, input }) => { const db = await requireDatabase(); await db.update(users).set({ isBanned: input.isBanned, bannedAt: input.isBanned ? new Date() : null }).where(eq(users.id, input.userId)); await db.insert(auditActions).values({ actorId: ctx.user.id, action: input.isBanned ? "ban" : "unban", entityType: "user", entityId: input.userId }); return { success: true }; }),
  }),

  audit: administratorProcedure.query(async () => { const db = await requireDatabase(); return db.select().from(auditActions).orderBy(desc(auditActions.createdAt)).limit(100); }),
});
