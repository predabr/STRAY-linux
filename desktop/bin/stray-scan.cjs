#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const SCANNER_VERSION = "1.1.0";

function readText(file) {
  try { return fs.readFileSync(file, "utf8"); } catch { return null; }
}

function firstLine(command, args) {
  try {
    const result = spawnSync(command, args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: 2500 });
    if (result.status !== 0 || !result.stdout) return null;
    return result.stdout.trim() || null;
  } catch { return null; }
}

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
  return (cpuInfo.match(/^model name\s*:\s*(.+)$/m) || cpuInfo.match(/^Hardware\s*:\s*(.+)$/m) || [])[1]?.trim() || null;
}

function detectMemoryGb() {
  const match = (readText("/proc/meminfo") || "").match(/^MemTotal:\s+(\d+)\s+kB$/m);
  return match ? Math.round(Number(match[1]) / 1024 / 1024) : null;
}

function detectGpu() {
  const nvidia = firstLine("nvidia-smi", ["--query-gpu=name,memory.total", "--format=csv,noheader,nounits"]);
  if (nvidia) {
    const [model, memory] = nvidia.split(",").map((value) => value.trim());
    return { model: model || null, vramMb: Number.parseInt(memory, 10) || null };
  }
  const pci = firstLine("lspci", ["-nn"]);
  const gpuLine = (pci || "").split("\n").find((line) => /VGA compatible controller|3D controller|Display controller/i.test(line));
  return { model: gpuLine ? gpuLine.replace(/^[^:]+:\s*/, "").trim() : null, vramMb: null };
}

function detectGraphics() {
  const nvidiaDriver = firstLine("nvidia-smi", ["--query-gpu=driver_version", "--format=csv,noheader,nounits"]);
  const glx = firstLine("glxinfo", ["-B"]);
  const vulkan = firstLine("vulkaninfo", ["--summary"]);
  const mesa = (glx || "").match(/Mesa\s+([0-9][\w.-]+)/i)?.[1] || null;
  const openGl = (glx || "").match(/OpenGL version string:\s*(.+)$/im)?.[1]?.trim() || null;
  const vulkanVersion = (vulkan || "").match(/Vulkan Instance Version:\s*([0-9.]+)/i)?.[1] || null;
  return { driverVersion: nvidiaDriver || (mesa ? `Mesa ${mesa}` : null), mesaVersion: mesa, vulkanVersion, openGlVersion: openGl };
}

function detectSteam() {
  const home = os.homedir();
  const roots = [path.join(home, ".steam", "steam"), path.join(home, ".local", "share", "Steam"), path.join(home, ".var", "app", "com.valvesoftware.Steam", "data", "Steam")];
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
  return { detected: roots.some((folder) => fs.existsSync(folder)), installedGameCount: manifests.size };
}

function detectDesktopEnvironment() {
  return process.env.XDG_CURRENT_DESKTOP || process.env.DESKTOP_SESSION || process.env.GDMSESSION || null;
}

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

function hasCommand(command) {
  return Boolean(firstLine("sh", ["-lc", `command -v ${command}`]));
}

function detectGamingEnvironment() {
  const sessionType = process.env.XDG_SESSION_TYPE || null;
  const groups = firstLine("id", ["-nG"])?.split(/\s+/) ?? [];
  const gamemoded = hasCommand("systemctl") ? firstLine("systemctl", ["--user", "is-active", "gamemoded.service"]) : null;
  return {
    sessionType,
    waylandDetected: sessionType === "wayland" || Boolean(process.env.WAYLAND_DISPLAY),
    x11Detected: sessionType === "x11" || Boolean(process.env.DISPLAY),
    vulkanToolsDetected: hasCommand("vulkaninfo"),
    gameModeDetected: hasCommand("gamemoderun"),
    gameModeServiceActive: gamemoded === null ? null : gamemoded === "active",
    mangoHudDetected: hasCommand("mangohud"),
    gamescopeDetected: hasCommand("gamescope"),
    flatpakDetected: hasCommand("flatpak"),
    renderGroupDetected: groups.includes("render") || groups.includes("video"),
  };
}

function createReport() {
  const osRelease = parseOsRelease(readText("/etc/os-release"));
  const steam = detectSteam();
  const gaming = detectGamingEnvironment();
  return {
    schemaVersion: 1,
    scannerVersion: SCANNER_VERSION,
    generatedAt: new Date().toISOString(),
    system: {
      distribution: osRelease,
      kernelVersion: firstLine("uname", ["-r"]),
      desktopEnvironment: detectDesktopEnvironment(),
      cpu: { model: detectCpu() },
      gpu: detectGpu(),
      memoryGb: detectMemoryGb(),
      storage: detectStorage(),
      displays: detectDisplays(),
      graphics: detectGraphics(),
      runtime: { wineVersion: firstLine("wine", ["--version"]), protonVersion: null, steamDetected: steam.detected, installedGameCount: steam.installedGameCount, gaming },
    },
  };
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes("--help")) {
    process.stdout.write("Uso: stray-scan [--pretty] [--output caminho.json]\nGera somente um relatório técnico local; não envia dados.\n");
    return;
  }
  const outputIndex = args.indexOf("--output");
  const output = outputIndex >= 0 ? args[outputIndex + 1] : null;
  if (outputIndex >= 0 && (!output || output.startsWith("-"))) throw new Error("Informe um caminho após --output.");
  const payload = JSON.stringify(createReport(), null, args.includes("--pretty") || Boolean(output) ? 2 : 0);
  if (output) {
    fs.writeFileSync(path.resolve(output), `${payload}\n`, { encoding: "utf8", mode: 0o600 });
    process.stdout.write(`Relatório local gravado em ${path.resolve(output)}\n`);
  } else {
    process.stdout.write(`${payload}\n`);
  }
}

try { main(); } catch (error) { process.stderr.write(`stray-scan: ${error.message}\n`); process.exitCode = 1; }
