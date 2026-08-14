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
    const parsed = scannerReportInput.parse({ ...report, scannerVersion: "1.1.0", system: { ...report.system, desktopEnvironment: "KDE", storage: { filesystem: "/dev/nvme0n1p2", mount: "/", totalGb: 1024, usedGb: 530 }, displays: [{ name: "DP-1", resolution: "2560×1440", refreshHz: 144 }], runtime: { ...report.system.runtime, installedGameCount: 42 } } });
    expect(parsed.system.storage?.totalGb).toBe(1024);
    expect(parsed.system.displays?.[0]?.resolution).toBe("2560×1440");
    expect(parsed.system.runtime.installedGameCount).toBe(42);
    expect(() => scannerReportInput.parse({ ...parsed, system: { ...parsed.system, username: "não-permitido" } })).toThrow();
  });

  it("produz diagnóstico explicável sem atribuir causa não verificada", () => {
    const parsed = scannerReportInput.parse({ ...report, system: { ...report.system, graphics: { ...report.system.graphics, vulkanVersion: null, mesaVersion: null }, runtime: { ...report.system.runtime, steamDetected: false, gaming: { sessionType: "wayland", waylandDetected: true, x11Detected: false, vulkanToolsDetected: false, gameModeDetected: false, gameModeServiceActive: null, mangoHudDetected: false, gamescopeDetected: false, flatpakDetected: true, renderGroupDetected: false } } } });
    const findings = assessLinuxGamingEnvironment(parsed);
    expect(findings.map((finding) => finding.id)).toEqual(expect.arrayContaining(["steam-not-detected", "vulkan-not-verified", "render-permission-not-detected"]));
    expect(findings.every((finding) => finding.recommendedAction.length > 20)).toBe(true);
  });
});
