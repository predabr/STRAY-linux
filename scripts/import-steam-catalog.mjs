import { createHash } from "node:crypto";
import fs from "node:fs";
import mysql from "mysql2/promise";

const datasetPath = process.env.STEAM_DATASET_PATH ?? "/home/ubuntu/linux-gaming-hub-data/games.json";
const importLimit = Number.parseInt(process.env.STEAM_IMPORT_LIMIT ?? "1500", 10);
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) throw new Error("DATABASE_URL não está disponível para o importador.");
if (!Number.isInteger(importLimit) || importLimit < 1000) throw new Error("STEAM_IMPORT_LIMIT precisa ser um inteiro de pelo menos 1000.");

const slugify = (value) => value
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "")
  .slice(0, 160) || "untitled";

const cleanText = (value, maxLength) => {
  if (typeof value !== "string") return null;
  const clean = value.replace(/<[^>]+>/g, " ").replace(/&(?:nbsp|amp|quot|#39);/g, " ").replace(/\s+/g, " ").trim();
  return clean ? clean.slice(0, maxLength) : null;
};

const isGameRecord = ([appId, game]) => {
  const id = Number.parseInt(appId, 10);
  return Number.isInteger(id) && id > 0 && game && typeof game.name === "string" && game.name.trim().length > 1;
};

const raw = fs.readFileSync(datasetPath, "utf8");
const records = Object.entries(JSON.parse(raw)).filter(isGameRecord);
const selected = records
  .sort(([, a], [, b]) => Number(b.positive ?? 0) - Number(a.positive ?? 0))
  .slice(0, importLimit)
  .map(([appId, game]) => ({ appId: Number.parseInt(appId, 10), game }));

if (selected.length < 1000) throw new Error(`O dataset forneceu somente ${selected.length} jogos válidos.`);

const connection = await mysql.createConnection(databaseUrl);
try {
  await connection.beginTransaction();

  const sourceName = "Mendeley Data — Steam Games Metadata and Player Reviews (2020–2024)";
  await connection.execute(
    "INSERT INTO content_sources (name, baseUrl, licenseNote, isOfficial) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE baseUrl = VALUES(baseUrl), licenseNote = VALUES(licenseNote)",
    [sourceName, "https://data.mendeley.com/datasets/jxy85cr3th/2", "CC BY 4.0; DOI: 10.17632/jxy85cr3th.2; importação limitada a metadados de jogos.", false],
  );
  const [[source]] = await connection.execute("SELECT id FROM content_sources WHERE name = ? LIMIT 1", [sourceName]);

  const inputHash = createHash("sha256").update(raw).digest("hex");
  const [batchResult] = await connection.execute(
    "INSERT INTO import_batches (sourceId, kind, inputHash, importedCount, notes) VALUES (?, ?, ?, ?, ?)",
    [source.id, "steam_games_snapshot", inputHash, selected.length, `Seleção dos ${selected.length} títulos com maior contagem de avaliações positivas no snapshot.`],
  );
  const importBatchId = batchResult.insertId;

  const gameRows = selected.map(({ appId, game }) => [
    `steam-${appId}-${slugify(game.name)}`,
    cleanText(game.name, 400),
    appId,
    cleanText(game.short_description, 600),
    cleanText(game.about_the_game, 20000),
    cleanText(game.developers?.join?.(", "), 255),
    cleanText(game.publishers?.join?.(", "), 255),
    cleanText(game.release_date, 64),
    "published",
    source.id,
    importBatchId,
    "https://data.mendeley.com/datasets/jxy85cr3th/2",
    false,
  ]);
  await connection.query(
    "INSERT INTO games (slug, title, steamAppId, shortDescription, description, developer, publisher, releaseDate, status, sourceId, importBatchId, sourceUrl, isFeatured) VALUES ? ON DUPLICATE KEY UPDATE title = VALUES(title), shortDescription = VALUES(shortDescription), description = VALUES(description), sourceId = VALUES(sourceId), importBatchId = VALUES(importBatchId), sourceUrl = VALUES(sourceUrl), status = 'published'",
    [gameRows],
  );

  const appIds = selected.map(({ appId }) => appId);
  const [gameRecords] = await connection.query("SELECT id, steamAppId FROM games WHERE steamAppId IN (?)", [appIds]);
  const gameIdByAppId = new Map(gameRecords.map((record) => [record.steamAppId, record.id]));

  const tagMap = new Map();
  for (const { game } of selected) {
    for (const genre of Array.isArray(game.genres) ? game.genres : []) tagMap.set(`genre:${genre}`, { slug: `genre-${slugify(genre)}`, name: cleanText(genre, 140), kind: "genre" });
    for (const category of Array.isArray(game.categories) ? game.categories : []) tagMap.set(`category:${category}`, { slug: `category-${slugify(category)}`, name: cleanText(category, 140), kind: "category" });
  }
  const tagRows = [...tagMap.values()].filter((tag) => tag.name).map((tag) => [tag.slug, tag.name, tag.kind]);
  if (tagRows.length) await connection.query("INSERT IGNORE INTO tags (slug, name, kind) VALUES ?", [tagRows]);
  const [tagRecords] = tagRows.length ? await connection.query("SELECT id, slug FROM tags WHERE slug IN (?)", [tagRows.map((tag) => tag[0])]) : [[]];
  const tagIdBySlug = new Map(tagRecords.map((record) => [record.slug, record.id]));

  const tagLinks = [];
  const platformRows = [];
  for (const { appId, game } of selected) {
    const gameId = gameIdByAppId.get(appId);
    if (!gameId) continue;
    platformRows.push([gameId, "steam", true, true, source.id, "https://data.mendeley.com/datasets/jxy85cr3th/2"]);
    for (const genre of Array.isArray(game.genres) ? game.genres : []) {
      const tagId = tagIdBySlug.get(`genre-${slugify(genre)}`);
      if (tagId) tagLinks.push([gameId, tagId]);
    }
    for (const category of Array.isArray(game.categories) ? game.categories : []) {
      const tagId = tagIdBySlug.get(`category-${slugify(category)}`);
      if (tagId) tagLinks.push([gameId, tagId]);
    }
  }
  if (platformRows.length) await connection.query("INSERT INTO game_platforms (gameId, platform, isAvailable, isWorking, sourceId, sourceUrl) VALUES ? ON DUPLICATE KEY UPDATE isAvailable = VALUES(isAvailable), sourceId = VALUES(sourceId), sourceUrl = VALUES(sourceUrl)", [platformRows]);
  if (tagLinks.length) await connection.query("INSERT IGNORE INTO game_tags (gameId, tagId) VALUES ?", [tagLinks]);

  await connection.commit();
  console.log(JSON.stringify({ importedGames: selected.length, importedTags: tagRows.length, gameTagLinks: tagLinks.length, sourceId: source.id, importBatchId }, null, 2));
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  await connection.end();
}
