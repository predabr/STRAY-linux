import { z } from "zod";

const MAX_EVIDENCE_IMAGE_BYTES = 5 * 1024 * 1024;

export const benchmarkEvidenceImageInput = z.object({
  mimeType: z.enum(["image/png", "image/jpeg", "image/webp"]),
  dataBase64: z.string().min(8).max(8 * 1024 * 1024).regex(/^[A-Za-z0-9+/]+={0,2}$/, "A captura deve ser codificada em Base64 puro."),
});

function hasExpectedSignature(bytes: Buffer, mimeType: z.infer<typeof benchmarkEvidenceImageInput>["mimeType"]) {
  if (mimeType === "image/png") return bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (mimeType === "image/jpeg") return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  return bytes.length >= 12 && bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP";
}

export function decodeBenchmarkEvidenceImage(input: z.infer<typeof benchmarkEvidenceImageInput>) {
  const bytes = Buffer.from(input.dataBase64, "base64");
  if (!bytes.length || bytes.length > MAX_EVIDENCE_IMAGE_BYTES) throw new Error("A captura precisa ter até 5 MB.");
  if (!hasExpectedSignature(bytes, input.mimeType)) throw new Error("O conteúdo da captura não corresponde ao tipo de imagem declarado.");
  const extension = input.mimeType === "image/png" ? "png" : input.mimeType === "image/jpeg" ? "jpg" : "webp";
  return { bytes, extension };
}
