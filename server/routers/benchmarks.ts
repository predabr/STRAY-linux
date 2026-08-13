import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { auditActions, benchmarkResults, benchmarks, games } from "../../drizzle/schema";
import { publicProcedure, router } from "../_core/trpc";
import { activeUserProcedure, moderatorProcedure, requireDatabase } from "./_guards";
import { hasBenchmarkEvidence, reviewedBenchmarkProvenance } from "./policies";

const resultInput = z.object({
  resolutionWidth: z.number().int().min(320).max(16384),
  resolutionHeight: z.number().int().min(240).max(8640),
  preset: z.string().trim().min(1).max(160),
  averageFps: z.number().positive().max(10000).nullable().optional(),
  onePercentLowFps: z.number().positive().max(10000).nullable().optional(),
  zeroPointOnePercentLowFps: z.number().positive().max(10000).nullable().optional(),
  temperatureC: z.number().min(-20).max(150).nullable().optional(),
  powerWatts: z.number().min(0).max(5000).nullable().optional(),
});

const submissionInput = z.object({
  gameId: z.number().int().positive(),
  hardwareProfileId: z.number().int().positive().nullable().optional(),
  cpuId: z.number().int().positive().nullable().optional(),
  gpuId: z.number().int().positive().nullable().optional(),
  ramId: z.number().int().positive().nullable().optional(),
  distributionId: z.number().int().positive().nullable().optional(),
  distributionVersionId: z.number().int().positive().nullable().optional(),
  gameVersion: z.string().trim().max(160).nullable().optional(),
  kernelVersion: z.string().trim().max(160).nullable().optional(),
  driverVersion: z.string().trim().max(160).nullable().optional(),
  mesaVersion: z.string().trim().max(160).nullable().optional(),
  nvidiaVersion: z.string().trim().max(160).nullable().optional(),
  protonVersion: z.string().trim().max(160).nullable().optional(),
  wineVersion: z.string().trim().max(160).nullable().optional(),
  runtimeVersion: z.string().trim().max(160).nullable().optional(),
  sourceLabel: z.string().trim().min(2).max(255),
  sourceUrl: z.string().trim().url().max(2048).optional(),
  evidenceNote: z.string().trim().min(8).max(6000).optional(),
  measuredAt: z.coerce.date().optional(),
  results: z.array(resultInput).min(1).max(12),
}).superRefine((value, ctx) => {
  if (!value.sourceUrl && !value.evidenceNote) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["evidenceNote"], message: "Informe uma URL de fonte ou uma descrição da evidência." });
  }
  if (!value.results.some((result) => result.averageFps !== null && result.averageFps !== undefined)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["results"], message: "Uma submissão precisa conter pelo menos um FPS médio medido." });
  }
});

export const benchmarksRouter = router({
  listForGame: publicProcedure.input(z.object({ gameId: z.number().int().positive(), page: z.number().int().min(1).default(1), pageSize: z.number().int().min(1).max(50).default(20), provenance: z.enum(["verified", "community", "estimated", "unknown"]).optional() })).query(async ({ input }) => {
    const db = await requireDatabase();
    const conditions = [eq(benchmarks.gameId, input.gameId), eq(benchmarks.verificationStatus, "verified")];
    if (input.provenance) conditions.push(eq(benchmarks.provenance, input.provenance));
    const rows = await db.select().from(benchmarks).where(and(...conditions)).orderBy(desc(benchmarks.measuredAt), desc(benchmarks.createdAt)).limit(input.pageSize).offset((input.page - 1) * input.pageSize);
    const resultRows = rows.length ? await db.select().from(benchmarkResults).where(sql`${benchmarkResults.benchmarkId} in (${sql.join(rows.map((row) => sql`${row.id}`), sql`, `)})`) : [];
    return rows.map((row) => ({ ...row, results: resultRows.filter((result) => result.benchmarkId === row.id) }));
  }),

  submit: activeUserProcedure.input(submissionInput).mutation(async ({ ctx, input }) => {
    const db = await requireDatabase();
    if (!hasBenchmarkEvidence(input)) throw new Error("A submissão exige FPS médio e uma fonte ou evidência.");
    const game = (await db.select({ id: games.id }).from(games).where(eq(games.id, input.gameId)).limit(1))[0];
    if (!game) throw new Error("Jogo não encontrado.");
    const { results, ...benchmark } = input;
    const created = await db.insert(benchmarks).values({ ...benchmark, userId: ctx.user.id, sourceType: "community_submission", provenance: "community", verificationStatus: "submitted" });
    const benchmarkId = Number(created[0].insertId);
    await db.insert(benchmarkResults).values(results.map((result) => ({
      ...result,
      benchmarkId,
      averageFps: result.averageFps?.toString(),
      onePercentLowFps: result.onePercentLowFps?.toString(),
      zeroPointOnePercentLowFps: result.zeroPointOnePercentLowFps?.toString(),
      temperatureC: result.temperatureC?.toString(),
      powerWatts: result.powerWatts?.toString(),
    })));
    return { id: benchmarkId, status: "submitted" as const };
  }),

  review: moderatorProcedure.input(z.object({ id: z.number().int().positive(), decision: z.enum(["verified", "rejected"]), reviewNote: z.string().trim().min(4).max(4000) })).mutation(async ({ ctx, input }) => {
    const db = await requireDatabase();
    const isVerified = input.decision === "verified";
    await db.update(benchmarks).set({ verificationStatus: input.decision, provenance: reviewedBenchmarkProvenance(input.decision), reviewedById: ctx.user.id, reviewedAt: new Date(), reviewNote: input.reviewNote }).where(eq(benchmarks.id, input.id));
    await db.insert(auditActions).values({ actorId: ctx.user.id, action: isVerified ? "verify" : "reject", entityType: "benchmark", entityId: input.id, metadata: { reviewNote: input.reviewNote } });
    return { success: true, status: input.decision };
  }),

  estimate: publicProcedure.input(z.object({ gameId: z.number().int().positive(), gpuId: z.number().int().positive().optional(), cpuId: z.number().int().positive().optional(), distributionId: z.number().int().positive().optional(), resolutionWidth: z.number().int().positive(), resolutionHeight: z.number().int().positive(), preset: z.string().trim().min(1).max(160) })).query(async ({ input }) => {
    const db = await requireDatabase();
    const conditions = [eq(benchmarks.gameId, input.gameId), eq(benchmarks.verificationStatus, "verified")];
    if (input.gpuId) conditions.push(eq(benchmarks.gpuId, input.gpuId));
    if (input.cpuId) conditions.push(eq(benchmarks.cpuId, input.cpuId));
    if (input.distributionId) conditions.push(eq(benchmarks.distributionId, input.distributionId));
    const sourceBenchmarks = await db.select({ id: benchmarks.id, provenance: benchmarks.provenance, measuredAt: benchmarks.measuredAt }).from(benchmarks).where(and(...conditions)).limit(50);
    if (sourceBenchmarks.length === 0) return { available: false as const, reason: "No verified benchmark available." };
    const ids = sourceBenchmarks.map((row) => row.id);
    const results = await db.select().from(benchmarkResults).where(and(sql`${benchmarkResults.benchmarkId} in (${sql.join(ids.map((id) => sql`${id}`), sql`, `)})`, eq(benchmarkResults.resolutionWidth, input.resolutionWidth), eq(benchmarkResults.resolutionHeight, input.resolutionHeight), eq(benchmarkResults.preset, input.preset)));
    const measured = results.map((result) => Number(result.averageFps)).filter(Number.isFinite);
    if (measured.length === 0) return { available: false as const, reason: "No verified benchmark available for this resolution and preset." };
    const ordered = [...measured].sort((a, b) => a - b);
    const midpoint = Math.floor(ordered.length / 2);
    const median = ordered.length % 2 ? ordered[midpoint] : (ordered[midpoint - 1] + ordered[midpoint]) / 2;
    return { available: true as const, provenance: "estimated" as const, label: "Estimated performance from verified benchmarks", fps: median, sampleSize: measured.length, confidence: measured.length >= 5 ? "medium" as const : "low" as const, method: "Median of verified benchmarks with an exact matching environment." };
  }),
});
