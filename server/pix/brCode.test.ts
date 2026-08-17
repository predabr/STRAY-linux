import { describe, expect, it } from "vitest";
import { acceptVerifiedPixWebhook } from "./paymentContracts";
import { buildStaticPixBrCode, validatePixBrCode } from "./brCode";
import { renderPixQrSvg } from "./qr";

describe("BR Code Pix", () => {
  it("gera e valida um payload estático com CRC16-CCITT", () => {
    const brCode = buildStaticPixBrCode({ key: "teste@example.com", merchantName: "Stray Linux", merchantCity: "Brasilia", transactionId: "STRAY120" });
    expect(brCode).toContain("BR.GOV.BCB.PIX");
    expect(brCode).toContain("6304");
    expect(validatePixBrCode(brCode)).toBe(true);
    expect(validatePixBrCode(`${brCode.slice(0, -1)}0`)).toBe(false);
  });

  it("não aceita confirmação duplicada em um fluxo de webhook já verificado", async () => {
    const processed = new Set<string>();
    const store = { hasProcessed: async (id: string) => processed.has(id), markProcessed: async (id: string) => { processed.add(id); } };
    await expect(acceptVerifiedPixWebhook({ providerEventId: "evt-1", providerChargeId: "charge-1", status: "confirmed" }, store)).resolves.toEqual({ accepted: true, chargeId: "charge-1" });
    await expect(acceptVerifiedPixWebhook({ providerEventId: "evt-1", providerChargeId: "charge-1", status: "confirmed" }, store)).resolves.toEqual({ accepted: false, reason: "duplicate" });
  });

  it("renderiza um QR SVG a partir do payload sem inserir a chave como texto no SVG", async () => {
    const brCode = buildStaticPixBrCode({ key: "teste@example.com", merchantName: "Stray Linux", merchantCity: "Brasilia" });
    const svg = await renderPixQrSvg(brCode);
    expect(svg).toContain("<svg");
    expect(svg).toContain("<path");
    expect(svg).not.toContain("teste@example.com");
  });
});
