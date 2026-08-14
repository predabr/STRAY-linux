export const STEAM_INTERFACE_LIST_ENDPOINT = "https://api.steampowered.com/ISteamWebAPIUtil/GetSupportedAPIList/v1/";
export const STEAM_APP_LIST_ENDPOINT = "https://partner.steam-api.com/IStoreService/GetAppList/v1/";

export type SteamCatalogApp = { appId: number; name: string; lastModified: number | null; priceChangeNumber: number | null };

export function slugifySteamTitle(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 160) || "untitled";
}

export function parseSteamCatalogApps(payload: unknown): SteamCatalogApp[] {
  const apps = (payload as { response?: { apps?: unknown[] } } | null)?.response?.apps;
  if (!Array.isArray(apps)) throw new Error("A Steam respondeu sem a lista de apps esperada.");
  return apps.flatMap((raw) => {
    const app = raw as Record<string, unknown>;
    const appId = Number(app.appid);
    const name = typeof app.name === "string" ? app.name.trim() : "";
    if (!Number.isInteger(appId) || appId <= 0 || name.length < 2) return [];
    return [{ appId, name: name.slice(0, 400), lastModified: Number.isFinite(Number(app.last_modified)) ? Number(app.last_modified) : null, priceChangeNumber: Number.isFinite(Number(app.price_change_number)) ? Number(app.price_change_number) : null }];
  });
}

export async function getSteamCatalogPage(key: string, options: { lastAppId?: number | null; maxResults?: number; modifiedSince?: number | null } = {}) {
  if (!key) throw new Error("STEAM_WEB_API_KEY não está configurada no servidor.");
  const url = new URL(STEAM_APP_LIST_ENDPOINT);
  url.searchParams.set("key", key);
  url.searchParams.set("input_json", JSON.stringify({
    include_games: true,
    include_dlc: false,
    include_software: false,
    include_videos: false,
    include_hardware: false,
    max_results: Math.min(Math.max(options.maxResults ?? 1000, 1), 5000),
    ...(options.lastAppId ? { last_appid: options.lastAppId } : {}),
    ...(options.modifiedSince ? { if_modified_since: options.modifiedSince } : {}),
  }));
  const response = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  if (!response.ok) throw new Error(`Steam IStoreService respondeu HTTP ${response.status}.`);
  const payload = await response.json();
  return { endpoint: STEAM_APP_LIST_ENDPOINT, apps: parseSteamCatalogApps(payload) };
}

export function countSteamInterfaces(payload: unknown) {
  const interfaces = (payload as { apilist?: { interfaces?: unknown[] } } | null)?.apilist?.interfaces;
  if (!Array.isArray(interfaces)) throw new Error("A Steam respondeu sem a lista esperada de interfaces.");
  return interfaces.length;
}

export async function verifySteamWebApi(key: string) {
  if (!key) throw new Error("STEAM_WEB_API_KEY não está configurada no servidor.");
  const url = new URL(STEAM_INTERFACE_LIST_ENDPOINT);
  url.searchParams.set("key", key);
  const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  if (!response.ok) throw new Error(`Steam Web API respondeu HTTP ${response.status}.`);
  return { endpoint: STEAM_INTERFACE_LIST_ENDPOINT, interfaces: countSteamInterfaces(await response.json()) };
}
