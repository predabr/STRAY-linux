export type PerformanceMeasurement = { gameId: number; capturedAt: number; averageFps: number | null; source: "verified" | "community" | "local-authorized" | "unknown"; resolution?: string | null; preset?: string | null };

export function detectPerformanceRegression(previous: PerformanceMeasurement | undefined, current: PerformanceMeasurement | undefined) {
  if (!previous || !current) return { available: false as const, reason: "São necessárias duas medições para comparar." };
  if (previous.gameId !== current.gameId) return { available: false as const, reason: "As medições pertencem a jogos diferentes." };
  if (previous.averageFps === null || current.averageFps === null || previous.averageFps <= 0) return { available: false as const, reason: "As duas medições precisam informar FPS médio explícito." };
  if (previous.resolution && current.resolution && previous.resolution !== current.resolution) return { available: false as const, reason: "A resolução mudou; as medições não são diretamente comparáveis." };
  if (previous.preset && current.preset && previous.preset !== current.preset) return { available: false as const, reason: "O preset mudou; as medições não são diretamente comparáveis." };
  const changePercent = ((current.averageFps - previous.averageFps) / previous.averageFps) * 100;
  return { available: true as const, previousFps: previous.averageFps, currentFps: current.averageFps, changePercent, classification: changePercent < 0 ? "regression" as const : changePercent > 0 ? "improvement" as const : "unchanged" as const, caveat: "A variação descreve duas medições comparáveis; ela não prova causalidade. Compare snapshots para verificar mudanças técnicas observadas." };
}
