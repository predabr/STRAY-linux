import { describe, expect, it } from "vitest";
import { detectPerformanceRegression } from "./performanceRegression";

describe("detector de regressão", () => {
  it("calcula somente duas medições comparáveis com FPS explícito e não afirma causa", () => {
    const result = detectPerformanceRegression({ gameId: 7, capturedAt: 1, averageFps: 100, source: "verified", resolution: "1080p", preset: "high" }, { gameId: 7, capturedAt: 2, averageFps: 80, source: "verified", resolution: "1080p", preset: "high" });
    expect(result).toMatchObject({ available: true, classification: "regression", changePercent: -20 });
    if (result.available) expect(result.caveat).toContain("não prova causalidade");
  });

  it("recusa comparação quando FPS não foi coletado", () => {
    expect(detectPerformanceRegression({ gameId: 7, capturedAt: 1, averageFps: null, source: "unknown" }, { gameId: 7, capturedAt: 2, averageFps: 80, source: "verified" })).toMatchObject({ available: false });
  });
});
