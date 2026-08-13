import { describe, expect, it } from "vitest";
import { assertSourceWhenPublishing, benchmarkResultsInput } from "./admin";

describe("validações administrativas críticas", () => {
  it("bloqueia publicação sem fonte nova ou herdada", () => {
    expect(() => assertSourceWhenPublishing("published", null, null)).toThrow("URL de fonte");
    expect(() => assertSourceWhenPublishing("published", undefined, undefined)).toThrow("URL de fonte");
  });

  it("aceita rascunho sem fonte e publicação com fonte atual ou herdada", () => {
    expect(() => assertSourceWhenPublishing("draft", null)).not.toThrow();
    expect(() => assertSourceWhenPublishing("published", "https://source.example/guide")).not.toThrow();
    expect(() => assertSourceWhenPublishing("published", null, "https://source.example/existing")).not.toThrow();
  });

  it("aceita apenas medições de benchmark com resolução, preset e FPS médio válidos", () => {
    const parsed = benchmarkResultsInput.parse([{ resolutionWidth: 1920, resolutionHeight: 1080, preset: "High", averageFps: 74.2, onePercentLowFps: 58.4 }]);
    expect(parsed[0].averageFps).toBe(74.2);
    expect(() => benchmarkResultsInput.parse([{ resolutionWidth: 1920, resolutionHeight: 1080, preset: "High", averageFps: 0 }])).toThrow();
    expect(() => benchmarkResultsInput.parse([{ resolutionWidth: 200, resolutionHeight: 1080, preset: "High", averageFps: 74 }])).toThrow();
  });
});
