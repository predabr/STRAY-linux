import type { Express, Request, Response } from "express";
import { and, desc, eq, isNull, like, sql } from "drizzle-orm";
import { benchmarks, compatibilityRecords, distributions, games, hardwareItems, linuxFixes } from "../drizzle/schema";
import { requireDatabase } from "./routers/_guards";

const clients = new Map<string, { count: number; resetAt: number }>();
function allow(req: Request, res: Response) {
  const now = Date.now(); const key = req.ip || "unknown"; const current = clients.get(key);
  const bucket = !current || current.resetAt <= now ? { count: 0, resetAt: now + 60_000 } : current;
  bucket.count += 1; clients.set(key, bucket);
  res.setHeader("X-RateLimit-Limit", "60"); res.setHeader("X-RateLimit-Remaining", String(Math.max(0, 60 - bucket.count)));
  if (bucket.count > 60) { res.status(429).json({ error: "rate_limit_exceeded", message: "Limite público excedido; tente novamente em breve." }); return false; }
  return true;
}
function page(value: unknown) { const parsed = Number(value); return Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, 100) : 24; }
function published(status: typeof games.status) { return and(eq(status, "published"), isNull(games.deletedAt)); }

export function registerPublicApi(app: Express) {
  app.use("/api/v1", (req, res, next) => { res.setHeader("X-API-Version", "1"); res.setHeader("Cache-Control", "public, max-age=60"); if (allow(req, res)) next(); });
  app.get("/api/v1", (_req, res) => res.json({ version: "v1", readOnly: true, resources: ["/games", "/compatibility", "/benchmarks", "/hardware", "/distros", "/linuxfix"] }));
  app.get("/api/v1/games", async (req, res) => { const db = await requireDatabase(); const limit = page(req.query.limit); const query = typeof req.query.q === "string" ? req.query.q.trim() : ""; const rows = await db.select({ id: games.id, slug: games.slug, title: games.title, steamAppId: games.steamAppId, updatedAt: games.updatedAt }).from(games).where(and(eq(games.status, "published"), isNull(games.deletedAt), query ? like(games.title, `%${query.slice(0, 100)}%`) : undefined)).orderBy(desc(games.sourcePositiveReviews), games.title).limit(limit); res.json({ data: rows, meta: { limit, count: rows.length } }); });
  app.get("/api/v1/distros", async (req, res) => { const db = await requireDatabase(); const limit = page(req.query.limit); const rows = await db.select({ id: distributions.id, slug: distributions.slug, name: distributions.name, family: distributions.family, packageManager: distributions.packageManager, officialUrl: distributions.officialUrl, sourceUrl: distributions.sourceUrl }).from(distributions).where(and(eq(distributions.status, "published"), isNull(distributions.deletedAt))).orderBy(distributions.name).limit(limit); res.json({ data: rows, meta: { limit, count: rows.length } }); });
  app.get("/api/v1/hardware", async (req, res) => { const db = await requireDatabase(); const limit = page(req.query.limit); const rows = await db.select({ id: hardwareItems.id, slug: hardwareItems.slug, model: hardwareItems.model, kind: hardwareItems.kind, manufacturer: hardwareItems.manufacturer, driverFamily: hardwareItems.driverFamily, sourceUrl: hardwareItems.sourceUrl }).from(hardwareItems).where(isNull(hardwareItems.deletedAt)).orderBy(hardwareItems.model).limit(limit); res.json({ data: rows, meta: { limit, count: rows.length } }); });
  app.get("/api/v1/linuxfix", async (req, res) => { const db = await requireDatabase(); const limit = page(req.query.limit); const rows = await db.select({ id: linuxFixes.id, slug: linuxFixes.slug, title: linuxFixes.title, category: linuxFixes.category, confidence: linuxFixes.confidence, provenance: linuxFixes.provenance, sourceUrl: linuxFixes.sourceUrl }).from(linuxFixes).where(and(eq(linuxFixes.status, "published"), isNull(linuxFixes.deletedAt))).orderBy(desc(linuxFixes.updatedAt)).limit(limit); res.json({ data: rows, meta: { limit, count: rows.length } }); });
  app.get("/api/v1/benchmarks", async (req, res) => { const db = await requireDatabase(); const limit = page(req.query.limit); const rows = await db.select({ id: benchmarks.id, gameId: benchmarks.gameId, provenance: benchmarks.provenance, verificationStatus: benchmarks.verificationStatus, measuredAt: benchmarks.measuredAt, sourceLabel: benchmarks.sourceLabel, sourceUrl: benchmarks.sourceUrl }).from(benchmarks).where(eq(benchmarks.verificationStatus, "verified")).orderBy(desc(benchmarks.measuredAt)).limit(limit); res.json({ data: rows, meta: { limit, count: rows.length, onlyVerified: true } }); });
  app.get("/api/v1/compatibility", async (req, res) => { const db = await requireDatabase(); const limit = page(req.query.limit); const rows = await db.select({ id: compatibilityRecords.id, gameId: compatibilityRecords.gameId, distributionId: compatibilityRecords.distributionId, gpuId: compatibilityRecords.gpuId, cpuId: compatibilityRecords.cpuId, level: compatibilityRecords.level, confidence: compatibilityRecords.confidence, provenance: compatibilityRecords.provenance, sourceUrl: compatibilityRecords.sourceUrl, updatedAt: compatibilityRecords.updatedAt }).from(compatibilityRecords).orderBy(desc(compatibilityRecords.updatedAt)).limit(limit); res.json({ data: rows, meta: { limit, count: rows.length } }); });
}
