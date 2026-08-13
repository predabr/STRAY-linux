import fs from "node:fs";

const datasetPath = process.env.STEAM_DATASET_PATH ?? "/home/ubuntu/linux-gaming-hub-data/games.json";
const raw = fs.readFileSync(datasetPath, "utf8");
const records = JSON.parse(raw);
const [appid, first] = Object.entries(records)[0] ?? [];

if (!appid || !first) {
  throw new Error("O dataset não contém registros.");
}

const fields = Object.fromEntries(
  Object.entries(first).map(([key, value]) => [key, Array.isArray(value) ? "array" : typeof value]),
);

console.log(JSON.stringify({ recordCount: Object.keys(records).length, firstAppId: appid, fields, sample: first }, null, 2));
