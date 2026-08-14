"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

function readText(file) { try { return fs.readFileSync(file, "utf8"); } catch { return null; } }
function unescapeVdf(value) { return value.replace(/\\\\/g, "\\").replace(/\\"/g, '"'); }
function realPath(value) { try { return fs.realpathSync(value); } catch { return value; } }

function getSteamRoots(home = os.homedir()) {
  const candidates = steamRootCandidates(home);
  const roots = new Map();
  for (const candidate of candidates) if (fs.existsSync(candidate.path)) roots.set(realPath(candidate.path), { path: realPath(candidate.path), kind: candidate.kind });
  return [...roots.values()];
}

function steamRootCandidates(home) {
  return [
    { path: path.join(home, ".steam", "steam"), kind: "native" },
    { path: path.join(home, ".steam", "root"), kind: "native" },
    { path: path.join(home, ".steam", "debian-installation"), kind: "native" },
    { path: path.join(home, ".local", "share", "Steam"), kind: "native" },
    { path: path.join(home, ".var", "app", "com.valvesoftware.Steam", ".local", "share", "Steam"), kind: "flatpak" },
    { path: path.join(home, ".var", "app", "com.valvesoftware.Steam", "data", "Steam"), kind: "flatpak" },
  ];
}

function getSteamAppsFolders(home) {
  const folders = new Map();
  for (const root of getSteamRoots(home)) {
    const steamApps = path.join(root.path, "steamapps");
    if (fs.existsSync(steamApps)) folders.set(realPath(steamApps), { path: realPath(steamApps), kind: root.kind });
    const libraryFolders = readText(path.join(steamApps, "libraryfolders.vdf")) || "";
    for (const match of libraryFolders.matchAll(/"path"\s+"((?:\\.|[^"])*)"/g)) {
      const candidate = path.join(unescapeVdf(match[1]), "steamapps");
      if (fs.existsSync(candidate)) folders.set(realPath(candidate), { path: realPath(candidate), kind: root.kind });
    }
  }
  return [...folders.values()];
}

function parseManifest(content) {
  const appId = content.match(/"appid"\s+"(\d+)"/i)?.[1];
  const name = content.match(/"name"\s+"((?:\\.|[^"])*)"/i)?.[1];
  const installDir = content.match(/"installdir"\s+"((?:\\.|[^"])*)"/i)?.[1];
  if (!appId || !name) return null;
  return { appId: Number(appId), name: unescapeVdf(name), installDir: installDir ? unescapeVdf(installDir) : null };
}

function scanSteamLibrary(home) {
  const games = new Map();
  for (const steamApps of getSteamAppsFolders(home)) {
    let entries = [];
    try { entries = fs.readdirSync(steamApps.path); } catch { continue; }
    for (const entry of entries) {
      if (!/^appmanifest_\d+\.acf$/i.test(entry)) continue;
      const parsed = parseManifest(readText(path.join(steamApps.path, entry)) || "");
      if (!parsed || games.has(parsed.appId)) continue;
      games.set(parsed.appId, { ...parsed, libraryPath: steamApps.path, installationType: steamApps.kind });
    }
  }
  return [...games.values()].sort((left, right) => left.name.localeCompare(right.name, "pt-BR"));
}

function scanSteamWorkshop(home) {
  const entries = [];
  for (const steamApps of getSteamAppsFolders(home)) {
    const contentRoot = path.join(steamApps.path, "workshop", "content");
    let appIds = [];
    try { appIds = fs.readdirSync(contentRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory() && /^\d+$/.test(entry.name)).map((entry) => entry.name); } catch { continue; }
    for (const appId of appIds.slice(0, 100)) {
      const folder = path.join(contentRoot, appId);
      let modCount = 0;
      try { modCount = fs.readdirSync(folder, { withFileTypes: true }).filter((entry) => entry.isDirectory()).length; } catch {}
      entries.push({ appId: Number(appId), modCount, path: folder, installationType: steamApps.kind });
    }
  }
  const unique = new Map(); for (const entry of entries) if (!unique.has(entry.appId)) unique.set(entry.appId, entry);
  return { source: "steam-workshop-local", entries: [...unique.values()].sort((left, right) => left.appId - right.appId) };
}

module.exports = { getSteamRoots, getSteamAppsFolders, parseManifest, scanSteamLibrary, scanSteamWorkshop };

if (require.main === module) {
  const homeIndex = process.argv.indexOf("--home");
  const home = homeIndex >= 0 ? process.argv[homeIndex + 1] : undefined;
  process.stdout.write(`${JSON.stringify({ games: scanSteamLibrary(home) }, null, 2)}\n`);
}
