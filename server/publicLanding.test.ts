import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");
const read = (relativePath: string) => fs.readFileSync(path.join(projectRoot, relativePath), "utf8");

describe("landing pública", () => {
  it("expõe formatos reais de instalação e não simula um repositório Pacman", () => {
    const landing = read("client/src/pages/Home.tsx");
    expect(landing).toContain("Stray-Linux-1.0.0-Setup.exe");
    expect(landing).toContain("Stray-Linux-1.0.0-amd64.deb");
    expect(landing).toContain("Stray-Linux-1.0.0-x86_64.rpm");
    expect(landing).toContain("Stray-Linux-1.0.0-x64.pacman");
    expect(landing).toContain("Stray-Linux-1.0.0-x86_64.AppImage");
    expect(landing).toContain("sudo pacman -U ./Stray-Linux-1.0.0-x64.pacman");
    expect(landing).not.toContain("pacman -S stray-linux");
  });

  it("mantém a página inicial fora do shell operacional", () => {
    const app = read("client/src/App.tsx");
    expect(app).toContain('if (location === "/") return <Home />;');
    expect(app).toContain("<ProductWorkspace><Router /></ProductWorkspace>");
  });
});
