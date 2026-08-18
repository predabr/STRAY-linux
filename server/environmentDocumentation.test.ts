import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const documentation = readFileSync("docs/ENVIRONMENT.md", "utf8");

describe("documentação de ambiente", () => {
  it("cobre configurações críticas por escopo sem publicar dados financeiros", () => {
    for (const key of ["DATABASE_URL", "BUILT_IN_FORGE_API_KEY", "STEAM_WEB_API_KEY", "PIX_STATIC_KEY", "PIX_MERCHANT_NAME", "PIX_MERCHANT_CITY", "DESKTOP_DATA_DIR"]) {
      expect(documentation).toContain(key);
    }
    expect(documentation).not.toContain("[REMOVIDO]");
  });
});
