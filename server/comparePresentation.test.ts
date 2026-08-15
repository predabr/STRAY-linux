import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");

describe("apresentação do comparador", () => {
  it("organiza a compatibilidade por etapas sem adicionar dados não verificados", () => {
    const compare = fs.readFileSync(path.join(projectRoot, "client/src/pages/Compare.tsx"), "utf8");
    const css = fs.readFileSync(path.join(projectRoot, "client/src/index.css"), "utf8");

    expect(compare).toContain("Compare cenários. Preserve o contexto.");
    expect(compare).toContain("Amostras verificadas por GPU");
    expect(compare).toContain("stray-compare-sample");
    expect(compare).toContain("Nenhum benchmark verificado disponível.");
    expect(css).toContain(".stray-compare-hero");
    expect(css).toContain(".stray-compare-sample");
  });
});
