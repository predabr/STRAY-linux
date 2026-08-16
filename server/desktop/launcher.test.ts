import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "../..");
const mainSource = () => fs.readFileSync(path.join(projectRoot, "desktop/main.cjs"), "utf8");

describe("bootstrap desktop Linux", () => {
  it("desativa aceleração gráfica antes do Electron ficar pronto", () => {
    const source = mainSource();
    expect(source).toContain('if (process.platform === "linux") app.disableHardwareAcceleration();');
  });

  it("seleciona porta livre e informa encerramento antecipado do servidor", () => {
    const source = mainSource();
    expect(source).toContain("function findAvailablePort(preferred)");
    expect(source).toContain('fallback.listen(0, "127.0.0.1"');
    expect(source).toContain("O servidor local encerrou antes de responder");
    expect(source).toContain("await waitForServer(port, child)");
  });

  it("encaminha o WASM SQLite externo incluído no pacote Linux", () => {
    const source = mainSource();
    expect(source).toContain('path.join(process.resourcesPath, "sql-wasm.wasm")');
    expect(source).toContain("DESKTOP_SQL_WASM_PATH");
    expect(source).toContain("resolveSqlWasmPath");
  });

  it("persiste stdout, stderr e o caminho do diagnóstico do servidor local", () => {
    const source = mainSource();
    expect(source).toContain("serverProcess.stdout.on");
    expect(source).toContain("serverProcess.stderr.on");
    expect(source).toContain("stray-linux-server.log");
    expect(source).toContain("appendLocalServerLog");
    expect(source).toContain("A causa técnica foi registrada em:");
  });
});
