import { and, asc, desc, eq, isNull, like, or } from "drizzle-orm";
import { z } from "zod";
import {
  distributions,
  games,
  linuxFixes,
  linuxFixSolutions,
  setupGuideSteps,
  setupGuides,
  wikiArticles,
} from "../../drizzle/schema";
import { publicProcedure, router } from "../_core/trpc";
import { requireDatabase } from "./_guards";

const pageInput = z.object({ page: z.number().int().min(1).default(1), pageSize: z.number().int().min(1).max(40).default(16) });

export const knowledgeRouter = router({
  wiki: router({
    list: publicProcedure.input(pageInput.extend({ q: z.string().trim().max(120).optional(), distributionId: z.number().int().positive().optional(), category: z.string().trim().max(120).optional() })).query(async ({ input }) => {
      const db = await requireDatabase();
      const conditions = [eq(wikiArticles.status, "published"), isNull(wikiArticles.deletedAt)];
      if (input.q) conditions.push(or(like(wikiArticles.title, `%${input.q}%`), like(wikiArticles.excerpt, `%${input.q}%`))!);
      if (input.distributionId) conditions.push(eq(wikiArticles.distributionId, input.distributionId));
      if (input.category) conditions.push(eq(wikiArticles.category, input.category));
      return db.select({ article: wikiArticles, distributionName: distributions.name, distributionSlug: distributions.slug }).from(wikiArticles).leftJoin(distributions, eq(wikiArticles.distributionId, distributions.id)).where(and(...conditions)).orderBy(asc(wikiArticles.title)).limit(input.pageSize).offset((input.page - 1) * input.pageSize);
    }),
    bySlug: publicProcedure.input(z.object({ slug: z.string().trim().min(1).max(220) })).query(async ({ input }) => {
      const db = await requireDatabase();
      return (await db.select({ article: wikiArticles, distributionName: distributions.name, distributionSlug: distributions.slug }).from(wikiArticles).leftJoin(distributions, eq(wikiArticles.distributionId, distributions.id)).where(and(eq(wikiArticles.slug, input.slug), eq(wikiArticles.status, "published"), isNull(wikiArticles.deletedAt))).limit(1))[0] ?? null;
    }),
  }),

  guides: router({
    list: publicProcedure.input(pageInput.extend({ q: z.string().trim().max(120).optional(), distributionId: z.number().int().positive().optional(), difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional() })).query(async ({ input }) => {
      const db = await requireDatabase();
      const conditions = [eq(setupGuides.status, "published"), isNull(setupGuides.deletedAt)];
      if (input.q) conditions.push(or(like(setupGuides.title, `%${input.q}%`), like(setupGuides.description, `%${input.q}%`))!);
      if (input.distributionId) conditions.push(eq(setupGuides.distributionId, input.distributionId));
      if (input.difficulty) conditions.push(eq(setupGuides.difficulty, input.difficulty));
      return db.select({ guide: setupGuides, distributionName: distributions.name, distributionSlug: distributions.slug }).from(setupGuides).leftJoin(distributions, eq(setupGuides.distributionId, distributions.id)).where(and(...conditions)).orderBy(desc(setupGuides.updatedAt)).limit(input.pageSize).offset((input.page - 1) * input.pageSize);
    }),
    bySlug: publicProcedure.input(z.object({ slug: z.string().trim().min(1).max(220) })).query(async ({ input }) => {
      const db = await requireDatabase();
      const guide = (await db.select().from(setupGuides).where(and(eq(setupGuides.slug, input.slug), eq(setupGuides.status, "published"), isNull(setupGuides.deletedAt))).limit(1))[0];
      if (!guide) return null;
      const [steps, relatedGame, relatedDistribution] = await Promise.all([
        db.select().from(setupGuideSteps).where(eq(setupGuideSteps.guideId, guide.id)).orderBy(asc(setupGuideSteps.stepOrder)),
        guide.gameId ? db.select({ slug: games.slug, title: games.title }).from(games).where(eq(games.id, guide.gameId)).limit(1) : [],
        guide.distributionId ? db.select({ slug: distributions.slug, name: distributions.name }).from(distributions).where(eq(distributions.id, guide.distributionId)).limit(1) : [],
      ]);
      return { ...guide, steps, relatedGame: relatedGame[0] ?? null, relatedDistribution: relatedDistribution[0] ?? null };
    }),
  }),

  linuxFix: router({
    list: publicProcedure.input(pageInput.extend({ q: z.string().trim().max(120).optional(), category: z.enum(["steam", "proton", "wine", "vulkan", "amd", "nvidia", "intel", "anti_cheat", "audio", "controller", "fps", "stuttering", "crashes", "black_screen", "launch_errors", "other"]).optional(), distributionId: z.number().int().positive().optional() })).query(async ({ input }) => {
      const db = await requireDatabase();
      const conditions = [eq(linuxFixes.status, "published"), isNull(linuxFixes.deletedAt)];
      if (input.q) conditions.push(or(like(linuxFixes.title, `%${input.q}%`), like(linuxFixes.symptoms, `%${input.q}%`))!);
      if (input.category) conditions.push(eq(linuxFixes.category, input.category));
      if (input.distributionId) conditions.push(eq(linuxFixes.distributionId, input.distributionId));
      return db.select().from(linuxFixes).where(and(...conditions)).orderBy(desc(linuxFixes.updatedAt)).limit(input.pageSize).offset((input.page - 1) * input.pageSize);
    }),
    bySlug: publicProcedure.input(z.object({ slug: z.string().trim().min(1).max(220) })).query(async ({ input }) => {
      const db = await requireDatabase();
      const fix = (await db.select().from(linuxFixes).where(and(eq(linuxFixes.slug, input.slug), eq(linuxFixes.status, "published"), isNull(linuxFixes.deletedAt))).limit(1))[0];
      if (!fix) return null;
      const [solutions, relatedGame, relatedDistribution] = await Promise.all([
        db.select().from(linuxFixSolutions).where(eq(linuxFixSolutions.fixId, fix.id)).orderBy(asc(linuxFixSolutions.stepOrder)),
        fix.gameId ? db.select({ slug: games.slug, title: games.title }).from(games).where(eq(games.id, fix.gameId)).limit(1) : [],
        fix.distributionId ? db.select({ slug: distributions.slug, name: distributions.name }).from(distributions).where(eq(distributions.id, fix.distributionId)).limit(1) : [],
      ]);
      return { ...fix, solutions, relatedGame: relatedGame[0] ?? null, relatedDistribution: relatedDistribution[0] ?? null };
    }),
  }),
});
