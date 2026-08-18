import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync("client/src/components/platform/ProductWorkspace.tsx", "utf8");

describe("navegação operacional", () => {
  it("preserva rotas e localiza rótulos técnicos visíveis", () => {
    expect(source).toContain('href: "/system-graph", label: "Mapa do sistema"');
    expect(source).toContain('href: "/system-timeline", label: "Linha do tempo"');
    expect(source).not.toContain('label: "System Graph"');
    expect(source).not.toContain('label: "Timeline"');
  });
});
