import { z } from "zod";

const nullableText = z.string().trim().min(1).max(255).nullable();

export const scannerReportInput = z.object({
  schemaVersion: z.literal(1),
  scannerVersion: z.string().trim().min(1).max(80),
  generatedAt: z.string().datetime({ offset: true }),
  system: z.object({
    distribution: z.object({ id: nullableText, name: nullableText, version: nullableText }).strict(),
    kernelVersion: nullableText,
    cpu: z.object({ model: nullableText }).strict(),
    gpu: z.object({ model: nullableText, vramMb: z.number().int().min(0).max(1_000_000).nullable() }).strict(),
    memoryGb: z.number().int().min(0).max(1_000_000).nullable(),
    graphics: z.object({ driverVersion: nullableText, mesaVersion: nullableText, vulkanVersion: nullableText, openGlVersion: nullableText }).strict(),
    runtime: z.object({ wineVersion: nullableText, protonVersion: nullableText, steamDetected: z.boolean() }).strict(),
  }).strict(),
}).strict();

export type ScannerReport = z.infer<typeof scannerReportInput>;

export function scannerReportToProfile(report: ScannerReport) {
  const distribution = [report.system.distribution.name, report.system.distribution.version].filter(Boolean).join(" ") || null;
  return {
    kernelVersion: report.system.kernelVersion,
    driverVersion: report.system.graphics.driverVersion,
    protonVersion: report.system.runtime.protonVersion,
    wineVersion: report.system.runtime.wineVersion,
    detectedCpu: report.system.cpu.model,
    detectedGpu: report.system.gpu.model,
    detectedRamGb: report.system.memoryGb,
    detectedDistribution: distribution,
    scannerVersion: report.scannerVersion,
    scannedAt: new Date(report.generatedAt),
  };
}
