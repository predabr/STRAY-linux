import { describe, expect, it } from "vitest";
import { scannerReportInput } from "./scannerReport";

describe("scannerReportInput", () => {
  it("aceita campos Vulkan minimizados e não exige extensões nem dados identificáveis", () => {
    const report = scannerReportInput.parse({
      schemaVersion: 1,
      scannerVersion: "1.4.0",
      generatedAt: "2026-08-15T15:00:00.000Z",
      system: {
        distribution: { id: "arch", name: "Arch Linux", version: null },
        kernelVersion: "6.16.0",
        cpu: { model: "CPU observada" },
        gpu: { model: "GPU observada", vramMb: null },
        memoryGb: 16,
        graphics: { driverVersion: "Mesa 25.1", mesaVersion: "25.1", vulkanVersion: "1.3.280", vulkanApiVersion: "1.3.280", vulkanDeviceName: "GPU observada", vulkanDriverName: "Mesa", vulkanDeviceCount: 1, openGlVersion: null },
        runtime: { wineVersion: null, protonVersion: null, steamDetected: false },
      },
    });

    expect(report.system.graphics.vulkanDeviceName).toBe("GPU observada");
    expect(report.system.graphics.vulkanDeviceCount).toBe(1);
    expect(JSON.stringify(report)).not.toContain("extensions");
  });
});
