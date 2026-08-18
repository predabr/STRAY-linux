import { releaseManifest } from "./releaseManifest";

export const currentReleaseNotes = {
  version: releaseManifest.version,
  title: "Atualização atual",
  summary: "Polimento local-first, distribuição verificável e limites técnicos explícitos.",
  groups: [
    { title: "GameHub e biblioteca", items: ["Cartões de jogo com ação de detalhe mais clara.", "Arte vertical oficial tenta o cabeçalho oficial do mesmo App ID antes do fallback local.", "Capas ausentes não são substituídas por mídia inventada."] },
    { title: "Diagnóstico e Stray AI", items: ["Scanner e ações locais explicam quando exigem o aplicativo desktop.", "A Stray AI trabalha com fontes internas e contexto local quando disponíveis.", "Falhas temporárias do contexto retornam uma resposta segura, sem detalhes internos ou resultado fabricado."] },
    { title: "Distribuição e privacidade", items: ["Cinco instaladores 1.2.0 usam downloads estáveis e sidecars SHA-256.", "O QR institucional abre apenas o GitHub oficial; ele não representa pagamento.", "Pix permanece indisponível sem configuração completa exclusivamente no servidor."] },
  ],
  verification: [
    { label: "Downloads e integridade", status: "Confirmado", detail: "Artefatos 1.2.0, redirects estáveis e sidecars SHA-256 foram verificados." },
    { label: "Aplicativo desktop", status: "Confirmado", detail: "Build e empacotamento Electron foram executados no ambiente de validação." },
    { label: "Pacote Arch em hardware real", status: "Pendente", detail: "A inspeção do arquivo e checksum passaram; `pacman -Qp` precisa ser executado em uma máquina Arch real." },
  ],
} as const;
