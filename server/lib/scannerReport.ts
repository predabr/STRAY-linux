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
    architecture: nullableText.optional(),
    cpu: z.object({ model: nullableText, architecture: nullableText.optional(), logicalCores: z.number().int().min(1).max(10_000).nullable().optional(), physicalCores: z.number().int().min(1).max(10_000).nullable().optional(), maxMhz: z.number().int().min(1).max(20_000).nullable().optional() }).strict(),
    gpu: z.object({ model: nullableText, vendor: nullableText.optional(), vramMb: z.number().int().min(0).max(1_000_000).nullable(), driverVersion: nullableText.optional(), adapters: z.array(z.object({ model: nullableText, vendor: nullableText, vramMb: z.number().int().min(0).max(1_000_000).nullable(), driverVersion: nullableText }).strict()).max(4).optional() }).strict(),
    memoryGb: z.number().int().min(0).max(1_000_000).nullable(),
    storage: z.object({ filesystem: nullableText, mount: nullableText, totalGb: z.number().int().min(0).max(1_000_000).nullable(), usedGb: z.number().int().min(0).max(1_000_000).nullable() }).strict().nullable().optional(),
    displays: z.array(z.object({ name: nullableText, resolution: nullableText, refreshHz: z.number().min(0).max(1_000).nullable() }).strict()).max(8).optional(),
    controllers: z.object({ detected: z.boolean(), devices: z.array(z.object({ id: nullableText, name: nullableText, path: nullableText }).strict()).max(16), source: nullableText }).strict().optional(),
    graphics: z.object({ driverVersion: nullableText, driverProvider: nullableText.optional(), mesaVersion: nullableText, vulkanVersion: nullableText, vulkanApiVersion: nullableText.optional(), vulkanDeviceName: nullableText.optional(), vulkanDriverName: nullableText.optional(), vulkanDeviceCount: z.number().int().min(0).max(16).optional(), openGlVersion: nullableText, openGlRenderer: nullableText.optional(), vulkanSummaryAvailable: z.boolean().optional(), glxInfoAvailable: z.boolean().optional() }).strict(),
    runtime: z.object({ wineVersion: nullableText, protonVersion: nullableText, protonTools: z.array(z.string().trim().min(1).max(255)).max(12).optional(), steamDetected: z.boolean(), steamInstallKinds: z.array(z.enum(["native", "flatpak"])).max(2).optional(), installedGameCount: z.number().int().min(0).max(100_000).optional(), discovery: z.object({ heroicDetected: z.boolean(), heroicInstallKinds: z.array(z.enum(["native", "flatpak"])).max(2), heroicInstalledGameCount: z.number().int().min(0).max(100_000), winePrefixes: z.object({ detected: z.boolean(), knownPrefixCount: z.number().int().min(0).max(10_000), sources: z.array(z.enum(["wine-default", "wineprefixes"])).max(2) }).strict(), protonPrefixes: z.object({ detected: z.boolean(), knownPrefixCount: z.number().int().min(0).max(10_000), sources: z.array(z.literal("steam-compatdata")).max(1) }).strict() }).strict().optional(), gaming: z.object({ sessionType: nullableText, waylandDetected: z.boolean(), x11Detected: z.boolean(), vulkanToolsDetected: z.boolean(), gameModeDetected: z.boolean(), gameModeServiceActive: z.boolean().nullable(), mangoHudDetected: z.boolean(), gamescopeDetected: z.boolean(), vkBasaltDetected: z.boolean().optional(), winetricksDetected: z.boolean().optional(), flatpakDetected: z.boolean(), renderGroupDetected: z.boolean() }).strict().optional() }).strict(),
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
    scanDetails: {
      architecture: report.system.architecture ?? report.system.cpu.architecture ?? null,
      cpu: report.system.cpu,
      gpu: report.system.gpu,
      memoryGb: report.system.memoryGb,
      storage: report.system.storage ?? null,
      displays: report.system.displays ?? [],
      graphics: report.system.graphics,
      runtime: report.system.runtime,
      desktopEnvironment: report.system.desktopEnvironment ?? null,
    },
  };
}
