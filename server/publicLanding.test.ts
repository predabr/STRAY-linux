import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");
const read = (relativePath: string) => fs.readFileSync(path.join(projectRoot, relativePath), "utf8");

describe("landing pública", () => {
  it("expõe instaladores reais, Linux por terminal verificado e não simula um repositório Pacman", () => {
    const landing = read("client/src/pages/Home.tsx");
    const distribution = read("client/src/lib/distribution.ts");
    expect(distribution).toContain("Stray-Linux-1.0.0-Setup_77d35f72.exe");
    expect(distribution).toContain("Stray-Linux-1.0.0-amd64_a04a5424.deb");
    expect(distribution).toContain("Stray-Linux-1.0.0-x86_64_fad145a2.rpm");
    expect(distribution).toContain("Stray-Linux-1.0.0-x64_e47eaca5.pacman");
    expect(distribution).toContain("Stray-Linux-1.0.0-x86_64_aa80474b.AppImage");
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
    expect(app).toContain('if (location === "/download") return <DownloadPage />;');
    expect(app).toContain('if (location === "/uninstall") return <Uninstall />;');
    expect(app).toContain("<ProductWorkspace><Router /></ProductWorkspace>");
  });

  it("documenta remoção segura sem limpar dados locais automaticamente", () => {
    const uninstall = read("client/src/pages/Uninstall.tsx");
    expect(uninstall).toContain("sudo apt remove stray-linux");
    expect(uninstall).toContain("sudo dnf remove stray-linux");
    expect(uninstall).toContain("sudo zypper remove stray-linux");
    expect(uninstall).toContain("sudo pacman -R stray-linux");
    expect(uninstall).toContain("rm ./Stray-Linux-1.0.0-x86_64.AppImage");
    expect(uninstall).toContain("não apaga automaticamente configurações ou dados locais");
  });
});
