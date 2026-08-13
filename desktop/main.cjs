const { app, BrowserWindow, dialog } = require("electron");
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

let serverProcess;
let mainWindow;
const preferredPort = Number(process.env.LGH_PORT || 43819);

function loadDesktopConfig() {
  const configPath = path.join(app.getPath("userData"), "linux-gaming-hub.config.json");
  const defaults = { port: preferredPort, databaseUrl: "", ollamaEndpoint: "http://127.0.0.1:11434" };
  try {
    const stored = JSON.parse(fs.readFileSync(configPath, "utf8"));
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
  serverProcess = spawn(process.execPath, [serverEntry], {
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: "1",
      NODE_ENV: "production",
      DESKTOP_MODE: "1",
      PORT: String(config.port),
      ...(config.databaseUrl ? { DATABASE_URL: config.databaseUrl } : {}),
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
    title: "Linux Gaming Hub",
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true },
  });
  mainWindow.loadURL(`http://127.0.0.1:${port}`);
}

app.whenReady().then(async () => {
  const config = loadDesktopConfig();
  startLocalServer(config);
  try {
    await waitForServer(config.port);
    createWindow(config.port);
  } catch (error) {
    dialog.showErrorBox("Linux Gaming Hub", `${error.message}\n\nEdite o arquivo linux-gaming-hub.config.json na pasta de dados do aplicativo e configure DATABASE_URL para executar o backend local.`);
    app.quit();
  }
});

app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
app.on("before-quit", () => { if (serverProcess && !serverProcess.killed) serverProcess.kill(); });
