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
    const SQL = await initSqlJs();
    const databasePath = path.join(dataDir, "linux-gaming-hub.sqlite");
    const db = fs.existsSync(databasePath) ? new SQL.Database(fs.readFileSync(databasePath)) : new SQL.Database();
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
      CREATE INDEX IF NOT EXISTS idx_games_title ON games(title);
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
