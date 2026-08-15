import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");

describe("shell visual do aplicativo", () => {
  it("mantém navegação lateral técnica com estado ativo explícito", () => {
    const component = fs.readFileSync(path.join(projectRoot, "client/src/components/platform/ProductWorkspace.tsx"), "utf8");
    const styles = fs.readFileSync(path.join(projectRoot, "client/src/index.css"), "utf8");

    expect(component).toContain("product-rail-link-active");
    expect(component).toContain("product-rail-status");
    expect(styles).toContain(".product-rail-link-active");
    expect(styles).toContain(".product-rail-status-dot");
  });
});
