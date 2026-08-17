import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");

describe("linguagem autoral de produto", () => {
  it("mantém a landing institucional com autoria segura e downloads verificáveis", () => {
    const home = fs.readFileSync(path.join(projectRoot, "client/src/pages/Home.tsx"), "utf8");
    const css = fs.readFileSync(path.join(projectRoot, "client/src/index.css"), "utf8");

    expect(home).toContain("landingCopy");
    expect(home).toContain("LetterReveal");
    expect(home).toContain("EvidenceSection");
    expect(home).toContain("INSTALAÇÃO LINUX");
    expect(home).toContain("SELEÇÃO OBRIGATÓRIA");
    expect(home).toContain('href={assets.exe}');
    expect(home).not.toContain('href="/scanner"');
    expect(home).not.toContain('href="/assistant"');
    expect(home).not.toContain("landing-horizontal-story");
    expect(home).not.toContain('addEventListener("wheel"');
    expect(home).toContain("editorial-sparkles");
    expect(home).not.toContain("editorial-orb");
    expect(css).toContain("editorial-twinkle");
    expect(css).toContain("editorial-letter-reveal");
    expect(css).toContain("prefers-reduced-motion");
  });
});
