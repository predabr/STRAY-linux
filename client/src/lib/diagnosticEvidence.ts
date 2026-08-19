import type { ScannerReport } from "../../../shared/scannerReport";

export type DiagnosticEvidenceGap = {
  id: "distribution" | "cpu" | "gpu" | "memory" | "graphics" | "vulkan" | "opengl";
  label: string;
};

export function getDiagnosticEvidenceGaps(report: ScannerReport): DiagnosticEvidenceGap[] {
  const { system } = report;
  const gaps: DiagnosticEvidenceGap[] = [];
  const add = (id: DiagnosticEvidenceGap["id"], label: string) => gaps.push({ id, label });

  if (!system.distribution.name && !system.distribution.id) add("distribution", "Distribuição");
  if (!system.cpu.model) add("cpu", "CPU");
  if (!system.gpu.model) add("gpu", "GPU");
  if (system.memoryGb === null) add("memory", "Memória");
  if (!system.graphics.driverVersion && !system.graphics.mesaVersion) add("graphics", "Driver gráfico");
  if (!system.graphics.vulkanVersion) add("vulkan", "Vulkan");
  if (!system.graphics.openGlVersion) add("opengl", "OpenGL");

  return gaps;
}
