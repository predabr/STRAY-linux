import Database from "better-sqlite3";

const db = new Database("/tmp/lgh-sqlite-driver-check.sqlite");
db.exec("CREATE TABLE IF NOT EXISTS probe (id INTEGER PRIMARY KEY, value TEXT NOT NULL)");
db.prepare("INSERT INTO probe (value) VALUES (?)").run("ok");
const row = db.prepare("SELECT count(*) AS count FROM probe").get();
db.close();
console.log(JSON.stringify(row));
