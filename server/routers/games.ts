import { and, asc, desc, eq, inArray, isNull, like, or, sql } from "drizzle-orm";
import { z } from "zod";
import {
  compatibilityRecords,
  distributions,
  distributionVersions,
  gamePlatforms,
  gameTags,
  games,
  hardwareItems,
  linuxFixes,
  setupGuides,
  tags,
} from "../../drizzle/schema";
import { publicProcedure, router } from "../_core/trpc";
import { requireDatabase } from "./_guards";

const paginationInput = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(48).default(24),
});

export const hardwareListInput = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(500).default(24),
  q: z.string().trim().max(120).optional(),
  kind: z.enum(["cpu", "gpu", "ram"]).optional(),
});

export const gameFilterInput = paginationInput.extend({
  q: z.string().trim().max(120).optional(),
  distributionId: z.number().int().positive().optional(),
  gpuId: z.number().int().positive().optional(),
  cpuId: z.number().int().positive().optional(),
  compatibility: z.enum(["excellent", "good", "playable", "limited", "broken", "unknown"]).optional(),
  platform: z.enum(["steam", "steam_deck", "proton", "wine", "native_linux"]).optional(),
  genre: z.string().trim().max(100).optional(),
  multiplayer: z.boolean().optional(),
  antiCheat: z.enum(["has", "none"]).optional(),
  tagSlugs: z.array(z.string().trim().max(100)).max(8).optional(),
  sort: z.enum(["popular", "title", "recent", "featured"]).default("popular"),
});

function publishedGameConditions(input: z.infer<typeof gameFilterInput>) {
  const conditions = [eq(games.status, "published"), isNull(games.deletedAt)];
  if (input.q) conditions.push(like(games.title, `%${input.q}%`));
  if (input.platform) {
    conditions.push(sql`exists (select 1 from ${gamePlatforms} gp where gp.gameId = ${games.id} and gp.platform = ${input.platform})`);
  }
  if (input.antiCheat === "has") conditions.push(sql`exists (select 1 from ${gamePlatforms} gp where gp.gameId = ${games.id} and gp.antiCheat is not null and gp.antiCheat <> '')`);
  if (input.antiCheat === "none") conditions.push(sql`not exists (select 1 from ${gamePlatforms} gp where gp.gameId = ${games.id} and gp.antiCheat is not null and gp.antiCheat <> '')`);
  if (input.genre) conditions.push(sql`exists (select 1 from ${gameTags} gt inner join ${tags} t on t.id = gt.tagId where gt.gameId = ${games.id} and t.kind = 'genre' and t.slug = ${input.genre})`);
  if (input.multiplayer) conditions.push(sql`exists (select 1 from ${gameTags} gt inner join ${tags} t on t.id = gt.tagId where gt.gameId = ${games.id} and t.kind = 'category' and (lower(t.slug) like '%multi%' or lower(t.name) like '%multi%'))`);
  if (input.tagSlugs?.length) {
    conditions.push(sql`exists (select 1 from ${gameTags} gt inner join ${tags} t on t.id = gt.tagId where gt.gameId = ${games.id} and t.slug in (${sql.join(input.tagSlugs.map((slug) => sql`${slug}`), sql`, `)}))`);
  }
  if (input.distributionId || input.gpuId || input.cpuId || input.compatibility) {
    const compatibilityConditions = [sql`cr.gameId = ${games.id}`];
    if (input.distributionId) compatibilityConditions.push(sql`cr.distributionId = ${input.distributionId}`);
    if (input.gpuId) compatibilityConditions.push(sql`cr.gpuId = ${input.gpuId}`);
    if (input.cpuId) compatibilityConditions.push(sql`cr.cpuId = ${input.cpuId}`);
    if (input.compatibility) compatibilityConditions.push(sql`cr.level = ${input.compatibility}`);
    conditions.push(sql`exists (select 1 from ${compatibilityRecords} cr where ${sql.join(compatibilityConditions, sql` and `)})`);
  }
  return conditions;
}

export const gamesRouter = router({
  list: publicProcedure.input(gameFilterInput).query(async ({ input }) => {
    const db = await requireDatabase();
    const where = and(...publishedGameConditions(input));
    const orderBy = input.sort === "recent" ? desc(games.createdAt) : input.sort === "featured" ? desc(games.isFeatured) : input.sort === "title" ? asc(games.title) : desc(games.sourcePositiveReviews);
    const [items, totalRows] = await Promise.all([
      db.select().from(games).where(where).orderBy(orderBy, asc(games.id)).limit(input.pageSize).offset((input.page - 1) * input.pageSize),
      db.select({ count: sql<number>`count(*)` }).from(games).where(where),
    ]);

    const ids = items.map((item) => item.id);
    const [platformRows, tagRows] = ids.length
      ? await Promise.all([
          db.select({ gameId: gamePlatforms.gameId, platform: gamePlatforms.platform, antiCheat: gamePlatforms.antiCheat }).from(gamePlatforms).where(inArray(gamePlatforms.gameId, ids)),
          db.select({ gameId: gameTags.gameId, slug: tags.slug, name: tags.name, kind: tags.kind }).from(gameTags).innerJoin(tags, eq(gameTags.tagId, tags.id)).where(inArray(gameTags.gameId, ids)),
        ])
      : [[], []];

    const platformsByGame = new Map<number, typeof platformRows>();
    for (const platform of platformRows) platformsByGame.set(platform.gameId, [...(platformsByGame.get(platform.gameId) ?? []), platform]);
    const tagsByGame = new Map<number, typeof tagRows>();
    for (const tag of tagRows) tagsByGame.set(tag.gameId, [...(tagsByGame.get(tag.gameId) ?? []), tag]);

    return {
      data: items.map((item) => ({
        ...item,
        platforms: platformsByGame.get(item.id) ?? [],
        tags: tagsByGame.get(item.id) ?? [],
      })),
      meta: { page: input.page, pageSize: input.pageSize, total: Number(totalRows[0]?.count ?? 0) },
    };
  }),

  bySlug: publicProcedure.input(z.object({ slug: z.string().trim().min(1).max(220) })).query(async ({ input }) => {
    const db = await requireDatabase();
    const game = (await db.select().from(games).where(and(eq(games.slug, input.slug), eq(games.status, "published"), isNull(games.deletedAt))).limit(1))[0];
    if (!game) return null;

    const [platforms, tagRows, compatibility, guides, fixes] = await Promise.all([
      db.select().from(gamePlatforms).where(eq(gamePlatforms.gameId, game.id)),
      db.select({ slug: tags.slug, name: tags.name, kind: tags.kind }).from(gameTags).innerJoin(tags, eq(gameTags.tagId, tags.id)).where(eq(gameTags.gameId, game.id)),
      db.select().from(compatibilityRecords).where(eq(compatibilityRecords.gameId, game.id)).orderBy(desc(compatibilityRecords.reviewedAt)).limit(24),
      db.select().from(setupGuides).where(and(eq(setupGuides.gameId, game.id), eq(setupGuides.status, "published"))).limit(12),
      db.select().from(linuxFixes).where(and(eq(linuxFixes.gameId, game.id), eq(linuxFixes.status, "published"), isNull(linuxFixes.deletedAt))).orderBy(desc(linuxFixes.updatedAt)).limit(12),
    ]);

    const distributionIds = compatibility.flatMap((record) => record.distributionId ? [record.distributionId] : []);
    const hardwareIds = compatibility.flatMap((record) => [record.cpuId, record.gpuId].filter((id): id is number => Boolean(id)));
    const [compatibilityDistributions, compatibilityHardware] = await Promise.all([
      distributionIds.length ? db.select({ id: distributions.id, name: distributions.name }).from(distributions).where(inArray(distributions.id, distributionIds)) : [],
      hardwareIds.length ? db.select({ id: hardwareItems.id, manufacturer: hardwareItems.manufacturer, model: hardwareItems.model }).from(hardwareItems).where(inArray(hardwareItems.id, hardwareIds)) : [],
    ]);
    const distributionNames = new Map(compatibilityDistributions.map((item) => [item.id, item.name]));
    const hardwareNames = new Map(compatibilityHardware.map((item) => [item.id, `${item.manufacturer} ${item.model}`]));

    return {
      ...game,
      platforms,
      tags: tagRows,
      compatibility: compatibility.map((record) => ({
        ...record,
        distributionName: record.distributionId ? distributionNames.get(record.distributionId) ?? "Distribuição não publicada" : "Sem distribuição declarada",
        cpuName: record.cpuId ? hardwareNames.get(record.cpuId) ?? "CPU não publicada" : "Sem CPU declarada",
        gpuName: record.gpuId ? hardwareNames.get(record.gpuId) ?? "GPU não publicada" : "Sem GPU declarada",
      })),
      guides,
      fixes,
    };
  }),

  filterOptions: publicProcedure.query(async () => {
    const db = await requireDatabase();
    const genres = await db.select({ slug: tags.slug, name: tags.name }).from(tags).where(eq(tags.kind, "genre")).orderBy(asc(tags.name)).limit(100);
    return { genres };
  }),
});

export const distributionsRouter = router({
  list: publicProcedure.query(async () => {
    const db = await requireDatabase();
    return db.select().from(distributions).where(and(eq(distributions.status, "published"), isNull(distributions.deletedAt))).orderBy(asc(distributions.name));
  }),
  bySlug: publicProcedure.input(z.object({ slug: z.string().trim().min(1).max(120) })).query(async ({ input }) => {
    const db = await requireDatabase();
    const distribution = (await db.select().from(distributions).where(and(eq(distributions.slug, input.slug), eq(distributions.status, "published"))).limit(1))[0];
    if (!distribution) return null;
    const versions = await db.select().from(distributionVersions).where(eq(distributionVersions.distributionId, distribution.id)).orderBy(desc(distributionVersions.isSupported), desc(distributionVersions.releaseDate));
    return { ...distribution, versions };
  }),
  versions: publicProcedure.input(z.object({ distributionId: z.number().int().positive() })).query(async ({ input }) => {
    const db = await requireDatabase();
    return db.select().from(distributionVersions).where(eq(distributionVersions.distributionId, input.distributionId)).orderBy(desc(distributionVersions.isSupported), desc(distributionVersions.releaseDate));
  }),
});

export const hardwareRouter = router({
  list: publicProcedure.input(hardwareListInput).query(async ({ input }) => {
    const db = await requireDatabase();
    const conditions = [isNull(hardwareItems.deletedAt)];
    if (input.kind) conditions.push(eq(hardwareItems.kind, input.kind));
    if (input.q) conditions.push(or(like(hardwareItems.model, `%${input.q}%`), like(hardwareItems.manufacturer, `%${input.q}%`))!);
    const where = and(...conditions);
    const [data, totalRows] = await Promise.all([
      db.select().from(hardwareItems).where(where).orderBy(asc(hardwareItems.kind), asc(hardwareItems.manufacturer), asc(hardwareItems.model)).limit(input.pageSize).offset((input.page - 1) * input.pageSize),
      db.select({ count: sql<number>`count(*)` }).from(hardwareItems).where(where),
    ]);
    return { data, meta: { page: input.page, pageSize: input.pageSize, total: Number(totalRows[0]?.count ?? 0) } };
  }),
});

export const searchRouter = router({
  query: publicProcedure.input(z.object({ q: z.string().trim().min(2).max(120), limit: z.number().int().min(1).max(12).default(6) })).query(async ({ input }) => {
    const db = await requireDatabase();
    const term = `%${input.q}%`;
    const [gameResults, distroResults, hardwareResults, guideResults] = await Promise.all([
      db.select({ id: games.id, slug: games.slug, title: games.title, description: games.shortDescription }).from(games).where(and(eq(games.status, "published"), like(games.title, term), isNull(games.deletedAt))).orderBy(asc(games.title)).limit(input.limit),
      db.select({ id: distributions.id, slug: distributions.slug, title: distributions.name, description: distributions.family }).from(distributions).where(and(eq(distributions.status, "published"), like(distributions.name, term), isNull(distributions.deletedAt))).orderBy(asc(distributions.name)).limit(input.limit),
      db.select({ id: hardwareItems.id, slug: hardwareItems.slug, title: hardwareItems.model, description: hardwareItems.manufacturer }).from(hardwareItems).where(and(or(like(hardwareItems.model, term), like(hardwareItems.manufacturer, term)), isNull(hardwareItems.deletedAt))).orderBy(asc(hardwareItems.model)).limit(input.limit),
      db.select({ id: setupGuides.id, slug: setupGuides.slug, title: setupGuides.title, description: setupGuides.description }).from(setupGuides).where(and(eq(setupGuides.status, "published"), like(setupGuides.title, term), isNull(setupGuides.deletedAt))).orderBy(asc(setupGuides.title)).limit(input.limit),
    ]);
    return { games: gameResults, distributions: distroResults, hardware: hardwareResults, guides: guideResults };
  }),
});
