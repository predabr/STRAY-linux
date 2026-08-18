# Auditoria final profunda — Stray Linux 1.2.0

**Data:** 18 de agosto de 2026  
**Escopo:** site público, workspace React, modo Electron/SQLite, tRPC, rotas HTTP, APIs públicas, Pix, documentação, distribuição e cadeia de build.

## Resultado executivo

A auditoria revisou a estrutura do Stray Linux sem remover recursos ou fabricar dados. Foram encontradas e corrigidas falhas reais de recuperação de erro, feedback de sincronização, contratos permissivos do armazenamento desktop, documentação de API e ambiente, consistência de rotas e comunicação de indisponibilidade do Scanner. A versão continua preservando os limites de evidência: não cria FPS, benchmarks, pagamentos, confirmações, avaliações ou relatos comunitários artificiais.

| Área | Resultado |
|---|---|
| Rotas e navegação | Rotas operacionais inventariadas e verificadas; as entradas da navegação apontam para caminhos registrados. |
| Interface e estados | Estados de carregamento, vazio, erro e indisponibilidade revisados nas superfícies prioritárias, em desktop e mobile. |
| Backend e segurança | Guards administrativos, validação de entrada, cron autenticado, API pública e fronteira IPC revisados. |
| Pix | QR manual somente é gerado no servidor quando as três configurações obrigatórias existem; não há checkout ou confirmação simulada. |
| Qualidade | TypeScript, 154 testes, build, política de dependências, empacotamento Electron e auditoria Arch aprovados. |

## Inventário auditado

Foram revisadas 37 superfícies de página, 25 módulos de roteamento, 37 tabelas de dados, 61 arquivos de teste e mais de 55 documentos de produto e operação. A revisão visual cobriu a landing, GameHub, Atlas de distros, LinuxFix, Benchmark, Comparar, apoio, API, dashboard, Scanner, Diagnóstico, Performance, Configurações, Stray AI, Biblioteca, Windows, moderação, administração e sincronização.

As rotas públicas mantêm papel institucional e os fluxos operacionais ficam dentro do workspace. No modo Electron, o aplicativo usa SQLite no diretório de dados do usuário e não depende de `DATABASE_URL` para operar localmente.

## Correções aplicadas

| Problema confirmado | Correção |
|---|---|
| O limite global de erros mostrava mensagem em inglês e stack trace ao usuário. | Mensagem localizada, ação de recuperação acessível e remoção dos detalhes internos. |
| A tela 404 tinha aparência clara genérica e texto em inglês. | Tela integrada ao tema do produto, em português, com retorno seguro ao início. |
| A sincronização de preferências não confirmava persistência, não revertia erro e sugeria resolução de conflitos que não existia. | Feedback de sucesso/erro, reversão local e escopo real declarado: apenas preferências consentidas. |
| Quatro mutações do SQLite desktop aceitavam entrada permissiva; a revisão de benchmark poderia sugerir verificação sem processo persistido. | Esquemas Zod específicos, limites de texto/ID e resposta explícita de revisão indisponível. |
| A documentação da API não mostrava a rota de descoberta e omitia o SVG de erro do badge. | Inclusão de `/api/v1`, dos formatos de resposta e de testes de apresentação. |
| O adaptador de IA citava `OPENAI_API_KEY`, embora use Forge integrado. | Mensagem alinhada a `BUILT_IN_FORGE_API_KEY` e guia de ambiente criado. |
| Rótulos críticos do Diagnóstico estavam em inglês. | Localização de cabeçalho, etapas, fluxo e origem. |
| Scanner bloqueado fora do Electron permanecia visualmente como CTA primário. | Variante de contorno e rótulo `Scanner no app desktop`, preservando o bloqueio técnico. |
| Navegação avançada continha `System Graph` e `Timeline`. | Rótulos alterados para `Mapa do sistema` e `Linha do tempo`. |

## Segurança e privacidade

O frontend não contém `PIX_STATIC_KEY`, `PIX_MERCHANT_NAME`, `PIX_MERCHANT_CITY`, `STEAM_WEB_API_KEY`, `BUILT_IN_FORGE_API_KEY` ou `JWT_SECRET`. A chave Pix não é enviada ao browser: o servidor cria e valida o BR Code, renderiza um SVG e devolve apenas a imagem quando a configuração estiver completa.

O Electron opera com isolamento de contexto, sandbox, integração Node desabilitada, servidor em loopback, bloqueio de navegação fora da origem local e abertura de links externos somente por lista permitida. Cada handler IPC exposto verifica o remetente da janela principal. A abertura de jogos restringe IDs ao formato Steam, confirma instalação local e não inicia títulos Heroic.

Os routers administrativos e de moderação possuem proteção no servidor. O job de atualização de fonte exige autenticação da plataforma e identidade de tarefa cron vinculada à fonte antes de executar. A API pública é somente leitura e aplica limite por IP.

## Ambiente e serviços externos

O guia completo está em [`ENVIRONMENT.md`](ENVIRONMENT.md). A tabela abaixo resume o impacto operacional.

| Serviço ou configuração | Estado nesta versão |
|---|---|
| SQLite desktop | Funcional sem configuração externa; usado pelo Electron. |
| Banco web (`DATABASE_URL`) | Necessário somente para recursos web persistentes. |
| OAuth da plataforma | Fornecido pela plataforma para contas e RBAC. |
| Stray AI | Depende de `BUILT_IN_FORGE_API_URL` e `BUILT_IN_FORGE_API_KEY` server-side quando chamado. |
| Atualização de catálogo Steam | Opcional e administrativa; requer `STEAM_WEB_API_KEY` para os fluxos autorizados. |
| QR Pix manual | Inativo até `PIX_STATIC_KEY`, `PIX_MERCHANT_NAME` e `PIX_MERCHANT_CITY` existirem no servidor. |
| Checkout dinâmico Pix | Não implementado sem provedor autorizado, cobrança individual, webhook autenticado e idempotência. |

## Integrações revisadas

| Integração | Uso | Limite aplicado |
|---|---|---|
| Steam local | Descoberta e abertura explícita de jogos instalados. | Não lê credenciais, não altera instalações e não apresenta dados Steam em tempo real sem fonte. |
| Heroic | Descoberta local de bibliotecas suportadas. | Leitura somente; não inicia jogos pelo Stray Linux. |
| Forge | Respostas de IA limitadas ao domínio do produto. | Chave exclusiva do servidor; não responde a pedidos fora do escopo. |
| Pix | QR BR Code estático opcional. | Sem payload/chave em texto no cliente e sem confirmação de pagamento. |
| API v1 | Jogos, distros, hardware, LinuxFix, compatibilidade, benchmarks, widgets e badges. | Apenas leitura, proveniência e limitação de taxa. |

## Validação executada

| Comando ou revisão | Resultado |
|---|---|
| `pnpm check` | Aprovado. |
| `pnpm test` | Aprovado: **61 arquivos, 154 testes**. |
| `pnpm build` | Aprovado. |
| `pnpm audit:security` | Aprovado pela política do projeto. |
| `pnpm desktop:dir` | Aprovado; gerado `dist/linux-unpacked`. |
| `ALLOW_NON_ARCH=1 pnpm verify:arch-download` | Aprovado: redirect, sidecar SHA-256, 173.025.951 bytes e conteúdo `opt/Stray Linux/`. |
| Revisão visual | Desktop 1280 px e mobile 375 px nas rotas prioritárias. |

O build emite aviso conhecido de chunks maiores que 500 kB para Mermaid e o chunk principal. A divisão manual não foi reaplicada porque a tentativa anterior introduziu ciclo de dependência em Recharts e uma landing vazia. O aviso não bloqueia o build; uma futura otimização deve ser acompanhada por testes de carregamento de rota.

## Limitações e pendências reais

As etiquetas técnicas `SETTINGS / LOCAL-FIRST`, `PERFORMANCE CENTER / SESSÕES LOCAIS`, `MODERATION / LINUXFIX`, `ADMINISTRAÇÃO / CONTROL PLANE` e `CLOUD SYNC / CONSENTIMENTO` ainda usam inglês parcial como estilo de interface. Elas não afetam fluxo, acessibilidade de controles, dados ou segurança, mas permanecem registradas como refinamento de localização em `todo.md`.

O aviso de segurança de `extract-zip@2.0.1` continua em revisão porque é uma dependência transitiva de desenvolvimento do Electron, não é chamada diretamente pelo projeto e o advisory não informa versão corrigida. A política local não encontrou advisory alto/crítico não revisado.

Esta auditoria não substitui a instalação manual em uma máquina Arch real nem o processo de assinatura de código Windows. Os artefatos publicados foram verificados por redirect, tamanho, hash e inspeção de conteúdo; validação `pacman -Qp` ainda depende de um runner Arch nativo. A assinatura Authenticode exige certificado de assinatura de código do proprietário.

## Arquivos principais modificados nesta auditoria

`client/src/components/ErrorBoundary.tsx`, `client/src/pages/Sync.tsx`, `client/src/pages/NotFound.tsx`, `client/src/pages/Diagnostics.tsx`, `client/src/pages/ApiDocs.tsx`, `client/src/components/platform/ProductWorkspace.tsx`, `server/desktop/router.ts`, `server/_core/llm.ts`, `README.md`, `docs/ENVIRONMENT.md`, `.final-audit-findings.md`, `todo.md` e os testes de regressão associados.

> Esta auditoria registra comportamento observado e validações executadas; não declara que um serviço externo sem credenciais, um pagamento sem provedor ou uma confirmação bancária esteja funcional quando esses requisitos não existem.
