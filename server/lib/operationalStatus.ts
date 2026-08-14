import { sql } from "drizzle-orm";
import { getDb } from "../db";

export type OperationalStatus = {
  status: "operational" | "degraded";
  checkedAt: string;
  checks: {
    api: "operational";
    database: "operational" | "unavailable" | "desktop_local";
    externalRefresh: "manual_only";
  };
};

export function buildOperationalStatus(database: OperationalStatus["checks"]["database"]): OperationalStatus {
  return {
    status: database === "unavailable" ? "degraded" : "operational",
    checkedAt: new Date().toISOString(),
    checks: { api: "operational", database, externalRefresh: "manual_only" },
  };
}

export async function getOperationalStatus(desktopMode: boolean): Promise<OperationalStatus> {
  if (desktopMode) return buildOperationalStatus("desktop_local");
  try {
    const db = await getDb();
    if (!db) return buildOperationalStatus("unavailable");
    await db.execute(sql`select 1`);
    return buildOperationalStatus("operational");
  } catch {
    return buildOperationalStatus("unavailable");
  }
}
