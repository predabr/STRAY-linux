import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync("client/src/pages/Diagnostics.tsx", "utf8");

describe("diagnóstico", () => {
  it("mantém os rótulos técnicos em português e limita ações ao desktop", () => {
    expect(source).toContain("O QUE HÁ DE ERRADO? / DIAGNÓSTICO LOCAL");
    expect(source).toContain("FLUXO DE ANÁLISE");
    expect(source).toContain('variant={desktopAvailable ? "default" : "outline"}');
    expect(source).toContain("Scanner no app desktop");
    expect(source).toContain("disabled={running || !desktopAvailable}");
    expect(source).toContain("maintenance.preview()");
    expect(source).toContain("Exportar diagnóstico");
    expect(source).toContain("O Stray não executa comandos, instala pacotes ou modifica permissões por esta tela.");
    expect(source).not.toContain("WHAT'S WRONG?");
    expect(source).not.toContain("LOCAL DIAGNOSTICS");
  });
});
