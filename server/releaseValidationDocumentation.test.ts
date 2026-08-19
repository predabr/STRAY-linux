import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("documentação de fechamento da release 1.3.0", () => {
  it("registra fases, validações, distribuição e limites verificáveis", () => {
    const reportPath = path.resolve(import.meta.dirname, "../docs/RELEASE_1_3_VALIDATION.md");
    expect(fs.existsSync(reportPath)).toBe(true);

    const report = fs.readFileSync(reportPath, "utf8");
    expect(report).toContain("Stray Linux 1.3.0");
    expect(report).toContain("Centro de Operações");
    expect(report).toContain("Biblioteca local");
    expect(report).toContain("Diagnóstico e LinuxFix");
    expect(report).toContain("Stray AI");
    expect(report).toContain("187 testes");
    expect(report).toContain("HTTP 302");
    expect(report).toContain("`pacman -Qp` exige uma máquina Arch real");
  });
});
