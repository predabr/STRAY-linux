import { beforeAll, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { initializeDesktopStore } from "./localStore";
import { desktopRouter } from "./router";

describe("Stray AI no modo desktop", () => {
  it("mantém a recusa fora do escopo sem consultar conteúdo local", async () => {
    const caller = desktopRouter.createCaller({} as never);
    const result = await caller.chat.ask({ question: "Crie o código de um jogo de corrida" });
    expect(result.context.inScope).toBe(false);
    expect(result.citations).toEqual([]);
    expect(result.context.memoryUsed).toBe(false);
    expect(result.explanation.unknowns.join(" ")).toContain("fora do escopo");
  });
});

describe("contrato local do desktop", () => {
  beforeAll(async () => { process.env.DESKTOP_DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), "stray-router-test-")); process.env.DESKTOP_SEED_PATH = path.resolve("desktop/seed/initial-data.json"); await initializeDesktopStore(); });
  it("expõe snapshots e saúde SQLite pelos caminhos user usados pelo cliente", async () => {
    const caller = desktopRouter.createCaller({} as never);
    const snapshots = await caller.user.snapshots.list();
    const health = await caller.user.localDatabaseStatus();
    expect(Array.isArray(snapshots)).toBe(true);
    expect(["ready", "recovered", "unavailable"]).toContain(health.status);
  });
});
