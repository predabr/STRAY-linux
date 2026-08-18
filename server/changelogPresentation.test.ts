import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath: string) => fs.readFileSync(path.join(root, relativePath), "utf8");

describe("changelog da release", () => {
  it("usa a versão central e distingue confirmação de validação Arch pendente", () => {
    const notes = read("client/src/lib/releaseNotes.ts");
    expect(notes).toContain("releaseManifest.version");
    expect(notes).toContain("Pacote Arch em hardware real");
    expect(notes).toContain("Pendente");
  });

  it("fica acessível pelo site e pelo aplicativo", () => {
    const app = read("client/src/App.tsx");
    const footer = read("client/src/components/site/SiteFooter.tsx");
    const workspace = read("client/src/components/platform/WorkspaceStatus.tsx");
    expect(app).toContain('path="/changelog"');
    expect(footer).toContain('href="/changelog"');
    expect(workspace).toContain('href="/changelog"');
  });
});
