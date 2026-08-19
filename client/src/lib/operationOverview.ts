export type OperationDecisionKind = "scan-required" | "recommendations-unavailable" | "profile-required" | "evidence-ready";

export type OperationDecision = {
  kind: OperationDecisionKind;
  eyebrow: string;
  title: string;
  detail: string;
};

export function getOperationDecision(input: { snapshot?: unknown; recommendations?: { profile?: unknown; items?: unknown[] }; recommendationsError: boolean }): OperationDecision {
  if (!input.snapshot) {
    return {
      kind: "scan-required",
      eyebrow: "DECISÃO ATUAL / LEITURA PENDENTE",
      title: "A próxima ação segura é gerar uma leitura local.",
      detail: "O Centro de Operações não infere dados de hardware, biblioteca ou compatibilidade sem um snapshot observado.",
    };
  }

  if (input.recommendationsError) {
    return {
      kind: "recommendations-unavailable",
      eyebrow: "DECISÃO ATUAL / CONSULTA INDISPONÍVEL",
      title: "As recomendações estão temporariamente indisponíveis.",
      detail: "Sua leitura local permanece intacta; a indisponibilidade não é um diagnóstico nem confirma ausência de alertas.",
    };
  }

  if (!input.recommendations?.profile) {
    return {
      kind: "profile-required",
      eyebrow: "DECISÃO ATUAL / PERFIL PENDENTE",
      title: "Crie um perfil técnico para relacionar sua leitura a evidências publicadas.",
      detail: "Campos desconhecidos permanecem explícitos e não são usados para completar compatibilidade ou desempenho.",
    };
  }

  return {
    kind: "evidence-ready",
    eyebrow: "DECISÃO ATUAL / EVIDÊNCIAS DISPONÍVEIS",
    title: "Existem evidências disponíveis para revisão.",
    detail: "Compatibilidade só aparece quando há um registro publicado compatível com os campos conhecidos do perfil.",
  };
}

export function getOperationMetrics(input: { snapshot?: { scan?: { system?: { runtime?: { installedGameCount?: number; discovery?: { heroicInstalledGameCount?: number } } } } }; snapshots?: unknown[]; guideCount: number; benchmarkCount?: number }) {
  const runtime = input.snapshot?.scan?.system?.runtime;
  const hasSnapshot = Boolean(input.snapshot);
  return {
    installedGames: hasSnapshot ? (runtime?.installedGameCount ?? 0) + (runtime?.discovery?.heroicInstalledGameCount ?? 0) : "—",
    snapshots: input.snapshots?.length ? input.snapshots.length : "—",
    guideCount: input.guideCount,
    benchmarkCount: input.benchmarkCount ?? 0,
  };
}
