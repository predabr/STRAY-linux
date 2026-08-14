import type { Request, Response } from "express";
import { contentSources } from "../../drizzle/schema";
import { sdk } from "../_core/sdk";
import { requireDatabase } from "../routers/_guards";
import { eq } from "drizzle-orm";
import { refreshSteamCatalog } from "../lib/steamCatalogRefresh";

export function isCronTask(user: { isCron?: boolean; taskUid?: string }) {
  return user.isCron === true && typeof user.taskUid === "string" && user.taskUid.length > 0;
}

export async function refreshSourceHandler(req: Request, res: Response) {
  let taskUid: string | undefined;
  try {
    const user = await sdk.authenticateRequest(req);
    if (!isCronTask(user)) return res.status(403).json({ error: "cron_only" });
    const cronTaskUid = user.taskUid!;
    taskUid = cronTaskUid;
    const db = await requireDatabase();
    const source = (await db.select().from(contentSources).where(eq(contentSources.scheduleCronTaskUid, cronTaskUid)).limit(1))[0];
    if (!source) return res.json({ ok: true, skipped: "orphan" });
    if (source.name !== "Steam Web API") return res.json({ ok: true, skipped: "unsupported_source", sourceId: source.id });
    const result = await refreshSteamCatalog(db, source, process.env.STEAM_WEB_API_KEY || "", { maxResults: 1000 });
    return res.json({ ok: true, sourceId: source.id, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 500) : "Erro não identificado.";
    return res.status(500).json({ error: "source_refresh_failed", message, context: { taskUid: taskUid ?? null }, timestamp: new Date().toISOString() });
  }
}
