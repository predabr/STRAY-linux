import { describe, expect, it } from "vitest";
import { gameFilterInput } from "./games";

describe("contrato de filtros do GameHub", () => {
  it("aceita a combinação técnica de distribuição, CPU, GPU, runtime e compatibilidade", () => {
    const result = gameFilterInput.parse({
      page: 2,
      pageSize: 24,
      q: "  Hades  ",
      distributionId: 7,
      cpuId: 11,
      gpuId: 21,
      compatibility: "playable",
      platform: "proton",
      genre: "roguelike",
      multiplayer: true,
      antiCheat: "none",
      sort: "featured",
    });
    expect(result).toMatchObject({ q: "Hades", page: 2, distributionId: 7, cpuId: 11, gpuId: 21, compatibility: "playable", platform: "proton", genre: "roguelike", multiplayer: true, antiCheat: "none", sort: "featured" });
  });

  it("aplica paginação segura e popularidade da fonte como ordenação padrão", () => {
    expect(gameFilterInput.parse({})).toMatchObject({ page: 1, pageSize: 24, sort: "popular" });
    expect(gameFilterInput.parse({ sort: "popular" })).toMatchObject({ sort: "popular" });
  });

  it("rejeita anti-cheat, runtime, identificadores e paginação fora do contrato", () => {
    expect(() => gameFilterInput.parse({ antiCheat: "unknown" })).toThrow();
    expect(() => gameFilterInput.parse({ platform: "native_windows" })).toThrow();
    expect(() => gameFilterInput.parse({ gpuId: 0 })).toThrow();
    expect(() => gameFilterInput.parse({ pageSize: 49 })).toThrow();
  });
});
