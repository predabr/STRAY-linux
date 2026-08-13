import { describe, expect, it } from "vitest";
import { canPublishWithSource, hasAdministrationAccess, hasBenchmarkEvidence, hasModerationAccess, reviewedBenchmarkProvenance } from "./policies";

describe("controle de acesso", () => {
  it("permite moderação para moderator e admin, mas não para user", () => {
    expect(hasModerationAccess("user")).toBe(false);
    expect(hasModerationAccess("moderator")).toBe(true);
    expect(hasModerationAccess("admin")).toBe(true);
  });

  it("restringe administração ao role admin", () => {
    expect(hasAdministrationAccess("user")).toBe(false);
    expect(hasAdministrationAccess("moderator")).toBe(false);
    expect(hasAdministrationAccess("admin")).toBe(true);
  });
});

describe("política de benchmark", () => {
  it("recusa FPS sem fonte ou evidência", () => {
    expect(hasBenchmarkEvidence({ sourceUrl: null, evidenceNote: null, results: [{ averageFps: 90 }] })).toBe(false);
  });

  it("recusa benchmark sem FPS médio medido", () => {
    expect(hasBenchmarkEvidence({ sourceUrl: "https://example.com/proof", results: [{ averageFps: null }] })).toBe(false);
  });

  it("aceita benchmark quando existe FPS e evidência", () => {
    expect(hasBenchmarkEvidence({ evidenceNote: "Medição do MangoHud anexada ao report.", results: [{ averageFps: 72.5 }] })).toBe(true);
  });

  it("nunca converte rejeição em dado verificado", () => {
    expect(reviewedBenchmarkProvenance("verified")).toBe("verified");
    expect(reviewedBenchmarkProvenance("rejected")).toBe("community");
  });
});

describe("política editorial", () => {
  it("requer uma fonte antes da publicação", () => {
    expect(canPublishWithSource("draft", null)).toBe(true);
    expect(canPublishWithSource("published", null)).toBe(false);
    expect(canPublishWithSource("published", "https://docs.example.org/source")).toBe(true);
  });
});
