import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDesktopStore } from "./localStore";
import { scannerReportInput, scannerReportToProfile } from "../lib/scannerReport";
import { isStrayAiDomainQuestion, STRAY_AI_OUT_OF_SCOPE_RESPONSE } from "../lib/strayAiScope";

const pageInput = z.object({ page: z.number().int().min(1).default(1), pageSize: z.number().int().min(1).max(48).default(24) });
const localUser = { id: 1, openId: "desktop-local-user", name: "Usuário local", email: null, loginMethod: "desktop", role: "admin" as const, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() };
const paginate = <T>(data: T[], page: number, pageSize: number) => ({ data: data.slice((page - 1) * pageSize, page * pageSize), meta: { page, pageSize, total: data.length } });
const store = () => getDesktopStore();

function gameList(input: { q?: string; page: number; pageSize: number }) {
  const query = input.q?.trim() ? `%${input.q.trim()}%` : "%";
  const games = store().all<any>("SELECT id, slug, title, description AS shortDescription, cover_image_url AS coverImageUrl, steam_app_id AS steamAppId, source_positive_reviews AS sourcePositiveReviews FROM games WHERE title LIKE ? ORDER BY source_positive_reviews DESC, title", [query]);
  return paginate(games.map((game) => ({ ...game, platforms: game.steamAppId ? [{ id: game.id, platform: "steam", antiCheat: null }] : [], tags: [] })), input.page, input.pageSize);
}

function wikiList(input: { q?: string; page: number; pageSize: number }) {
  const query = input.q?.trim() ? `%${input.q.trim()}%` : "%";
  const rows = store().all<any>("SELECT *, NULL AS distributionName FROM wiki_articles WHERE title LIKE ? OR body LIKE ? ORDER BY title", [query, query]);
  return paginate(rows.map((article) => ({ article, distributionName: article.distributionName })), input.page, input.pageSize).data;
}

export const desktopRouter = router({
  auth: router({
    me: publicProcedure.query(() => localUser),
    logout: publicProcedure.mutation(() => ({ success: true })),
  }),
  games: router({
    list: publicProcedure.input(pageInput.extend({ q: z.string().optional(), distributionId: z.number().optional(), gpuId: z.number().optional(), cpuId: z.number().optional(), compatibility: z.string().optional(), platform: z.string().optional(), genre: z.string().optional(), multiplayer: z.boolean().optional(), antiCheat: z.enum(["has", "none"]).optional(), tagSlugs: z.array(z.string()).optional(), sort: z.string().optional() })).query(({ input }) => gameList(input)),
    bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(({ input }) => {
      const game = store().one<any>("SELECT id, slug, title, description AS shortDescription, cover_image_url AS coverImageUrl, steam_app_id AS steamAppId, source_positive_reviews AS sourcePositiveReviews FROM games WHERE slug = ?", [input.slug]);
      if (!game) return null;
      return { ...game, platforms: game.steamAppId ? [{ id: game.id, platform: "steam", antiCheat: null }] : [], tags: [], compatibility: [], guides: [] };
    }),
    filterOptions: publicProcedure.query(() => ({ genres: [] })),
  }),
  distributions: router({
    list: publicProcedure.query(() => store().all<any>("SELECT id, slug, name, family, package_manager AS packageManager, desktop AS defaultDesktop, official_url AS officialUrl, source_url AS sourceUrl FROM distributions ORDER BY name")),
    bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(({ input }) => {
      const distribution = store().one<any>("SELECT id, slug, name, family, package_manager AS packageManager, desktop AS defaultDesktop, official_url AS officialUrl, source_url AS sourceUrl FROM distributions WHERE slug = ?", [input.slug]);
      return distribution ? { ...distribution, versions: [] } : null;
    }),
    versions: publicProcedure.input(z.object({ distributionId: z.number() })).query(() => []),
  }),
  hardware: router({ list: publicProcedure.input(pageInput.extend({ q: z.string().optional(), kind: z.string().optional() })).query(({ input }) => ({ data: [], meta: { page: input.page, pageSize: input.pageSize, total: 0 } })) }),
  knowledge: router({
    wiki: router({
      list: publicProcedure.input(pageInput.extend({ q: z.string().optional() })).query(({ input }) => wikiList(input)),
      bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(({ input }) => { const article = store().one<any>("SELECT * FROM wiki_articles WHERE slug = ?", [input.slug]); return article ? { article, distributionName: null } : null; }),
    }),
    guides: router({
      list: publicProcedure.input(pageInput.extend({ q: z.string().optional(), difficulty: z.string().optional(), distributionId: z.number().optional() })).query(({ input }) => {
        const term = input.q?.trim() ? `%${input.q.trim()}%` : "%";
        const rows = store().all<any>("SELECT * FROM setup_guides WHERE title LIKE ? AND (? IS NULL OR difficulty = ?) ORDER BY title", [term, input.difficulty ?? null, input.difficulty ?? null]);
        return paginate(rows.map((guide) => ({ guide, distributionName: null })), input.page, input.pageSize).data;
      }),
      bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(({ input }) => { const guide = store().one<any>("SELECT * FROM setup_guides WHERE slug = ?", [input.slug]); return guide ? { ...guide, guideVersion: guide.guide_version, sourceUrl: guide.source_url, steps: JSON.parse(guide.steps_json) } : null; }),
    }),
    linuxFix: router({
      list: publicProcedure.input(pageInput.extend({ q: z.string().optional(), category: z.string().optional() })).query(({ input }) => {
        const term = input.q?.trim() ? `%${input.q.trim()}%` : "%";
        const rows = store().all<any>("SELECT * FROM linux_fixes WHERE title LIKE ? AND (? IS NULL OR category = ?) ORDER BY title", [term, input.category ?? null, input.category ?? null]);
        return paginate(rows, input.page, input.pageSize).data;
      }),
      bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(({ input }) => { const fix = store().one<any>("SELECT * FROM linux_fixes WHERE slug = ?", [input.slug]); return fix ? { ...fix, possibleCauses: fix.possible_causes, sourceUrl: fix.source_url, solutions: JSON.parse(fix.solutions_json) } : null; }),
    }),
  }),
  search: router({
    query: publicProcedure.input(z.object({ q: z.string().min(1), limit: z.number().int().min(1).max(20).default(6) })).query(({ input }) => {
      const term = `%${input.q}%`;
      return { games: store().all<any>("SELECT id, slug, title, description FROM games WHERE title LIKE ? ORDER BY title LIMIT ?", [term, input.limit]), distributions: store().all<any>("SELECT id, slug, name AS title, family AS description FROM distributions WHERE name LIKE ? ORDER BY name LIMIT ?", [term, input.limit]), hardware: [], guides: store().all<any>("SELECT id, slug, title, description FROM setup_guides WHERE title LIKE ? ORDER BY title LIMIT ?", [term, input.limit]) };
    }),
  }),
  benchmarks: router({
    listForGame: publicProcedure.input(z.object({ gameId: z.number(), page: z.number().default(1), pageSize: z.number().default(20), provenance: z.string().optional() })).query(() => []),
    estimate: publicProcedure.input(z.object({ gameId: z.number(), gpuId: z.number().optional(), cpuId: z.number().optional(), distributionId: z.number().optional(), resolutionWidth: z.number(), resolutionHeight: z.number(), preset: z.string() })).query(() => ({ available: false as const, reason: "No verified benchmark available in this local snapshot." })),
    submit: publicProcedure.input(z.any()).mutation(({ input }) => { const result = store().run("INSERT INTO benchmarks (game_id, source_label, source_url, evidence_note, results_json) VALUES (?, ?, ?, ?, ?)", [input.gameId, input.sourceLabel || "Submissão local", input.sourceUrl || null, input.evidenceNote || null, JSON.stringify(input.results || [])]); return { id: Number(result.lastInsertRowid), status: "submitted" as const }; }),
    mine: publicProcedure.query(() => store().all<any>("SELECT b.*, g.title AS gameTitle, g.slug AS gameSlug FROM benchmarks b JOIN games g ON g.id = b.game_id ORDER BY b.created_at DESC").map((row) => ({ benchmark: { id: row.id, verificationStatus: row.verification_status, provenance: row.provenance }, gameTitle: row.gameTitle, gameSlug: row.gameSlug, results: JSON.parse(row.results_json) }))),
    review: publicProcedure.input(z.any()).mutation(() => ({ success: true, status: "verified" as const })),
  }),
  compatibility: router({
    forEnvironment: publicProcedure.input(z.object({ gameId: z.number(), gameVersion: z.string().nullable().optional(), distributionId: z.number().nullable().optional(), distributionVersionId: z.number().nullable().optional(), cpuId: z.number().nullable().optional(), gpuId: z.number().nullable().optional(), kernelVersion: z.string().nullable().optional(), driverVersion: z.string().nullable().optional(), protonVersion: z.string().nullable().optional(), wineVersion: z.string().nullable().optional(), runtimeVersion: z.string().nullable().optional() })).query(() => ({ available: false as const, reason: "O snapshot local atual não inclui registros de compatibilidade por ambiente.", method: "O modo desktop informa indisponibilidade em vez de inferir compatibilidade sem dados locais." })),
  }),
  user: router({
    dashboard: publicProcedure.query(() => ({ user: localUser, profiles: store().all<any>("SELECT id, name, cpu_id AS cpuId, gpu_id AS gpuId, ram_id AS ramId, distribution_id AS distributionId, distribution_version_id AS distributionVersionId, kernel_version AS kernelVersion, driver_version AS driverVersion, proton_version AS protonVersion, wine_version AS wineVersion, runtime_version AS runtimeVersion, storage_description AS storageDescription, monitor_description AS monitorDescription, is_active AS isActive, updated_at AS updatedAt FROM profiles ORDER BY is_active DESC, updated_at DESC"), favorites: store().all<any>("SELECT g.id, g.slug, g.title, g.description AS shortDescription, g.steam_app_id AS steamAppId FROM favorites f JOIN games g ON g.id = f.game_id ORDER BY f.created_at DESC"), savedGuides: store().all<any>("SELECT g.id, g.slug, g.title, g.description, g.difficulty, g.provenance FROM saved_guides s JOIN setup_guides g ON g.id = s.guide_id ORDER BY s.created_at DESC") })),
    profiles: router({ list: publicProcedure.query(() => store().all<any>("SELECT id, name, cpu_id AS cpuId, gpu_id AS gpuId, ram_id AS ramId, distribution_id AS distributionId, distribution_version_id AS distributionVersionId, kernel_version AS kernelVersion, driver_version AS driverVersion, proton_version AS protonVersion, wine_version AS wineVersion, runtime_version AS runtimeVersion, storage_description AS storageDescription, monitor_description AS monitorDescription, is_active AS isActive, updated_at AS updatedAt FROM profiles ORDER BY is_active DESC, updated_at DESC")), upsert: publicProcedure.input(z.any()).mutation(({ input }) => { if (input.isActive) store().run("UPDATE profiles SET is_active = 0"); if (input.id) { store().run("UPDATE profiles SET name = ?, cpu_id = ?, gpu_id = ?, ram_id = ?, distribution_id = ?, distribution_version_id = ?, kernel_version = ?, driver_version = ?, proton_version = ?, wine_version = ?, runtime_version = ?, storage_description = ?, monitor_description = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [input.name, input.cpuId || null, input.gpuId || null, input.ramId || null, input.distributionId || null, input.distributionVersionId || null, input.kernelVersion || null, input.driverVersion || null, input.protonVersion || null, input.wineVersion || null, input.runtimeVersion || null, input.storageDescription || null, input.monitorDescription || null, input.isActive ? 1 : 0, input.id]); return { id: input.id }; } const result = store().run("INSERT INTO profiles (name, cpu_id, gpu_id, ram_id, distribution_id, distribution_version_id, kernel_version, driver_version, proton_version, wine_version, runtime_version, storage_description, monitor_description, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [input.name, input.cpuId || null, input.gpuId || null, input.ramId || null, input.distributionId || null, input.distributionVersionId || null, input.kernelVersion || null, input.driverVersion || null, input.protonVersion || null, input.wineVersion || null, input.runtimeVersion || null, input.storageDescription || null, input.monitorDescription || null, input.isActive ? 1 : 0]); return { id: Number(result.lastInsertRowid) }; }), importScan: publicProcedure.input(z.object({ name: z.string().trim().min(2).max(120), isActive: z.boolean().default(true), scan: scannerReportInput })).mutation(({ input }) => { const profile = scannerReportToProfile(input.scan); const detectedDistribution = input.scan.system.distribution.id ? store().one<{ id: number }>("SELECT id FROM distributions WHERE lower(slug) = lower(?) LIMIT 1", [input.scan.system.distribution.id]) : undefined; const storage = input.scan.system.storage?.totalGb ? `${input.scan.system.storage.usedGb ?? 0} / ${input.scan.system.storage.totalGb} GB${input.scan.system.storage.mount ? ` (${input.scan.system.storage.mount})` : ""}` : null; const monitor = input.scan.system.displays?.map((display) => `${display.name || "Monitor"} ${display.resolution || ""}${display.refreshHz ? ` @ ${display.refreshHz} Hz` : ""}`).join(" · ") || null; if (input.isActive) store().run("UPDATE profiles SET is_active = 0"); const result = store().run("INSERT INTO profiles (name, distribution_id, kernel_version, driver_version, proton_version, wine_version, storage_description, monitor_description, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [input.name, detectedDistribution?.id ?? null, profile.kernelVersion, profile.driverVersion, profile.protonVersion, profile.wineVersion, storage, monitor, input.isActive ? 1 : 0]); return { id: Number(result.lastInsertRowid), scannerVersion: profile.scannerVersion }; }), remove: publicProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => { store().run("DELETE FROM profiles WHERE id = ?", [input.id]); return { success: true }; }) }),
    favorites: router({ list: publicProcedure.query(() => store().all<any>("SELECT g.id, g.slug, g.title, g.description AS shortDescription, g.steam_app_id AS steamAppId FROM favorites f JOIN games g ON g.id = f.game_id ORDER BY f.created_at DESC").map((game) => ({ game }))), toggle: publicProcedure.input(z.object({ gameId: z.number() })).mutation(({ input }) => { const current = store().one<any>("SELECT game_id FROM favorites WHERE game_id = ?", [input.gameId]); if (current) { store().run("DELETE FROM favorites WHERE game_id = ?", [input.gameId]); return { favorited: false }; } store().run("INSERT INTO favorites (game_id) VALUES (?)", [input.gameId]); return { favorited: true }; }) }),
    savedGuides: router({ list: publicProcedure.query(() => store().all<any>("SELECT g.id, g.slug, g.title, g.description, g.difficulty, g.provenance FROM saved_guides s JOIN setup_guides g ON g.id = s.guide_id ORDER BY s.created_at DESC").map((guide) => ({ guide }))), toggle: publicProcedure.input(z.object({ guideId: z.number() })).mutation(({ input }) => { const current = store().one<any>("SELECT guide_id FROM saved_guides WHERE guide_id = ?", [input.guideId]); if (current) { store().run("DELETE FROM saved_guides WHERE guide_id = ?", [input.guideId]); return { saved: false }; } store().run("INSERT INTO saved_guides (guide_id) VALUES (?)", [input.guideId]); return { saved: true }; }) }),
    linuxFixHistory: router({ list: publicProcedure.query(() => store().all<any>("SELECT f.*, h.viewed_at AS viewedAt FROM fix_history h JOIN linux_fixes f ON f.id = h.fix_id ORDER BY h.viewed_at DESC").map((row) => ({ fix: { ...row, possibleCauses: row.possible_causes }, viewedAt: row.viewedAt }))), record: publicProcedure.input(z.object({ fixId: z.number() })).mutation(({ input }) => { store().run("INSERT INTO fix_history (fix_id) VALUES (?)", [input.fixId]); return { success: true }; }) }),
    reports: router({ list: publicProcedure.query(() => store().all<any>("SELECT id, subject_type AS subjectType, subject_id AS subjectId, type, description, status, created_at AS createdAt FROM reports ORDER BY created_at DESC")), create: publicProcedure.input(z.any()).mutation(({ input }) => { const result = store().run("INSERT INTO reports (subject_type, subject_id, type, description) VALUES (?, ?, ?, ?)", [input.subjectType, input.subjectId, input.type, input.description]); return { id: Number(result.lastInsertRowid), status: "open" as const }; }) }),
    hardwareOptions: publicProcedure.query(() => []), compatibilityForActiveProfile: publicProcedure.input(z.object({ gameId: z.number() })).query(() => ({ profile: null, records: [] })),
  }),
  chat: router({ history: publicProcedure.query(() => []), ask: publicProcedure.input(z.object({ question: z.string().trim().min(2).max(2500) })).mutation(({ input }) => ({ answer: isStrayAiDomainQuestion(input.question) ? "No modo desktop, o Stray AI permanece focado no Stray Linux e usa apenas o conteúdo incluído no snapshot local. Para diagnósticos fundamentados, abra o Scanner e consulte os guias e LinuxFix disponíveis." : STRAY_AI_OUT_OF_SCOPE_RESPONSE, sources: [] })) }),
  admin: router({ overview: publicProcedure.query(() => ({ ...store().counts(), hardware: 0, pendingBenchmarks: store().one<{ count: number }>("SELECT count(*) as count FROM benchmarks WHERE verification_status = 'submitted'")?.count ?? 0, openReports: store().one<{ count: number }>("SELECT count(*) as count FROM reports WHERE status = 'open'")?.count ?? 0 })), listUsers: publicProcedure.query(() => [localUser]) }),
});
