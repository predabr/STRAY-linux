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

    expect(store.counts().games).toBeGreaterThanOrEqual(1500);
    expect(store.counts().distributions).toBeGreaterThanOrEqual(17);
    const game = store.one<{ id: number }>("SELECT id FROM games ORDER BY id LIMIT 1");
    expect(game?.id).toBeTypeOf("number");

    store.run("INSERT INTO favorites (game_id) VALUES (?)", [game!.id]);
    expect(store.one<{ count: number }>("SELECT count(*) AS count FROM favorites")?.count).toBe(1);
    expect(fs.existsSync(path.join(directory, "linux-gaming-hub.sqlite"))).toBe(true);
  });
});
