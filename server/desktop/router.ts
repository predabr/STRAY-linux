import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDesktopStore, getDesktopStoreHealth } from "./localStore";
import { scannerReportInput, scannerReportToProfile } from "../lib/scannerReport";
import { isStrayAiDomainQuestion, STRAY_AI_OUT_OF_SCOPE_RESPONSE } from "../lib/strayAiScope";

const pageInput = z.object({ page: z.number().int().min(1).default(1), pageSize: z.number().int().min(1).max(48).default(24) });
const localProfileInput = z.object({
  id: z.number().int().positive().optional(),
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
  isActive: z.boolean().default(false),
});
const localBenchmarkInput = z.object({
  gameId: z.number().int().positive(),
  sourceLabel: z.string().trim().min(1).max(180).default("Submissão local"),
  sourceUrl: z.string().trim().url().max(2_048).nullable().optional(),
  evidenceNote: z.string().trim().max(2_000).nullable().optional(),
  results: z.array(z.record(z.string(), z.union([z.string().trim().max(500), z.number().finite(), z.boolean(), z.null()]))).max(500).default([]),
});
const localBenchmarkReviewInput = z.object({ id: z.number().int().positive() });
const localReportInput = z.object({
  subjectType: z.string().trim().min(2).max(80),
  subjectId: z.number().int().positive(),
  type: z.enum(["incorrect_information", "invalid_benchmark", "duplicate", "broken_link", "inappropriate_content", "spam", "other"]),
  description: z.string().trim().min(8).max(6_000),
});
const localUser = { id: 1, openId: "desktop-local-user", name: "Usuário local", email: null, loginMethod: "desktop", role: "admin" as const, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() };
const paginate = <T>(data: T[], page: number, pageSize: number) => ({ data: data.slice((page - 1) * pageSize, page * pageSize), meta: { page, pageSize, total: data.length } });
const store = () => getDesktopStore();

function steamCoverUrl(appId: number | null | undefined) {
  return appId ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/library_600x900.jpg` : null;
}

function publicGame(game: any) {
  return {
    ...game,
    coverImageUrl: game.coverImageUrl || steamCoverUrl(game.steamAppId),
    platforms: game.steamAppId ? [{ id: game.id, platform: "steam", antiCheat: null }] : [],
    tags: [],
  };
}

function normalizedTitle(value: string) {
  return value.toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/gi, " ").trim().replace(/\s+/g, " ");
}

function stableHardwareId(kind: string, value: string) {
  let hash = 0;
  for (const character of `${kind}:${value}`) hash = ((hash * 31) + character.charCodeAt(0)) >>> 0;
  return 1_000_000 + (hash % 900_000_000);
}

function detectedHardwareOptions() {
  const options = new Map<number, { id: number; kind: "cpu" | "gpu" | "ram"; manufacturer: string; model: string; source: string }>();
  const snapshots = store().all<{ reportJson: string }>("SELECT report_json AS reportJson FROM scanner_snapshots ORDER BY created_at DESC LIMIT 24");
  for (const snapshot of snapshots) {
    try {
      const report = scannerReportInput.parse(JSON.parse(snapshot.reportJson));
      const add = (kind: "cpu" | "gpu" | "ram", manufacturer: string | null | undefined, model: string | null | undefined) => {
        if (!model?.trim()) return;
        const id = stableHardwareId(kind, model);
        options.set(id, { id, kind, manufacturer: manufacturer?.trim() || "Detectado localmente", model: model.trim(), source: "scanner-local" });
      };
      add("cpu", null, report.system.cpu.model);
      add("gpu", report.system.gpu.vendor, report.system.gpu.model);
      if (report.system.memoryGb) add("ram", "Memória detectada", `${report.system.memoryGb} GB RAM`);
      for (const adapter of report.system.gpu.adapters ?? []) add("gpu", adapter.vendor, adapter.model);
    } catch {
      // Snapshots antigos ou inválidos não impedem o uso das demais leituras locais.
    }
  }
  return Array.from(options.values()).sort((left, right) => left.kind.localeCompare(right.kind) || left.model.localeCompare(right.model, "pt-BR"));
}

function localRecommendations() {
  const profile = store().one<any>("SELECT id, name, cpu_id AS cpuId, gpu_id AS gpuId, distribution_id AS distributionId, kernel_version AS kernelVersion, driver_version AS driverVersion, proton_version AS protonVersion FROM profiles WHERE is_active = 1 ORDER BY updated_at DESC LIMIT 1") ?? null;
  const latestSnapshot = store().one<{ reportJson: string }>("SELECT report_json AS reportJson FROM scanner_snapshots ORDER BY created_at DESC LIMIT 1");
  if (!latestSnapshot) return { profile, items: [] };
  try {
    const scan = scannerReportInput.parse(JSON.parse(latestSnapshot.reportJson));
    const items: { kind: "scanner"; id: string; title: string; detail: string; href: string; status: "attention" | "review" }[] = [];
    if (!scan.system.graphics.vulkanVersion) items.push({ kind: "scanner", id: "vulkan", title: "Vulkan não foi detectado", detail: "O Scanner não encontrou uma versão Vulkan. Abra o Diagnóstico para consultar causas e passos por distribuição.", href: "/diagnostics", status: "attention" });
    if (!scan.system.runtime.gaming?.renderGroupDetected) items.push({ kind: "scanner", id: "render-group", title: "Acesso ao grupo de renderização não foi confirmado", detail: "O relatório não confirmou os grupos render ou video da sessão atual. Revise o Diagnóstico antes de alterar permissões.", href: "/diagnostics", status: "review" });
    if (!scan.system.runtime.steamDetected && !scan.system.runtime.discovery?.heroicDetected) items.push({ kind: "scanner", id: "launchers", title: "Nenhum launcher foi detectado", detail: "Steam e Heroic não foram localizados pelos caminhos suportados. A Biblioteca continua disponível para pastas adicionadas conscientemente.", href: "/library", status: "review" });
    return { profile, items };
  } catch { return { profile, items: [] }; }
}

function gameList(input: { q?: string; page: number; pageSize: number }) {
  const fields = "id, slug, title, description AS shortDescription, steam_app_id AS steamAppId, source_positive_reviews AS sourcePositiveReviews";
  const term = input.q?.trim() ? normalizedTitle(input.q) : "";
  const games = term
    ? store().all<any>(`SELECT ${fields} FROM games ORDER BY source_positive_reviews DESC, title`).filter((game) => normalizedTitle(String(game.title)).includes(term))
    : store().all<any>(`SELECT ${fields} FROM games ORDER BY source_positive_reviews DESC, title`);
  return paginate(games.map(publicGame), input.page, input.pageSize);
}

function wikiList(input: { q?: string; page: number; pageSize: number }) {
  const query = input.q?.trim() ? `%${input.q.trim()}%` : "%";
  const rows = store().all<any>("SELECT *, NULL AS distributionName FROM wiki_articles WHERE title LIKE ? OR body LIKE ? ORDER BY title", [query, query]);
  return paginate(rows.map((article) => ({ article, distributionName: article.distributionName })), input.page, input.pageSize).data;
}

function localAiKeyword(question: string) {
  const normalized = question.toLowerCase();
  return ["vulkan", "proton", "wine", "steam", "mesa", "driver", "stutter", "mangohud", "gamemode", "gamescope", "launch", "iniciar"].find((keyword) => normalized.includes(keyword)) ?? null;
}

function desktopAiAnswer(question: string) {
  if (!isStrayAiDomainQuestion(question)) return { answer: STRAY_AI_OUT_OF_SCOPE_RESPONSE, citations: [], explanation: { facts: [], inferences: [], estimates: [], unknowns: ["O pedido está fora do escopo do Stray AI."], why: { internalSources: 0, profileUsed: false, memoryUsed: false, confidence: "unavailable" as const } }, context: { inScope: false, profileAvailable: false, internalSources: 0, memoryUsed: false, snapshotAvailable: false, snapshotCapturedAt: null, snapshotFacts: [] as string[] } };
  const profile = store().one<any>("SELECT name, kernel_version AS kernelVersion, driver_version AS driverVersion, proton_version AS protonVersion, wine_version AS wineVersion, runtime_version AS runtimeVersion FROM profiles WHERE is_active = 1 ORDER BY updated_at DESC LIMIT 1");
  const latestSnapshot = store().one<any>("SELECT report_json AS reportJson, created_at AS createdAt FROM scanner_snapshots ORDER BY created_at DESC LIMIT 1");
  let snapshotFacts = "";
  if (latestSnapshot?.reportJson) { try { const report = scannerReportInput.parse(JSON.parse(latestSnapshot.reportJson)); snapshotFacts = `Distro: ${report.system.distribution.name ?? "não informada"} ${report.system.distribution.version ?? ""}. CPU: ${report.system.cpu.model ?? "não informada"}. GPU: ${report.system.gpu.model ?? "não informada"}. RAM: ${report.system.memoryGb ?? "não informada"} GB. Kernel: ${report.system.kernelVersion ?? "não informado"}. Driver: ${report.system.graphics.driverVersion ?? "não informado"}. Vulkan: ${report.system.graphics.vulkanVersion ?? "não informado"}. Steam: ${report.system.runtime.steamDetected ? "detectada" : "não detectada"}.`; } catch { snapshotFacts = "O último snapshot local existe, mas não pôde ser validado novamente."; } }
  const keyword = localAiKeyword(question);
  const term = `%${keyword ?? ""}%`;
  const guides = keyword ? store().all<any>("SELECT title, slug, source_url AS sourceUrl FROM setup_guides WHERE lower(title) LIKE ? OR lower(description) LIKE ? ORDER BY title LIMIT 2", [term, term]) : [];
  const fixes = keyword ? store().all<any>("SELECT title, slug, source_url AS sourceUrl FROM linux_fixes WHERE lower(title) LIKE ? OR lower(symptoms) LIKE ? OR lower(possible_causes) LIKE ? ORDER BY title LIMIT 2", [term, term, term]) : [];
  const citations = [...guides.map((item) => ({ type: "guide" as const, title: item.title, slug: item.slug, sourceUrl: item.sourceUrl ?? null })), ...fixes.map((item) => ({ type: "linuxfix" as const, title: item.title, slug: item.slug, sourceUrl: item.sourceUrl ?? null }))];
  const memories = store().all<any>("SELECT summary FROM ai_memory_entries WHERE consented = 1 ORDER BY updated_at DESC LIMIT 4");
  const profileFacts = profile ? [`Perfil ativo: ${profile.name}.`, `Kernel: ${profile.kernelVersion ?? "não informado"}.`, `Driver: ${profile.driverVersion ?? "não informado"}.`, `Proton: ${profile.protonVersion ?? "não informado"}.`, `Wine: ${profile.wineVersion ?? "não informado"}.`].join("\n") : "Não há perfil técnico ativo no armazenamento local.";
  const known = [snapshotFacts, profileFacts].filter(Boolean).join("\n");
  const sourceText = citations.length ? citations.map((item) => item.title).join(", ") : "Nenhum guia ou LinuxFix local correspondeu diretamente ao termo da pergunta.";
  return {
    answer: `### O que o Stray AI sabe\n${known}${memories.length ? `\nMemória local consentida: ${memories.map((item) => item.summary).join(" · ")}.` : ""}\n\n### Evidência local disponível\n${sourceText}\n\n### O que ele não sabe\nO modo desktop não possui benchmark, telemetria de FPS, histórico de performance ou compatibilidade por ambiente para esta pergunta, a menos que você importe uma evidência local posteriormente.\n\n### Próximo passo seguro\n${citations.length ? "Leia as fontes listadas e execute o Scanner novamente após qualquer alteração para verificar apenas campos detectáveis." : "Abra o Scanner, gere um relatório local e consulte LinuxFix ou guias por tema antes de mudar configurações."}\n\n### Por que esta resposta\nA resposta usa somente o perfil local, memória com consentimento e conteúdo empacotado no SQLite. Ela não executa comandos e não presume que uma solução funcione no seu ambiente.`,
    citations,
    explanation: { facts: [profile ? "O perfil técnico ativo foi usado." : "Não há perfil técnico ativo.", latestSnapshot ? `O último snapshot local foi consultado (${latestSnapshot.createdAt}).` : "Não há snapshot local para consultar.", snapshotFacts ? "Fatos do Scanner local foram consultados." : "Nenhum fato do Scanner local foi consultado.", citations.length ? `${citations.length} fonte(s) interna(s) foram recuperadas.` : "Nenhuma fonte interna foi recuperada.", memories.length ? `${memories.length} memória(s) local(is) com consentimento foram usadas.` : "Nenhuma memória local consentida foi usada."], inferences: citations.length ? ["A seleção de fontes segue termos da pergunta e não comprova que uma solução funcionará no ambiente."] : [], estimates: [], unknowns: ["Não há conclusão automática sobre FPS, compatibilidade, causa raiz ou resultado sem evidência específica."], why: { internalSources: citations.length, profileUsed: Boolean(profile), memoryUsed: memories.length > 0, confidence: citations.length ? "medium" as const : "unavailable" as const } },
    context: { inScope: true, profileAvailable: Boolean(profile), internalSources: citations.length, memoryUsed: memories.length > 0, snapshotAvailable: Boolean(latestSnapshot), snapshotCapturedAt: latestSnapshot?.createdAt ?? null, snapshotFacts: snapshotFacts ? snapshotFacts.split(". ").filter(Boolean) : [] },
  };
}

export const desktopRouter = router({
  auth: router({
    me: publicProcedure.query(() => localUser),
    logout: publicProcedure.mutation(() => ({ success: true })),
  }),
  games: router({
    list: publicProcedure.input(pageInput.extend({ q: z.string().optional(), distributionId: z.number().optional(), gpuId: z.number().optional(), cpuId: z.number().optional(), compatibility: z.string().optional(), platform: z.string().optional(), genre: z.string().optional(), multiplayer: z.boolean().optional(), antiCheat: z.enum(["has", "none"]).optional(), tagSlugs: z.array(z.string()).optional(), sort: z.string().optional() })).query(({ input }) => gameList(input)),
    bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(({ input }) => {
      const game = store().one<any>("SELECT id, slug, title, description AS shortDescription, steam_app_id AS steamAppId, source_positive_reviews AS sourcePositiveReviews FROM games WHERE slug = ?", [input.slug]);
      if (!game) return null;
      return { ...publicGame(game), description: game.shortDescription, compatibility: [], guides: [], fixes: [] };
    }),
    showcase: publicProcedure.input(z.object({ limit: z.number().int().min(1).max(12).default(6) })).query(({ input }) => {
      const fields = "id, slug, title, description AS shortDescription, steam_app_id AS steamAppId, source_positive_reviews AS sourcePositiveReviews";
      return {
        featured: store().all<any>(`SELECT ${fields} FROM games ORDER BY source_positive_reviews DESC, title LIMIT ?`, [input.limit]).map(publicGame),
        recent: store().all<any>(`SELECT ${fields} FROM games ORDER BY id DESC LIMIT ?`, [input.limit]).map(publicGame),
      };
    }),
    resolveInstalled: publicProcedure.input(z.object({ steamAppIds: z.array(z.number().int().positive()).max(512).default([]), titles: z.array(z.string().trim().min(1).max(240)).max(512).default([]) })).query(({ input }) => {
      const steamIds = new Set(input.steamAppIds);
      const titles = new Set(input.titles.map(normalizedTitle).filter(Boolean));
      const rows = store().all<any>("SELECT id, slug, title, description AS shortDescription, steam_app_id AS steamAppId, source_positive_reviews AS sourcePositiveReviews FROM games");
      return rows.flatMap((game) => {
        const bySteamAppId = typeof game.steamAppId === "number" && steamIds.has(game.steamAppId);
        const byNormalizedTitle = titles.has(normalizedTitle(String(game.title)));
        if (!bySteamAppId && !byNormalizedTitle) return [];
        return [{ ...publicGame(game), matchMethod: bySteamAppId ? "steam-app-id" as const : "normalized-title" as const }];
      });
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
  hardware: router({ list: publicProcedure.input(pageInput.extend({ q: z.string().optional(), kind: z.string().optional() })).query(({ input }) => {
    const term = input.q?.trim().toLocaleLowerCase("pt-BR");
    const options = detectedHardwareOptions().filter((item) => (!input.kind || item.kind === input.kind) && (!term || `${item.manufacturer} ${item.model}`.toLocaleLowerCase("pt-BR").includes(term)));
    return paginate(options, input.page, input.pageSize);
  }) }),
  knowledge: router({
    wiki: router({
      list: publicProcedure.input(pageInput.extend({ q: z.string().optional() })).query(({ input }) => wikiList(input)),
      bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(({ input }) => { const article = store().one<any>("SELECT * FROM wiki_articles WHERE slug = ?", [input.slug]); return article ? { article, distributionName: null } : null; }),
    }),
    guides: router({
      list: publicProcedure.input(pageInput.extend({ q: z.string().optional(), difficulty: z.string().optional(), distributionId: z.number().optional() })).query(({ input }) => {
        const term = input.q?.trim() ? `%${input.q.trim()}%` : "%";
        const rows = store().all<any>("SELECT g.*, g.distribution_id AS distributionId, d.name AS distributionName FROM setup_guides g LEFT JOIN distributions d ON d.id = g.distribution_id WHERE g.title LIKE ? AND (? IS NULL OR g.difficulty = ?) AND (? IS NULL OR g.distribution_id = ?) ORDER BY g.title", [term, input.difficulty ?? null, input.difficulty ?? null, input.distributionId ?? null, input.distributionId ?? null]);
        return paginate(rows.map(({ distributionName, ...guide }) => ({ guide, distributionName: distributionName ?? null })), input.page, input.pageSize).data;
      }),
      bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(({ input }) => { const guide = store().one<any>("SELECT *, distribution_id AS distributionId FROM setup_guides WHERE slug = ?", [input.slug]); return guide ? { ...guide, guideVersion: guide.guide_version, sourceUrl: guide.source_url, steps: JSON.parse(guide.steps_json) } : null; }),
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
      return { games: store().all<any>("SELECT id, slug, title, description FROM games WHERE title LIKE ? ORDER BY title LIMIT ?", [term, input.limit]), distributions: store().all<any>("SELECT id, slug, name AS title, family AS description FROM distributions WHERE name LIKE ? ORDER BY name LIMIT ?", [term, input.limit]), hardware: detectedHardwareOptions().filter((item) => `${item.manufacturer} ${item.model}`.toLocaleLowerCase("pt-BR").includes(input.q.toLocaleLowerCase("pt-BR"))).slice(0, input.limit), guides: store().all<any>("SELECT id, slug, title, description FROM setup_guides WHERE title LIKE ? ORDER BY title LIMIT ?", [term, input.limit]) };
    }),
  }),
  benchmarks: router({
    listForGame: publicProcedure.input(z.object({ gameId: z.number(), page: z.number().default(1), pageSize: z.number().default(20), provenance: z.string().optional() })).query(() => []),
    estimate: publicProcedure.input(z.object({ gameId: z.number(), gpuId: z.number().optional(), cpuId: z.number().optional(), distributionId: z.number().optional(), resolutionWidth: z.number(), resolutionHeight: z.number(), preset: z.string() })).query(() => ({ available: false as const, reason: "No verified benchmark available in this local snapshot." })),
    submit: publicProcedure.input(localBenchmarkInput).mutation(({ input }) => { const result = store().run("INSERT INTO benchmarks (game_id, source_label, source_url, evidence_note, results_json) VALUES (?, ?, ?, ?, ?)", [input.gameId, input.sourceLabel, input.sourceUrl ?? null, input.evidenceNote ?? null, JSON.stringify(input.results)]); return { id: Number(result.lastInsertRowid), status: "submitted" as const }; }),
    mine: publicProcedure.query(() => store().all<any>("SELECT b.*, g.title AS gameTitle, g.slug AS gameSlug FROM benchmarks b JOIN games g ON g.id = b.game_id ORDER BY b.created_at DESC").map((row) => ({ benchmark: { id: row.id, verificationStatus: row.verification_status, provenance: row.provenance }, gameTitle: row.gameTitle, gameSlug: row.gameSlug, results: JSON.parse(row.results_json) }))),
    review: publicProcedure.input(localBenchmarkReviewInput).mutation(() => ({ success: false, status: "unavailable" as const, reason: "A revisão de benchmark não é executada no modo desktop local." })),
  }),
  compatibility: router({
    forEnvironment: publicProcedure.input(z.object({ gameId: z.number(), gameVersion: z.string().nullable().optional(), distributionId: z.number().nullable().optional(), distributionVersionId: z.number().nullable().optional(), cpuId: z.number().nullable().optional(), gpuId: z.number().nullable().optional(), kernelVersion: z.string().nullable().optional(), driverVersion: z.string().nullable().optional(), protonVersion: z.string().nullable().optional(), wineVersion: z.string().nullable().optional(), runtimeVersion: z.string().nullable().optional() })).query(() => ({ available: false as const, reason: "O snapshot local atual não inclui registros de compatibilidade por ambiente.", method: "O modo desktop informa indisponibilidade em vez de inferir compatibilidade sem dados locais." })),
  }),
  system: router({
    evidence: router({
      list: publicProcedure.input(pageInput.extend({ scope: z.string().trim().min(1).max(80).optional() })).query(({ input }) => store().all<any>("SELECT id, scope, subject_type AS subjectType, subject_id AS subjectId, evidence_class AS evidenceClass, summary, source_url AS sourceUrl, observed_at AS observedAt, payload_json AS payloadJson, created_at AS createdAt FROM evidence_records WHERE (? IS NULL OR scope = ?) ORDER BY created_at DESC LIMIT ? OFFSET ?", [input.scope ?? null, input.scope ?? null, input.pageSize, (input.page - 1) * input.pageSize])),
    }),
    events: router({
      list: publicProcedure.input(pageInput).query(({ input }) => store().all<any>("SELECT id, event_type AS eventType, label, details_json AS detailsJson, evidence_id AS evidenceId, created_at AS createdAt FROM system_events ORDER BY created_at DESC LIMIT ? OFFSET ?", [input.pageSize, (input.page - 1) * input.pageSize])),
    }),
    logs: router({
      list: publicProcedure.input(pageInput.extend({ level: z.enum(["info", "warning", "error"]).optional() })).query(({ input }) => store().all<any>("SELECT id, level, module, message, details_json AS detailsJson, created_at AS createdAt FROM local_logs WHERE (? IS NULL OR level = ?) ORDER BY created_at DESC LIMIT ? OFFSET ?", [input.level ?? null, input.level ?? null, input.pageSize, (input.page - 1) * input.pageSize])),
    }),
  }),
  user: router({
    dashboard: publicProcedure.query(() => ({ user: localUser, profiles: store().all<any>("SELECT id, name, cpu_id AS cpuId, gpu_id AS gpuId, ram_id AS ramId, distribution_id AS distributionId, distribution_version_id AS distributionVersionId, kernel_version AS kernelVersion, driver_version AS driverVersion, proton_version AS protonVersion, wine_version AS wineVersion, runtime_version AS runtimeVersion, storage_description AS storageDescription, monitor_description AS monitorDescription, is_active AS isActive, updated_at AS updatedAt FROM profiles ORDER BY is_active DESC, updated_at DESC"), favorites: store().all<any>("SELECT g.id, g.slug, g.title, g.description AS shortDescription, g.steam_app_id AS steamAppId FROM favorites f JOIN games g ON g.id = f.game_id ORDER BY f.created_at DESC"), savedGuides: store().all<any>("SELECT g.id, g.slug, g.title, g.description, g.difficulty, g.provenance FROM saved_guides s JOIN setup_guides g ON g.id = s.guide_id ORDER BY s.created_at DESC") })),
    profiles: router({
      list: publicProcedure.query(() => store().all<any>("SELECT id, name, cpu_id AS cpuId, gpu_id AS gpuId, ram_id AS ramId, distribution_id AS distributionId, distribution_version_id AS distributionVersionId, kernel_version AS kernelVersion, driver_version AS driverVersion, proton_version AS protonVersion, wine_version AS wineVersion, runtime_version AS runtimeVersion, storage_description AS storageDescription, monitor_description AS monitorDescription, is_active AS isActive, updated_at AS updatedAt FROM profiles ORDER BY is_active DESC, updated_at DESC")),
      upsert: publicProcedure.input(localProfileInput).mutation(({ input }) => {
        const values = [input.name, input.cpuId ?? null, input.gpuId ?? null, input.ramId ?? null, input.distributionId ?? null, input.distributionVersionId ?? null, input.kernelVersion ?? null, input.driverVersion ?? null, input.protonVersion ?? null, input.wineVersion ?? null, input.runtimeVersion ?? null, input.storageDescription ?? null, input.monitorDescription ?? null, input.isActive ? 1 : 0];
        if (input.id) {
          const existing = store().one<{ id: number }>("SELECT id FROM profiles WHERE id = ? LIMIT 1", [input.id]);
          if (!existing) throw new Error("Perfil local não encontrado.");
          if (input.isActive) store().run("UPDATE profiles SET is_active = 0");
          store().run("UPDATE profiles SET name = ?, cpu_id = ?, gpu_id = ?, ram_id = ?, distribution_id = ?, distribution_version_id = ?, kernel_version = ?, driver_version = ?, proton_version = ?, wine_version = ?, runtime_version = ?, storage_description = ?, monitor_description = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [...values, input.id]);
          return { id: input.id };
        }
        if (input.isActive) store().run("UPDATE profiles SET is_active = 0");
        const result = store().run("INSERT INTO profiles (name, cpu_id, gpu_id, ram_id, distribution_id, distribution_version_id, kernel_version, driver_version, proton_version, wine_version, runtime_version, storage_description, monitor_description, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", values);
        return { id: Number(result.lastInsertRowid) };
      }),
      importScan: publicProcedure.input(z.object({ name: z.string().trim().min(2).max(120), isActive: z.boolean().default(true), scan: scannerReportInput })).mutation(({ input }) => {
        const profile = scannerReportToProfile(input.scan);
        const detectedDistribution = input.scan.system.distribution.id ? store().one<{ id: number }>("SELECT id FROM distributions WHERE lower(slug) = lower(?) LIMIT 1", [input.scan.system.distribution.id]) : undefined;
        const storage = input.scan.system.storage?.totalGb ? `${input.scan.system.storage.usedGb ?? 0} / ${input.scan.system.storage.totalGb} GB${input.scan.system.storage.mount ? ` (${input.scan.system.storage.mount})` : ""}` : null;
        const monitor = input.scan.system.displays?.map((display) => `${display.name || "Monitor"} ${display.resolution || ""}${display.refreshHz ? ` @ ${display.refreshHz} Hz` : ""}`).join(" · ") || null;
        if (input.isActive) store().run("UPDATE profiles SET is_active = 0");
        const result = store().run("INSERT INTO profiles (name, distribution_id, kernel_version, driver_version, proton_version, wine_version, storage_description, monitor_description, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [input.name, detectedDistribution?.id ?? null, profile.kernelVersion, profile.driverVersion, profile.protonVersion, profile.wineVersion, storage, monitor, input.isActive ? 1 : 0]);
        return { id: Number(result.lastInsertRowid), scannerVersion: profile.scannerVersion };
      }),
      remove: publicProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => {
        store().run("DELETE FROM profiles WHERE id = ?", [input.id]);
        return { success: true };
      }),
    }),
    favorites: router({ list: publicProcedure.query(() => store().all<any>("SELECT g.id, g.slug, g.title, g.description AS shortDescription, g.steam_app_id AS steamAppId FROM favorites f JOIN games g ON g.id = f.game_id ORDER BY f.created_at DESC").map((game) => ({ game }))), toggle: publicProcedure.input(z.object({ gameId: z.number() })).mutation(({ input }) => { const current = store().one<any>("SELECT game_id FROM favorites WHERE game_id = ?", [input.gameId]); if (current) { store().run("DELETE FROM favorites WHERE game_id = ?", [input.gameId]); return { favorited: false }; } store().run("INSERT INTO favorites (game_id) VALUES (?)", [input.gameId]); return { favorited: true }; }) }),
    savedGuides: router({ list: publicProcedure.query(() => store().all<any>("SELECT g.id, g.slug, g.title, g.description, g.difficulty, g.provenance FROM saved_guides s JOIN setup_guides g ON g.id = s.guide_id ORDER BY s.created_at DESC").map((guide) => ({ guide }))), toggle: publicProcedure.input(z.object({ guideId: z.number() })).mutation(({ input }) => { const current = store().one<any>("SELECT guide_id FROM saved_guides WHERE guide_id = ?", [input.guideId]); if (current) { store().run("DELETE FROM saved_guides WHERE guide_id = ?", [input.guideId]); return { saved: false }; } store().run("INSERT INTO saved_guides (guide_id) VALUES (?)", [input.guideId]); return { saved: true }; }) }),
    linuxFixHistory: router({ list: publicProcedure.query(() => store().all<any>("SELECT f.*, h.viewed_at AS viewedAt FROM fix_history h JOIN linux_fixes f ON f.id = h.fix_id ORDER BY h.viewed_at DESC").map((row) => ({ fix: { ...row, possibleCauses: row.possible_causes }, viewedAt: row.viewedAt }))), record: publicProcedure.input(z.object({ fixId: z.number() })).mutation(({ input }) => { store().run("INSERT INTO fix_history (fix_id) VALUES (?)", [input.fixId]); return { success: true }; }) }),
    snapshots: router({
      list: publicProcedure.query(() => store().all<any>("SELECT id, label, report_json AS reportJson, created_at AS createdAt FROM scanner_snapshots ORDER BY created_at DESC LIMIT 48").map((row) => ({ id: row.id, label: row.label, createdAt: row.createdAt, scan: scannerReportInput.parse(JSON.parse(row.reportJson)) }))),
      create: publicProcedure.input(z.object({ label: z.string().trim().min(2).max(120), scan: scannerReportInput })).mutation(({ input }) => { const result = store().run("INSERT INTO scanner_snapshots (label, report_json) VALUES (?, ?)", [input.label, JSON.stringify(input.scan)]); const snapshotId = Number(result.lastInsertRowid); const evidence = store().run("INSERT INTO evidence_records (scope, subject_type, subject_id, evidence_class, summary, observed_at, payload_json) VALUES (?, ?, ?, ?, ?, ?, ?)", ["scanner", "snapshot", String(snapshotId), "verified", `Leitura local capturada: ${input.label}`, input.scan.generatedAt, JSON.stringify({ scannerVersion: input.scan.scannerVersion })]); store().run("INSERT INTO system_events (event_type, label, details_json, evidence_id) VALUES (?, ?, ?, ?)", ["scanner.snapshot.created", `Snapshot salvo: ${input.label}`, JSON.stringify({ snapshotId }), Number(evidence.lastInsertRowid)]); store().run("INSERT INTO local_logs (level, module, message, details_json) VALUES (?, ?, ?, ?)", ["info", "scanner", "Snapshot local salvo", JSON.stringify({ snapshotId, scannerVersion: input.scan.scannerVersion })]); return { id: snapshotId }; }),
      remove: publicProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => { store().run("DELETE FROM scanner_snapshots WHERE id = ?", [input.id]); return { success: true }; }),
    }),
    backups: router({
      list: publicProcedure.query(() => store().listLocalBackups()),
      create: publicProcedure.input(z.object({ label: z.string().trim().min(2).max(120) })).mutation(({ input }) => store().createLocalBackup(input.label)),
      preview: publicProcedure.input(z.object({ id: z.number().int().positive() })).query(({ input }) => store().previewLocalBackup(input.id)),
      restore: publicProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => store().restoreLocalBackup(input.id)),
    }),
    timeline: router({
      list: publicProcedure.query(() => store().all<any>("SELECT id, event_type AS eventType, label, details_json AS detailsJson, created_at AS createdAt FROM system_events ORDER BY created_at DESC LIMIT 120")),
    }),
    logs: router({
      list: publicProcedure.input(z.object({ level: z.enum(["info", "warning", "error"]).optional() })).query(({ input }) => store().all<any>("SELECT id, level, module, message, details_json AS detailsJson, created_at AS createdAt FROM local_logs WHERE (? IS NULL OR level = ?) ORDER BY created_at DESC LIMIT 200", [input.level ?? null, input.level ?? null])),
    }),
    preferences: router({
      list: publicProcedure.query(() => store().all<any>("SELECT key, value_json AS valueJson, updated_at AS updatedAt FROM local_preferences ORDER BY key").map((row) => ({ key: row.key, value: JSON.parse(row.valueJson), updatedAt: row.updatedAt }))),
      set: publicProcedure.input(z.object({ key: z.enum(["privacy.aiMemory", "privacy.localBackup", "system.safeMode", "system.releaseChannel", "system.notifications", "system.updateChecks"]), value: z.union([z.boolean(), z.enum(["stable", "beta", "experimental"])] ) })).mutation(({ input }) => { store().run("INSERT INTO local_preferences (key, value_json, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json, updated_at = CURRENT_TIMESTAMP", [input.key, JSON.stringify(input.value)]); return { success: true }; }),
    }),
    aiMemory: router({
      list: publicProcedure.query(() => store().all<any>("SELECT id, memory_type AS memoryType, summary, payload_json AS payloadJson, consented, created_at AS createdAt, updated_at AS updatedAt FROM ai_memory_entries WHERE consented = 1 ORDER BY updated_at DESC LIMIT 48").map((row) => ({ ...row, consented: Boolean(row.consented), payload: JSON.parse(row.payloadJson) }))),
      record: publicProcedure.input(z.object({ memoryType: z.enum(["favorite-game", "runtime", "fix", "diagnostic"]), summary: z.string().trim().min(2).max(320), payload: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).default({}), consented: z.boolean() })).mutation(({ input }) => { const result = store().run("INSERT INTO ai_memory_entries (memory_type, summary, payload_json, consented) VALUES (?, ?, ?, ?)", [input.memoryType, input.summary, JSON.stringify(input.payload), input.consented ? 1 : 0]); return { id: Number(result.lastInsertRowid), stored: input.consented }; }),
      remove: publicProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => { store().run("DELETE FROM ai_memory_entries WHERE id = ?", [input.id]); return { success: true }; }),
    }),
    exportLocalData: publicProcedure.query(() => store().exportLocalData()),
    localDatabaseStatus: publicProcedure.query(() => getDesktopStoreHealth()),
    reports: router({ list: publicProcedure.query(() => store().all<any>("SELECT id, subject_type AS subjectType, subject_id AS subjectId, type, description, status, created_at AS createdAt FROM reports ORDER BY created_at DESC")), create: publicProcedure.input(localReportInput).mutation(({ input }) => { const result = store().run("INSERT INTO reports (subject_type, subject_id, type, description) VALUES (?, ?, ?, ?)", [input.subjectType, input.subjectId, input.type, input.description]); return { id: Number(result.lastInsertRowid), status: "open" as const }; }) }),
    hardwareOptions: publicProcedure.query(() => detectedHardwareOptions()),
    compatibilityForActiveProfile: publicProcedure.input(z.object({ gameId: z.number() })).query(() => ({ profile: store().one<any>("SELECT id, name, cpu_id AS cpuId, gpu_id AS gpuId, distribution_id AS distributionId, kernel_version AS kernelVersion, driver_version AS driverVersion, proton_version AS protonVersion FROM profiles WHERE is_active = 1 ORDER BY updated_at DESC LIMIT 1") ?? null, records: [] })),
    recommendations: publicProcedure.query(() => localRecommendations()),
  }),
  chat: router({ history: publicProcedure.query(() => []), ask: publicProcedure.input(z.object({ question: z.string().trim().min(2).max(2500) })).mutation(({ input }) => desktopAiAnswer(input.question)), askPublic: publicProcedure.input(z.object({ question: z.string().trim().min(2).max(2500) })).mutation(({ input }) => desktopAiAnswer(input.question)) }),
  admin: router({ overview: publicProcedure.query(() => ({ ...store().counts(), hardware: 0, pendingBenchmarks: store().one<{ count: number }>("SELECT count(*) as count FROM benchmarks WHERE verification_status = 'submitted'")?.count ?? 0, openReports: store().one<{ count: number }>("SELECT count(*) as count FROM reports WHERE status = 'open'")?.count ?? 0 })), listUsers: publicProcedure.query(() => [localUser]) }),
});
