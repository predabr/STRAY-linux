import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath: string) => fs.readFileSync(path.join(root, relativePath), "utf8");

describe("experiência Stray AI", () => {
  it("oferece perguntas técnicas iniciais e não expõe o erro interno do servidor no chat", () => {
    const assistant = read("client/src/pages/Assistant.tsx");
    expect(assistant).toContain("starterPrompts");
    expect(assistant).toContain("Meu jogo não abre pelo Proton");
    expect(assistant).toContain("chatFailureMessage");
    expect(assistant).not.toContain("error.message");
  });

  it("mantém a explicação de escopo e limitações no console", () => {
    const assistant = read("client/src/pages/Assistant.tsx");
    expect(assistant).toContain("Escopo técnico controlado");
    expect(assistant).toContain("Perfil, Scanner e fontes internas entram somente quando existem.");
    expect(assistant).toContain("A IA não executa comandos nem inventa resultados");
    expect(assistant).toContain("Pedidos de código, jogos e temas externos ficam fora do escopo");
    expect(assistant).toContain("Ausência de evidência continua sendo ausência");
    expect(assistant).toContain("verifique a evidência antes de mudar o sistema");
  });
});
