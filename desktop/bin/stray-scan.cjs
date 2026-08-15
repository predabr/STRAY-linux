#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const SCANNER_VERSION = "1.4.0";

function readText(file) { try { return fs.readFileSync(file, "utf8"); } catch { return null; } }

function commandOutput(command, args) {
  try {
    const result = spawnSync(command, args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: 2500, maxBuffer: 512 * 1024 });
    if (result.status !== 0 || !result.stdout) return null;
    return result.stdout.trim() || null;
  } catch { return null; }
}

function firstLine(command, args) { return commandOutput(command, args); }

function parseOsRelease(content) {
  const values = {};
  for (const line of (content || "").split("\n")) {
    const index = line.indexOf("=");
    if (index <= 0) continue;
    const key = line.slice(0, index);
    values[key] = line.slice(index + 1).replace(/^['"]|['"]$/g, "");
  }
  return { id: values.ID || null, name: values.PRETTY_NAME || values.NAME || null, version: values.VERSION_ID || null };
}

function detectCpu() {
  const cpuInfo = readText("/proc/cpuinfo") || "";
  const lscpu = commandOutput("lscpu", []) || "";
  const readLscpu = (label) => (lscpu.match(new RegExp(`^${label}:\\s*(.+)$`, "mi")) || [])[1]?.trim() || null;
  const model = (cpuInfo.match(/^model name\s*:\s*(.+)$/m) || cpuInfo.match(/^Hardware\s*:\s*(.+)$/m) || [])[1]?.trim() || null;
  const logicalCores = Number.parseInt(readLscpu("CPU\\(s\\)") || "", 10) || os.cpus().length || null;
  const coresPerSocket = Number.parseInt(readLscpu("Core\\(s\\) per socket") || "", 10);
  const sockets = Number.parseInt(readLscpu("Socket\\(s\\)") || "", 10);
  const physicalCores = coresPerSocket && sockets ? coresPerSocket * sockets : null;
  const maxMhz = Number.parseFloat(readLscpu("CPU max MHz") || "") || null;
  return { model, architecture: readLscpu("Architecture") || firstLine("uname", ["-m"]), logicalCores, physicalCores, maxMhz: maxMhz ? Math.round(maxMhz) : null };
}

function detectMemoryGb() {
  const match = (readText("/proc/meminfo") || "").match(/^MemTotal:\s+(\d+)\s+kB$/m);
  return match ? Math.round(Number(match[1]) / 1024 / 1024) : null;
}

function inferGpuVendor(model) {
  if (/nvidia|geforce|quadro|tesla/i.test(model || "")) return "NVIDIA";
  if (/amd|radeon|ati/i.test(model || "")) return "AMD";
  if (/intel|arc|iris|uhd graphics/i.test(model || "")) return "Intel";
  return null;
}

function detectGpuAdapters() {
  const nvidia = commandOutput("nvidia-smi", ["--query-gpu=name,memory.total,driver_version", "--format=csv,noheader,nounits"]);
  if (nvidia) return nvidia.split("\n").slice(0, 4).map((line) => {
    const [model, memory, driverVersion] = line.split(",").map((value) => value.trim());
    return { model: model || null, vendor: "NVIDIA", vramMb: Number.parseInt(memory, 10) || null, driverVersion: driverVersion || null };
  });
  const pci = commandOutput("lspci", ["-nn"]);
  return (pci || "").split("\n").filter((line) => /VGA compatible controller|3D controller|Display controller/i.test(line)).slice(0, 4).map((line) => {
    const model = line.replace(/^[^:]+:\s*/, "").trim() || null;
    return { model, vendor: inferGpuVendor(model), vramMb: null, driverVersion: null };
  });
}

function detectGpu() {
  const adapters = detectGpuAdapters();
  const primary = adapters[0] || { model: null, vendor: null, vramMb: null, driverVersion: null };
  return { ...primary, adapters };
}

function detectGraphics(gpu) {
  const nvidiaDriver = firstLine("nvidia-smi", ["--query-gpu=driver_version", "--format=csv,noheader,nounits"]);
  const glx = commandOutput("glxinfo", ["-B"]);
  const vulkan = commandOutput("vulkaninfo", ["--summary"]);
  const mesa = (glx || "").match(/Mesa\s+([0-9][\w.-]+)/i)?.[1] || null;
  const openGl = (glx || "").match(/OpenGL version string:\s*(.+)$/im)?.[1]?.trim() || null;
  const openGlRenderer = (glx || "").match(/OpenGL renderer string:\s*(.+)$/im)?.[1]?.trim() || null;
  const vulkanVersion = (vulkan || "").match(/Vulkan Instance Version:\s*([0-9.]+)/i)?.[1] || null;
  const vulkanApiVersion = (vulkan || "").match(/apiVersion\s*=\s*([0-9.]+)/i)?.[1] || null;
  const vulkanDeviceName = (vulkan || "").match(/deviceName\s*=\s*(.+)$/im)?.[1]?.trim() || null;
  const vulkanDriverName = (vulkan || "").match(/driverName\s*=\s*(.+)$/im)?.[1]?.trim() || null;
  const vulkanDeviceCount = (vulkan || "").match(/^GPU\d+:/gim)?.length || 0;
  const driverVersion = nvidiaDriver || gpu.driverVersion || (mesa ? `Mesa ${mesa}` : null);
  return { driverVersion, driverProvider: nvidiaDriver ? "nvidia-smi" : mesa ? "mesa/glxinfo" : null, mesaVersion: mesa, vulkanVersion, vulkanApiVersion, vulkanDeviceName, vulkanDriverName, vulkanDeviceCount, openGlVersion: openGl, openGlRenderer, vulkanSummaryAvailable: Boolean(vulkan), glxInfoAvailable: Boolean(glx) };
}

function steamRoots() {
  const home = os.homedir();
  return [path.join(home, ".steam", "steam"), path.join(home, ".steam", "root"), path.join(home, ".steam", "debian-installation"), path.join(home, ".local", "share", "Steam"), path.join(home, ".var", "app", "com.valvesoftware.Steam", ".local", "share", "Steam"), path.join(home, ".var", "app", "com.valvesoftware.Steam", "data", "Steam")];
}

function detectSteam(roots) {
  const libraryFolders = roots.flatMap((root) => {
    const steamApps = path.join(root, "steamapps");
    const content = readText(path.join(steamApps, "libraryfolders.vdf")) || "";
    const discovered = [...content.matchAll(/"path"\s+"([^"]+)"/g)].map((match) => path.join(match[1].replace(/\\\\/g, "\\"), "steamapps"));
    return [steamApps, ...discovered];
  });
  const manifests = new Set();
  for (const folder of libraryFolders) {
    try { for (const entry of fs.readdirSync(folder)) if (/^appmanifest_\d+\.acf$/i.test(entry)) manifests.add(`${folder}/${entry}`); } catch {}
  }
  const installKinds = roots.flatMap((root) => fs.existsSync(root) ? [root.includes("com.valvesoftware.Steam") ? "flatpak" : "native"] : []);
  return { detected: roots.some((folder) => fs.existsSync(folder)), installedGameCount: manifests.size, installKinds: [...new Set(installKinds)] };
}

function detectProton(roots) {
  const candidates = roots.flatMap((root) => [path.join(root, "compatibilitytools.d"), path.join(root, "steamapps", "common")]);
  const tools = new Set();
  for (const folder of candidates) {
    try { for (const entry of fs.readdirSync(folder, { withFileTypes: true })) if (entry.isDirectory() && /^(GE-Proton|Proton)/i.test(entry.name)) tools.add(entry.name); } catch {}
  }
  return [...tools].sort().slice(0, 12);
}

function detectProtonPrefixes(roots) {
  let count = 0;
  for (const root of roots) {
    const compatData = path.join(root, "steamapps", "compatdata");
    try {
      for (const entry of fs.readdirSync(compatData, { withFileTypes: true })) {
        if (entry.isDirectory() && fs.existsSync(path.join(compatData, entry.name, "pfx"))) count += 1;
      }
    } catch {}
  }
  return { detected: count > 0, knownPrefixCount: Math.min(count, 10000), sources: count ? ["steam-compatdata"] : [] };
}

function detectWinePrefixes() {
  const home = os.homedir();
  const sources = [];
  let count = 0;
  if (fs.existsSync(path.join(home, ".wine"))) { count += 1; sources.push("wine-default"); }
  const managed = path.join(home, ".local", "share", "wineprefixes");
  try {
    const managedCount = fs.readdirSync(managed, { withFileTypes: true }).filter((entry) => entry.isDirectory()).length;
    if (managedCount) { count += managedCount; sources.push("wineprefixes"); }
  } catch {}
  return { detected: count > 0, knownPrefixCount: Math.min(count, 10000), sources };
}

function detectHeroic() {
  const home = os.homedir();
  const candidates = [
    { path: path.join(process.env.XDG_CONFIG_HOME || path.join(home, ".config"), "heroic", "legendaryConfig", "legendary"), kind: "native" },
    { path: path.join(home, ".var", "app", "com.heroicgameslauncher.hgl", "config", "heroic", "legendaryConfig", "legendary"), kind: "flatpak" },
  ];
  const kinds = [];
  const installs = new Set();
  for (const candidate of candidates) {
    if (!fs.existsSync(candidate.path)) continue;
    kinds.push(candidate.kind);
    try {
      const entries = JSON.parse(fs.readFileSync(path.join(candidate.path, "installed.json"), "utf8"));
      for (const key of Object.keys(entries || {})) installs.add(key);
    } catch {}
  }
  return { detected: kinds.length > 0, installedGameCount: installs.size, installKinds: [...new Set(kinds)] };
}

function detectDesktopEnvironment() { return process.env.XDG_CURRENT_DESKTOP || process.env.DESKTOP_SESSION || process.env.GDMSESSION || null; }

function detectStorage() {
  const output = firstLine("df", ["-Pk", "/"]);
  const line = (output || "").split("\n").at(-1) || "";
  const values = line.trim().split(/\s+/);
  if (values.length < 6 || !/^\d+$/.test(values[1])) return null;
  return { filesystem: values[0] || null, mount: values.at(-1) || null, totalGb: Math.round(Number(values[1]) / 1024 / 1024), usedGb: Math.round(Number(values[2]) / 1024 / 1024) };
}

function detectDisplays() {
  const output = firstLine("xrandr", ["--current"]);
  if (!output) return [];
  return output.split("\n").flatMap((line) => {
    const match = line.match(/^([\w.-]+)\s+connected(?:\s+primary)?\s+(\d+)x(\d+)\+[-\d]+\+[-\d]+/);
    if (!match) return [];
    const refresh = (line.match(/\s(\d+(?:\.\d+)?)\*\+?/) || [])[1];
    return [{ name: match[1], resolution: `${match[2]}×${match[3]}`, refreshHz: refresh ? Number(refresh) : null }];
  });
}

function hasCommand(command) { return Boolean(firstLine("sh", ["-lc", `command -v ${command}`])); }

function detectGamingEnvironment() {
  const sessionType = process.env.XDG_SESSION_TYPE || null;
  const groups = firstLine("id", ["-nG"])?.split(/\s+/) ?? [];
  const gamemoded = hasCommand("systemctl") ? firstLine("systemctl", ["--user", "is-active", "gamemoded.service"]) : null;
  return { sessionType, waylandDetected: sessionType === "wayland" || Boolean(process.env.WAYLAND_DISPLAY), x11Detected: sessionType === "x11" || Boolean(process.env.DISPLAY), vulkanToolsDetected: hasCommand("vulkaninfo"), gameModeDetected: hasCommand("gamemoderun"), gameModeServiceActive: gamemoded === null ? null : gamemoded === "active", mangoHudDetected: hasCommand("mangohud"), gamescopeDetected: hasCommand("gamescope"), vkBasaltDetected: hasCommand("vkbasalt"), winetricksDetected: hasCommand("winetricks"), flatpakDetected: hasCommand("flatpak"), renderGroupDetected: groups.includes("render") || groups.includes("video") };
}

function detectControllers() {
  const devicesFile = readText("/proc/bus/input/devices") || "";
  const names = new Map();
  for (const block of devicesFile.split("\n\n")) {
    const name = (block.match(/^N: Name="(.+)"$/m) || [])[1] || null;
    const handlers = (block.match(/^H: Handlers=(.+)$/m) || [])[1] || "";
    for (const id of handlers.match(/js\d+/g) || []) names.set(id, name);
  }
  const devices = [];
  try { for (const id of fs.readdirSync("/dev/input")) if (/^js\d+$/.test(id)) devices.push({ id, name: names.get(id) || null, path: `/dev/input/${id}` }); } catch {}
  return { detected: devices.length > 0, devices: devices.slice(0, 16), source: "procfs/dev-input" };
}

function createReport() {
  const roots = steamRoots();
  const steam = detectSteam(roots);
  const heroic = detectHeroic();
  const protonTools = detectProton(roots);
  const gpu = detectGpu();
  return {
    schemaVersion: 1,
    scannerVersion: SCANNER_VERSION,
    generatedAt: new Date().toISOString(),
    system: {
      distribution: parseOsRelease(readText("/etc/os-release")),
      kernelVersion: firstLine("uname", ["-r"]),
      desktopEnvironment: detectDesktopEnvironment(),
      architecture: firstLine("uname", ["-m"]),
      cpu: detectCpu(),
      gpu,
      memoryGb: detectMemoryGb(),
      storage: detectStorage(),
      displays: detectDisplays(),
      graphics: detectGraphics(gpu),
      runtime: { wineVersion: firstLine("wine", ["--version"]), protonVersion: protonTools[0] || null, protonTools, steamDetected: steam.detected, steamInstallKinds: steam.installKinds, installedGameCount: steam.installedGameCount, discovery: { heroicDetected: heroic.detected, heroicInstallKinds: heroic.installKinds, heroicInstalledGameCount: heroic.installedGameCount, winePrefixes: detectWinePrefixes(), protonPrefixes: detectProtonPrefixes(roots) }, gaming: detectGamingEnvironment() },
      controllers: detectControllers(),
    },
  };
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes("--help")) { process.stdout.write("Uso: stray-scan [--pretty] [--output caminho.json]\nGera somente um relatório técnico local; não envia dados.\n"); return; }
  const outputIndex = args.indexOf("--output");
  const output = outputIndex >= 0 ? args[outputIndex + 1] : null;
  if (outputIndex >= 0 && (!output || output.startsWith("-"))) throw new Error("Informe um caminho após --output.");
  const payload = JSON.stringify(createReport(), null, args.includes("--pretty") || Boolean(output) ? 2 : 0);
  if (output) { fs.writeFileSync(path.resolve(output), `${payload}\n`, { encoding: "utf8", mode: 0o600 }); process.stdout.write(`Relatório local gravado em ${path.resolve(output)}\n`); } else process.stdout.write(`${payload}\n`);
}

try { main(); } catch (error) { process.stderr.write(`stray-scan: ${error.message}\n`); process.exitCode = 1; }
