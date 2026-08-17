import type { ScannerReport } from "../../shared/scannerReport";

export { scannerReportInput, type ScannerReport } from "../../shared/scannerReport";

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
    scanDetails: { architecture: report.system.architecture ?? report.system.cpu.architecture ?? null, cpu: report.system.cpu, gpu: report.system.gpu, memoryGb: report.system.memoryGb, storage: report.system.storage ?? null, displays: report.system.displays ?? [], graphics: report.system.graphics, runtime: report.system.runtime, desktopEnvironment: report.system.desktopEnvironment ?? null },
  };
}
