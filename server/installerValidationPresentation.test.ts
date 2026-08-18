import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath: string) => fs.readFileSync(path.join(root, relativePath), "utf8");

describe("orientação de validação por distribuição", () => {
  it("explica no painel que checksum não simula a abertura local e declara o limite Arch", () => {
    const panel = read("client/src/components/site/LinuxInstallerPanel.tsx");
    expect(panel).toContain("VALIDAÇÃO DESTE FORMATO");
    expect(panel).toContain("não há confirmação simulada no site");
    expect(panel).toContain("pacman -Qp");
    expect(panel).toContain("máquina Arch real");
  });

  it("mantém a matriz operacional com limites de cada formato", () => {
    const docs = read("docs/CI_AND_DISTRIBUTION.md");
    expect(docs).toContain("Matriz de validação por formato");
    expect(docs).toContain("Debian / Ubuntu");
    expect(docs).toContain("Arch e derivadas");
    expect(docs).toContain("Windows (`.exe`)");
    expect(docs).toContain("Canal de atualização");
    expect(docs).toContain("feed HTTPS comum");
  });

  it("declara no updater o canal comum sem prometer uma instalação genérica", () => {
    const updater = read("desktop/updater.cjs");
    expect(updater).toContain("UPDATE_CHANNEL_NOTE");
    expect(updater).toContain("formato compatível com sua distribuição");
  });
});
