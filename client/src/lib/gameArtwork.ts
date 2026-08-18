const STEAM_CDN = "https://cdn.cloudflare.steamstatic.com/steam/apps";

export function steamArtworkCandidates(appId: number | null | undefined) {
  if (!appId) return [];
  return [
    `${STEAM_CDN}/${appId}/library_600x900.jpg`,
    `${STEAM_CDN}/${appId}/header.jpg`,
  ];
}

export function gameArtworkCandidates(preferredUrl: string | null | undefined, steamAppId: number | null | undefined) {
  return Array.from(new Set([preferredUrl, ...steamArtworkCandidates(steamAppId)].filter((url): url is string => Boolean(url))));
}
