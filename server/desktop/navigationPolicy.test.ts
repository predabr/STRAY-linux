import { describe, expect, it } from "vitest";

const { isAllowedExternalUrl } = require("../../desktop/security.cjs") as { isAllowedExternalUrl: (value: string) => boolean };

describe("política de navegação desktop", () => {
  it("permite apenas destinos web explícitos para o navegador do sistema", () => {
    expect(isAllowedExternalUrl("https://example.com/guia")).toBe(true);
    expect(isAllowedExternalUrl("http://127.0.0.1:43819/")).toBe(true);
  });

  it("recusa esquemas executáveis ou inválidos", () => {
    expect(isAllowedExternalUrl("javascript:alert(1)")).toBe(false);
    expect(isAllowedExternalUrl("file:///tmp/local.html")).toBe(false);
    expect(isAllowedExternalUrl("steam://run/730")).toBe(false);
    expect(isAllowedExternalUrl("not a url")).toBe(false);
  });
});
