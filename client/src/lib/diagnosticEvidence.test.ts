import { describe, expect, it } from "vitest";
import { getDiagnosticEvidenceGaps } from "./diagnosticEvidence";
import type { ScannerReport } from "../../../shared/scannerReport";

const report = (overrides: Partial<ScannerReport["system"]> = {}): ScannerReport => ({
  schemaVersion: 1,
  scannerVersion: "test",
  generatedAt: "2026-08-18T12:00:00.000Z",
  system: {
    distribution: { id: "arch", name: "Arch Linux", version: "rolling" },
    kernelVersion: "6.12",
    cpu: { model: "Test CPU" },
    gpu: { model: "Test GPU", vramMb: null },
    memoryGb: 16,
    graphics: { driverVersion: "1", mesaVersion: "25", vulkanVersion: "1.3", openGlVersion: "4.6" },
    runtime: { wineVersion: null, protonVersion: null, steamDetected: false },
    ...overrides,
  },
});

describe("lacunas de evidência do Diagnóstico", () => {
  it("não transforma campos observados em lacunas", () => {
    expect(getDiagnosticEvidenceGaps(report())).toEqual([]);
  });

  it("lista somente campos explicitamente ausentes", () => {
    const incomplete = report({
      distribution: { id: null, name: null, version: null },
      cpu: { model: null },
      gpu: { model: null, vramMb: null },
      memoryGb: null,
      graphics: { driverVersion: null, mesaVersion: null, vulkanVersion: null, openGlVersion: null },
    });

    expect(getDiagnosticEvidenceGaps(incomplete).map((gap) => gap.id)).toEqual([
      "distribution", "cpu", "gpu", "memory", "graphics", "vulkan", "opengl",
    ]);
  });
});
