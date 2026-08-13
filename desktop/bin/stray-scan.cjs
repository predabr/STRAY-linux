#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const SCANNER_VERSION = "1.0.0";

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
  return [path.join(home, ".steam", "steam"), path.join(home, ".local", "share", "Steam"), path.join(home, ".var", "app", "com.valvesoftware.Steam")].some((folder) => fs.existsSync(folder));
}

function createReport() {
  const osRelease = parseOsRelease(readText("/etc/os-release"));
  return {
    schemaVersion: 1,
    scannerVersion: SCANNER_VERSION,
    generatedAt: new Date().toISOString(),
    system: {
      distribution: osRelease,
      kernelVersion: firstLine("uname", ["-r"]),
      cpu: { model: detectCpu() },
      gpu: detectGpu(),
      memoryGb: detectMemoryGb(),
      graphics: detectGraphics(),
      runtime: { wineVersion: firstLine("wine", ["--version"]), protonVersion: null, steamDetected: detectSteam() },
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
