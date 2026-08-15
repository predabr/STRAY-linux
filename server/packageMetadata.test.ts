import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");

describe("metadados de distribuição", () => {
  it("preserva o crédito público resumido e não expõe nome completo", () => {
    const packageJson = fs.readFileSync(path.join(projectRoot, "package.json"), "utf8");
    expect(packageJson).toContain('"author": "Pedro (Brasil)"');
    expect(packageJson).toContain('"maintainer": "Pedro <creator@straylinux.local>"');
    expect(packageJson).not.toContain("Pedro Henrique Gouveia Araújo de Souza");
    expect(packageJson).not.toContain("14 anos");
  });
});
