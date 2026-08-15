import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");

describe("biblioteca local", () => {
  it("filtra fontes locais sem alegar que elas foram sincronizadas da rede", () => {
    const component = fs.readFileSync(path.join(projectRoot, "client/src/pages/Library.tsx"), "utf8");
    expect(component).toContain("sourceFilter");
    expect(component).toContain("sourceCounts");
    expect(component).toContain("Steam");
    expect(component).toContain("Heroic");
    expect(component).toContain("Nenhuma informação é enviada à rede.");
    expect(component).not.toContain("biblioteca sincronizada");
  });
});
