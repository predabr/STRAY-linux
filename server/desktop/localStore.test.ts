import { afterEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { DesktopStore } from "./localStore";

const temporaryDirectories: string[] = [];

afterEach(() => {
  temporaryDirectories.splice(0).forEach((directory) => fs.rmSync(directory, { recursive: true, force: true }));
});

describe("DesktopStore", () => {
  it("creates a local SQLite snapshot and persists personal data without DATABASE_URL", async () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "lgh-sqlite-test-"));
    temporaryDirectories.push(directory);
    const seedPath = path.resolve("desktop/seed/initial-data.json");
    const store = await DesktopStore.create(directory, seedPath);

    expect(store.counts().games).toBeGreaterThanOrEqual(10000);
    expect(store.counts().distributions).toBeGreaterThanOrEqual(21);
    expect(store.one<{ slug: string; packageManager: string }>("SELECT slug, package_manager AS packageManager FROM distributions WHERE slug = ?", ["zorin-os"])).toEqual({ slug: "zorin-os", packageManager: "apt" });
    expect(store.one<{ slug: string; packageManager: string | null }>("SELECT slug, package_manager AS packageManager FROM distributions WHERE slug = ?", ["pikaos"])).toEqual({ slug: "pikaos", packageManager: "apt" });
    expect(store.one<{ slug: string; packageManager: string | null }>("SELECT slug, package_manager AS packageManager FROM distributions WHERE slug = ?", ["garuda-linux"])).toEqual({ slug: "garuda-linux", packageManager: "pacman" });
    expect(store.one<{ slug: string; packageManager: string | null }>("SELECT slug, package_manager AS packageManager FROM distributions WHERE slug = ?", ["chimeraos"])).toEqual({ slug: "chimeraos", packageManager: null });
    expect(store.one<{ slug: string }>("SELECT slug FROM wiki_articles WHERE slug = ?", ["zorin-os-gaming-reference"])).toEqual({ slug: "zorin-os-gaming-reference" });
    expect(store.all<{ slug: string }>("SELECT slug FROM wiki_articles WHERE slug IN (?, ?, ?) ORDER BY slug", ["chimeraos-overview", "garuda-linux-overview", "pikaos-overview"])).toHaveLength(3);
    expect(store.one<{ sourceUrl: string }>("SELECT source_url AS sourceUrl FROM wiki_articles WHERE slug = ?", ["pikaos-overview"])).toEqual({ sourceUrl: "https://wiki.pika-os.com/en/why-pikaos" });
    expect(store.all<{ slug: string }>("SELECT slug FROM setup_guides WHERE slug IN (?, ?, ?) ORDER BY slug", ["zorin-nvidia-driver-gaming", "zorin-steam-flatpak", "zorin-update-and-gaming-baseline"])).toHaveLength(3);
    expect(store.counts().guides).toBeGreaterThanOrEqual(54);
    expect(store.one<{ slug: string; distributionId: number }>("SELECT slug, distribution_id AS distributionId FROM setup_guides WHERE slug = ?", ["pikaos-gaming-family-baseline"])).toEqual({ slug: "pikaos-gaming-family-baseline", distributionId: 420001 });
    expect(store.all<{ slug: string }>("SELECT slug FROM linux_fixes WHERE slug IN (?, ?, ?) ORDER BY slug", ["flatpak-steam-permission-reset", "proton-log-collect", "wine-version-context"])).toHaveLength(3);
    const game = store.one<{ id: number; sourcePositiveReviews: number }>("SELECT id, source_positive_reviews AS sourcePositiveReviews FROM games ORDER BY source_positive_reviews DESC LIMIT 1");
    expect(game?.id).toBeTypeOf("number");
    expect(game?.sourcePositiveReviews).toBeGreaterThan(0);

    store.run("INSERT INTO favorites (game_id) VALUES (?)", [game!.id]);
    expect(store.one<{ count: number }>("SELECT count(*) AS count FROM favorites")?.count).toBe(1);
    store.run("INSERT INTO profiles (name, distribution_id, distribution_version_id, wine_version, runtime_version, is_active) VALUES (?, ?, ?, ?, ?, 1)", ["Perfil local", 1, 2, "Wine 10", "Steam Linux Runtime"]);
    expect(store.one<{ distributionId: number; distributionVersionId: number; wineVersion: string; runtimeVersion: string }>("SELECT distribution_id AS distributionId, distribution_version_id AS distributionVersionId, wine_version AS wineVersion, runtime_version AS runtimeVersion FROM profiles WHERE name = ?", ["Perfil local"])).toMatchObject({ distributionId: 1, distributionVersionId: 2, wineVersion: "Wine 10", runtimeVersion: "Steam Linux Runtime" });
    store.run("INSERT INTO scanner_snapshots (label, report_json) VALUES (?, ?)", ["Antes da atualização", JSON.stringify({ schemaVersion: 1 })]);
    expect(store.one<{ label: string }>("SELECT label FROM scanner_snapshots WHERE label = ?", ["Antes da atualização"])).toEqual({ label: "Antes da atualização" });
    store.run("INSERT INTO evidence_records (scope, subject_type, evidence_class, summary, payload_json) VALUES (?, ?, ?, ?, ?)", ["scanner", "report", "verified", "Scanner local concluído", "{}"]);
    store.run("INSERT INTO system_events (event_type, label, details_json) VALUES (?, ?, ?)", ["scanner.completed", "Scanner local concluído", "{}"]);
    store.run("INSERT INTO local_logs (level, module, message, details_json) VALUES (?, ?, ?, ?)", ["info", "scanner", "Relatório salvo localmente", "{}"]);
    store.run("INSERT INTO performance_sessions (id, game_id, game_title, started_at, metrics_json) VALUES (?, ?, ?, ?, ?)", ["session-1", game!.id, "Sessão local", Date.now(), "{}"]);
    store.run("INSERT INTO local_preferences (key, value_json) VALUES (?, ?)", ["privacy.aiMemory", JSON.stringify({ enabled: true })]);
    store.run("INSERT INTO ai_memory_entries (memory_type, summary, payload_json, consented) VALUES (?, ?, ?, ?)", ["diagnostic", "Vulkan observado no último scanner", "{}", 1]);
    store.run("INSERT INTO ai_memory_entries (memory_type, summary, payload_json, consented) VALUES (?, ?, ?, ?)", ["diagnostic", "Não exportar sem consentimento", "{}", 0]);
    const exportData = store.exportLocalData();
    expect(exportData.snapshots).toHaveLength(1);
    expect(exportData.sessions).toHaveLength(1);
    expect(exportData.preferences).toEqual([{ key: "privacy.aiMemory", valueJson: JSON.stringify({ enabled: true }), updatedAt: expect.any(String) }]);
    expect(exportData.evidence).toHaveLength(1);
    expect(exportData.events).toHaveLength(1);
    expect(exportData.aiMemory).toHaveLength(1);
    expect(exportData.diagnosticLogs).toEqual([expect.objectContaining({ level: "info", module: "scanner", message: "Relatório salvo localmente" })]);
    expect(JSON.stringify(exportData)).not.toContain("Não exportar sem consentimento");
    const backup = store.createLocalBackup("Antes da troca");
    expect(backup.preview.aiMemory).toBe(1);
    store.run("UPDATE local_preferences SET value_json = ? WHERE key = ?", [JSON.stringify({ enabled: false }), "privacy.aiMemory"]);
    const restore = store.restoreLocalBackup(backup.id);
    expect(restore.success).toBe(true);
    expect(store.one<{ valueJson: string }>("SELECT value_json AS valueJson FROM local_preferences WHERE key = ?", ["privacy.aiMemory"])?.valueJson).toBe(JSON.stringify({ enabled: true }));
    expect(store.listLocalBackups()).toHaveLength(1);
    expect(fs.existsSync(path.join(directory, "linux-gaming-hub.sqlite"))).toBe(true);
  });

  it("preserva um banco local corrompido e recria uma base utilizável", async () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "lgh-sqlite-recovery-test-"));
    temporaryDirectories.push(directory);
    fs.writeFileSync(path.join(directory, "linux-gaming-hub.sqlite"), "arquivo que não é SQLite");

    const store = await DesktopStore.create(directory, path.resolve("desktop/seed/initial-data.json"));

    expect(store.recoveredDatabase).toBe(true);
    expect(store.counts().games).toBeGreaterThanOrEqual(10000);
    expect(fs.readdirSync(directory).some((name) => name.startsWith("linux-gaming-hub.sqlite.corrupt-") && name.endsWith(".bak"))).toBe(true);
    expect(store.one<{ level: string; module: string }>("SELECT level, module FROM local_logs WHERE module = ? ORDER BY id DESC LIMIT 1", ["database"])).toEqual({ level: "warning", module: "database" });
  });
});
