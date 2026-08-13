import { describe, expect, it } from "vitest";
import { riskLabels, windowsActions, windowsApps } from "../client/src/data/windowsCatalog";

describe("catálogo Windows", () => {
  it("mantém ações identificadas, classificadas por risco e vinculadas a fontes HTTPS", () => {
    expect(windowsActions.length).toBeGreaterThanOrEqual(8);
    expect(new Set(windowsActions.map((action) => action.id)).size).toBe(windowsActions.length);
    windowsActions.forEach((action) => {
      expect(riskLabels[action.risk]).toBeDefined();
      expect(action.sourceUrl).toMatch(/^https:\/\//);
      expect(action.requirement.length).toBeGreaterThan(10);
    });
  });

  it("recomenda aplicativos por identificador individual WinGet, sem instalador em lote", () => {
    expect(windowsApps.length).toBeGreaterThanOrEqual(6);
    windowsApps.forEach((app) => {
      expect(app.wingetId).toMatch(/^[A-Za-z0-9.-]+$/);
      expect(`winget install --id ${app.wingetId} --exact`).not.toContain("--all");
      expect(app.sourceUrl).toMatch(/^https:\/\//);
    });
  });
});
