import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");
const read = (relativePath: string) => fs.readFileSync(path.join(projectRoot, relativePath), "utf8");

describe("landing pública", () => {
  it("expõe instaladores reais, Linux por terminal verificado e não simula um repositório Pacman", () => {
    const landing = read("client/src/pages/Home.tsx");
    const distribution = read("client/src/lib/distribution.ts");
    expect(distribution).toContain("Stray-Linux-1.1.2-Setup_106bcba4.exe");
    expect(distribution).toContain("Stray-Linux-1.1.2-amd64_12e992f7.deb");
    expect(distribution).toContain("Stray-Linux-1.1.2-x86_64_61cc0a89.rpm");
    expect(distribution).toContain("Stray-Linux-1.1.2-x64_19f3ad3b.pacman");
    expect(distribution).toContain("Stray-Linux-1.1.2-x86_64_2f04de8f.AppImage");
    expect(distribution).toContain("sudo pacman -U /tmp/stray-linux.pacman");
    expect(distribution).toContain("sudo dpkg -i /tmp/stray-linux.deb || sudo apt-get -f install -y");
    expect(distribution).toContain("sha256sum -c -");
    expect(landing).toContain('import { distributionAssets as assets, linuxInstallers } from "@/lib/distribution";');
    expect(landing).toContain('href={assets.exe}');
    expect(landing).not.toContain('href={assets.deb}');
    expect(landing).not.toContain('href={assets.rpm}');
    expect(landing).not.toContain('href={assets.pacman}');
    expect(landing).not.toContain('href={assets.appImage}');
    expect(landing).not.toContain("pacman -S stray-linux");
  });

  it("mantém a página inicial fora do shell operacional", () => {
    const app = read("client/src/App.tsx");
    expect(app).toContain('if (location === "/") return <Home />;');
    expect(app).toContain('const DownloadPage = lazy(() => import("@/pages/Home")');
    expect(app).toContain('if (location === "/download") return <DownloadPage />;');
    expect(app).toContain('if (location === "/uninstall") return <Uninstall />;');
    expect(app).toContain("<ProductWorkspace><Router /></ProductWorkspace>");
  });

  it("mantém apresentação institucional e downloads sem substituir a interface por imagem estática", () => {
    const landing = read("client/src/pages/Home.tsx");
    expect(landing).toContain("Seu Linux.");
    expect(landing).toContain("Criado por Pedro, Brasil");
    expect(landing).toContain("O QUE O APP ENTREGA");
    expect(landing).toContain("Ver downloads");
    expect(landing).toContain("<TerminalInstaller");
    expect(landing).toContain('useState<Installer["id"] | null>(null)');
    expect(landing).toContain('selected ? linuxInstallers.find((item) => item.id === selected) : undefined');
    expect(landing).toContain('{installer.name} · pacote {installer.signal}');
    expect(landing).toContain("SELEÇÃO OBRIGATÓRIA");
    expect(landing).toContain("function SignalStrip()");
    expect(landing).toContain("Clareza para jogar.");
    expect(landing).toContain("O bloco usa `bash -c`");
    expect(landing).toContain("usam exclusivamente a aba");
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
    expect(workspace).toContain("const advancedTools: NavigationItem[]");
    expect(workspace).toContain("ExpandableNavigationGroup");
    expect(workspace).toContain("advancedOpen || advancedRouteActive");
    expect(workspace).toContain('href: "/assistant", label: "Stray AI"');
    expect(copy).toContain('tools: "MAIS FERRAMENTAS"');
    expect(copy).toContain('version: "Versão 1.1.0"');
  });

  it("documenta remoção segura sem limpar dados locais automaticamente", () => {
    const uninstall = read("client/src/pages/Uninstall.tsx");
    const landing = read("client/src/pages/Home.tsx");
    const windowsWorkflow = read(".github/workflows/windows-installer.yml");
    expect(uninstall).toContain("artefatos da versão 1.1.1");
    expect(uninstall).not.toContain("artefatos da versão 1.0.0");
    expect(landing).toContain('href="/uninstall"');
    expect(landing).toContain("pacman -Q stray-linux");
    expect(landing).toContain("which stray-linux");
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
