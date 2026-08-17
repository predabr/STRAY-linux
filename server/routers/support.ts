import { ENV } from "../_core/env";
import { publicProcedure, router } from "../_core/trpc";
import { buildStaticPixBrCode, validatePixBrCode } from "../pix/brCode";
import { renderPixQrSvg } from "../pix/qr";

export const buildStaticPixStatus = async (config = ENV) => {
  if (!config.pixStaticKey || !config.pixMerchantName || !config.pixMerchantCity) {
    return { mode: "unavailable" as const, reason: "missing-server-configuration" as const };
  }
  const brCode = buildStaticPixBrCode({
    key: config.pixStaticKey,
    merchantName: config.pixMerchantName,
    merchantCity: config.pixMerchantCity,
    transactionId: config.pixTransactionId || "***",
  });
  if (!validatePixBrCode(brCode)) throw new Error("Falha de validação do BR Code Pix configurado.");
  const qrCodeSvg = await renderPixQrSvg(brCode);
  return { mode: "static" as const, qrCodeSvg, merchantName: config.pixMerchantName };
};

export const supportRouter = router({
  pixStatus: publicProcedure.query(() => buildStaticPixStatus()),
});
