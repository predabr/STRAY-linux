import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath: string) => fs.readFileSync(path.join(root, relativePath), "utf8");

describe("acessibilidade e privacidade das operações locais", () => {
  it("mantém feedback e estados desabilitados acionáveis na Biblioteca", () => {
    const library = read("client/src/pages/Library.tsx");
    expect(library).toContain('role="status"');
    expect(library).toContain('disabled={launching}');
    expect(library).toContain('disabled={revealing}');
    expect(library).toContain("Nenhum dado foi enviado.");
    expect(library).toContain("A leitura não percorre o disco indiscriminadamente.");
  });

  it("mantém o Diagnóstico sem automação destrutiva e com limite de reversão explícito", () => {
    const diagnostics = read("client/src/pages/Diagnostics.tsx");
    expect(diagnostics).toContain("O Stray não executa comandos, instala pacotes ou modifica permissões por esta tela.");
    expect(diagnostics).toContain("Não há reversão necessária: esta tela só leu e organizou dados locais; nenhuma alteração foi aplicada.");
    expect(diagnostics).toContain('disabled={running || !desktopAvailable}');
  });

  it("mantém o chat acessível por teclado e sem envio indevido de contexto", () => {
    const chat = read("client/src/components/AIChatBox.tsx");
    const assistant = read("client/src/pages/Assistant.tsx");
    const router = read("server/routers/chat.ts");
    expect(chat).toContain('type="button"');
    expect(chat).toContain('aria-label={placeholder}');
    expect(chat).toContain("const sendLabel = staticTranslationCatalog[locale]");
    expect(chat).toContain('aria-label={sendLabel}');
    expect(chat).toContain('e.key === "Enter" && !e.shiftKey');
    expect(assistant).toContain("Perfil, Scanner e fontes internas entram somente quando existem.");
    expect(router).toContain("Use SOMENTE o contexto interno e o perfil técnico fornecidos abaixo.");
    expect(router).toContain("O assistente não executa comandos nem altera o sistema.");
  });
});
