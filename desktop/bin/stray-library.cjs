"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

function readText(file) {
  try { return fs.readFileSync(file, "utf8"); } catch { return null; }
}

function unescapeVdf(value) {
  return value.replace(/\\\\/g, "\\").replace(/\\\"/g, '"');
}

function getSteamAppsFolders() {
  const home = os.homedir();
  const roots = [
    path.join(home, ".steam", "steam"),
    path.join(home, ".local", "share", "Steam"),
    path.join(home, ".var", "app", "com.valvesoftware.Steam", "data", "Steam"),
  ];
  const folders = new Set();
  for (const root of roots) {
    const steamApps = path.join(root, "steamapps");
    if (fs.existsSync(steamApps)) folders.add(steamApps);
    const libraryFolders = readText(path.join(steamApps, "libraryfolders.vdf")) || "";
    for (const match of libraryFolders.matchAll(/"path"\s+"((?:\\.|[^"])*)"/g)) {
      const candidate = path.join(unescapeVdf(match[1]), "steamapps");
      if (fs.existsSync(candidate)) folders.add(candidate);
    }
  }
  return [...folders];
}

function parseManifest(content) {
  const appId = content.match(/"appid"\s+"(\d+)"/i)?.[1];
  const name = content.match(/"name"\s+"((?:\\.|[^"])*)"/i)?.[1];
  const installDir = content.match(/"installdir"\s+"((?:\\.|[^"])*)"/i)?.[1];
  if (!appId || !name) return null;
  return { appId: Number(appId), name: unescapeVdf(name), installDir: installDir ? unescapeVdf(installDir) : null };
}

function scanSteamLibrary() {
  const games = new Map();
  for (const steamApps of getSteamAppsFolders()) {
    let entries = [];
    try { entries = fs.readdirSync(steamApps); } catch { continue; }
    for (const entry of entries) {
      if (!/^appmanifest_\d+\.acf$/i.test(entry)) continue;
      const parsed = parseManifest(readText(path.join(steamApps, entry)) || "");
      if (!parsed || games.has(parsed.appId)) continue;
      games.set(parsed.appId, { ...parsed, libraryPath: steamApps });
    }
  }
  return [...games.values()].sort((left, right) => left.name.localeCompare(right.name, "pt-BR"));
}

module.exports = { scanSteamLibrary };

if (require.main === module) process.stdout.write(`${JSON.stringify({ games: scanSteamLibrary() }, null, 2)}\n`);
