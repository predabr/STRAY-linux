import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync("client/src/pages/Sync.tsx", "utf8");

describe("sincronização de preferências", () => {
  it("comunica persistência, falha e reversão de estado", () => {
    expect(source).toContain("Preferência salva na conta.");
    expect(source).toContain("Não foi possível salvar. A alteração foi desfeita.");
    expect(source).toContain("localStorage.setItem(key, JSON.stringify(previous))");
    expect(source).toContain("Atualizar preferências da conta");
  });
});
