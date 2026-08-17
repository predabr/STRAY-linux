import { describe, expect, it } from "vitest";
import { buildStaticPixStatus } from "./support";

describe("contrato público de apoio Pix", () => {
  it("não expõe QR, payload ou chave quando a configuração de servidor está ausente", async () => {
    await expect(buildStaticPixStatus({ pixStaticKey: "", pixMerchantName: "", pixMerchantCity: "", pixTransactionId: "" } as never)).resolves.toEqual({ mode: "unavailable", reason: "missing-server-configuration" });
  });

  it("retorna apenas QR SVG quando o BR Code é montado no servidor", async () => {
    const result = await buildStaticPixStatus({ pixStaticKey: "teste@example.com", pixMerchantName: "Stray Linux", pixMerchantCity: "Brasilia", pixTransactionId: "STRAY120" } as never);
    expect(result.mode).toBe("static");
    if (result.mode !== "static") return;
    expect(result.qrCodeSvg).toContain("<svg");
    expect(result.qrCodeSvg).not.toContain("teste@example.com");
    expect(JSON.stringify(result)).not.toContain("BR.GOV.BCB.PIX");
  });
});
