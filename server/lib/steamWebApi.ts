export const STEAM_INTERFACE_LIST_ENDPOINT = "https://api.steampowered.com/ISteamWebAPIUtil/GetSupportedAPIList/v1/";

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
