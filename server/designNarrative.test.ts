import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");

describe("linguagem autoral de produto", () => {
  it("mantém a landing institucional com autoria segura e downloads verificáveis", () => {
    const home = fs.readFileSync(path.join(projectRoot, "client/src/pages/Home.tsx"), "utf8");
    const css = fs.readFileSync(path.join(projectRoot, "client/src/index.css"), "utf8");

    expect(home).toContain("Jogue Linux.");
    expect(home).toContain("STATUS LOCAL");
    expect(home).toContain("Escolher formato");
    expect(home).toContain("Criado por Pedro, Brasil");
    expect(home).toContain("INSTALAÇÃO LINUX");
    expect(home).toContain("SELEÇÃO OBRIGATÓRIA");
    expect(home).toContain('href={assets.exe}');
    expect(home).not.toContain('href="/scanner"');
    expect(home).not.toContain('href="/assistant"');
    expect(home).not.toContain("landing-horizontal-story");
    expect(home).not.toContain('addEventListener("wheel"');
    expect(css).toContain("prefers-reduced-motion");
  });
});
