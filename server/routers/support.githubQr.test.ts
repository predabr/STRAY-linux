import { describe, expect, it } from "vitest";
import { buildGithubQrStatus, STRAY_LINUX_GITHUB_URL } from "./support";

describe("QR institucional do GitHub", () => {
  it("gera um SVG para o repositório oficial sem envolver configuração Pix", async () => {
    const result = await buildGithubQrStatus();
    expect(result.githubUrl).toBe(STRAY_LINUX_GITHUB_URL);
    expect(result.qrCodeSvg).toContain("<svg");
    expect(result.qrCodeSvg).not.toContain("53205895819");
  });
});
