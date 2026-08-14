import type { ScannerReport } from "./scannerReport";

export type LinuxHealthFinding = { id: string; severity: "attention" | "info"; title: string; detail: string; recommendedAction: string };

export function assessLinuxGamingEnvironment(report: ScannerReport): LinuxHealthFinding[] {
  const findings: LinuxHealthFinding[] = [];
  const { graphics, runtime } = report.system;
  const gaming = runtime.gaming;
  if (!runtime.steamDetected) findings.push({ id: "steam-not-detected", severity: "attention", title: "Steam não foi detectado", detail: "O scanner não encontrou uma instalação Steam nos caminhos locais conhecidos.", recommendedAction: "Instale ou abra a Steam pelo método recomendado para sua distribuição e execute o scanner novamente." });
  if (!graphics.vulkanVersion) findings.push({ id: "vulkan-not-verified", severity: "attention", title: "Vulkan não pôde ser verificado", detail: "O scanner não encontrou uma versão Vulkan disponível neste ambiente.", recommendedAction: "Confirme o driver gráfico e o pacote Vulkan da sua distribuição antes de testar jogos Proton." });
  if ((/AMD|Radeon|Intel/i.test(report.system.gpu.model ?? "")) && !graphics.mesaVersion) findings.push({ id: "mesa-not-verified", severity: "attention", title: "Mesa não pôde ser verificado", detail: "A GPU parece usar uma pilha aberta, mas a versão Mesa não foi localizada.", recommendedAction: "Consulte a documentação da sua distribuição para verificar o driver Mesa e execute o scanner novamente." });
  if (gaming && !gaming.renderGroupDetected) findings.push({ id: "render-permission-not-detected", severity: "attention", title: "Permissão de renderização não detectada", detail: "O usuário atual não aparece nos grupos render ou video retornados pelo sistema.", recommendedAction: "Revise os grupos e as permissões gráficas pela documentação da sua distribuição antes de alterar a conta." });
  if (gaming && !gaming.gameModeDetected) findings.push({ id: "gamemode-not-detected", severity: "info", title: "GameMode não foi detectado", detail: "GameMode é opcional e a ausência dele não indica falha do sistema.", recommendedAction: "Instale-o somente se um guia oficial da sua distribuição ou um jogo específico recomendar seu uso." });
  if (gaming && gaming.gameModeDetected && gaming.gameModeServiceActive === false) findings.push({ id: "gamemode-service-inactive", severity: "info", title: "Serviço GameMode inativo", detail: "O executável GameMode foi encontrado, mas o serviço de usuário não está ativo neste momento.", recommendedAction: "Abra um jogo com GameMode ou consulte a documentação oficial do pacote para verificar a ativação." });
  if (gaming && !gaming.waylandDetected && !gaming.x11Detected) findings.push({ id: "session-not-detected", severity: "info", title: "Sessão gráfica não identificada", detail: "O scanner não encontrou marcadores de Wayland ou X11 nesta execução.", recommendedAction: "Execute o scanner dentro de uma sessão gráfica ativa para obter mais contexto." });
  return findings;
}
