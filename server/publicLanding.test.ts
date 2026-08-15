import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");
const read = (relativePath: string) => fs.readFileSync(path.join(projectRoot, relativePath), "utf8");

describe("landing pública", () => {
  it("expõe instaladores reais, Linux por terminal verificado e não simula um repositório Pacman", () => {
    const landing = read("client/src/pages/Home.tsx");
    const distribution = read("client/src/lib/distribution.ts");
    expect(distribution).toContain("Stray-Linux-1.0.0-Setup_c047dcd8.exe");
    expect(distribution).toContain("Stray-Linux-1.0.0-amd64_90ee4160.deb");
    expect(distribution).toContain("Stray-Linux-1.0.0-x86_64_e0f23ad7.rpm");
    expect(distribution).toContain("Stray-Linux-1.0.0-x64_906cbf46.pacman");
    expect(distribution).toContain("Stray-Linux-1.0.0-x86_64_9a06525f.AppImage");
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

  it("mantém a composição funcional e responsiva sem substituir a interface por imagem estática", () => {
    const landing = read("client/src/pages/Home.tsx");
    for (const route of ["/scanner", "/games", "/library", "/linuxfix", "/setup", "/benchmark", "/assistant", "/download", "/api/docs"]) {
      expect(landing).toContain(`"${route}"`);
    }
    expect(landing).toContain("<ProductPreview />");
    expect(landing).toContain("<SystemPreview />");
    expect(landing).toContain("<TerminalInstaller");
    expect(landing).toContain('{ value: "21", label: "distribuições publicadas" }');
    expect(landing).toContain('useState<(typeof linuxInstallers)[number]["id"] | null>(null)');
    expect(landing).toContain('selected ? linuxInstallers.find((item) => item.id === selected) : undefined');
    expect(landing).toContain('{installer.name} · pacote {installer.signal}');
    expect(landing).toContain('{installer.name.toUpperCase()}');
    expect(landing).toContain("SELEÇÃO OBRIGATÓRIA");
    expect(landing).toContain("O bloco inicia com `bash -c`");
    expect(landing).toContain("não use o pacote `.deb`");
    expect(landing).not.toContain("stray-linux-landing-original_68a8e472.png");
    expect(landing).not.toContain("87 FPS");
    expect(landing).not.toContain("Excellent 92");
  });

  it("documenta remoção segura sem limpar dados locais automaticamente", () => {
    const uninstall = read("client/src/pages/Uninstall.tsx");
    expect(uninstall).toContain("sudo apt remove stray-linux");
    expect(uninstall).toContain("sudo dnf remove stray-linux");
    expect(uninstall).toContain("sudo zypper remove stray-linux");
    expect(uninstall).toContain("sudo pacman -R stray-linux");
    expect(uninstall).toContain('rm -f "${appImageInstallPath}"');
    expect(uninstall).toContain("não apaga automaticamente configurações ou dados locais");
  });
});
