import { and, count, desc, eq, isNull, or } from "drizzle-orm";
import { z } from "zod";
import { auditActions, benchmarkResults, benchmarks, distributions, games, hardwareItems, linuxFixes, linuxFixSolutions, reports, setupGuides, setupGuideSteps, users } from "../../drizzle/schema";
import { router } from "../_core/trpc";
import { administratorProcedure, requireDatabase } from "./_guards";

const status = z.enum(["draft", "published", "archived"]);
const sourceUrl = z.string().trim().url().max(2048).nullable().optional();
const guideStepsInput = z.array(z.object({ title: z.string().trim().min(2).max(400), explanation: z.string().trim().max(12000).nullable().optional(), command: z.string().trim().max(12000).nullable().optional(), warning: z.string().trim().max(12000).nullable().optional() })).min(1).max(80);
const fixSolutionsInput = z.array(z.object({ title: z.string().trim().min(2).max(400), explanation: z.string().trim().max(12000).nullable().optional(), command: z.string().trim().max(12000).nullable().optional(), warning: z.string().trim().max(12000).nullable().optional() })).min(1).max(80);
export const benchmarkResultsInput = z.array(z.object({ resolutionWidth: z.number().int().min(320).max(16384), resolutionHeight: z.number().int().min(240).max(8640), preset: z.string().trim().min(1).max(160), averageFps: z.number().positive().max(10000), onePercentLowFps: z.number().positive().max(10000).nullable().optional(), zeroPointOnePercentLowFps: z.number().positive().max(10000).nullable().optional() })).min(1).max(12);

export function assertSourceWhenPublishing(nextStatus: "draft" | "published" | "archived", nextUrl: string | null | undefined, previousUrl?: string | null) {
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
    archive: administratorProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => { const db = await requireDatabase(); await db.update(games).set({ status: "archived", deletedAt: new Date() }).where(eq(games.id, input.id)); await db.insert(auditActions).values({ actorId: ctx.user.id, action: "archive", entityType: "game", entityId: input.id }); return { success: true }; }),
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
    archive: administratorProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => { const db = await requireDatabase(); await db.update(distributions).set({ status: "archived", deletedAt: new Date() }).where(eq(distributions.id, input.id)); await db.insert(auditActions).values({ actorId: ctx.user.id, action: "archive", entityType: "distribution", entityId: input.id }); return { success: true }; }),
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
    archive: administratorProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => { const db = await requireDatabase(); await db.update(hardwareItems).set({ deletedAt: new Date() }).where(eq(hardwareItems.id, input.id)); await db.insert(auditActions).values({ actorId: ctx.user.id, action: "archive", entityType: "hardware", entityId: input.id }); return { success: true }; }),
  }),

  guides: router({
    list: administratorProcedure.query(async () => { const db = await requireDatabase(); return db.select().from(setupGuides).where(isNull(setupGuides.deletedAt)).orderBy(desc(setupGuides.updatedAt)).limit(100); }),
    byId: administratorProcedure.input(z.object({ id: z.number().int().positive() })).query(async ({ input }) => { const db = await requireDatabase(); const guide = (await db.select().from(setupGuides).where(and(eq(setupGuides.id, input.id), isNull(setupGuides.deletedAt))).limit(1))[0]; if (!guide) return null; const steps = await db.select().from(setupGuideSteps).where(eq(setupGuideSteps.guideId, guide.id)).orderBy(setupGuideSteps.stepOrder); return { guide, steps }; }),
    save: administratorProcedure.input(z.object({ id: z.number().int().positive().optional(), slug: z.string().trim().min(2).max(220), title: z.string().trim().min(2).max(400), description: z.string().trim().max(12000).nullable().optional(), difficulty: z.enum(["beginner", "intermediate", "advanced"]), guideVersion: z.string().trim().max(120).nullable().optional(), distributionId: z.number().int().positive().nullable().optional(), distributionVersionId: z.number().int().positive().nullable().optional(), gameId: z.number().int().positive().nullable().optional(), provenance: z.enum(["verified", "community", "estimated", "unknown"]), sourceUrl, status, steps: guideStepsInput })).mutation(async ({ ctx, input }) => {
      const db = await requireDatabase(); const { id, steps, ...value } = input;
      const existing = id ? (await db.select().from(setupGuides).where(eq(setupGuides.id, id)).limit(1))[0] : undefined;
      if (id && !existing) throw new Error("Guia não encontrado.");
      assertSourceWhenPublishing(value.status, value.sourceUrl, existing?.sourceUrl);
      let entityId = id;
      if (id) { await db.update(setupGuides).set({ ...value, reviewedById: ctx.user.id, reviewedAt: new Date() }).where(eq(setupGuides.id, id)); await db.delete(setupGuideSteps).where(eq(setupGuideSteps.guideId, id)); }
      else { const result = await db.insert(setupGuides).values({ ...value, authorId: ctx.user.id, reviewedById: value.status === "published" ? ctx.user.id : null, reviewedAt: value.status === "published" ? new Date() : null }); entityId = Number(result[0].insertId); }
      await db.insert(setupGuideSteps).values(steps.map((step, index) => ({ ...step, guideId: entityId!, stepOrder: index + 1 })));
      await db.insert(auditActions).values({ actorId: ctx.user.id, action: id ? "update" : "create", entityType: "setup_guide", entityId: entityId!, metadata: { status: value.status, stepCount: steps.length } });
      return { id: entityId };
    }),
    archive: administratorProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => { const db = await requireDatabase(); await db.update(setupGuides).set({ status: "archived", deletedAt: new Date() }).where(eq(setupGuides.id, input.id)); await db.insert(auditActions).values({ actorId: ctx.user.id, action: "archive", entityType: "setup_guide", entityId: input.id }); return { success: true }; }),
  }),

  linuxFix: router({
    list: administratorProcedure.query(async () => { const db = await requireDatabase(); return db.select().from(linuxFixes).where(isNull(linuxFixes.deletedAt)).orderBy(desc(linuxFixes.updatedAt)).limit(100); }),
    byId: administratorProcedure.input(z.object({ id: z.number().int().positive() })).query(async ({ input }) => { const db = await requireDatabase(); const fix = (await db.select().from(linuxFixes).where(and(eq(linuxFixes.id, input.id), isNull(linuxFixes.deletedAt))).limit(1))[0]; if (!fix) return null; const solutions = await db.select().from(linuxFixSolutions).where(eq(linuxFixSolutions.fixId, fix.id)).orderBy(linuxFixSolutions.stepOrder); return { fix, solutions }; }),
    save: administratorProcedure.input(z.object({ id: z.number().int().positive().optional(), slug: z.string().trim().min(2).max(220), title: z.string().trim().min(2).max(400), category: z.enum(["steam", "proton", "wine", "vulkan", "amd", "nvidia", "intel", "anti_cheat", "audio", "controller", "fps", "stuttering", "crashes", "black_screen", "launch_errors", "other"]), symptoms: z.string().trim().min(8).max(12000), possibleCauses: z.string().trim().min(8).max(12000), gameId: z.number().int().positive().nullable().optional(), distributionId: z.number().int().positive().nullable().optional(), hardwareId: z.number().int().positive().nullable().optional(), affectedVersion: z.string().trim().max(160).nullable().optional(), confidence: z.enum(["high", "medium", "low", "unknown"]), provenance: z.enum(["verified", "community", "estimated", "unknown"]), sourceUrl, status, solutions: fixSolutionsInput })).mutation(async ({ ctx, input }) => {
      const db = await requireDatabase(); const { id, solutions, ...value } = input;
      const existing = id ? (await db.select().from(linuxFixes).where(eq(linuxFixes.id, id)).limit(1))[0] : undefined;
      if (id && !existing) throw new Error("Solução LinuxFix não encontrada.");
      assertSourceWhenPublishing(value.status, value.sourceUrl, existing?.sourceUrl);
      let entityId = id;
      if (id) { await db.update(linuxFixes).set({ ...value, reviewedById: ctx.user.id, reviewedAt: new Date() }).where(eq(linuxFixes.id, id)); await db.delete(linuxFixSolutions).where(eq(linuxFixSolutions.fixId, id)); }
      else { const result = await db.insert(linuxFixes).values({ ...value, authorId: ctx.user.id, reviewedById: value.status === "published" ? ctx.user.id : null, reviewedAt: value.status === "published" ? new Date() : null }); entityId = Number(result[0].insertId); }
      await db.insert(linuxFixSolutions).values(solutions.map((solution, index) => ({ ...solution, fixId: entityId!, stepOrder: index + 1 })));
      await db.insert(auditActions).values({ actorId: ctx.user.id, action: id ? "update" : "create", entityType: "linux_fix", entityId: entityId!, metadata: { status: value.status, solutionCount: solutions.length } });
      return { id: entityId };
    }),
    archive: administratorProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => { const db = await requireDatabase(); await db.update(linuxFixes).set({ status: "archived", deletedAt: new Date() }).where(eq(linuxFixes.id, input.id)); await db.insert(auditActions).values({ actorId: ctx.user.id, action: "archive", entityType: "linux_fix", entityId: input.id }); return { success: true }; }),
  }),

  benchmarks: router({
    list: administratorProcedure.query(async () => { const db = await requireDatabase(); return db.select({ benchmark: benchmarks, gameTitle: games.title }).from(benchmarks).innerJoin(games, eq(benchmarks.gameId, games.id)).orderBy(desc(benchmarks.updatedAt)).limit(100); }),
    byId: administratorProcedure.input(z.object({ id: z.number().int().positive() })).query(async ({ input }) => { const db = await requireDatabase(); const benchmark = (await db.select().from(benchmarks).where(eq(benchmarks.id, input.id)).limit(1))[0]; if (!benchmark) return null; const results = await db.select().from(benchmarkResults).where(eq(benchmarkResults.benchmarkId, input.id)); return { benchmark, results }; }),
    save: administratorProcedure.input(z.object({ id: z.number().int().positive().optional(), gameId: z.number().int().positive(), cpuId: z.number().int().positive().nullable().optional(), gpuId: z.number().int().positive().nullable().optional(), distributionId: z.number().int().positive().nullable().optional(), distributionVersionId: z.number().int().positive().nullable().optional(), gameVersion: z.string().trim().max(160).nullable().optional(), kernelVersion: z.string().trim().max(160).nullable().optional(), driverVersion: z.string().trim().max(160).nullable().optional(), protonVersion: z.string().trim().max(160).nullable().optional(), wineVersion: z.string().trim().max(160).nullable().optional(), runtimeVersion: z.string().trim().max(160).nullable().optional(), sourceLabel: z.string().trim().min(2).max(255), sourceUrl: z.string().trim().url().max(2048), evidenceNote: z.string().trim().max(6000).nullable().optional(), provenance: z.enum(["verified", "community", "estimated", "unknown"]), verificationStatus: z.enum(["submitted", "in_review", "verified", "rejected"]), measuredAt: z.coerce.date().nullable().optional(), results: benchmarkResultsInput })).mutation(async ({ ctx, input }) => {
      const db = await requireDatabase(); const { id, results, ...value } = input; const existing = id ? (await db.select().from(benchmarks).where(eq(benchmarks.id, id)).limit(1))[0] : undefined; if (id && !existing) throw new Error("Benchmark não encontrado.");
      const base = { ...value, userId: ctx.user.id, hardwareProfileId: null, ramId: null, mesaVersion: null, nvidiaVersion: null, sourceType: "admin_entry" as const, reviewedById: value.verificationStatus === "verified" || value.verificationStatus === "rejected" ? ctx.user.id : null, reviewedAt: value.verificationStatus === "verified" || value.verificationStatus === "rejected" ? new Date() : null };
      let entityId = id; if (id) { await db.update(benchmarks).set(base).where(eq(benchmarks.id, id)); await db.delete(benchmarkResults).where(eq(benchmarkResults.benchmarkId, id)); } else { const created = await db.insert(benchmarks).values(base); entityId = Number(created[0].insertId); }
      await db.insert(benchmarkResults).values(results.map((result) => ({ ...result, benchmarkId: entityId!, averageFps: result.averageFps.toString(), onePercentLowFps: result.onePercentLowFps?.toString(), zeroPointOnePercentLowFps: result.zeroPointOnePercentLowFps?.toString(), temperatureC: null, powerWatts: null })));
      await db.insert(auditActions).values({ actorId: ctx.user.id, action: id ? "update" : "create", entityType: "benchmark", entityId: entityId!, metadata: { status: value.verificationStatus, provenance: value.provenance, resultCount: results.length } }); return { id: entityId };
    }),
    remove: administratorProcedure.input(z.object({ id: z.number().int().positive(), reason: z.string().trim().min(4).max(1000) })).mutation(async ({ ctx, input }) => { const db = await requireDatabase(); await db.delete(benchmarks).where(eq(benchmarks.id, input.id)); await db.insert(auditActions).values({ actorId: ctx.user.id, action: "delete", entityType: "benchmark", entityId: input.id, metadata: { reason: input.reason } }); return { success: true }; }),
  }),

  reports: router({
    list: administratorProcedure.query(async () => { const db = await requireDatabase(); return db.select({ report: reports, reporterName: users.name, reporterEmail: users.email }).from(reports).innerJoin(users, eq(reports.reporterId, users.id)).orderBy(desc(reports.updatedAt)).limit(100); }),
    save: administratorProcedure.input(z.object({ id: z.number().int().positive().optional(), subjectType: z.string().trim().min(2).max(80), subjectId: z.number().int().positive(), type: z.enum(["incorrect_information", "invalid_benchmark", "duplicate", "broken_link", "inappropriate_content", "spam", "other"]), description: z.string().trim().min(8).max(6000), status: z.enum(["open", "in_review", "resolved", "rejected"]), resolution: z.string().trim().max(6000).nullable().optional() })).mutation(async ({ ctx, input }) => { const db = await requireDatabase(); const { id, ...value } = input; const existing = id ? (await db.select().from(reports).where(eq(reports.id, id)).limit(1))[0] : undefined; if (id && !existing) throw new Error("Report não encontrado."); const reviewed = value.status === "resolved" || value.status === "rejected"; let entityId = id; const base = { ...value, reviewerId: reviewed ? ctx.user.id : null, resolvedAt: reviewed ? new Date() : null }; if (id) await db.update(reports).set(base).where(eq(reports.id, id)); else { const created = await db.insert(reports).values({ ...base, reporterId: ctx.user.id }); entityId = Number(created[0].insertId); } await db.insert(auditActions).values({ actorId: ctx.user.id, action: id ? "update" : "create", entityType: "report", entityId: entityId!, metadata: { status: value.status } }); return { id: entityId }; }),
    remove: administratorProcedure.input(z.object({ id: z.number().int().positive(), reason: z.string().trim().min(4).max(1000) })).mutation(async ({ ctx, input }) => { const db = await requireDatabase(); await db.delete(reports).where(eq(reports.id, input.id)); await db.insert(auditActions).values({ actorId: ctx.user.id, action: "delete", entityType: "report", entityId: input.id, metadata: { reason: input.reason } }); return { success: true }; }),
  }),

  moderation: router({
    benchmarks: administratorProcedure.query(async () => { const db = await requireDatabase(); return db.select({ benchmark: benchmarks, gameTitle: games.title }).from(benchmarks).innerJoin(games, eq(benchmarks.gameId, games.id)).where(eq(benchmarks.verificationStatus, "submitted")).orderBy(desc(benchmarks.createdAt)).limit(100); }),
    reports: administratorProcedure.query(async () => { const db = await requireDatabase(); return db.select({ report: reports, reporterName: users.name, reporterEmail: users.email }).from(reports).innerJoin(users, eq(reports.reporterId, users.id)).where(and(or(eq(reports.status, "open"), eq(reports.status, "in_review")))).orderBy(desc(reports.createdAt)).limit(100); }),
    reviewReport: administratorProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["in_review", "resolved", "rejected"]), resolution: z.string().trim().max(4000).nullable().optional() })).mutation(async ({ ctx, input }) => {
      const db = await requireDatabase(); await db.update(reports).set({ status: input.status, reviewerId: ctx.user.id, resolution: input.resolution, resolvedAt: input.status === "resolved" || input.status === "rejected" ? new Date() : null }).where(eq(reports.id, input.id)); await db.insert(auditActions).values({ actorId: ctx.user.id, action: "review", entityType: "report", entityId: input.id, metadata: { status: input.status } }); return { success: true };
    }),
    removeBenchmark: administratorProcedure.input(z.object({ id: z.number().int().positive(), reason: z.string().trim().min(4).max(1000) })).mutation(async ({ ctx, input }) => { const db = await requireDatabase(); await db.delete(benchmarks).where(eq(benchmarks.id, input.id)); await db.insert(auditActions).values({ actorId: ctx.user.id, action: "delete", entityType: "benchmark", entityId: input.id, metadata: { reason: input.reason } }); return { success: true }; }),
    removeReport: administratorProcedure.input(z.object({ id: z.number().int().positive(), reason: z.string().trim().min(4).max(1000) })).mutation(async ({ ctx, input }) => { const db = await requireDatabase(); await db.delete(reports).where(eq(reports.id, input.id)); await db.insert(auditActions).values({ actorId: ctx.user.id, action: "delete", entityType: "report", entityId: input.id, metadata: { reason: input.reason } }); return { success: true }; }),
  }),

  users: router({
    list: administratorProcedure.query(async () => { const db = await requireDatabase(); return db.select({ id: users.id, name: users.name, email: users.email, role: users.role, isBanned: users.isBanned, createdAt: users.createdAt, lastSignedIn: users.lastSignedIn }).from(users).orderBy(desc(users.lastSignedIn)).limit(100); }),
    setRole: administratorProcedure.input(z.object({ userId: z.number().int().positive(), role: z.enum(["user", "moderator", "admin"]) })).mutation(async ({ ctx, input }) => { const db = await requireDatabase(); await db.update(users).set({ role: input.role }).where(eq(users.id, input.userId)); await db.insert(auditActions).values({ actorId: ctx.user.id, action: "set_role", entityType: "user", entityId: input.userId, metadata: { role: input.role } }); return { success: true }; }),
    setBan: administratorProcedure.input(z.object({ userId: z.number().int().positive(), isBanned: z.boolean() })).mutation(async ({ ctx, input }) => { const db = await requireDatabase(); await db.update(users).set({ isBanned: input.isBanned, bannedAt: input.isBanned ? new Date() : null }).where(eq(users.id, input.userId)); await db.insert(auditActions).values({ actorId: ctx.user.id, action: input.isBanned ? "ban" : "unban", entityType: "user", entityId: input.userId }); return { success: true }; }),
  }),

  audit: administratorProcedure.query(async () => { const db = await requireDatabase(); return db.select().from(auditActions).orderBy(desc(auditActions.createdAt)).limit(100); }),
});
