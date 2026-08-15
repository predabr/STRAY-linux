import { describe, expect, it } from "vitest";
import { buildSystemGraph, driverHealth, type SystemGraphScan } from "./systemGraph";

const scan: SystemGraphScan = { system: { distribution: { name: "Arch Linux", version: null }, kernelVersion: "6.16", desktopEnvironment: "KDE", gpu: { model: "GPU observada" }, graphics: { driverVersion: "Mesa 25", mesaVersion: "25", vulkanVersion: "1.3", vulkanApiVersion: "1.3", vulkanDeviceName: "GPU observada", vulkanDriverName: "Mesa", vulkanDeviceCount: 1, vulkanSummaryAvailable: true }, runtime: { wineVersion: null, protonVersion: "Proton 10", steamDetected: true, installedGameCount: 3, discovery: { heroicDetected: false, heroicInstalledGameCount: 0 }, gaming: { sessionType: "wayland", waylandDetected: true, x11Detected: false, vulkanToolsDetected: true, gameModeDetected: true, gameModeServiceActive: true, mangoHudDetected: false, gamescopeDetected: false, renderGroupDetected: true } } } };

describe("System Graph", () => {
  it("conecta apenas sinais observados e conserva ausência de Wine como desconhecida", () => {
    const graph = buildSystemGraph(scan);
    expect(graph.nodes.find((node) => node.id === "vulkan")).toMatchObject({ state: "observed", value: "Instância 1.3" });
    expect(graph.nodes.find((node) => node.id === "wine")).toMatchObject({ state: "unknown" });
    expect(graph.edges).toContainEqual(["driver", "mesa"]);
    expect(driverHealth(scan).map((check) => check.state)).toEqual(["pass", "pass", "pass", "pass"]);
  });
});
