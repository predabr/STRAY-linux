import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");

describe("apresentação do Stray AI", () => {
  it("mantém o chat único, limite de escopo e falhas visíveis no histórico", () => {
    const assistant = fs.readFileSync(path.join(projectRoot, "client/src/pages/Assistant.tsx"), "utf8");
    const css = fs.readFileSync(path.join(projectRoot, "client/src/index.css"), "utf8");

    expect(assistant).toContain("AIChatBox");
    expect(assistant).toContain("stray-ai-console");
    expect(assistant).toContain("Conversa do aplicativo");
    expect(assistant).toContain("Não consegui responder agora");
    expect(assistant).not.toContain("Base da resposta atual");
    expect(assistant).not.toContain("Contrato de resposta");
    expect(css).toContain(".stray-ai-console");
  });
});
