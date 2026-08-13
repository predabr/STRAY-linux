import { describe, expect, it } from "vitest";
import { benchmarkEvidenceImageInput, decodeBenchmarkEvidenceImage } from "./lib/benchmarkEvidence";

describe("evidência visual de benchmark", () => {
  it("aceita PNG com assinatura coerente", () => {
    const input = benchmarkEvidenceImageInput.parse({ mimeType: "image/png", dataBase64: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]).toString("base64") });
    expect(decodeBenchmarkEvidenceImage(input)).toMatchObject({ extension: "png" });
  });

  it("rejeita conteúdo que simula um tipo MIME diferente", () => {
    const input = benchmarkEvidenceImageInput.parse({ mimeType: "image/png", dataBase64: Buffer.from("not-a-png").toString("base64") });
    expect(() => decodeBenchmarkEvidenceImage(input)).toThrow("não corresponde");
  });
});
