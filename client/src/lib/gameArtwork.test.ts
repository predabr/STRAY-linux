import { describe, expect, it } from "vitest";
import { gameArtworkCandidates, steamArtworkCandidates } from "./gameArtwork";

describe("arte de jogos", () => {
  it("oferece capa vertical e cabeçalho oficial como fallback por Steam App ID", () => {
    expect(steamArtworkCandidates(620)).toEqual([
      "https://cdn.cloudflare.steamstatic.com/steam/apps/620/library_600x900.jpg",
      "https://cdn.cloudflare.steamstatic.com/steam/apps/620/header.jpg",
    ]);
  });

  it("preserva URL autorizada preferencial sem duplicar a capa por App ID", () => {
    const primary = "https://cdn.cloudflare.steamstatic.com/steam/apps/620/library_600x900.jpg";
    expect(gameArtworkCandidates(primary, 620)).toEqual([
      primary,
      "https://cdn.cloudflare.steamstatic.com/steam/apps/620/header.jpg",
    ]);
  });
});
