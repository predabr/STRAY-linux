import type { ScannerReport } from "../../../server/lib/scannerReport";

export type ConfigurationComparisonRow = { label: string; before: string; after: string; status: "changed" | "unchanged" | "unknown" };

function normalized(value: string | null | undefined) { return value?.trim() || null; }

export function compareConfigurations(before: ScannerReport, after: ScannerReport): ConfigurationComparisonRow[] {
  const values = (scan: ScannerReport) => ({
    "Distribuição": [scan.system.distribution.name, scan.system.distribution.version].filter(Boolean).join(" ") || null,
    "Kernel": scan.system.kernelVersion,
    "Desktop": scan.system.desktopEnvironment,
    "GPU": scan.system.gpu.model,
    "Driver": scan.system.graphics.driverVersion,
    "Mesa": scan.system.graphics.mesaVersion,
    "Vulkan": scan.system.graphics.vulkanVersion,
    "Proton": scan.system.runtime.protonVersion,
    "Wine": scan.system.runtime.wineVersion,
    "Wayland / X11": scan.system.runtime.gaming?.sessionType || (scan.system.runtime.gaming?.waylandDetected ? "Wayland" : scan.system.runtime.gaming?.x11Detected ? "X11" : null),
    "GameMode": scan.system.runtime.gaming?.gameModeDetected ? scan.system.runtime.gaming.gameModeServiceActive === false ? "detectado; serviço inativo" : "detectado" : null,
    "Gamescope": scan.system.runtime.gaming?.gamescopeDetected ? "detectado" : null,
    "Resolução": scan.system.displays?.map((display) => display.resolution).filter(Boolean).join(" · ") || null,
    "Preset": null,
  });
  const first = values(before);
  const second = values(after);
  return Object.keys(first).map((label) => {
    const beforeValue = normalized(first[label as keyof typeof first]);
    const afterValue = normalized(second[label as keyof typeof second]);
    return { label, before: beforeValue || "Não informado", after: afterValue || "Não informado", status: beforeValue === null || afterValue === null ? "unknown" : beforeValue === afterValue ? "unchanged" : "changed" };
  });
}
