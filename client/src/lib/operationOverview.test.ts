import { describe, expect, it } from "vitest";
import { getOperationDecision, getOperationMetrics } from "./operationOverview";

describe("modelo do Centro de Operações", () => {
  it("prioriza uma leitura local quando não há snapshot", () => {
    expect(getOperationDecision({ recommendationsError: false })).toMatchObject({
      kind: "scan-required",
      title: "A próxima ação segura é gerar uma leitura local.",
    });
    expect(getOperationMetrics({ guideCount: 0 })).toMatchObject({ installedGames: "—", snapshots: "—" });
  });

  it("separa uma falha de consulta da leitura local existente", () => {
    expect(getOperationDecision({ snapshot: {}, recommendationsError: true })).toMatchObject({
      kind: "recommendations-unavailable",
      title: "As recomendações estão temporariamente indisponíveis.",
    });
  });

  it("só declara evidência pronta quando existe perfil ativo e consulta válida", () => {
    expect(getOperationDecision({ snapshot: {}, recommendationsError: false, recommendations: {} }).kind).toBe("profile-required");
    expect(getOperationDecision({ snapshot: {}, recommendationsError: false, recommendations: { profile: {}, items: [] } })).toMatchObject({
      kind: "evidence-ready",
      title: "Existem evidências disponíveis para revisão.",
    });
  });
});
