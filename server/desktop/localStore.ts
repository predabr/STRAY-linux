import initSqlJs, { type Database } from "sql.js";
import fs from "node:fs";
import path from "node:path";

type Seed = {
  exportedAt: string;
  games: Array<{ id: number; slug: string; title: string; shortDescription?: string | null; steamAppId?: number | null; sourcePositiveReviews?: number | null }>;
  distributions: Array<{ id: number; slug: string; name: string; family?: string | null; packageManager?: string | null; defaultDesktop?: string | null; officialUrl?: string | null; sourceUrl?: string | null }>;
  wiki: Array<{ id: number; slug: string; title: string; excerpt?: string | null; body: string; category: string; versionLabel?: string | null; provenance: string; sourceUrl?: string | null }>;
  guides: Array<{ id: number; slug: string; title: string; description?: string | null; difficulty: string; guideVersion?: string | null; distributionId?: number | null; provenance: string; sourceUrl?: string | null; steps: unknown[] }>;
  fixes: Array<{ id: number; slug: string; title: string; category: string; symptoms: string; possibleCauses: string; confidence: string; provenance: string; sourceUrl?: string | null; solutions: unknown[] }>;
};

export class DesktopStore {
  constructor(private db: Database, private databasePath: string) {}
  static async create(dataDir: string, seedPath: string) {
    fs.mkdirSync(dataDir, { recursive: true });
    const wasmPath = process.env.DESKTOP_SQL_WASM_PATH;
    const SQL = wasmPath ? await initSqlJs({ locateFile: (file) => file === "sql-wasm.wasm" ? wasmPath : file }) : await initSqlJs();
    const databasePath = path.join(dataDir, "linux-gaming-hub.sqlite");
    const db = fs.existsSync(databasePath) ? (() => { try { const existing = new SQL.Database(fs.readFileSync(databasePath)); existing.exec("PRAGMA schema_version;"); return existing; } catch { fs.renameSync(databasePath, databasePath + ".corrupt-" + Date.now() + ".bak"); return new SQL.Database(); } })() : new SQL.Database();
    const store = new DesktopStore(db, databasePath);
    store.createSchema();
    store.seed(seedPath);
    return store;
  }
  private createSchema() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS games (id INTEGER PRIMARY KEY, slug TEXT UNIQUE NOT NULL, title TEXT NOT NULL, description TEXT, steam_app_id INTEGER, source_positive_reviews INTEGER);
      CREATE TABLE IF NOT EXISTS distributions (id INTEGER PRIMARY KEY, slug TEXT UNIQUE NOT NULL, name TEXT NOT NULL, family TEXT, package_manager TEXT, desktop TEXT, official_url TEXT, source_url TEXT);
      CREATE TABLE IF NOT EXISTS wiki_articles (id INTEGER PRIMARY KEY, slug TEXT UNIQUE NOT NULL, title TEXT NOT NULL, excerpt TEXT, body TEXT NOT NULL, category TEXT NOT NULL, version_label TEXT, provenance TEXT NOT NULL, source_url TEXT);
      CREATE TABLE IF NOT EXISTS setup_guides (id INTEGER PRIMARY KEY, slug TEXT UNIQUE NOT NULL, title TEXT NOT NULL, description TEXT, difficulty TEXT NOT NULL, guide_version TEXT, distribution_id INTEGER, provenance TEXT NOT NULL, source_url TEXT, steps_json TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS linux_fixes (id INTEGER PRIMARY KEY, slug TEXT UNIQUE NOT NULL, title TEXT NOT NULL, category TEXT NOT NULL, symptoms TEXT NOT NULL, possible_causes TEXT NOT NULL, confidence TEXT NOT NULL, provenance TEXT NOT NULL, source_url TEXT, solutions_json TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS favorites (game_id INTEGER PRIMARY KEY, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS saved_guides (guide_id INTEGER PRIMARY KEY, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS profiles (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE NOT NULL, cpu_id INTEGER, gpu_id INTEGER, ram_id INTEGER, distribution_id INTEGER, distribution_version_id INTEGER, kernel_version TEXT, driver_version TEXT, proton_version TEXT, wine_version TEXT, runtime_version TEXT, storage_description TEXT, monitor_description TEXT, is_active INTEGER NOT NULL DEFAULT 0, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS fix_history (id INTEGER PRIMARY KEY AUTOINCREMENT, fix_id INTEGER NOT NULL, viewed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS reports (id INTEGER PRIMARY KEY AUTOINCREMENT, subject_type TEXT NOT NULL, subject_id INTEGER NOT NULL, type TEXT NOT NULL, description TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'open', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS benchmarks (id INTEGER PRIMARY KEY AUTOINCREMENT, game_id INTEGER NOT NULL, source_label TEXT NOT NULL, source_url TEXT, evidence_note TEXT, verification_status TEXT NOT NULL DEFAULT 'submitted', provenance TEXT NOT NULL DEFAULT 'community', results_json TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS scanner_snapshots (id INTEGER PRIMARY KEY AUTOINCREMENT, label TEXT NOT NULL, report_json TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS evidence_records (id INTEGER PRIMARY KEY AUTOINCREMENT, scope TEXT NOT NULL, subject_type TEXT NOT NULL, subject_id TEXT, evidence_class TEXT NOT NULL CHECK(evidence_class IN ('official', 'verified', 'community', 'estimated', 'unknown')), summary TEXT NOT NULL, source_url TEXT, observed_at TEXT, payload_json TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS system_events (id INTEGER PRIMARY KEY AUTOINCREMENT, event_type TEXT NOT NULL, label TEXT NOT NULL, details_json TEXT NOT NULL DEFAULT '{}', evidence_id INTEGER, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS local_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, level TEXT NOT NULL CHECK(level IN ('info', 'warning', 'error')), module TEXT NOT NULL, message TEXT NOT NULL, details_json TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS performance_sessions (id TEXT PRIMARY KEY, game_id INTEGER NOT NULL, game_title TEXT NOT NULL, profile_name TEXT, started_at INTEGER NOT NULL, ended_at INTEGER, metrics_json TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS local_preferences (key TEXT PRIMARY KEY, value_json TEXT NOT NULL, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS ai_memory_entries (id INTEGER PRIMARY KEY AUTOINCREMENT, memory_type TEXT NOT NULL, summary TEXT NOT NULL, payload_json TEXT NOT NULL DEFAULT '{}', consented INTEGER NOT NULL DEFAULT 0 CHECK(consented IN (0, 1)), created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS local_backups (id INTEGER PRIMARY KEY AUTOINCREMENT, label TEXT NOT NULL, backup_json TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
      CREATE INDEX IF NOT EXISTS idx_games_title ON games(title);
      CREATE INDEX IF NOT EXISTS idx_scanner_snapshots_created ON scanner_snapshots(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_evidence_scope ON evidence_records(scope, created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_system_events_created ON system_events(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_local_logs_created ON local_logs(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_performance_sessions_game ON performance_sessions(game_id, started_at DESC);
      CREATE INDEX IF NOT EXISTS idx_local_backups_created ON local_backups(created_at DESC);
    `);
    const profileColumns = new Set(this.rows<{ name: string }>("PRAGMA table_info(profiles)").map((column) => column.name));
    if (!profileColumns.has("distribution_version_id")) this.db.run("ALTER TABLE profiles ADD COLUMN distribution_version_id INTEGER");
    if (!profileColumns.has("wine_version")) this.db.run("ALTER TABLE profiles ADD COLUMN wine_version TEXT");
    if (!profileColumns.has("runtime_version")) this.db.run("ALTER TABLE profiles ADD COLUMN runtime_version TEXT");
    if (!profileColumns.has("storage_description")) this.db.run("ALTER TABLE profiles ADD COLUMN storage_description TEXT");
    if (!profileColumns.has("monitor_description")) this.db.run("ALTER TABLE profiles ADD COLUMN monitor_description TEXT");
    const gameColumns = new Set(this.rows<{ name: string }>("PRAGMA table_info(games)").map((column) => column.name));
    if (!gameColumns.has("source_positive_reviews")) this.db.run("ALTER TABLE games ADD COLUMN source_positive_reviews INTEGER");
    this.db.run("CREATE INDEX IF NOT EXISTS idx_games_popularity ON games(source_positive_reviews)");
    const guideColumns = new Set(this.rows<{ name: string }>("PRAGMA table_info(setup_guides)").map((column) => column.name));
    if (!guideColumns.has("distribution_id")) this.db.run("ALTER TABLE setup_guides ADD COLUMN distribution_id INTEGER");
    this.db.run("CREATE INDEX IF NOT EXISTS idx_setup_guides_distribution ON setup_guides(distribution_id)");
    this.persist();
  }
  private seed(seedPath: string) {
    const seed = JSON.parse(fs.readFileSync(seedPath, "utf8")) as Seed;
    const marker = this.one<{ value: string }>("SELECT value FROM metadata WHERE key = 'seed_exported_at'");
    if (marker?.value === seed.exportedAt) return;
    this.db.run("BEGIN");
    try {
      this.db.run("DELETE FROM games; DELETE FROM distributions; DELETE FROM wiki_articles; DELETE FROM setup_guides; DELETE FROM linux_fixes;");
      const insert = (sql: string, params: unknown[]) => this.db.run(sql, params as any[]);
      seed.games.forEach((item) => insert("INSERT INTO games (id, slug, title, description, steam_app_id, source_positive_reviews) VALUES (?, ?, ?, ?, ?, ?)", [item.id, item.slug, item.title, item.shortDescription ?? null, item.steamAppId ?? null, item.sourcePositiveReviews ?? null]));
      seed.distributions.forEach((item) => insert("INSERT INTO distributions (id, slug, name, family, package_manager, desktop, official_url, source_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [item.id, item.slug, item.name, item.family ?? null, item.packageManager ?? null, item.defaultDesktop ?? null, item.officialUrl ?? null, item.sourceUrl ?? null]));
      seed.wiki.forEach((item) => insert("INSERT INTO wiki_articles (id, slug, title, excerpt, body, category, version_label, provenance, source_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [item.id, item.slug, item.title, item.excerpt ?? null, item.body, item.category, item.versionLabel ?? null, item.provenance, item.sourceUrl ?? null]));
      seed.guides.forEach((item) => insert("INSERT INTO setup_guides (id, slug, title, description, difficulty, guide_version, distribution_id, provenance, source_url, steps_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [item.id, item.slug, item.title, item.description ?? null, item.difficulty, item.guideVersion ?? null, item.distributionId ?? null, item.provenance, item.sourceUrl ?? null, JSON.stringify(item.steps)]));
      seed.fixes.forEach((item) => insert("INSERT INTO linux_fixes (id, slug, title, category, symptoms, possible_causes, confidence, provenance, source_url, solutions_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [item.id, item.slug, item.title, item.category, item.symptoms, item.possibleCauses, item.confidence, item.provenance, item.sourceUrl ?? null, JSON.stringify(item.solutions)]));
      insert("INSERT INTO metadata (key, value) VALUES ('seed_exported_at', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value", [seed.exportedAt]);
      this.db.run("COMMIT");
    } catch (error) { this.db.run("ROLLBACK"); throw error; }
    this.persist();
  }
  private rows<T>(sql: string, params: unknown[] = []) {
    const result = this.db.exec(sql, params as any[]);
    if (!result.length) return [] as T[];
    const [{ columns, values }] = result;
    return values.map((row) => Object.fromEntries(columns.map((column, index) => [column, row[index]])) as T);
  }
  all<T>(sql: string, params: unknown[] = []) { return this.rows<T>(sql, params); }
  one<T>(sql: string, params: unknown[] = []) { return this.rows<T>(sql, params)[0]; }
  run(sql: string, params: unknown[] = []) {
    this.db.run(sql, params as any[]);
    const lastInsertRowid = this.one<{ id: number }>("SELECT last_insert_rowid() AS id")?.id ?? 0;
    const changes = this.one<{ count: number }>("SELECT changes() AS count")?.count ?? 0;
    this.persist();
    return { lastInsertRowid, changes };
  }
  exportLocalData() {
    return {
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      snapshots: this.all<{ id: number; label: string; reportJson: string; createdAt: string }>("SELECT id, label, report_json AS reportJson, created_at AS createdAt FROM scanner_snapshots ORDER BY created_at DESC"),
      sessions: this.all<{ id: string; gameId: number; gameTitle: string; profileName: string | null; startedAt: number; endedAt: number | null; metricsJson: string; createdAt: string }>("SELECT id, game_id AS gameId, game_title AS gameTitle, profile_name AS profileName, started_at AS startedAt, ended_at AS endedAt, metrics_json AS metricsJson, created_at AS createdAt FROM performance_sessions ORDER BY started_at DESC"),
      preferences: this.all<{ key: string; valueJson: string; updatedAt: string }>("SELECT key, value_json AS valueJson, updated_at AS updatedAt FROM local_preferences ORDER BY key"),
      localGameMetadata: this.all<{ id: number; slug: string; title: string; steamAppId: number | null }>("SELECT id, slug, title, steam_app_id AS steamAppId FROM games ORDER BY title"),
      evidence: this.all<{ id: number; scope: string; subjectType: string; subjectId: string | null; evidenceClass: string; summary: string; sourceUrl: string | null; observedAt: string | null; payloadJson: string; createdAt: string }>("SELECT id, scope, subject_type AS subjectType, subject_id AS subjectId, evidence_class AS evidenceClass, summary, source_url AS sourceUrl, observed_at AS observedAt, payload_json AS payloadJson, created_at AS createdAt FROM evidence_records ORDER BY created_at DESC"),
      events: this.all<{ id: number; eventType: string; label: string; detailsJson: string; evidenceId: number | null; createdAt: string }>("SELECT id, event_type AS eventType, label, details_json AS detailsJson, evidence_id AS evidenceId, created_at AS createdAt FROM system_events ORDER BY created_at DESC"),
      aiMemory: this.all<{ id: number; memoryType: string; summary: string; payloadJson: string; consented: number; createdAt: string; updatedAt: string }>("SELECT id, memory_type AS memoryType, summary, payload_json AS payloadJson, consented, created_at AS createdAt, updated_at AS updatedAt FROM ai_memory_entries WHERE consented = 1 ORDER BY updated_at DESC"),
    };
  }
  private userDataSnapshot() {
    return {
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      favorites: this.all<any>("SELECT game_id AS gameId, created_at AS createdAt FROM favorites ORDER BY created_at DESC"),
      savedGuides: this.all<any>("SELECT guide_id AS guideId, created_at AS createdAt FROM saved_guides ORDER BY created_at DESC"),
      profiles: this.all<any>("SELECT id, name, cpu_id AS cpuId, gpu_id AS gpuId, ram_id AS ramId, distribution_id AS distributionId, distribution_version_id AS distributionVersionId, kernel_version AS kernelVersion, driver_version AS driverVersion, proton_version AS protonVersion, wine_version AS wineVersion, runtime_version AS runtimeVersion, storage_description AS storageDescription, monitor_description AS monitorDescription, is_active AS isActive, updated_at AS updatedAt FROM profiles ORDER BY id"),
      snapshots: this.all<any>("SELECT id, label, report_json AS reportJson, created_at AS createdAt FROM scanner_snapshots ORDER BY id"),
      preferences: this.all<any>("SELECT key, value_json AS valueJson, updated_at AS updatedAt FROM local_preferences ORDER BY key"),
      evidence: this.all<any>("SELECT id, scope, subject_type AS subjectType, subject_id AS subjectId, evidence_class AS evidenceClass, summary, source_url AS sourceUrl, observed_at AS observedAt, payload_json AS payloadJson, created_at AS createdAt FROM evidence_records ORDER BY id"),
      events: this.all<any>("SELECT id, event_type AS eventType, label, details_json AS detailsJson, evidence_id AS evidenceId, created_at AS createdAt FROM system_events ORDER BY id"),
      aiMemory: this.all<any>("SELECT id, memory_type AS memoryType, summary, payload_json AS payloadJson, consented, created_at AS createdAt, updated_at AS updatedAt FROM ai_memory_entries WHERE consented = 1 ORDER BY id"),
    };
  }
  private backupPreview(data: ReturnType<DesktopStore["userDataSnapshot"]>) { return { schemaVersion: data.schemaVersion, exportedAt: data.exportedAt, profiles: data.profiles.length, snapshots: data.snapshots.length, preferences: data.preferences.length, evidence: data.evidence.length, events: data.events.length, aiMemory: data.aiMemory.length, excludes: ["catálogo empacotado", "credenciais", "memórias sem consentimento"] }; }
  createLocalBackup(label: string) { const data = this.userDataSnapshot(); this.db.run("INSERT INTO local_backups (label, backup_json) VALUES (?, ?)", [label, JSON.stringify(data)]); const id = this.one<{ id: number }>("SELECT id FROM local_backups ORDER BY id DESC LIMIT 1")?.id ?? 0; this.persist(); return { id, preview: this.backupPreview(data) }; }
  listLocalBackups() { return this.all<{ id: number; label: string; createdAt: string }>("SELECT id, label, created_at AS createdAt FROM local_backups ORDER BY created_at DESC"); }
  previewLocalBackup(id: number) { const row = this.one<{ backupJson: string }>("SELECT backup_json AS backupJson FROM local_backups WHERE id = ?", [id]); if (!row) throw new Error("Backup local não encontrado."); return this.backupPreview(JSON.parse(row.backupJson)); }
  restoreLocalBackup(id: number) {
    const row = this.one<{ backupJson: string }>("SELECT backup_json AS backupJson FROM local_backups WHERE id = ?", [id]);
    if (!row) throw new Error("Backup local não encontrado.");
    const data = JSON.parse(row.backupJson) as ReturnType<DesktopStore["userDataSnapshot"]>;
    if (data.schemaVersion !== 1) throw new Error("Formato de backup local incompatível.");
    this.db.run("BEGIN");
    try {
      this.db.run("DELETE FROM favorites; DELETE FROM saved_guides; DELETE FROM profiles; DELETE FROM scanner_snapshots; DELETE FROM local_preferences; DELETE FROM evidence_records; DELETE FROM system_events; DELETE FROM ai_memory_entries;");
      data.favorites.forEach((item) => this.db.run("INSERT INTO favorites (game_id, created_at) VALUES (?, ?)", [item.gameId, item.createdAt]));
      data.savedGuides.forEach((item) => this.db.run("INSERT INTO saved_guides (guide_id, created_at) VALUES (?, ?)", [item.guideId, item.createdAt]));
      data.profiles.forEach((item) => this.db.run("INSERT INTO profiles (id, name, cpu_id, gpu_id, ram_id, distribution_id, distribution_version_id, kernel_version, driver_version, proton_version, wine_version, runtime_version, storage_description, monitor_description, is_active, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [item.id, item.name, item.cpuId, item.gpuId, item.ramId, item.distributionId, item.distributionVersionId, item.kernelVersion, item.driverVersion, item.protonVersion, item.wineVersion, item.runtimeVersion, item.storageDescription, item.monitorDescription, item.isActive, item.updatedAt]));
      data.snapshots.forEach((item) => this.db.run("INSERT INTO scanner_snapshots (id, label, report_json, created_at) VALUES (?, ?, ?, ?)", [item.id, item.label, item.reportJson, item.createdAt]));
      data.preferences.forEach((item) => this.db.run("INSERT INTO local_preferences (key, value_json, updated_at) VALUES (?, ?, ?)", [item.key, item.valueJson, item.updatedAt]));
      data.evidence.forEach((item) => this.db.run("INSERT INTO evidence_records (id, scope, subject_type, subject_id, evidence_class, summary, source_url, observed_at, payload_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [item.id, item.scope, item.subjectType, item.subjectId, item.evidenceClass, item.summary, item.sourceUrl, item.observedAt, item.payloadJson, item.createdAt]));
      data.events.forEach((item) => this.db.run("INSERT INTO system_events (id, event_type, label, details_json, evidence_id, created_at) VALUES (?, ?, ?, ?, ?, ?)", [item.id, item.eventType, item.label, item.detailsJson, item.evidenceId, item.createdAt]));
      data.aiMemory.forEach((item) => this.db.run("INSERT INTO ai_memory_entries (id, memory_type, summary, payload_json, consented, created_at, updated_at) VALUES (?, ?, ?, ?, 1, ?, ?)", [item.id, item.memoryType, item.summary, item.payloadJson, item.createdAt, item.updatedAt]));
      this.db.run("INSERT INTO system_events (event_type, label, details_json) VALUES (?, ?, ?)", ["backup.restored", "Backup local restaurado", JSON.stringify({ backupId: id })]);
      this.db.run("COMMIT");
    } catch (error) { this.db.run("ROLLBACK"); throw error; }
    this.persist();
    return { success: true, preview: this.backupPreview(data) };
  }
  private persist() { fs.writeFileSync(this.databasePath, Buffer.from(this.db.export())); }
  counts() { return { games: this.one<{ count: number }>("SELECT count(*) as count FROM games")?.count ?? 0, distributions: this.one<{ count: number }>("SELECT count(*) as count FROM distributions")?.count ?? 0, wiki: this.one<{ count: number }>("SELECT count(*) as count FROM wiki_articles")?.count ?? 0, guides: this.one<{ count: number }>("SELECT count(*) as count FROM setup_guides")?.count ?? 0, fixes: this.one<{ count: number }>("SELECT count(*) as count FROM linux_fixes")?.count ?? 0 }; }
}

let store: DesktopStore | null = null;
export async function initializeDesktopStore() {
  if (!store) {
    const dataDir = process.env.DESKTOP_DATA_DIR;
    const seedPath = process.env.DESKTOP_SEED_PATH;
    if (!dataDir || !seedPath) throw new Error("Desktop SQLite paths were not configured.");
    store = await DesktopStore.create(dataDir, seedPath);
  }
  return store;
}
export function getDesktopStore() { if (!store) throw new Error("Desktop SQLite store was not initialized."); return store; }
