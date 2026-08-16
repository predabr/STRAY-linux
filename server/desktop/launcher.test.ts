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
});
