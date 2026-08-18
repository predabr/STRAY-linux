import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync("client/src/components/ErrorBoundary.tsx", "utf8");

describe("limite global de erros", () => {
  it("oferece recuperação sem expor stack trace ao usuário", () => {
    expect(source).toContain("Não foi possível carregar esta tela.");
    expect(source).toContain("Recarregar aplicativo");
    expect(source).not.toContain("this.state.error?.stack");
    expect(source).not.toContain("An unexpected error occurred.");
  });
});
