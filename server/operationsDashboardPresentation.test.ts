import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const dashboard = readFileSync("client/src/pages/Dashboard.tsx", "utf8");

describe("Centro de Operações", () => {
  it("encaminha uma leitura ausente ao Scanner, Biblioteca e Diagnóstico", () => {
    expect(dashboard).toContain('Link href="/scanner"');
    expect(dashboard).toContain("Abrir Scanner");
    expect(dashboard).toContain('Link href="/library"');
    expect(dashboard).toContain("Explorar jogos");
    expect(dashboard).toContain('Link href="/diagnostics"');
    expect(dashboard).toContain("Abrir Diagnóstico");
  });

  it("mostra Vulkan apenas como sinal observado da última leitura", () => {
    expect(dashboard).toContain('scan.system.graphics?.vulkanVersion');
    expect(dashboard).toContain('label="VULKAN"');
    expect(dashboard).toContain('"Vulkan não informado"');
  });

  it("separa ausência de leitura, erro de consulta e recomendações com evidência", () => {
    expect(dashboard).toContain("A visão geral aguarda uma leitura do seu computador");
    expect(dashboard).toContain("Leitura incompleta: campos sem valor permanecem como não informados.");
    expect(dashboard).toContain("Não foi possível consultar recomendações agora");
    expect(dashboard).toContain("Próximos sinais do perfil ativo");
    expect(dashboard).toContain("registros publicados ficam separados");
  });

  it("conecta o hero e as métricas ao modelo de decisão sem transformar ausência em zero", () => {
    expect(dashboard).toContain('getOperationDecision({ snapshot, recommendations, recommendationsError })');
    expect(dashboard).toContain("<OperationDecisionHero decision={decision} />");
    expect(dashboard).toContain('value={metrics.installedGames}');
    expect(dashboard).toContain('value={metrics.snapshots}');
    expect(dashboard).toContain('"Requer leitura local"');
    expect(dashboard).toContain('"Revisar sinais"');
  });
});
