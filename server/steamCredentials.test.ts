import { describe, expect, it } from "vitest";

describe("credencial Steam Web API", () => {
  it("autoriza a leitura do catálogo de interfaces suportadas no servidor", async () => {
    if (process.env.RUN_EXTERNAL_STEAM_TESTS !== "1") return;
    const key = process.env.STEAM_WEB_API_KEY;
    if (!key) throw new Error("STEAM_WEB_API_KEY é necessária quando RUN_EXTERNAL_STEAM_TESTS=1.");
    const url = new URL("https://api.steampowered.com/ISteamWebAPIUtil/GetSupportedAPIList/v1/");
    url.searchParams.set("key", key);
    const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    expect(response.status).toBe(200);
    const payload = await response.json() as { apilist?: { interfaces?: unknown[] } };
    expect(Array.isArray(payload.apilist?.interfaces)).toBe(true);
  }, 15_000);
});
