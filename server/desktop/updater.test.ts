import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const { createDesktopUpdater, UPDATE_FEED_URL } = require("../../desktop/updater.cjs") as typeof import("../../desktop/updater.cjs");

function emitter() {
  const handlers = new Map<string, (value?: any) => void>();
  return {
    on: (event: string, handler: (value?: any) => void) => { handlers.set(event, handler); },
    emit: (event: string, value?: any) => handlers.get(event)?.(value),
    checkForUpdates: async () => undefined,
    quitAndInstall: () => undefined,
  };
}

describe("atualização desktop controlada", () => {
  it("não verifica feed no modo de desenvolvimento", async () => {
    const updater = createDesktopUpdater({ app: { isPackaged: false, getVersion: () => "1.1.0" }, autoUpdater: emitter(), dialog: {} });
    expect(updater.feedUrl).toBe(UPDATE_FEED_URL);
    expect((await updater.check()).state).toBe("development");
  });

  it("baixa uma versão encontrada e só instala após confirmação", async () => {
    const autoUpdater = emitter();
    let installed = false;
    autoUpdater.quitAndInstall = () => { installed = true; };
    const updater = createDesktopUpdater({ app: { isPackaged: true, getVersion: () => "1.0.0" }, autoUpdater, dialog: { showMessageBox: async () => ({ response: 0 }) }, logger: { info: () => {}, error: () => {} } });
    autoUpdater.emit("update-available", { version: "1.1.0" });
    autoUpdater.emit("download-progress", { percent: 50 });
    expect(updater.getStatus()).toMatchObject({ state: "downloading", progress: 50, version: "1.1.0" });
    autoUpdater.emit("update-downloaded", { version: "1.1.0" });
    await new Promise((resolve) => setImmediate(resolve));
    expect(installed).toBe(true);
  });
});
