import type { SystemGraphScan } from "./systemGraph";

export type PreflightStatus = "ready" | "warning" | "unknown";
export type PreflightCheck = { id: string; label: string; status: PreflightStatus; detail: string };

export function buildPreflight(scan: SystemGraphScan): PreflightCheck[] {
  const gaming = scan.system.runtime.gaming;
  const storage = (scan.system as SystemGraphScan["system"] & { storage?: { totalGb: number | null; usedGb: number | null } | null }).storage;
  const freeGb = storage?.totalGb !== null && storage?.totalGb !== undefined && storage?.usedGb !== null && storage?.usedGb !== undefined ? storage.totalGb - storage.usedGb : null;
  return [
    { id: "runtime", label: "Runtime", status: scan.system.runtime.protonVersion || scan.system.runtime.wineVersion || scan.system.runtime.steamDetected || scan.system.runtime.discovery?.heroicDetected ? "ready" : "unknown", detail: scan.system.runtime.protonVersion || scan.system.runtime.wineVersion || (scan.system.runtime.steamDetected ? "Steam observado" : scan.system.runtime.discovery?.heroicDetected ? "Heroic observado" : "Nenhum runtime detectável foi informado.") },
    { id: "gpu", label: "GPU", status: scan.system.gpu.model ? "ready" : "unknown", detail: scan.system.gpu.model || "A GPU não foi informada pelo snapshot." },
    { id: "vulkan", label: "Vulkan", status: scan.system.graphics.vulkanVersion ? "ready" : "warning", detail: scan.system.graphics.vulkanVersion ? `Instância ${scan.system.graphics.vulkanVersion} observada.` : "O Scanner não informou uma versão Vulkan." },
    { id: "driver", label: "Driver", status: scan.system.graphics.driverVersion || scan.system.gpu.driverVersion ? "ready" : "unknown", detail: scan.system.graphics.driverVersion || scan.system.gpu.driverVersion || "Nenhuma versão de driver foi observada." },
    { id: "storage", label: "Armazenamento", status: freeGb === null ? "unknown" : freeGb < 10 ? "warning" : "ready", detail: freeGb === null ? "Capacidade livre não foi informada." : `${freeGb} GB livres na montagem observada.` },
    { id: "permissions", label: "Permissões gráficas", status: gaming?.renderGroupDetected ? "ready" : gaming ? "warning" : "unknown", detail: gaming?.renderGroupDetected ? "Grupo render/video observado." : gaming ? "Nenhum grupo render/video foi observado." : "A sessão gráfica não foi informada." },
  ];
}

export function preflightResult(checks: PreflightCheck[]) {
  if (checks.some((check) => check.status === "warning")) return "warning" as const;
  if (checks.some((check) => check.status === "unknown")) return "unknown" as const;
  return "ready" as const;
}
