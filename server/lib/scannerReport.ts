import { z } from "zod";

const nullableText = z.string().trim().min(1).max(255).nullable();

export const scannerReportInput = z.object({
  schemaVersion: z.literal(1),
  scannerVersion: z.string().trim().min(1).max(80),
  generatedAt: z.string().datetime({ offset: true }),
  system: z.object({
    distribution: z.object({ id: nullableText, name: nullableText, version: nullableText }).strict(),
    kernelVersion: nullableText,
    desktopEnvironment: nullableText.optional(),
    cpu: z.object({ model: nullableText }).strict(),
    gpu: z.object({ model: nullableText, vramMb: z.number().int().min(0).max(1_000_000).nullable() }).strict(),
    memoryGb: z.number().int().min(0).max(1_000_000).nullable(),
    storage: z.object({ filesystem: nullableText, mount: nullableText, totalGb: z.number().int().min(0).max(1_000_000).nullable(), usedGb: z.number().int().min(0).max(1_000_000).nullable() }).strict().nullable().optional(),
    displays: z.array(z.object({ name: nullableText, resolution: nullableText, refreshHz: z.number().min(0).max(1_000).nullable() }).strict()).max(8).optional(),
    graphics: z.object({ driverVersion: nullableText, mesaVersion: nullableText, vulkanVersion: nullableText, openGlVersion: nullableText }).strict(),
    runtime: z.object({ wineVersion: nullableText, protonVersion: nullableText, steamDetected: z.boolean(), installedGameCount: z.number().int().min(0).max(100_000).optional(), gaming: z.object({ sessionType: nullableText, waylandDetected: z.boolean(), x11Detected: z.boolean(), vulkanToolsDetected: z.boolean(), gameModeDetected: z.boolean(), gameModeServiceActive: z.boolean().nullable(), mangoHudDetected: z.boolean(), gamescopeDetected: z.boolean(), flatpakDetected: z.boolean(), renderGroupDetected: z.boolean() }).strict().optional() }).strict(),
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
