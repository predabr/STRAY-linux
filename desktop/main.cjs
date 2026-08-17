const { app, BrowserWindow, dialog, ipcMain, Menu, shell } = require("electron");
const { spawn } = require("node:child_process");
const net = require("node:net");
const fs = require("node:fs");
const path = require("node:path");
const { isAllowedExternalUrl } = require("./security.cjs");
const { autoUpdater } = require("electron-updater");
const { createDesktopUpdater } = require("./updater.cjs");

let serverProcess;
let mainWindow;
let desktopUpdater;
const preferredPort = Number(process.env.LGH_PORT || 43819);
if (process.platform === "linux") app.disableHardwareAcceleration();

function localServerLogPath() {
  return path.join(app.getPath("userData"), "stray-linux-server.log");
}

function appendLocalServerLog(kind, value) {
  try {
    const logPath = localServerLogPath();
    const line = `[${new Date().toISOString()}] [${kind}] ${String(value).trim()}\n`;
    fs.appendFileSync(logPath, line, "utf8");
    if (fs.statSync(logPath).size > 512_000) {
      const recent = fs.readFileSync(logPath, "utf8").slice(-384_000);
      fs.writeFileSync(logPath, recent, "utf8");
    }
    return logPath;
  } catch {
    return null;
  }
}

function findAvailablePort(preferred) {
  return new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.once("error", () => {
      probe.close();
      const fallback = net.createServer();
      fallback.once("error", reject);
      fallback.listen(0, "127.0.0.1", () => {
        const address = fallback.address();
        const port = typeof address === "object" && address ? address.port : 0;
        fallback.close(() => resolve(port));
      });
    });
    probe.listen(preferred, "127.0.0.1", () => probe.close(() => resolve(preferred)));
  });
}

function loadDesktopConfig() {
  const configPath = path.join(app.getPath("userData"), "stray-linux.config.json");
  const defaults = { port: preferredPort };
  try {
    const legacyPath = path.join(app.getPath("userData"), "linux-gaming-hub.config.json");
    const sourcePath = fs.existsSync(configPath) ? configPath : legacyPath;
    const stored = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
    const normalized = { ...defaults, ...stored };
    if (sourcePath !== configPath) fs.writeFileSync(configPath, JSON.stringify(normalized, null, 2));
    return normalized;
  } catch {
    fs.writeFileSync(configPath, JSON.stringify(defaults, null, 2));
    return defaults;
  }
}

function resolveSqlWasmPath() {
  const candidates = app.isPackaged
    ? [path.join(process.resourcesPath, "sql-wasm.wasm")]
    : [
        path.join(app.getAppPath(), "node_modules", "sql.js", "dist", "sql-wasm.wasm"),
        path.join(process.cwd(), "node_modules", "sql.js", "dist", "sql-wasm.wasm"),
      ];
  return candidates.find((candidate) => fs.existsSync(candidate)) ?? null;
}

function startLocalServer(config) {
  const serverEntry = app.isPackaged
    ? path.join(process.resourcesPath, "app.asar", "dist", "index.js")
    : path.join(app.getAppPath(), "dist", "index.js");
  const seedPath = app.isPackaged
    ? path.join(process.resourcesPath, "app.asar", "desktop", "seed", "initial-data.json")
    : path.join(app.getAppPath(), "desktop", "seed", "initial-data.json");
  const sqlWasmPath = resolveSqlWasmPath();
  const serverEnv = {
    ...process.env,
    ELECTRON_RUN_AS_NODE: "1",
    NODE_ENV: "production",
    ELECTRON_DISABLE_GPU: "1",
    DESKTOP_MODE: "1",
    PORT: String(config.port),
    DESKTOP_DATA_DIR: app.getPath("userData"),
    DESKTOP_SEED_PATH: seedPath,
  };
  if (sqlWasmPath) serverEnv.DESKTOP_SQL_WASM_PATH = sqlWasmPath;
  else delete serverEnv.DESKTOP_SQL_WASM_PATH;
  appendLocalServerLog("startup", `Iniciando servidor local em ${serverEntry}; SQLite WASM: ${sqlWasmPath ?? "ausente"}`);
  serverProcess = spawn(process.execPath, [serverEntry], {
    env: serverEnv,
    stdio: "pipe",
    windowsHide: true,
  });
  serverProcess.stdout.on("data", (chunk) => { appendLocalServerLog("stdout", chunk); console.log(`[local-server] ${chunk}`); });
  serverProcess.stderr.on("data", (chunk) => { appendLocalServerLog("stderr", chunk); console.error(`[local-server] ${chunk}`); });
  serverProcess.on("error", (error) => { appendLocalServerLog("spawn-error", error.stack || error.message); console.error(`[local-server] spawn error: ${error.message}`); });
  serverProcess.on("exit", (code, signal) => { const event = `Servidor local encerrou: código ${code ?? "null"}${signal ? `; sinal ${signal}` : ""}`; appendLocalServerLog("exit", event); console.error(`[local-server] exited with code ${code ?? "null"}${signal ? ` signal ${signal}` : ""}`); });
  return serverProcess;
}

async function waitForServer(port, child, attempts = 80) {
  let exited = false;
  let exitCode = null;
  const onExit = (code) => { exited = true; exitCode = code; };
  child.once("exit", onExit);
  try {
    for (let attempt = 0; attempt < attempts; attempt += 1) {
      if (exited) throw new Error(`O servidor local encerrou antes de responder${exitCode === null ? "" : ` (código ${exitCode})`}.`);
      try {
        const response = await fetch(`http://127.0.0.1:${port}/api/health`);
        if (response.ok) return;
      } catch {}
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    throw new Error("O servidor local não iniciou a tempo.");
  } finally {
    child.removeListener("exit", onExit);
  }
}

function createWindow(port) {
  const localOrigin = `http://127.0.0.1:${port}`;
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 940,
    minWidth: 1024,
    minHeight: 720,
    backgroundColor: "#09090b",
    title: "Stray Linux",
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true, webSecurity: true, preload: path.join(__dirname, "preload.cjs") },
  });
  mainWindow.setMenuBarVisibility(false);
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (isAllowedExternalUrl(url)) void shell.openExternal(url).catch((error) => console.error("[external-link]", error));
    return { action: "deny" };
  });
  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (url === localOrigin || url.startsWith(`${localOrigin}/`)) return;
    event.preventDefault();
    if (isAllowedExternalUrl(url)) void shell.openExternal(url).catch((error) => console.error("[external-link]", error));
  });
  mainWindow.loadURL(`${localOrigin}/dashboard`);
}

function runScanner() {
  const scannerPath = app.isPackaged ? path.join(process.resourcesPath, "app.asar", "desktop", "bin", "stray-scan.cjs") : path.join(app.getAppPath(), "desktop", "bin", "stray-scan.cjs");
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [scannerPath, "--pretty"], { env: { ...process.env, ELECTRON_RUN_AS_NODE: "1" }, stdio: ["ignore", "pipe", "pipe"], windowsHide: true });
    let stdout = ""; let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", () => reject(new Error("Não foi possível iniciar o scanner local.")));
    child.on("close", (code) => {
      if (code !== 0) return reject(new Error(stderr.trim() || "O scanner local não terminou corretamente."));
      try { resolve(JSON.parse(stdout)); } catch { reject(new Error("O scanner local retornou um relatório inválido.")); }
    });
  });
}

function scanLibrary() {
  const libraryPath = app.isPackaged ? path.join(process.resourcesPath, "app.asar", "desktop", "bin", "stray-library.cjs") : path.join(app.getAppPath(), "desktop", "bin", "stray-library.cjs");
  const { scanLocalLibrary } = require(libraryPath);
  return { games: scanLocalLibrary() };
}

app.whenReady().then(async () => {
  Menu.setApplicationMenu(null);
  ipcMain.handle("stray:scanner:run", async (event) => {
    if (!mainWindow || event.sender.id !== mainWindow.webContents.id) throw new Error("Solicitação do scanner recusada.");
    return runScanner();
  });
  ipcMain.handle("stray:maintenance:preview", async (event) => {
    if (!mainWindow || event.sender.id !== mainWindow.webContents.id) throw new Error("Solicitação de manutenção recusada.");
    const maintenancePath = app.isPackaged ? path.join(process.resourcesPath, "app.asar", "desktop", "bin", "stray-maintenance.cjs") : path.join(app.getAppPath(), "desktop", "bin", "stray-maintenance.cjs");
    const { previewMaintenance } = require(maintenancePath);
    return previewMaintenance();
  });
  ipcMain.handle("stray:performance:pick-log", async (event) => {
    if (!mainWindow || event.sender.id !== mainWindow.webContents.id) throw new Error("Solicitação de log recusada.");
    const selected = await dialog.showOpenDialog(mainWindow, { title: "Selecionar log MangoHud", filters: [{ name: "Logs e CSV", extensions: ["csv", "log", "txt"] }], properties: ["openFile", "dontAddToRecent"] });
    if (selected.canceled || !selected.filePaths[0]) return { cancelled: true, log: null };
    const filePath = selected.filePaths[0];
    const size = fs.statSync(filePath).size;
    if (size > 8 * 1024 * 1024) throw new Error("O log selecionado excede o limite local de 8 MB.");
    const performancePath = app.isPackaged ? path.join(process.resourcesPath, "app.asar", "desktop", "bin", "stray-performance-log.cjs") : path.join(app.getAppPath(), "desktop", "bin", "stray-performance-log.cjs");
    const { parsePerformanceLog } = require(performancePath);
    return { cancelled: false, log: parsePerformanceLog(filePath, fs.readFileSync(filePath, "utf8")) };
  });
  ipcMain.handle("stray:library:scan", async (event) => {
    if (!mainWindow || event.sender.id !== mainWindow.webContents.id) throw new Error("Solicitação da biblioteca recusada.");
    return scanLibrary();
  });
  ipcMain.handle("stray:library:scan-mods", async (event) => {
    if (!mainWindow || event.sender.id !== mainWindow.webContents.id) throw new Error("Solicitação de mods recusada.");
    const libraryPath = app.isPackaged ? path.join(process.resourcesPath, "app.asar", "desktop", "bin", "stray-library.cjs") : path.join(app.getAppPath(), "desktop", "bin", "stray-library.cjs");
    const { scanSteamWorkshop } = require(libraryPath);
    return scanSteamWorkshop();
  });
  ipcMain.handle("stray:library:pick-external", async (event) => {
    if (!mainWindow || event.sender.id !== mainWindow.webContents.id) throw new Error("Solicitação de pasta externa recusada.");
    const selected = await dialog.showOpenDialog(mainWindow, { title: "Selecionar pasta de jogo externo", properties: ["openDirectory", "dontAddToRecent"] });
    if (selected.canceled || !selected.filePaths[0]) return { cancelled: true, game: null };
    const libraryPath = app.isPackaged ? path.join(process.resourcesPath, "app.asar", "desktop", "bin", "stray-library.cjs") : path.join(app.getAppPath(), "desktop", "bin", "stray-library.cjs");
    const { describeExternalGameDirectory } = require(libraryPath);
    return { cancelled: false, game: describeExternalGameDirectory(selected.filePaths[0]) };
  });
  ipcMain.handle("stray:library:launch", async (event, gameId) => {
    if (!mainWindow || event.sender.id !== mainWindow.webContents.id) throw new Error("Solicitação de execução recusada.");
    if (typeof gameId !== "string" || !/^steam:\d+$/.test(gameId)) throw new Error("O Stray Linux não inicia jogos do Heroic; abra-o pelo próprio launcher.");
    const appId = Number(gameId.slice("steam:".length));
    if (!Number.isSafeInteger(appId) || appId <= 0) throw new Error("Identificador de jogo inválido.");
    const installed = scanLibrary().games.some((game) => game.appId === appId);
    if (!installed) throw new Error("O jogo não está instalado nesta biblioteca Steam.");
    await shell.openExternal(`steam://run/${appId}`);
    return { launched: true };
  });
  ipcMain.handle("stray:library:reveal", async (event, gameId) => {
    if (!mainWindow || event.sender.id !== mainWindow.webContents.id) throw new Error("Solicitação de pasta recusada.");
    if (typeof gameId !== "string") throw new Error("Identificador de jogo inválido.");
    const game = scanLibrary().games.find((entry) => entry.id === gameId);
    if (!game?.installDir) throw new Error("A pasta de instalação deste jogo não foi encontrada.");
    const message = await shell.openPath(game.installDir);
    if (message) throw new Error(message);
    return { revealed: true };
  });
  ipcMain.handle("stray:updates:status", async (event) => {
    if (!mainWindow || event.sender.id !== mainWindow.webContents.id) throw new Error("Solicitação de atualização recusada.");
    return desktopUpdater?.getStatus() ?? { state: "unavailable", detail: "Atualizações não foram inicializadas." };
  });
  ipcMain.handle("stray:updates:check", async (event) => {
    if (!mainWindow || event.sender.id !== mainWindow.webContents.id) throw new Error("Solicitação de atualização recusada.");
    return desktopUpdater?.check() ?? { state: "unavailable", detail: "Atualizações não foram inicializadas." };
  });
  const config = loadDesktopConfig();
  try {
    const port = await findAvailablePort(config.port);
    const child = startLocalServer({ ...config, port });
    await waitForServer(port, child);
    createWindow(port);
    desktopUpdater = createDesktopUpdater({ app, autoUpdater, dialog });
    if (app.isPackaged) setTimeout(() => { void desktopUpdater.check(); }, 15_000);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const logPath = appendLocalServerLog("startup-failure", message) || localServerLogPath();
    dialog.showErrorBox("Stray Linux", `${message}\n\nO aplicativo não exige DATABASE_URL. A causa técnica foi registrada em:\n${logPath}\n\nEnvie esse arquivo pela opção “Exportar diagnóstico” ou confira as permissões do diretório local antes de abrir novamente.`);
    app.quit();
  }
});

app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
app.on("before-quit", () => { if (serverProcess && !serverProcess.killed) serverProcess.kill(); });
