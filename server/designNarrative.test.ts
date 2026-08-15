import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");

describe("linguagem autoral de produto", () => {
  it("mantém a landing como interface funcional com narrativa e superfícies próprias", () => {
    const home = fs.readFileSync(path.join(projectRoot, "client/src/pages/Home.tsx"), "utf8");
    const css = fs.readFileSync(path.join(projectRoot, "client/src/index.css"), "utf8");

    expect(home).toContain("stray-story-shell");
    expect(home).toContain("stray-story-preview");
    expect(home).toContain('href="/scanner"');
    expect(home).toContain('href="/assistant"');
    expect(css).toContain(".stray-story-shell");
    expect(css).toContain(".stray-product-section");
    expect(css).toContain("prefers-reduced-motion");
  });
});
