import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync("client/src/pages/NotFound.tsx", "utf8");

describe("tela de rota inexistente", () => {
  it("mantém retorno seguro e texto localizado", () => {
    expect(source).toContain("Esta página não foi encontrada.");
    expect(source).toContain("Ir para o início");
    expect(source).toContain('setLocation("/")');
    expect(source).not.toContain("Page Not Found");
    expect(source).not.toContain("Go Home");
  });
});
