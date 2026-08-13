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
    expect(store.counts().distributions).toBeGreaterThanOrEqual(17);
    const game = store.one<{ id: number; sourcePositiveReviews: number }>("SELECT id, source_positive_reviews AS sourcePositiveReviews FROM games ORDER BY source_positive_reviews DESC LIMIT 1");
    expect(game?.id).toBeTypeOf("number");
    expect(game?.sourcePositiveReviews).toBeGreaterThan(0);

    store.run("INSERT INTO favorites (game_id) VALUES (?)", [game!.id]);
    expect(store.one<{ count: number }>("SELECT count(*) AS count FROM favorites")?.count).toBe(1);
    store.run("INSERT INTO profiles (name, distribution_id, distribution_version_id, wine_version, runtime_version, is_active) VALUES (?, ?, ?, ?, ?, 1)", ["Perfil local", 1, 2, "Wine 10", "Steam Linux Runtime"]);
    expect(store.one<{ distributionId: number; distributionVersionId: number; wineVersion: string; runtimeVersion: string }>("SELECT distribution_id AS distributionId, distribution_version_id AS distributionVersionId, wine_version AS wineVersion, runtime_version AS runtimeVersion FROM profiles WHERE name = ?", ["Perfil local"])).toMatchObject({ distributionId: 1, distributionVersionId: 2, wineVersion: "Wine 10", runtimeVersion: "Steam Linux Runtime" });
    expect(fs.existsSync(path.join(directory, "linux-gaming-hub.sqlite"))).toBe(true);
  });
});
