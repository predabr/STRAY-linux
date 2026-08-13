import { describe, expect, it } from "vitest";
import { explainCompatibilityMatch, rankCompatibilityRecord } from "./compatibility";

const record = {
  gameVersion: "1.4.2",
  distributionId: 7,
  distributionVersionId: null,
  cpuId: 10,
  gpuId: 11,
  kernelConstraint: "6.12",
  driverConstraint: "570.86",
  protonVersion: "Proton 9",
  wineVersion: null,
  runtimeVersion: null,
} as Parameters<typeof rankCompatibilityRecord>[0];

describe("motor de compatibilidade", () => {
  it("marca como exato somente quando todos os critérios declarados correspondem", () => {
    const result = rankCompatibilityRecord(record, { gameId: 1, gameVersion: "1.4.2", distributionId: 7, cpuId: 10, gpuId: 11, kernelVersion: "6.12", driverVersion: "570.86", protonVersion: "Proton 9" });
    expect(result.classification).toBe("exact");
    expect(result.coverage).toBe(100);
  });

  it("mantém a correspondência parcial quando o ambiente não informa todos os critérios", () => {
    const result = rankCompatibilityRecord(record, { gameId: 1, gameVersion: "1.4.2", distributionId: 7, gpuId: 11 });
    expect(result.classification).toBe("partial");
    expect(result.missingFactors).toContain("CPU");
    expect(result.coverage).toBeGreaterThan(0);
    expect(result.coverage).toBeLessThan(100);
  });

  it("expõe conflitos em vez de transformar um registro incompatível em previsão", () => {
    const result = rankCompatibilityRecord(record, { gameId: 1, gameVersion: "1.4.2", distributionId: 7, cpuId: 10, gpuId: 99, kernelVersion: "6.12", driverVersion: "570.86", protonVersion: "Proton 9" });
    expect(result.classification).toBe("conflict");
    expect(result.conflictingFactors).toContain("GPU");
  });

  it("separa o nível publicado da cobertura do ambiente e expõe fatores auditáveis", () => {
    const ranked = rankCompatibilityRecord({ ...record, level: "excellent", provenance: "verified", confidence: "high", sourceUrl: "https://source.example/record", reviewedAt: new Date("2026-08-13T00:00:00.000Z") } as Parameters<typeof rankCompatibilityRecord>[0], { gameId: 1, gameVersion: "1.4.2", distributionId: 7, cpuId: 10, gpuId: 11, kernelVersion: "6.12", driverVersion: "570.86", protonVersion: "Proton 9" });
    const explanation = explainCompatibilityMatch(ranked);
    expect(explanation.result).toBe("excellent");
    expect(explanation.environmentCoverage).toBe(100);
    expect(explanation.factors).toEqual(expect.arrayContaining([expect.objectContaining({ label: "GPU", state: "match" })]));
    expect(explanation.limitations).toEqual([]);
  });
});
