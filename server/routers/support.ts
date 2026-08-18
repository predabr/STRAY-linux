import { ENV } from "../_core/env";
import { publicProcedure, router } from "../_core/trpc";
import { buildStaticPixBrCode, validatePixBrCode } from "../pix/brCode";
import { renderPixQrSvg, renderQrSvg } from "../pix/qr";

export const STRAY_LINUX_GITHUB_URL = "https://github.com/predabr/STRAY-linux";

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

export const buildGithubQrStatus = async () => ({
  githubUrl: STRAY_LINUX_GITHUB_URL,
  qrCodeSvg: await renderQrSvg(STRAY_LINUX_GITHUB_URL, 192),
});

export const supportRouter = router({
  pixStatus: publicProcedure.query(() => buildStaticPixStatus()),
  githubQr: publicProcedure.query(() => buildGithubQrStatus()),
});
