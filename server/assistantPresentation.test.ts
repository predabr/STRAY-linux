import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");

describe("apresentação do Stray AI", () => {
  it("mantém chat, transparência e limites em uma superfície técnica", () => {
    const assistant = fs.readFileSync(path.join(projectRoot, "client/src/pages/Assistant.tsx"), "utf8");
    const css = fs.readFileSync(path.join(projectRoot, "client/src/index.css"), "utf8");

    expect(assistant).toContain("AIChatBox");
    expect(assistant).toContain("Base da resposta atual");
    expect(assistant).toContain("Contrato de resposta");
    expect(assistant).toContain("stray-ai-console");
    expect(css).toContain(".stray-ai-console");
    expect(css).toContain(".stray-ai-citation");
  });
});
