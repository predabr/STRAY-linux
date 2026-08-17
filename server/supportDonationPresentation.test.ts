import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const supportPage = readFileSync("client/src/pages/Support.tsx", "utf8");
const appPage = readFileSync("client/src/pages/ProjectSupport.tsx", "utf8");
const nav = readFileSync("client/src/components/platform/ProductWorkspace.tsx", "utf8");
const paymentSecurity = readFileSync("docs/PAYMENT_SECURITY.md", "utf8");

describe("área de apoio do projeto", () => {
  it("não expõe chave Pix/CPF antes de um checkout autenticado", () => {
    for (const source of [supportPage, appPage]) {
      expect(source).toContain("https://github.com/predabr/STRAY-linux");
      expect(source).toContain("Checkout");
      expect(source).toContain("webhook autenticado");
      expect(source).not.toContain("53205895819");
      expect(source).not.toContain("navigator.clipboard.writeText");
      expect(source).not.toContain("CHAVE PIX");
      expect(source).not.toContain("processPayment");
      expect(source).not.toContain("stripe.confirm");
    }
  });

  it("mantém o acesso destacado na navegação do aplicativo", () => {
    expect(nav).toContain('href: "/project-support"');
    expect(nav).toContain('label: "Apoie o projeto"');
  });

  it("documenta que a ativação exige provedor autorizado e webhook autenticado", () => {
    expect(paymentSecurity).toContain("provedor de pagamentos autorizado");
    expect(paymentSecurity).toContain("assinatura do webhook");
    expect(paymentSecurity).not.toContain("53205895819");
  });
});
