import type { Request, Response } from "express";
import { contentSources, sourceRefreshRuns } from "../../drizzle/schema";
import { sdk } from "../_core/sdk";
import { requireDatabase } from "../routers/_guards";
import { eq } from "drizzle-orm";

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
    await db.insert(sourceRefreshRuns).values({ sourceId: source.id, kind: "scheduled-source-refresh", status: "skipped", finishedAt: new Date(), sourceEndpoint: source.baseUrl, message: "Nenhuma receita de importação aprovada para esta fonte. Nenhuma solicitação externa foi feita." });
    return res.json({ ok: true, skipped: "awaiting_approved_recipe", sourceId: source.id });
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 500) : "Erro não identificado.";
    return res.status(500).json({ error: "source_refresh_failed", message, context: { taskUid: taskUid ?? null }, timestamp: new Date().toISOString() });
  }
}
