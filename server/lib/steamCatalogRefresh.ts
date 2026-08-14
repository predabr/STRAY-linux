import { createHash } from "node:crypto";
import { and, eq, inArray, isNull } from "drizzle-orm";
import { contentSources, games, importBatches, sourceRefreshRuns } from "../../drizzle/schema";
import { getSteamCatalogPage, slugifySteamTitle } from "./steamWebApi";

type Database = any;
type SteamSource = { id: number; catalogCursorAppId: number | null; lastCatalogRefreshAt: Date | null };

export async function refreshSteamCatalog(db: Database, source: SteamSource, key: string, options: { maxResults?: number } = {}) {
  const startedAt = new Date();
  const run = await db.insert(sourceRefreshRuns).values({ sourceId: source.id, kind: "steam-istore-app-list", status: "started", sourceEndpoint: "https://partner.steam-api.com/IStoreService/GetAppList/v1/" });
  const runId = Number(run[0].insertId);
  try {
    const page = await getSteamCatalogPage(key, { lastAppId: source.catalogCursorAppId, maxResults: options.maxResults });
    const inputHash = createHash("sha256").update(JSON.stringify(page.apps)).digest("hex");
    await db.update(sourceRefreshRuns).set({ inputHash }).where(eq(sourceRefreshRuns.id, runId));
    const appIds = page.apps.map((app) => app.appId);
    const existing = appIds.length ? await db.select({ steamAppId: games.steamAppId }).from(games).where(and(inArray(games.steamAppId, appIds), isNull(games.deletedAt))) : [];
    const existingIds = new Set(existing.map((game: { steamAppId: number | null }) => game.steamAppId).filter((id: number | null): id is number => id !== null));
    const newApps = page.apps.filter((app) => !existingIds.has(app.appId));
    const batch = await db.insert(importBatches).values({ sourceId: source.id, kind: "steam_istore_app_list", inputHash, importedCount: newApps.length, notes: `IStoreService/GetAppList: ${page.apps.length} registros vistos; somente App ID e nome foram considerados.` });
    const importBatchId = Number(batch[0].insertId);
    if (newApps.length) await db.insert(games).values(newApps.map((app) => ({ slug: `steam-${app.appId}-${slugifySteamTitle(app.name)}`, title: app.name, steamAppId: app.appId, status: "draft" as const, sourceId: source.id, importBatchId, sourceUrl: page.endpoint, sourceUpdatedAt: app.lastModified ? new Date(app.lastModified * 1000) : null, sourceCheckedAt: startedAt })));
    const nextCursor = page.apps.reduce((largest, app) => Math.max(largest, app.appId), source.catalogCursorAppId ?? 0) || null;
    await Promise.all([
      db.update(contentSources).set({ catalogCursorAppId: nextCursor, lastCatalogRefreshAt: startedAt, lastCheckedAt: startedAt, lastSuccessfulRefreshAt: startedAt }).where(eq(contentSources.id, source.id)),
      db.update(sourceRefreshRuns).set({ status: "succeeded", finishedAt: new Date(), recordsSeen: page.apps.length, recordsChanged: newApps.length, message: `Atualização incremental concluída: ${newApps.length} novos rascunhos; mídia e campos de loja não foram importados.` }).where(eq(sourceRefreshRuns.id, runId)),
    ]);
    return { runId, endpoint: page.endpoint, seen: page.apps.length, created: newApps.length, nextCursor };
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 2000) : "Falha desconhecida no refresh Steam.";
    await db.update(sourceRefreshRuns).set({ status: "failed", finishedAt: new Date(), message }).where(eq(sourceRefreshRuns.id, runId));
    throw error;
  }
}
