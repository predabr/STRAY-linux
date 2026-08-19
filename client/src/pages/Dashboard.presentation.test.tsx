import { getOperationDecision } from "@/lib/operationOverview";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DashboardContent, OperationDecisionHero } from "./Dashboard";

function renderDecision(input: Parameters<typeof getOperationDecision>[0]) {
  return renderToStaticMarkup(<OperationDecisionHero decision={getOperationDecision(input)} />);
}

const observedSnapshot = {
  label: "Leitura local",
  createdAt: "2026-08-18T15:00:00.000Z",
  scan: {
    system: {
      distribution: { name: "Arch Linux", version: "2026.08" },
      cpu: { model: "CPU observada" },
      gpu: { vendor: "AMD", model: "GPU observada" },
      graphics: { vulkanVersion: "1.3" },
      runtime: { steamDetected: true, installedGameCount: 2, discovery: { heroicInstalledGameCount: 1 } },
    },
  },
};

function renderOverview(input: { snapshots?: any[]; recommendations?: any; recommendationsError?: boolean }) {
  return renderToStaticMarkup(<DashboardContent section="overview" dashboard={{ savedGuides: [], favorites: [] }} reports={[]} logs={[]} history={[]} myBenchmarks={[]} recommendations={input.recommendations} recommendationsError={input.recommendationsError ?? false} snapshots={input.snapshots} />);
}

describe("hero do Centro de Operações", () => {
  it("renderiza o estado sem leitura com ação para o Scanner", () => {
    const markup = renderDecision({ recommendationsError: false });
    expect(markup).toContain("A próxima ação segura é gerar uma leitura local.");
    expect(markup).toContain('href="/scanner"');
    expect(markup).toContain("Abrir Scanner");
  });

  it("renderiza uma consulta indisponível sem afirmar que a leitura falhou", () => {
    const markup = renderDecision({ snapshot: {}, recommendationsError: true });
    expect(markup).toContain("As recomendações estão temporariamente indisponíveis.");
    expect(markup).toContain("Sua leitura local permanece intacta");
    expect(markup).toContain('href="/diagnostics"');
  });

  it("renderiza o estado com evidências disponíveis e ação de revisão", () => {
    const markup = renderDecision({ snapshot: {}, recommendationsError: false, recommendations: { profile: {}, items: [] } });
    expect(markup).toContain("Existem evidências disponíveis para revisão.");
    expect(markup).toContain("Revisar sinais");
    expect(markup).toContain('href="/diagnostics"');
  });

  it("renderiza o overview sem snapshot com métricas indisponíveis e encaminhamento seguro", () => {
    const markup = renderOverview({ snapshots: [] });
    expect(markup).toContain("A próxima ação segura é gerar uma leitura local.");
    expect(markup).toContain("Requer leitura local");
    expect(markup).toContain("A visão geral aguarda uma leitura do seu computador");
    expect(markup).toContain("Configurar Meu PC");
  });

  it("renderiza o overview com leitura existente e erro de recomendações sem apagar os sinais", () => {
    const markup = renderOverview({ snapshots: [observedSnapshot], recommendationsError: true });
    expect(markup).toContain("As recomendações estão temporariamente indisponíveis.");
    expect(markup).toContain("Última leitura local");
    expect(markup).toContain("Vulkan 1.3");
    expect(markup).toContain("Não foi possível consultar recomendações agora");
  });

  it("renderiza o overview com evidências disponíveis sem afirmar compatibilidade inexistente", () => {
    const markup = renderOverview({ snapshots: [observedSnapshot], recommendations: { profile: { name: "Perfil observado" }, items: [] } });
    expect(markup).toContain("Existem evidências disponíveis para revisão.");
    expect(markup).toContain("Próximos sinais do perfil ativo");
    expect(markup).toContain("Nenhum alerta técnico verificável foi encontrado");
    expect(markup).toContain("registros publicados ficam separados");
  });
});
