export type SystemGraphScan = {
  system: {
    distribution: { name: string | null; version: string | null };
    kernelVersion: string | null;
    desktopEnvironment?: string | null;
    gpu: { model: string | null; driverVersion?: string | null };
    graphics: { driverVersion: string | null; mesaVersion: string | null; vulkanVersion: string | null; vulkanApiVersion?: string | null; vulkanDeviceName?: string | null; vulkanDriverName?: string | null; vulkanDeviceCount?: number; vulkanSummaryAvailable?: boolean };
    runtime: { wineVersion: string | null; protonVersion: string | null; steamDetected: boolean; installedGameCount?: number; discovery?: { heroicDetected: boolean; heroicInstalledGameCount: number }; gaming?: { sessionType: string | null; waylandDetected: boolean; x11Detected: boolean; vulkanToolsDetected: boolean; gameModeDetected: boolean; gameModeServiceActive: boolean | null; mangoHudDetected: boolean; gamescopeDetected: boolean; renderGroupDetected: boolean } };
  };
};

export type SystemGraphNode = { id: string; label: string; value: string; state: "observed" | "not-detected" | "unknown" };

const observed = (value: string | number | null | undefined): SystemGraphNode["state"] => value === null || value === undefined || value === "" ? "unknown" : "observed";

export function buildSystemGraph(scan: SystemGraphScan) {
  const graphics = scan.system.graphics;
  const runtime = scan.system.runtime;
  const gaming = runtime.gaming;
  const nodes: SystemGraphNode[] = [
    { id: "pc", label: "PC", value: [scan.system.distribution.name, scan.system.distribution.version].filter(Boolean).join(" ") || "Não informado", state: observed(scan.system.distribution.name) },
    { id: "gpu", label: "GPU", value: scan.system.gpu.model || "Não detectada", state: observed(scan.system.gpu.model) },
    { id: "driver", label: "Driver", value: graphics.driverVersion || scan.system.gpu.driverVersion || "Não informado", state: observed(graphics.driverVersion || scan.system.gpu.driverVersion) },
    { id: "mesa", label: "Mesa", value: graphics.mesaVersion ? `Mesa ${graphics.mesaVersion}` : "Não informado", state: observed(graphics.mesaVersion) },
    { id: "vulkan", label: "Vulkan", value: graphics.vulkanVersion ? `Instância ${graphics.vulkanVersion}` : "Não detectado", state: graphics.vulkanVersion ? "observed" : graphics.vulkanSummaryAvailable ? "unknown" : "not-detected" },
    { id: "kernel", label: "Kernel", value: scan.system.kernelVersion || "Não informado", state: observed(scan.system.kernelVersion) },
    { id: "desktop", label: "Desktop", value: scan.system.desktopEnvironment || "Não informado", state: observed(scan.system.desktopEnvironment) },
    { id: "session", label: "Wayland / X11", value: gaming?.sessionType || (gaming?.waylandDetected ? "Wayland" : gaming?.x11Detected ? "X11" : "Não detectado"), state: gaming?.waylandDetected || gaming?.x11Detected ? "observed" : "not-detected" },
    { id: "steam", label: "Steam", value: runtime.steamDetected ? `${runtime.installedGameCount ?? 0} instalação(ões) detectada(s)` : "Não detectado", state: runtime.steamDetected ? "observed" : "not-detected" },
    { id: "heroic", label: "Heroic", value: runtime.discovery?.heroicDetected ? `${runtime.discovery.heroicInstalledGameCount} instalação(ões) detectada(s)` : "Não detectado", state: runtime.discovery?.heroicDetected ? "observed" : "not-detected" },
    { id: "wine", label: "Wine", value: runtime.wineVersion || "Não informado", state: observed(runtime.wineVersion) },
    { id: "proton", label: "Proton", value: runtime.protonVersion || "Não informado", state: observed(runtime.protonVersion) },
    { id: "games", label: "Jogos", value: runtime.installedGameCount === undefined ? "Não informado" : `${runtime.installedGameCount} Steam detectado(s)`, state: runtime.installedGameCount === undefined ? "unknown" : "observed" },
  ];
  const edges = [["pc", "gpu"], ["gpu", "driver"], ["driver", "mesa"], ["mesa", "vulkan"], ["pc", "kernel"], ["pc", "desktop"], ["desktop", "session"], ["vulkan", "proton"], ["proton", "games"], ["steam", "proton"], ["heroic", "wine"]] as const;
  return { nodes, edges };
}

export function driverHealth(scan: SystemGraphScan) {
  const gaming = scan.system.runtime.gaming;
  return [
    { label: "GPU detectada", state: scan.system.gpu.model ? "pass" : "unknown", detail: scan.system.gpu.model || "O Scanner não localizou uma GPU." },
    { label: "Driver informado", state: scan.system.graphics.driverVersion || scan.system.gpu.driverVersion ? "pass" : "unknown", detail: scan.system.graphics.driverVersion || scan.system.gpu.driverVersion || "Nenhuma versão foi obtida." },
    { label: "Vulkan disponível", state: scan.system.graphics.vulkanVersion ? "pass" : scan.system.graphics.vulkanSummaryAvailable ? "unknown" : "warning", detail: scan.system.graphics.vulkanVersion ? `Instância ${scan.system.graphics.vulkanVersion} observada.` : "O resumo Vulkan não informou uma versão." },
    { label: "Grupo de renderização", state: gaming?.renderGroupDetected ? "pass" : gaming ? "warning" : "unknown", detail: gaming?.renderGroupDetected ? "Grupo render ou video observado." : gaming ? "Nenhum grupo render/video foi observado." : "Sessão gráfica não disponível no relatório." },
  ] as const;
}
