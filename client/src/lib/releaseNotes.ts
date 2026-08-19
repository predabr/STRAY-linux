import { releaseManifest } from "./releaseManifest";

export const currentReleaseNotes = {
  version: releaseManifest.version,
  title: "Atualização atual",
  summary: "Operação local mais explícita, diagnósticos por evidência e distribuição verificável.",
  groups: [
    { title: "Centro de Operações e biblioteca", items: ["O Centro de Operações separa leitura pendente, consulta indisponível, perfil pendente e evidências disponíveis.", "A Biblioteca indica explicitamente arte ausente e mantém as ações Steam, Heroic e pastas locais dentro de seus limites.", "Capas ausentes não são substituídas por mídia inventada."] },
    { title: "Diagnóstico, LinuxFix e Stray AI", items: ["O Diagnóstico distingue campos observados de lacunas de leitura e não aplica mudanças.", "LinuxFix apresenta pré-requisito, risco, verificação e reversão — ou declara a reversão não documentada.", "A Stray AI organiza evidência, lacunas, pré-requisitos, risco e reversão sem executar comandos."] },
    { title: "Distribuição, localização e privacidade", items: ["Cinco instaladores 1.3.0 usam downloads estáveis e sidecars SHA-256.", "Novas mensagens preservam as 11 localidades e rótulos acessíveis no chat.", "Dados locais continuam minimizados; nenhuma ação destrutiva é simulada."] },
  ],
  verification: [
    { label: "Downloads e integridade", status: "Confirmado", detail: "Artefatos 1.3.0, redirects estáveis e sidecars SHA-256 foram gerados com checksums reais." },
    { label: "Aplicativo desktop", status: "Confirmado", detail: "Build e empacotamento Electron foram executados para Windows, AppImage, DEB, RPM e Pacman." },
    { label: "Pacote Arch em hardware real", status: "Pendente", detail: "A inspeção do arquivo e checksum passaram; `pacman -Qp` precisa ser executado em uma máquina Arch real." },
  ],
} as const;
