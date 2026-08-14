import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import {
  favorites,
  compatibilityRecords,
  games,
  hardwareItems,
  linuxFixes,
  linuxFixHistory,
  reports,
  savedGuides,
  setupGuides,
  userHardwareProfiles,
  userSyncPreferences,
} from "../../drizzle/schema";
import { router } from "../_core/trpc";
import { activeUserProcedure, requireDatabase } from "./_guards";
import { scannerReportInput, scannerReportToProfile } from "../lib/scannerReport";

const profileInput = z.object({
  name: z.string().trim().min(1).max(140),
  cpuId: z.number().int().positive().nullable().optional(),
  gpuId: z.number().int().positive().nullable().optional(),
  ramId: z.number().int().positive().nullable().optional(),
  distributionId: z.number().int().positive().nullable().optional(),
  distributionVersionId: z.number().int().positive().nullable().optional(),
  kernelVersion: z.string().trim().max(160).nullable().optional(),
  driverVersion: z.string().trim().max(160).nullable().optional(),
  protonVersion: z.string().trim().max(160).nullable().optional(),
  wineVersion: z.string().trim().max(160).nullable().optional(),
  runtimeVersion: z.string().trim().max(160).nullable().optional(),
  storageDescription: z.string().trim().max(255).nullable().optional(),
  monitorDescription: z.string().trim().max(255).nullable().optional(),
  detectedCpu: z.string().trim().max(255).nullable().optional(),
  detectedGpu: z.string().trim().max(255).nullable().optional(),
  detectedRamGb: z.number().int().min(0).max(1_000_000).nullable().optional(),
  detectedDistribution: z.string().trim().max(255).nullable().optional(),
  scannerVersion: z.string().trim().max(80).nullable().optional(),
  scannedAt: z.coerce.date().nullable().optional(),
  isActive: z.boolean().default(false),
});

export const userRouter = router({
  dashboard: activeUserProcedure.query(async ({ ctx }) => {
    const db = await requireDatabase();
    const [profiles, favoriteRows, savedGuideRows] = await Promise.all([
      db.select().from(userHardwareProfiles).where(eq(userHardwareProfiles.userId, ctx.user.id)).orderBy(desc(userHardwareProfiles.isActive), desc(userHardwareProfiles.updatedAt)),
      db.select({ game: games }).from(favorites).innerJoin(games, eq(favorites.gameId, games.id)).where(eq(favorites.userId, ctx.user.id)).orderBy(desc(favorites.createdAt)).limit(12),
      db.select({ guide: setupGuides }).from(savedGuides).innerJoin(setupGuides, eq(savedGuides.guideId, setupGuides.id)).where(eq(savedGuides.userId, ctx.user.id)).orderBy(desc(savedGuides.createdAt)).limit(12),
    ]);
    return { user: ctx.user, profiles, favorites: favoriteRows.map((row) => row.game), savedGuides: savedGuideRows.map((row) => row.guide) };
  }),

  syncPreferences: router({
    get: activeUserProcedure.query(async ({ ctx }) => {
      const db = await requireDatabase();
      const preference = (await db.select().from(userSyncPreferences).where(eq(userSyncPreferences.userId, ctx.user.id)).limit(1))[0];
      return preference ?? { syncFavorites: true, syncSavedGuides: true, syncLinuxFixHistory: true, syncManualProfiles: true, syncTechnicalSnapshot: false, consentedAt: null, lastReviewedAt: null };
    }),
    update: activeUserProcedure.input(z.object({ syncFavorites: z.boolean(), syncSavedGuides: z.boolean(), syncLinuxFixHistory: z.boolean(), syncManualProfiles: z.boolean(), syncTechnicalSnapshot: z.boolean() })).mutation(async ({ ctx, input }) => {
      const db = await requireDatabase();
      const now = new Date();
      await db.insert(userSyncPreferences).values({ userId: ctx.user.id, ...input, consentedAt: now, lastReviewedAt: now }).onDuplicateKeyUpdate({ set: { ...input, lastReviewedAt: now } });
      return { success: true, reviewedAt: now };
    }),
  }),

  recommendations: activeUserProcedure.query(async ({ ctx }) => {
    const db = await requireDatabase();
    const profile = (await db.select().from(userHardwareProfiles).where(and(eq(userHardwareProfiles.userId, ctx.user.id), eq(userHardwareProfiles.isActive, true))).limit(1))[0];
    if (!profile) return { profile: null, items: [] };
    const conditions = [eq(compatibilityRecords.provenance, "verified")];
    if (profile.distributionId) conditions.push(eq(compatibilityRecords.distributionId, profile.distributionId));
    if (profile.cpuId) conditions.push(eq(compatibilityRecords.cpuId, profile.cpuId));
    if (profile.gpuId) conditions.push(eq(compatibilityRecords.gpuId, profile.gpuId));
    if (profile.protonVersion) conditions.push(eq(compatibilityRecords.protonVersion, profile.protonVersion));
    const items = await db.select({ game: games, record: compatibilityRecords }).from(compatibilityRecords).innerJoin(games, eq(compatibilityRecords.gameId, games.id)).where(and(...conditions)).orderBy(desc(compatibilityRecords.reviewedAt)).limit(8);
    return { profile, items };
  }),

  profiles: router({
    list: activeUserProcedure.query(async ({ ctx }) => {
      const db = await requireDatabase();
      return db.select().from(userHardwareProfiles).where(eq(userHardwareProfiles.userId, ctx.user.id)).orderBy(desc(userHardwareProfiles.isActive), desc(userHardwareProfiles.updatedAt));
    }),
    upsert: activeUserProcedure.input(profileInput.extend({ id: z.number().int().positive().optional() })).mutation(async ({ ctx, input }) => {
      const db = await requireDatabase();
      const { id, isActive, ...profile } = input;
      if (isActive) {
        await db.update(userHardwareProfiles).set({ isActive: false }).where(eq(userHardwareProfiles.userId, ctx.user.id));
      }
      if (id) {
        const existing = (await db.select({ id: userHardwareProfiles.id }).from(userHardwareProfiles).where(and(eq(userHardwareProfiles.id, id), eq(userHardwareProfiles.userId, ctx.user.id))).limit(1))[0];
        if (!existing) throw new Error("Perfil não encontrado.");
        await db.update(userHardwareProfiles).set({ ...profile, isActive }).where(eq(userHardwareProfiles.id, id));
        return { id };
      }
      const result = await db.insert(userHardwareProfiles).values({ ...profile, userId: ctx.user.id, isActive });
      return { id: Number(result[0].insertId) };
    }),
    importScan: activeUserProcedure.input(z.object({ name: z.string().trim().min(1).max(140).default("Perfil importado pelo Stray Scan"), isActive: z.boolean().default(true), scan: scannerReportInput })).mutation(async ({ ctx, input }) => {
      const db = await requireDatabase();
      if (input.isActive) await db.update(userHardwareProfiles).set({ isActive: false }).where(eq(userHardwareProfiles.userId, ctx.user.id));
      const result = await db.insert(userHardwareProfiles).values({ ...scannerReportToProfile(input.scan), userId: ctx.user.id, name: input.name, isActive: input.isActive });
      return { id: Number(result[0].insertId) };
    }),
    remove: activeUserProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const db = await requireDatabase();
      await db.delete(userHardwareProfiles).where(and(eq(userHardwareProfiles.id, input.id), eq(userHardwareProfiles.userId, ctx.user.id)));
      return { success: true };
    }),
  }),

  favorites: router({
    list: activeUserProcedure.query(async ({ ctx }) => {
      const db = await requireDatabase();
      return db.select({ game: games }).from(favorites).innerJoin(games, eq(favorites.gameId, games.id)).where(eq(favorites.userId, ctx.user.id)).orderBy(desc(favorites.createdAt));
    }),
    toggle: activeUserProcedure.input(z.object({ gameId: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const db = await requireDatabase();
      const existing = (await db.select({ id: favorites.id }).from(favorites).where(and(eq(favorites.userId, ctx.user.id), eq(favorites.gameId, input.gameId))).limit(1))[0];
      if (existing) {
        await db.delete(favorites).where(eq(favorites.id, existing.id));
        return { favorited: false };
      }
      await db.insert(favorites).values({ userId: ctx.user.id, gameId: input.gameId });
      return { favorited: true };
    }),
  }),

  savedGuides: router({
    list: activeUserProcedure.query(async ({ ctx }) => {
      const db = await requireDatabase();
      return db.select({ guide: setupGuides }).from(savedGuides).innerJoin(setupGuides, eq(savedGuides.guideId, setupGuides.id)).where(eq(savedGuides.userId, ctx.user.id)).orderBy(desc(savedGuides.createdAt));
    }),
    toggle: activeUserProcedure.input(z.object({ guideId: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const db = await requireDatabase();
      const existing = (await db.select({ id: savedGuides.id }).from(savedGuides).where(and(eq(savedGuides.userId, ctx.user.id), eq(savedGuides.guideId, input.guideId))).limit(1))[0];
      if (existing) { await db.delete(savedGuides).where(eq(savedGuides.id, existing.id)); return { saved: false }; }
      await db.insert(savedGuides).values({ userId: ctx.user.id, guideId: input.guideId });
      return { saved: true };
    }),
  }),

  linuxFixHistory: router({
    list: activeUserProcedure.query(async ({ ctx }) => {
      const db = await requireDatabase();
      return db.select({ fix: linuxFixes, viewedAt: linuxFixHistory.viewedAt }).from(linuxFixHistory).innerJoin(linuxFixes, eq(linuxFixHistory.fixId, linuxFixes.id)).where(eq(linuxFixHistory.userId, ctx.user.id)).orderBy(desc(linuxFixHistory.viewedAt)).limit(100);
    }),
    record: activeUserProcedure.input(z.object({ fixId: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const db = await requireDatabase();
      await db.insert(linuxFixHistory).values({ userId: ctx.user.id, fixId: input.fixId });
      return { success: true };
    }),
  }),

  reports: router({
    list: activeUserProcedure.query(async ({ ctx }) => {
      const db = await requireDatabase();
      return db.select().from(reports).where(eq(reports.reporterId, ctx.user.id)).orderBy(desc(reports.updatedAt));
    }),
    create: activeUserProcedure.input(z.object({ subjectType: z.string().trim().min(2).max(80), subjectId: z.number().int().positive(), type: z.enum(["incorrect_information", "invalid_benchmark", "duplicate", "broken_link", "inappropriate_content", "spam", "other"]), description: z.string().trim().min(8).max(6000) })).mutation(async ({ ctx, input }) => {
      const db = await requireDatabase();
      const result = await db.insert(reports).values({ ...input, reporterId: ctx.user.id });
      return { id: Number(result[0].insertId), status: "open" as const };
    }),
  }),

  compatibilityForActiveProfile: activeUserProcedure.input(z.object({ gameId: z.number().int().positive() })).query(async ({ ctx, input }) => {
    const db = await requireDatabase();
    const profile = (await db.select().from(userHardwareProfiles).where(and(eq(userHardwareProfiles.userId, ctx.user.id), eq(userHardwareProfiles.isActive, true))).limit(1))[0];
    if (!profile) return { profile: null, records: [] };
    const conditions = [eq(compatibilityRecords.gameId, input.gameId)];
    if (profile.distributionId) conditions.push(eq(compatibilityRecords.distributionId, profile.distributionId));
    if (profile.cpuId) conditions.push(eq(compatibilityRecords.cpuId, profile.cpuId));
    if (profile.gpuId) conditions.push(eq(compatibilityRecords.gpuId, profile.gpuId));
    const records = await db.select().from(compatibilityRecords).where(and(...conditions)).orderBy(desc(compatibilityRecords.reviewedAt)).limit(12);
    return { profile, records };
  }),

  hardwareOptions: activeUserProcedure.query(async () => {
    const db = await requireDatabase();
    return db.select().from(hardwareItems).orderBy(hardwareItems.kind, hardwareItems.manufacturer, hardwareItems.model).limit(500);
  }),
});
