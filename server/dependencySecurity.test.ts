import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");

describe("configuração de dependências de produção", () => {
  it("mantém as versões transitivas corrigidas para rotas e utilitários", () => {
    const packageJson = fs.readFileSync(path.join(projectRoot, "package.json"), "utf8");
    const workspace = fs.readFileSync(path.join(projectRoot, "pnpm-workspace.yaml"), "utf8");

    expect(packageJson).toContain('"express": "^4.22.2"');
    expect(workspace).toContain("lodash: 4.18.1");
    expect(workspace).toContain("path-to-regexp: 0.1.13");
  });
});
