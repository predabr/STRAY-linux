import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const supportPage = readFileSync("client/src/pages/Support.tsx", "utf8");
const appPage = readFileSync("client/src/pages/ProjectSupport.tsx", "utf8");
const nav = readFileSync("client/src/components/platform/ProductWorkspace.tsx", "utf8");

describe("área de apoio do projeto", () => {
  it("expõe Pix e GitHub com confirmação explícita e sem checkout", () => {
    for (const source of [supportPage, appPage]) {
      expect(source).toContain("53205895819");
      expect(source).toContain("https://github.com/predabr/STRAY-linux");
      expect(source).toContain("navigator.clipboard.writeText");
      expect(source).toContain("dado sensível");
      expect(source).not.toContain("processPayment");
      expect(source).not.toContain("stripe.confirm");
    }
  });

  it("mantém o acesso destacado na navegação do aplicativo", () => {
    expect(nav).toContain('href: "/project-support"');
    expect(nav).toContain('label: "Apoie o projeto"');
  });
});
