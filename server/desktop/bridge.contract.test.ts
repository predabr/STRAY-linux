import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "../..");
const read = (relativePath: string) => fs.readFileSync(path.join(root, relativePath), "utf8");

describe("contrato da ponte Electron", () => {
  it("mantém handlers para todos os canais expostos ao renderer", () => {
    const preload = read("desktop/preload.cjs");
    const main = read("desktop/main.cjs");
    const channels = [
      "stray:scanner:run",
      "stray:maintenance:preview",
      "stray:performance:pick-log",
      "stray:library:scan",
      "stray:library:launch",
      "stray:library:reveal",
      "stray:library:scan-mods",
      "stray:library:pick-external",
      "stray:updates:status",
      "stray:updates:check",
    ];
    for (const channel of channels) {
      expect(preload).toContain(channel);
      expect(main).toContain(`ipcMain.handle(\"${channel}\"`);
    }
  });

  it("mantém isolamento do renderer e não expõe ipcRenderer diretamente", () => {
    const preload = read("desktop/preload.cjs");
    expect(preload).toContain("contextBridge.exposeInMainWorld");
    expect(preload).not.toContain("window.ipcRenderer");
    expect(preload).not.toContain("nodeIntegration: true");
  });
});
