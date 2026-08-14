const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

let serverProcess;
let mainWindow;
const preferredPort = Number(process.env.LGH_PORT || 43819);

function loadDesktopConfig() {
  const configPath = path.join(app.getPath("userData"), "stray-linux.config.json");
  const defaults = { port: preferredPort, ollamaEndpoint: "http://127.0.0.1:11434" };
  try {
    const legacyPath = path.join(app.getPath("userData"), "linux-gaming-hub.config.json");
    const sourcePath = fs.existsSync(configPath) ? configPath : legacyPath;
    const stored = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
    if (sourcePath !== configPath) fs.writeFileSync(configPath, JSON.stringify({ ...defaults, ...stored }, null, 2));
    return { ...defaults, ...stored };
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
      DESKTOP_MODE: "1",
      PORT: String(config.port),
      DESKTOP_DATA_DIR: app.getPath("userData"),
      DESKTOP_SEED_PATH: seedPath,
    },
    stdio: "pipe",
    windowsHide: true,
  });
  serverProcess.stderr.on("data", (chunk) => console.error(`[local-server] ${chunk}`));
  serverProcess.on("exit", (code) => console.error(`[local-server] exited with code ${code}`));
}

async function waitForServer(port, attempts = 80) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/api/health`);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("O servidor local não iniciou a tempo.");
}

function createWindow(port) {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 940,
    minWidth: 1024,
    minHeight: 720,
    backgroundColor: "#09090b",
    title: "Stray Linux",
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true, preload: path.join(__dirname, "preload.cjs") },
  });
  mainWindow.loadURL(`http://127.0.0.1:${port}`);
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

app.whenReady().then(async () => {
  ipcMain.handle("stray:scanner:run", async (event) => {
    if (!mainWindow || event.sender.id !== mainWindow.webContents.id) throw new Error("Solicitação do scanner recusada.");
    return runScanner();
  });
  const config = loadDesktopConfig();
  startLocalServer(config);
  try {
    await waitForServer(config.port);
    createWindow(config.port);
  } catch (error) {
    dialog.showErrorBox("Stray Linux", `${error.message}\n\nO aplicativo não exige DATABASE_URL. Verifique se o diretório local possui permissão de escrita e tente abrir novamente.`);
    app.quit();
  }
});

app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
app.on("before-quit", () => { if (serverProcess && !serverProcess.killed) serverProcess.kill(); });
