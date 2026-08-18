import QRCode from "qrcode";

export async function renderQrSvg(value: string, width = 176) {
  return QRCode.toString(value, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 1,
    width,
    color: { dark: "#050a16", light: "#ffffff" },
  });
}

export async function renderPixQrSvg(brCode: string) {
  return renderQrSvg(brCode);
}
