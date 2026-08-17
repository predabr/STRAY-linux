import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");

describe("linguagem autoral de produto", () => {
  it("mantém a landing institucional com autoria segura e downloads verificáveis", () => {
    const home = fs.readFileSync(path.join(projectRoot, "client/src/pages/Home.tsx"), "utf8");
    const hero = fs.readFileSync(path.join(projectRoot, "client/src/components/site/SiteHero.tsx"), "utf8");
    const evidence = fs.readFileSync(path.join(projectRoot, "client/src/components/site/LandingEvidence.tsx"), "utf8");
    const installer = fs.readFileSync(path.join(projectRoot, "client/src/components/site/LinuxInstallerPanel.tsx"), "utf8");
    const windowsDownload = fs.readFileSync(path.join(projectRoot, "client/src/components/site/WindowsDownloadCard.tsx"), "utf8");
    const css = fs.readFileSync(path.join(projectRoot, "client/src/index.css"), "utf8");

    expect(home).toContain("landingCopy");
    expect(hero).toContain("LetterReveal");
    expect(evidence).toContain("evidenceCards.map");
    expect(installer).toContain("INSTALAÇÃO LINUX");
    expect(installer).toContain("SELEÇÃO OBRIGATÓRIA");
    expect(windowsDownload).toContain("href={distributionAssets.exe}");
    expect(home).not.toContain('href="/scanner"');
    expect(home).not.toContain('href="/assistant"');
    expect(home).not.toContain("landing-horizontal-story");
    expect(home).not.toContain('addEventListener("wheel"');
    expect(hero).toContain("editorial-sparkles");
    expect(home).not.toContain("editorial-orb");
    expect(css).toContain("editorial-twinkle");
    expect(css).toContain("editorial-letter-reveal");
    expect(css).toContain("prefers-reduced-motion");
  });
});
