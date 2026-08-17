import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "../..");
const source = (relativePath: string) => fs.readFileSync(path.join(projectRoot, relativePath), "utf8");

describe("prévia local de manutenção", () => {
  it("usa somente comandos de inspeção e simulação por família", () => {
    const maintenance = source("desktop/bin/stray-maintenance.cjs");
    expect(maintenance).toContain('command("pacman", ["-Qdtq"])');
    expect(maintenance).toContain('command("apt-get", ["--simulate", "autoremove"])');
    expect(maintenance).toContain('command("dnf", ["--assumeno", "autoremove"])');
    expect(maintenance).toContain("cleanupRequiresConfirmation: true");
    expect(maintenance).not.toContain('"pacman", ["-R');
    expect(maintenance).not.toContain('"apt-get", ["autoremove", "-y"])');
    expect(maintenance).not.toContain('"dnf", ["-y", "autoremove"])');
  });

  it("expõe a leitura somente pela ponte IPC do processo principal", () => {
    const main = source("desktop/main.cjs");
    const preload = source("desktop/preload.cjs");
    expect(main).toContain('ipcMain.handle("stray:maintenance:preview"');
    expect(main).toContain("event.sender.id !== mainWindow.webContents.id");
    expect(preload).toContain('maintenance: Object.freeze({ preview: () => ipcRenderer.invoke("stray:maintenance:preview") })');
  });

  it("mantém a importação de MangoHud dependente de escolha de arquivo e limitada", () => {
    const main = source("desktop/main.cjs");
    const parser = source("desktop/bin/stray-performance-log.cjs");
    expect(main).toContain('ipcMain.handle("stray:performance:pick-log"');
    expect(main).toContain('properties: ["openFile", "dontAddToRecent"]');
    expect(main).toContain("8 * 1024 * 1024");
    expect(parser).toContain('source: "user-selected-mangohud-log"');
    expect(parser).toContain("function parsePerformanceLog");
  });
});
