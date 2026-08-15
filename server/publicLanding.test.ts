import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");
const read = (relativePath: string) => fs.readFileSync(path.join(projectRoot, relativePath), "utf8");

describe("landing pública", () => {
  it("expõe instaladores reais, Linux por terminal verificado e não simula um repositório Pacman", () => {
    const landing = read("client/src/pages/Home.tsx");
    expect(landing).toContain("Stray-Linux-1.0.0-Setup_fd81114a.exe");
    expect(landing).toContain("Stray-Linux-1.0.0-amd64_8506c6fc.deb");
    expect(landing).toContain("Stray-Linux-1.0.0-x86_64_032c51b2.rpm");
    expect(landing).toContain("Stray-Linux-1.0.0-x64_0d745038.pacman");
    expect(landing).toContain("Stray-Linux-1.0.0-x86_64_68775b31.AppImage");
    expect(landing).toContain("sudo pacman -U /tmp/stray-linux.pacman");
    expect(landing).toContain("sudo dpkg -i /tmp/stray-linux.deb || sudo apt-get -f install -y");
    expect(landing).toContain("sha256sum -c -");
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
