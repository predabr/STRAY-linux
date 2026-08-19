# Fechamento verificável — Stray Linux 1.3.0

**Data de fechamento:** 18 de agosto de 2026

Esta entrega foi conduzida em fases contínuas, sem criar funcionalidades que não possuíssem contrato, evidência ou limitação explícita. A versão foi mantida em `1.2.0` durante a implementação e passou para `1.3.0` somente após a conclusão dos pilares funcionais, da cobertura de localização e das validações de release.

| Fase concluída | Resultado verificável |
|---|---|
| Roadmap institucional | Rota pública, cinco fases, estados discretos, critérios, limites e cópia tipada nas 11 localidades. |
| Centro de Operações | Modelo de decisão com leitura pendente, consulta indisponível, perfil pendente e evidências disponíveis, sem transformar ausência em diagnóstico. |
| Biblioteca local | Ações Steam/Heroic/pastas preservadas, feedback acessível, abertura local explícita e identificação de arte ausente. |
| Diagnóstico e LinuxFix | Lacunas de leitura, pré-requisitos, risco, verificação e reversão declarados sem automação destrutiva. |
| Stray AI | Contexto condicional, evidência, lacunas, pré-requisitos, risco, reversão e limites, sem executar comandos nem inventar resultados. |
| Qualidade | Catálogo nas 11 localidades, regressões de acessibilidade/privacidade, contratos desktop e revisão visual desktop/mobile. |

## Validações executadas

| Verificação | Resultado |
|---|---|
| Testes Vitest | **187 testes** aprovados em 76 arquivos. |
| TypeScript | `pnpm check` aprovado. |
| Build de produção | `pnpm build` aprovado. |
| Dependências | `pnpm audit:security` aprovado conforme a política do projeto; advisories transitivos sem correção disponível permanecem registrados. |
| Empacotamento desktop | Windows NSIS, AppImage, DEB, RPM e Pacman gerados para `1.3.0`. |
| Revisão visual | Rotas operacionais revisadas em 1280×720 e 375×812; registro em `docs/QA_1_3_VISUAL_REVIEW.md`. |
| Distribuição pública | Cinco redirects estáveis devolveram HTTP 302 para artefatos `1.3.0`; o pacote Pacman foi baixado, teve SHA-256 comparado ao sidecar, contêiner gzip e conteúdo `opt/Stray Linux/` confirmados. |
| GitHub | Branch `main` sincronizado inicialmente no commit `810c7ff` antes do fechamento documental. |

> A verificação de instalação e de abertura continua específica para cada ambiente. Em especial, `pacman -Qp` exige uma máquina Arch real; a assinatura Authenticode do instalador Windows depende de um certificado de assinatura configurado pelo responsável.
