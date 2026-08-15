import { describe, expect, it } from "vitest";
import { scannerReportInput, scannerReportToProfile } from "./lib/scannerReport";
import { assessLinuxGamingEnvironment } from "./lib/linuxHealth";

const report = {
  schemaVersion: 1,
  scannerVersion: "1.0.0",
  generatedAt: "2026-08-13T22:00:00.000Z",
  system: {
    distribution: { id: "arch", name: "Arch Linux", version: null },
    kernelVersion: "6.12.1-arch1-1",
    cpu: { model: "AMD Ryzen 5 5600" },
    gpu: { model: "AMD Radeon RX 7600", vramMb: 8192 },
    memoryGb: 24,
    graphics: { driverVersion: "Mesa 26.2.0", mesaVersion: "26.2.0", vulkanVersion: "1.4.0", openGlVersion: "4.6" },
    runtime: { wineVersion: "wine-10.0", protonVersion: null, steamDetected: true },
  },
};

describe("contrato do stray-scan", () => {
  it("aceita somente a telemetria técnica minimizada e converte para um perfil", () => {
    const parsed = scannerReportInput.parse(report);
    expect(scannerReportToProfile(parsed)).toMatchObject({ detectedCpu: "AMD Ryzen 5 5600", detectedGpu: "AMD Radeon RX 7600", detectedRamGb: 24, detectedDistribution: "Arch Linux", kernelVersion: "6.12.1-arch1-1" });
  });

  it("rejeita campos não permitidos como hostname, usuário ou identificador de máquina", () => {
    expect(() => scannerReportInput.parse({ ...report, hostname: "não-permitido" })).toThrow();
    expect(() => scannerReportInput.parse({ ...report, system: { ...report.system, serialNumber: "não-permitido" } })).toThrow();
  });

  it("aceita ambiente, armazenamento e monitores opcionais sem ampliar dados pessoais", () => {
    const parsed = scannerReportInput.parse({ ...report, scannerVersion: "1.3.0", system: { ...report.system, architecture: "x86_64", desktopEnvironment: "KDE", cpu: { model: "AMD Ryzen 5 5600", architecture: "x86_64", physicalCores: 6, logicalCores: 12, maxMhz: 4400 }, gpu: { model: "AMD Radeon RX 7600", vendor: "AMD", vramMb: 8192, driverVersion: null, adapters: [{ model: "AMD Radeon RX 7600", vendor: "AMD", vramMb: 8192, driverVersion: null }] }, storage: { filesystem: "/dev/nvme0n1p2", mount: "/", totalGb: 1024, usedGb: 530 }, displays: [{ name: "DP-1", resolution: "2560×1440", refreshHz: 144 }], graphics: { ...report.system.graphics, driverProvider: "mesa/glxinfo", openGlRenderer: "AMD Radeon", vulkanSummaryAvailable: true, glxInfoAvailable: true }, runtime: { ...report.system.runtime, protonTools: ["GE-Proton10"], steamInstallKinds: ["native"], installedGameCount: 42, discovery: { heroicDetected: true, heroicInstallKinds: ["native"], heroicInstalledGameCount: 3, winePrefixes: { detected: true, knownPrefixCount: 1, sources: ["wine-default"] }, protonPrefixes: { detected: true, knownPrefixCount: 2, sources: ["steam-compatdata"] } } } } });
    expect(parsed.system.storage?.totalGb).toBe(1024);
    expect(parsed.system.displays?.[0]?.resolution).toBe("2560×1440");
    expect(parsed.system.runtime.installedGameCount).toBe(42);
    expect(parsed.system.runtime.discovery?.heroicInstalledGameCount).toBe(3);
    expect(parsed.system.runtime.discovery?.protonPrefixes.knownPrefixCount).toBe(2);
    expect(parsed.system.cpu.logicalCores).toBe(12);
    expect(parsed.system.gpu.adapters?.[0]?.vramMb).toBe(8192);
    expect(scannerReportToProfile(parsed).scanDetails).toMatchObject({ architecture: "x86_64", graphics: { openGlRenderer: "AMD Radeon" }, runtime: { protonTools: ["GE-Proton10"] } });
    expect(() => scannerReportInput.parse({ ...parsed, system: { ...parsed.system, username: "não-permitido" } })).toThrow();
  });

  it("produz diagnóstico explicável sem atribuir causa não verificada", () => {
    const parsed = scannerReportInput.parse({ ...report, system: { ...report.system, graphics: { ...report.system.graphics, vulkanVersion: null, mesaVersion: null }, runtime: { ...report.system.runtime, steamDetected: false, gaming: { sessionType: "wayland", waylandDetected: true, x11Detected: false, vulkanToolsDetected: false, gameModeDetected: false, gameModeServiceActive: null, mangoHudDetected: false, gamescopeDetected: false, flatpakDetected: true, renderGroupDetected: false } } } });
    const findings = assessLinuxGamingEnvironment(parsed);
    expect(findings.map((finding) => finding.id)).toEqual(expect.arrayContaining(["steam-not-detected", "vulkan-not-verified", "render-permission-not-detected"]));
    expect(findings.every((finding) => finding.recommendedAction.length > 20)).toBe(true);
  });
});
