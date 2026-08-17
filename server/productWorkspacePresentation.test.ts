import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");

describe("shell visual do aplicativo", () => {
  it("mantém navegação lateral técnica com estado ativo explícito", () => {
    const component = fs.readFileSync(path.join(projectRoot, "client/src/components/platform/ProductWorkspace.tsx"), "utf8");
    const navItem = fs.readFileSync(path.join(projectRoot, "client/src/components/platform/WorkspaceNavItem.tsx"), "utf8");
    const status = fs.readFileSync(path.join(projectRoot, "client/src/components/platform/WorkspaceStatus.tsx"), "utf8");
    const styles = fs.readFileSync(path.join(projectRoot, "client/src/index.css"), "utf8");
    const workspaceStyles = fs.readFileSync(path.join(projectRoot, "client/src/styles/workspace.css"), "utf8");

    expect(component).toContain("WorkspaceNavItem");
    expect(navItem).toContain("product-rail-link-active");
    expect(status).toContain("product-rail-status");
    expect(workspaceStyles).toContain(".product-rail-link-active");
    expect(styles).toContain(".product-rail-status-dot");
  });
});
