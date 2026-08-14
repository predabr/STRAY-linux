import { describe, expect, it } from "vitest";
import { gameFilterInput, gameShowcaseInput, hardwareListInput } from "./games";

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

  it("permite que seletores de hardware carreguem até 500 itens sem expandir a paginação do catálogo", () => {
    expect(hardwareListInput.parse({ pageSize: 500, kind: "gpu" })).toMatchObject({ page: 1, pageSize: 500, kind: "gpu" });
    expect(() => hardwareListInput.parse({ pageSize: 501 })).toThrow();
  });

  it("limita seções de descoberta a uma quantidade pequena de cartões", () => {
    expect(gameShowcaseInput.parse({})).toEqual({ limit: 6 });
    expect(gameShowcaseInput.parse({ limit: 12 })).toEqual({ limit: 12 });
    expect(() => gameShowcaseInput.parse({ limit: 13 })).toThrow();
  });
});
