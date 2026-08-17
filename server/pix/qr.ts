import QRCode from "qrcode";

export async function renderPixQrSvg(brCode: string) {
  return QRCode.toString(brCode, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 1,
    width: 176,
    color: { dark: "#050a16", light: "#ffffff" },
  });
}
