import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath: string) => fs.readFileSync(path.join(root, relativePath), "utf8");

describe("polimento de produto", () => {
  it("mantém a comparação acessível pela rota declarada e não a deixa cair em NotFound", () => {
    const app = read("client/src/App.tsx");
    expect(app).toContain('const Compare = lazy(() => import("@/pages/Compare"))');
    expect(app).toContain('<Route path="/compare" component={Compare} />');
  });

  it("concentra primitivas reutilizáveis para cabeçalhos, filtros, cartões, foco e estados vazios", () => {
    const styles = read("client/src/index.css");
    const games = read("client/src/pages/Games.tsx");
    const card = read("client/src/components/platform/GameCard.tsx");
    expect(styles).toContain(".stray-page-header");
    expect(styles).toContain(".stray-filter-panel");
    expect(styles).toContain(".stray-game-card");
    expect(styles).toContain(":focus-visible");
    expect(games).toContain("aria-live=\"polite\"");
    expect(games).toContain("Limpar filtros");
    expect(card).toContain("stray-card-action");
  });
});
