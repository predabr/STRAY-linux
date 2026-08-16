const { app, BrowserWindow, dialog, ipcMain, shell } = require("electron");
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

function startLocalServer(config) {
  const serverEntry = app.isPackaged
    ? path.join(process.resourcesPath, "app.asar", "dist", "index.js")
    : path.join(app.getAppPath(), "dist", "index.js");
  const seedPath = app.isPackaged
    ? path.join(process.resourcesPath, "app.asar", "desktop", "seed", "initial-data.json")
    : path.join(app.getAppPath(), "desktop", "seed", "initial-data.json");
  serverProcess = spawn(process.execPath, [serverEntry], {
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: "1",
      NODE_ENV: "production",
      ELECTRON_DISABLE_GPU: "1",
      DESKTOP_MODE: "1",
      PORT: String(config.port),
      DESKTOP_DATA_DIR: app.getPath("userData"),
      DESKTOP_SEED_PATH: seedPath,
    },
    stdio: "pipe",
    windowsHide: true,
  });
  serverProcess.stderr.on("data", (chunk) => console.error(`[local-server] ${chunk}`));
  serverProcess.on("error", (error) => console.error(`[local-server] spawn error: ${error.message}`));
  serverProcess.on("exit", (code, signal) => console.error(`[local-server] exited with code ${code ?? "null"}${signal ? ` signal ${signal}` : ""}`));
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
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true, webSecurity: true, preload: path.join(__dirname, "preload.cjs") },
  });
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (isAllowedExternalUrl(url)) void shell.openExternal(url).catch((error) => console.error("[external-link]", error));
    return { action: "deny" };
  });
  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (url === localOrigin || url.startsWith(`${localOrigin}/`)) return;
    event.preventDefault();
    if (isAllowedExternalUrl(url)) void shell.openExternal(url).catch((error) => console.error("[external-link]", error));
  });
  mainWindow.loadURL(localOrigin);
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
  ipcMain.handle("stray:scanner:run", async (event) => {
    if (!mainWindow || event.sender.id !== mainWindow.webContents.id) throw new Error("Solicitação do scanner recusada.");
    return runScanner();
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
    dialog.showErrorBox("Stray Linux", `${error.message}\n\nO aplicativo não exige DATABASE_URL. Verifique se o diretório local possui permissão de escrita e tente abrir novamente.`);
    app.quit();
  }
});

app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
app.on("before-quit", () => { if (serverProcess && !serverProcess.killed) serverProcess.kill(); });
