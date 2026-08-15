import { describe, expect, it } from "vitest";
import { buildPreflight, preflightResult } from "./preflight";
import type { SystemGraphScan } from "./systemGraph";

const scan: SystemGraphScan = { system: { distribution: { name: "Distro", version: null }, kernelVersion: "6.16", gpu: { model: "GPU", driverVersion: "Driver" }, graphics: { driverVersion: "Driver", mesaVersion: null, vulkanVersion: null }, runtime: { wineVersion: null, protonVersion: "Proton", steamDetected: true, gaming: { sessionType: "wayland", waylandDetected: true, x11Detected: false, vulkanToolsDetected: true, gameModeDetected: false, gameModeServiceActive: null, mangoHudDetected: false, gamescopeDetected: false, renderGroupDetected: true } } } };

describe("preflight", () => {
  it("emite aviso para Vulkan não observado sem bloquear nem alegar falha de jogo", () => {
    const checks = buildPreflight(scan);
    expect(checks.find((check) => check.id === "vulkan")).toMatchObject({ status: "warning" });
    expect(preflightResult(checks)).toBe("warning");
  });
});
