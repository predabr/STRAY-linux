import { describe, expect, it } from "vitest";
import { buildOperationalStatus } from "./lib/operationalStatus";

describe("status operacional interno", () => {
  it("declara degradado quando o banco não está disponível", () => {
    const result = buildOperationalStatus("unavailable");
    expect(result).toMatchObject({ status: "degraded", checks: { api: "operational", database: "unavailable", externalRefresh: "manual_only" } });
  });

  it("declara o modo SQLite local sem fingir uma conexão remota", () => {
    expect(buildOperationalStatus("desktop_local")).toMatchObject({ status: "operational", checks: { database: "desktop_local" } });
  });
});
