import { describe, expect, it } from "vitest";
import { groupBenchmarkEvidence } from "../client/src/lib/benchmarkComparison";

describe("groupBenchmarkEvidence", () => {
  it("agrega somente FPS declarados e preserva o contexto de CPU e distribuição", () => {
    const groups = groupBenchmarkEvidence([
      { gpu: "GPU A", cpu: "CPU 1", distribution: "Distro 1", averageFps: 80 },
      { gpu: "GPU A", cpu: "CPU 2", distribution: "Distro 2", averageFps: 100 },
      { gpu: "GPU B", cpu: "CPU 1", distribution: "Distro 1", averageFps: null },
    ]);
    expect(groups).toEqual([{ label: "GPU A", averageFps: 90, sampleSize: 2, cpuLabels: ["CPU 1", "CPU 2"], distributions: ["Distro 1", "Distro 2"] }]);
  });
});
