import fs from "node:fs/promises";
import path from "node:path";
import mysql from "mysql2/promise";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required only to export the desktop seed during development.");
const gameLimit = Number.parseInt(process.env.DESKTOP_GAME_LIMIT ?? "10000", 10);
if (!Number.isInteger(gameLimit) || gameLimit < 10000) throw new Error("DESKTOP_GAME_LIMIT precisa ser um inteiro de pelo menos 10000.");

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const [games] = await connection.query(`SELECT id, slug, title, shortDescription, steamAppId, sourcePositiveReviews FROM games WHERE status = 'published' AND deletedAt IS NULL ORDER BY sourcePositiveReviews DESC, steamAppId IS NULL, steamAppId ASC, id ASC LIMIT ${gameLimit}`);
const [distros] = await connection.query("SELECT id, slug, name, family, packageManager, defaultDesktop, officialUrl, sourceUrl FROM distributions WHERE status = 'published' AND deletedAt IS NULL ORDER BY name");
const [wiki] = await connection.query("SELECT id, slug, title, excerpt, body, category, versionLabel, provenance, sourceUrl FROM wiki_articles WHERE status = 'published' AND deletedAt IS NULL ORDER BY id");
const [guides] = await connection.query("SELECT id, slug, title, description, difficulty, guideVersion, provenance, sourceUrl FROM setup_guides WHERE status = 'published' AND deletedAt IS NULL ORDER BY id");
const [guideSteps] = await connection.query("SELECT guideId, stepOrder, title, explanation, command, warning FROM setup_guide_steps ORDER BY guideId, stepOrder");
const [fixes] = await connection.query("SELECT id, slug, title, category, symptoms, possibleCauses, confidence, provenance, sourceUrl FROM linux_fixes WHERE status = 'published' AND deletedAt IS NULL ORDER BY id");
const [solutions] = await connection.query("SELECT fixId, stepOrder, title, explanation, command, warning FROM linux_fix_solutions ORDER BY fixId, stepOrder");

const groupBy = (rows, key) => rows.reduce((map, row) => { const group = map.get(row[key]) ?? []; group.push(row); map.set(row[key], group); return map; }, new Map());
const groupedGuideSteps = groupBy(guideSteps, "guideId");
const groupedSolutions = groupBy(solutions, "fixId");
const seed = {
  exportedAt: new Date().toISOString(),
  provenance: "desktop_snapshot",
  games,
  distributions: distros,
  wiki,
  guides: guides.map((guide) => ({ ...guide, steps: groupedGuideSteps.get(guide.id) ?? [] })),
  fixes: fixes.map((fix) => ({ ...fix, solutions: groupedSolutions.get(fix.id) ?? [] })),
};

const output = path.resolve("desktop/seed/initial-data.json");
await fs.mkdir(path.dirname(output), { recursive: true });
await fs.writeFile(output, JSON.stringify(seed));
connection.destroy();
console.log(JSON.stringify({ output, games: games.length, distributions: distros.length, wiki: wiki.length, guides: guides.length, fixes: fixes.length }));
