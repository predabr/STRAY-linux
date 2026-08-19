import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath: string) => fs.readFileSync(path.join(root, relativePath), "utf8");

describe("runbook LinuxFix", () => {
  it("expõe pré-requisitos, risco, verificação e reversão sem prometer reversibilidade ausente", () => {
    const page = read("client/src/pages/Knowledge.tsx");
    const metadata = read("client/src/i18n/linuxFixStepMetadata.ts");
    expect(page).toContain("linuxFixStepMetadata");
    expect(page).toContain("metadata.prerequisite");
    expect(page).toContain("metadata.noRollback");
    expect(page).toContain("solution.verification");
    expect(page).toContain("solution.rollback");
    expect(metadata).toContain('"pt-BR"');
    expect(metadata).toContain('"zh-CN"');
    expect(metadata).toContain("byKind");
  });
});
