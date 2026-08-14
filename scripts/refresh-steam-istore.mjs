import { createHash } from "node:crypto";
import mysql from "mysql2/promise";

const key = process.env.STEAM_WEB_API_KEY;
const databaseUrl = process.env.DATABASE_URL;
const endpoint = "https://partner.steam-api.com/IStoreService/GetAppList/v1/";
const limit = 500;

if (!key) throw new Error("STEAM_WEB_API_KEY não está configurada no servidor.");
if (!databaseUrl) throw new Error("DATABASE_URL não está disponível para o refresh Steam.");

const slugify = (value) => value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 160) || "untitled";
const url = new URL(endpoint);
url.searchParams.set("key", key);

const connection = await mysql.createConnection(databaseUrl);
try {
  await connection.execute("INSERT INTO content_sources (name, baseUrl, licenseNote, isOfficial) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE baseUrl = VALUES(baseUrl), licenseNote = VALUES(licenseNote), isOfficial = VALUES(isOfficial)", ["Steam Web API", "https://partner.steam-api.com/", "Uso limitado ao IStoreService/GetAppList documentado pela Steamworks; somente App ID e nome. Mídia e dados de Storefront não são importados.", true]);
  const [sourceRows] = await connection.execute("SELECT id, catalogCursorAppId FROM content_sources WHERE name = ? LIMIT 1", ["Steam Web API"]);
  const source = sourceRows[0];
  if (!source) throw new Error("Não foi possível inicializar a fonte Steam.");
  url.searchParams.set("input_json", JSON.stringify({
    include_games: true,
    include_dlc: false,
    include_software: false,
    include_videos: false,
    include_hardware: false,
    max_results: limit,
    ...(source.catalogCursorAppId ? { last_appid: Number(source.catalogCursorAppId) } : {}),
  }));
  const response = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  if (!response.ok) throw new Error(`Steam IStoreService respondeu HTTP ${response.status}.`);
  const payload = await response.json();
  const apps = Array.isArray(payload?.response?.apps) ? payload.response.apps.flatMap((app) => {
    const appId = Number(app?.appid); const name = typeof app?.name === "string" ? app.name.trim() : "";
    return Number.isInteger(appId) && appId > 0 && name.length >= 2 ? [{ appId, name: name.slice(0, 400), lastModified: Number.isFinite(Number(app.last_modified)) ? Number(app.last_modified) : null }] : [];
  }) : [];
  const inputHash = createHash("sha256").update(JSON.stringify(apps)).digest("hex");
  const [runResult] = await connection.execute("INSERT INTO source_refresh_runs (sourceId, kind, status, inputHash, sourceEndpoint) VALUES (?, ?, ?, ?, ?)", [source.id, "steam-istore-app-list", "started", inputHash, endpoint]);
  const runId = runResult.insertId;
  try {
    const ids = apps.map((app) => app.appId);
    const [existingRows] = ids.length ? await connection.query(`SELECT steamAppId FROM games WHERE deletedAt IS NULL AND steamAppId IN (${ids.map(() => "?").join(",")})`, ids) : [[]];
    const existing = new Set(existingRows.map((row) => Number(row.steamAppId)));
    const newApps = apps.filter((app) => !existing.has(app.appId));
    await connection.beginTransaction();
    const [batchResult] = await connection.execute("INSERT INTO import_batches (sourceId, kind, inputHash, importedCount, notes) VALUES (?, ?, ?, ?, ?)", [source.id, "steam_istore_app_list", inputHash, newApps.length, `IStoreService/GetAppList: ${apps.length} registros vistos; somente App ID e nome foram importados.`]);
    if (newApps.length) await connection.query("INSERT INTO games (slug, title, steamAppId, status, sourceId, importBatchId, sourceUrl, sourceUpdatedAt, sourceCheckedAt) VALUES ?", [newApps.map((app) => [`steam-${app.appId}-${slugify(app.name)}`, app.name, app.appId, "draft", source.id, batchResult.insertId, endpoint, app.lastModified ? new Date(app.lastModified * 1000) : null, new Date()])]);
    const nextCursor = apps.reduce((largest, app) => Math.max(largest, app.appId), Number(source.catalogCursorAppId || 0)) || null;
    await connection.execute("UPDATE content_sources SET catalogCursorAppId = ?, lastCatalogRefreshAt = NOW(), lastCheckedAt = NOW(), lastSuccessfulRefreshAt = NOW() WHERE id = ?", [nextCursor, source.id]);
    await connection.execute("UPDATE source_refresh_runs SET status = ?, finishedAt = NOW(), recordsSeen = ?, recordsChanged = ?, message = ? WHERE id = ?", ["succeeded", apps.length, newApps.length, `Atualização incremental concluída: ${newApps.length} novos rascunhos; mídia e campos de loja não foram importados.`, runId]);
    await connection.commit();
    console.log(JSON.stringify({ endpoint, seen: apps.length, createdDrafts: newApps.length, nextCursor, mediaImported: false }, null, 2));
  } catch (error) {
    await connection.rollback();
    await connection.execute("UPDATE source_refresh_runs SET status = ?, finishedAt = NOW(), message = ? WHERE id = ?", ["failed", error instanceof Error ? error.message.slice(0, 2000) : "Falha desconhecida no refresh Steam.", runId]);
    throw error;
  }
} finally {
  connection.destroy();
}
