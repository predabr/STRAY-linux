import { describe, expect, it } from "vitest";
import { compareConfigurations } from "./snapshotComparison";

const base = { schemaVersion: 1 as const, scannerVersion: "1.4.0", generatedAt: "2026-08-15T15:00:00.000Z", system: { distribution: { id: "arch", name: "Arch", version: null }, kernelVersion: "6.16", cpu: { model: "CPU" }, gpu: { model: "GPU", vramMb: null }, memoryGb: 16, graphics: { driverVersion: "Mesa 25", mesaVersion: "25", vulkanVersion: "1.3", openGlVersion: null }, runtime: { wineVersion: null, protonVersion: "Proton 10", steamDetected: true, gaming: { sessionType: "wayland", waylandDetected: true, x11Detected: false, vulkanToolsDetected: true, gameModeDetected: true, gameModeServiceActive: true, mangoHudDetected: false, gamescopeDetected: false, flatpakDetected: false, renderGroupDetected: true } } } };

describe("comparação de configurações", () => {
  it("distingue mudança, igualdade e ausência de informação", () => {
    const after = { ...base, system: { ...base.system, kernelVersion: "6.17" } };
    const rows = compareConfigurations(base, after);
    expect(rows.find((row) => row.label === "Kernel")).toMatchObject({ status: "changed" });
    expect(rows.find((row) => row.label === "Driver")).toMatchObject({ status: "unchanged" });
    expect(rows.find((row) => row.label === "Preset")).toMatchObject({ status: "unknown" });
  });
});
