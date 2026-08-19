import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..");
const read = (file: string) => fs.readFileSync(path.join(root, file), "utf8");

describe("roadmap de produto", () => {
  it("mantém fases, status, limites e princípios explícitos", () => {
    const roadmap = read("client/src/pages/Roadmap.tsx");
    const copy = read("client/src/i18n/roadmapCopy.ts");
    expect(roadmap).toContain("Centro de Operações");
    expect(roadmap).toContain("Biblioteca local");
    expect(roadmap).toContain("Diagnóstico e LinuxFix");
    expect(roadmap).toContain("Stray AI");
    expect(roadmap).toContain("Qualidade");
    expect(roadmap).toContain("Em planejamento");
    expect(roadmap).toContain("Em desenvolvimento");
    expect(roadmap).toContain("Validada");
    expect(roadmap).toContain("PRINCÍPIOS DE DESENVOLVIMENTO");
    expect(roadmap).toContain("roadmapCopy[locale]");
    expect(copy).toContain("Product status does not guarantee universal operation");
    expect(copy).toContain("Status de produto não garantem funcionamento universal");
  });

  it("mantém o acesso institucional no site e a rota pública", () => {
    const app = read("client/src/App.tsx");
    const home = read("client/src/pages/Home.tsx");
    const nav = read("client/src/components/site/SiteNav.tsx");
    expect(app).toContain('Route path="/roadmap"');
    expect(app).toContain('location === "/roadmap" ? <Roadmap />');
    expect(home).toContain('href="/roadmap"');
    expect(nav).toContain('href="/roadmap"');
  });
});
