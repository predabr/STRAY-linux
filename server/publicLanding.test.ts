import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");
const read = (relativePath: string) => fs.readFileSync(path.join(projectRoot, relativePath), "utf8");

describe("landing pública", () => {
  it("expõe instaladores reais, Linux por terminal verificado e não simula um repositório Pacman", () => {
    const landing = read("client/src/pages/Home.tsx");
    const windowsDownload = read("client/src/components/site/WindowsDownloadCard.tsx");
    const distribution = read("client/src/lib/distribution.ts");
    expect(distribution).toContain("downloads/stray-linux/windows-x64.exe");
    expect(distribution).toContain("downloads/stray-linux/debian-amd64.deb");
    expect(distribution).toContain("downloads/stray-linux/rpm-x64.rpm");
    expect(distribution).toContain("downloads/stray-linux/arch-x64.pacman");
    expect(distribution).toContain("downloads/stray-linux/linux-x64.AppImage");
    expect(distribution).toContain("sudo pacman -U /tmp/stray-linux.pacman");
    expect(distribution).toContain("sudo dpkg -i /tmp/stray-linux.deb || sudo apt-get -f install -y");
    expect(distribution).toContain("sha256sum --check --status -");
    expect(windowsDownload).toContain('import { distributionAssets } from "@/lib/distribution";');
    expect(windowsDownload).toContain('href={distributionAssets.exe}');
    expect(landing).not.toContain('href={assets.deb}');
    expect(landing).not.toContain('href={assets.rpm}');
    expect(landing).not.toContain('href={assets.pacman}');
    expect(landing).not.toContain('href={assets.appImage}');
    expect(landing).not.toContain("pacman -S stray-linux");
  });

  it("mantém a página inicial fora do shell operacional", () => {
    const app = read("client/src/App.tsx");
    expect(app).toContain('const publicPage = location === "/" || location === "/download" || location === "/uninstall" || location === "/support";');
    expect(app).toContain('if (publicPage) return location === "/" ? <Home />');
    expect(app).toContain('const DownloadPage = lazy(() => import("@/pages/Home")');
    expect(app).toContain('location === "/download" ? <DownloadPage />');
    expect(app).toContain('location === "/uninstall" ? <Uninstall />');
    expect(app).toContain("<ProductWorkspace><Router /></ProductWorkspace>");
  });

  it("mantém apresentação institucional e downloads sem substituir a interface por imagem estática", () => {
    const landing = read("client/src/pages/Home.tsx");
    const hero = read("client/src/components/site/SiteHero.tsx");
    const method = read("client/src/components/site/LandingMethod.tsx");
    const evidence = read("client/src/components/site/LandingEvidence.tsx");
    const installer = read("client/src/components/site/LinuxInstallerPanel.tsx");
    expect(landing).toContain("landingCopy");
    expect(hero).toContain("LetterReveal");
    expect(evidence).toContain("evidenceCards.map");
    expect(installer).toContain('useState<Installer["id"] | null>(null)');
    expect(installer).toContain('selected ? linuxInstallers.find((item) => item.id === selected) : undefined');
    expect(installer).toContain('{installer.name} · pacote {installer.signal}');
    expect(installer).toContain("SELEÇÃO OBRIGATÓRIA");
    expect(method).toContain("copy.cards.map");
    expect(installer).toContain("O bloco usa `bash -c`");
    expect(installer).toContain("usam exclusivamente a aba");
    expect(landing).not.toContain("stray-linux-landing-original_68a8e472.png");
    expect(landing).not.toContain("87 FPS");
    expect(landing).not.toContain("Excellent 92");
  });

  it("usa a rolagem vertical nativa e não recupera a narrativa lateral", () => {
    const landing = read("client/src/pages/Home.tsx");
    expect(landing).not.toContain('addEventListener("wheel"');
    expect(landing).not.toContain("Narrativa horizontal do Stray Linux");
    expect(landing).not.toContain("landing-horizontal-story");
    expect(landing).not.toContain("SCROLL TO EXPLORE");
  });

  it("reduz a sobrecarga da navegação sem remover ferramentas avançadas", () => {
    const workspace = read("client/src/components/platform/ProductWorkspace.tsx");
    const copy = read("client/src/i18n/productShellCopy.ts");
    expect(workspace).toContain("const advancedTools: WorkspaceNavigationItem[]");
    expect(workspace).toContain("WorkspaceDisclosureGroup");
    expect(workspace).toContain("advancedOpen || advancedRouteActive");
    expect(workspace).toContain('href: "/assistant", label: "Stray AI"');
    expect(copy).toContain('tools: "MAIS FERRAMENTAS"');
    expect(copy).toContain('version: "Versão 1.2.0"');
  });

  it("documenta remoção segura sem limpar dados locais automaticamente", () => {
    const uninstall = read("client/src/pages/Uninstall.tsx");
    const landing = read("client/src/pages/Home.tsx");
    const nav = read("client/src/components/site/SiteNav.tsx");
    const hero = read("client/src/components/site/SiteHero.tsx");
    const installer = read("client/src/components/site/LinuxInstallerPanel.tsx");
    const windowsWorkflow = read(".github/workflows/windows-installer.yml");
    expect(uninstall).toContain("artefatos publicados da versão atual");
    expect(uninstall).not.toContain("artefatos da versão 1.0.0");
    expect(nav).toContain('href="/uninstall"');
    expect(installer).toContain("pacman -Q stray-linux");
    expect(installer).toContain("which stray-linux");
    expect(landing).toContain("landingCopy");
    expect(hero).toContain("LetterReveal");
    expect(uninstall).toContain("sudo apt remove stray-linux");
    expect(uninstall).toContain("sudo dnf remove stray-linux");
    expect(uninstall).toContain("sudo zypper remove stray-linux");
    expect(uninstall).toContain("sudo pacman -R stray-linux");
    expect(uninstall).toContain('rm -f "${appImageInstallPath}"');
    expect(uninstall).toContain("não apaga automaticamente configurações ou dados locais");
    expect(windowsWorkflow).toContain("corepack enable");
    expect(windowsWorkflow).not.toContain("pnpm/action-setup@v4");
  });
});
