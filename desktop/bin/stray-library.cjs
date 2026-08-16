"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");

function readText(file) { try { return fs.readFileSync(file, "utf8"); } catch { return null; } }
function readJson(file) { try { const value = JSON.parse(fs.readFileSync(file, "utf8")); return value && typeof value === "object" ? value : null; } catch { return null; } }
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
      games.set(parsed.appId, {
        ...parsed,
        installDir: parsed.installDir ? path.join(steamApps.path, "common", parsed.installDir) : null,
        libraryPath: steamApps.path,
        installationType: steamApps.kind,
      });
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

function heroicLegendaryCandidates(home = os.homedir()) {
  const usesRuntimeHome = home === os.homedir();
  const configRoot = usesRuntimeHome ? process.env.XDG_CONFIG_HOME || path.join(home, ".config") : path.join(home, ".config");
  return [
    { path: path.join(configRoot, "heroic", "legendaryConfig", "legendary"), installationType: "native" },
    { path: path.join(home, ".var", "app", "com.heroicgameslauncher.hgl", "config", "heroic", "legendaryConfig", "legendary"), installationType: "flatpak" },
  ];
}

function pickHeroicCover(keyImages) {
  if (!Array.isArray(keyImages)) return null;
  const preferredTypes = ["DieselGameBoxTall", "OfferImageTall", "DieselGameBox", "OfferImageWide"];
  for (const type of preferredTypes) {
    const image = keyImages.find((candidate) => candidate && candidate.type === type && typeof candidate.url === "string" && /^https:\/\//i.test(candidate.url));
    if (image) return image.url;
  }
  return null;
}

/**
 * Lê apenas registros de instalações Epic já conhecidos pelo Heroic/Legendary.
 * Não acessa user.json, tokens, cookies, rede, executáveis ou pastas de jogos fora
 * do caminho explicitamente armazenado pelo launcher.
 */
function scanHeroicLibrary(home) {
  const games = new Map();
  for (const candidate of heroicLegendaryCandidates(home)) {
    const installed = readJson(path.join(candidate.path, "installed.json"));
    if (!installed) continue;
    for (const [appName, installedEntry] of Object.entries(installed)) {
      if (!installedEntry || typeof installedEntry !== "object" || !/^[A-Za-z0-9_.-]+$/.test(appName)) continue;
      const installDir = typeof installedEntry.install_path === "string" ? installedEntry.install_path : null;
      if (!installDir || !fs.existsSync(installDir)) continue;
      const metadataRecord = readJson(path.join(candidate.path, "metadata", `${appName}.json`));
      const metadata = metadataRecord && metadataRecord.metadata && typeof metadataRecord.metadata === "object" ? metadataRecord.metadata : {};
      const title = typeof metadata.title === "string" && metadata.title.trim() ? metadata.title.trim() : typeof installedEntry.title === "string" && installedEntry.title.trim() ? installedEntry.title.trim() : appName;
      const id = `heroic:${appName}`;
      if (!games.has(id)) games.set(id, {
        id,
        appId: null,
        externalId: appName,
        name: title,
        installDir,
        libraryPath: candidate.path,
        installationType: candidate.installationType,
        launcher: "heroic",
        store: "epic",
        coverUrl: pickHeroicCover(metadata.keyImages),
        coverSource: metadata.keyImages ? "heroic-local-metadata" : null,
      });
    }
  }
  return [...games.values()].sort((left, right) => left.name.localeCompare(right.name, "pt-BR"));
}

/**
 * Descreve uma pasta escolhida conscientemente pelo usuário. Não examina
 * subdiretórios, não abre executáveis, não usa rede e não tenta determinar a
 * origem ou licença do conteúdo. O item serve apenas para organização local.
 */
function describeExternalGameDirectory(directory) {
  if (typeof directory !== "string" || !path.isAbsolute(directory) || !fs.existsSync(directory)) throw new Error("Pasta de jogo inválida.");
  const resolved = realPath(directory);
  let stats;
  try { stats = fs.statSync(resolved); } catch { throw new Error("Não foi possível ler a pasta selecionada."); }
  if (!stats.isDirectory()) throw new Error("Selecione uma pasta de jogo, não um arquivo.");
  const title = path.basename(resolved).trim() || "Jogo externo";
  const externalId = crypto.createHash("sha256").update(resolved).digest("hex").slice(0, 16);
  return {
    id: `external:${externalId}`,
    appId: null,
    externalId,
    name: title,
    installDir: resolved,
    libraryPath: resolved,
    installationType: "external",
    launcher: "external",
    store: "external",
    coverUrl: null,
    coverSource: null,
  };
}

function scanLocalLibrary(home) {
  const steam = scanSteamLibrary(home).map((game) => ({
    id: `steam:${game.appId}`,
    ...game,
    externalId: String(game.appId),
    launcher: "steam",
    store: "steam",
    coverUrl: null,
    coverSource: null,
  }));
  return [...steam, ...scanHeroicLibrary(home)].sort((left, right) => left.name.localeCompare(right.name, "pt-BR"));
}

module.exports = { getSteamRoots, getSteamAppsFolders, parseManifest, scanSteamLibrary, scanSteamWorkshop, heroicLegendaryCandidates, scanHeroicLibrary, describeExternalGameDirectory, scanLocalLibrary };

if (require.main === module) {
  const homeIndex = process.argv.indexOf("--home");
  const home = homeIndex >= 0 ? process.argv[homeIndex + 1] : undefined;
  process.stdout.write(`${JSON.stringify({ games: scanLocalLibrary(home) }, null, 2)}\n`);
}
