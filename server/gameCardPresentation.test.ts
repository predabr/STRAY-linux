import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");
const read = (relativePath: string) => fs.readFileSync(path.join(projectRoot, relativePath), "utf8");

describe("apresentação de jogos", () => {
  it("usa fallback próprio quando não há mídia registrada", () => {
    const card = read("client/src/components/platform/GameCard.tsx");
    expect(card).toContain("FALLBACK DE CATÁLOGO");
    expect(card).toContain("STRAY / CATALOG OBJECT");
    expect(card).toContain("game.coverImageUrl");
  });

  it("não adiciona indicadores simulados de FPS ou compatibilidade ao cartão", () => {
    const card = read("client/src/components/platform/GameCard.tsx");
    expect(card).not.toContain("87 FPS");
    expect(card).not.toContain("Excellent");
  });

  it("oferece fontes externas sem transformar seus rótulos em resultado do Stray", () => {
    const detail = read("client/src/pages/GameDetail.tsx");
    expect(detail).toContain("function CompatibilitySources");
    expect(detail).toContain("https://www.protondb.com/app/${game.steamAppId}");
    expect(detail).toContain("https://areweanticheatyet.com/");
    expect(detail).toContain("Eles não alteram a matriz do Stray");
    expect(detail).toContain("ausência de resultado não é incompatibilidade");
    expect(detail).not.toContain("87 FPS");
  });
});
