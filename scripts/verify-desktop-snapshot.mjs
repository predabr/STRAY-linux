import fs from "node:fs";
import path from "node:path";
import initSqlJs from "sql.js";

const dataDir = process.env.DESKTOP_DATA_DIR;
if (!dataDir) throw new Error("DESKTOP_DATA_DIR é obrigatório.");
const databasePath = path.join(dataDir, "linux-gaming-hub.sqlite");
if (!fs.existsSync(databasePath)) throw new Error(`Snapshot SQLite não encontrado: ${databasePath}`);

const SQL = await initSqlJs();
const db = new SQL.Database(fs.readFileSync(databasePath));
const count = (table) => Number(db.exec(`SELECT count(*) AS total FROM ${table}`)[0]?.values?.[0]?.[0] ?? 0);
const result = { games: count("games"), distributions: count("distributions"), wiki: count("wiki_articles"), guides: count("setup_guides"), fixes: count("linux_fixes") };
if (result.games < 1000 || result.distributions < 17 || result.wiki < 17 || result.guides < 36 || result.fixes < 6) throw new Error(`Snapshot incompleto: ${JSON.stringify(result)}`);
console.log(JSON.stringify({ mode: "desktop-sqlite", databasePath, ...result }));
