# Matriz de escopo — prompts de evolução Stray Linux

## Decisão de escopo

O **Prompt 11 — Achievements** está explicitamente excluído por solicitação do proprietário. Não serão criadas tabelas, rotas, itens de navegação, eventos, progresso, badges ou recomendações de conquistas nesta rodada. A exclusão também impede que contadores de uso sejam reinterpretados como gamificação.

## Mapa de capacidades

| Prompt | Área | Estado inicial | Direção permitida |
| --- | --- | --- | --- |
| 1 | GameHub 2.0 | Parcialmente implementado | Reforçar descoberta, seções condicionadas a fonte e virtualização/paginação sem fabricar rankings. |
| 2 | Game Profile | Parcialmente implementado | Organizar por visões de evidência, ambiente e histórico; mídia continua bloqueada sem licença. |
| 3 | Benchmark Lab | Parcialmente implementado | Separar tabelas, comparações e gráficos por proveniência; ausência continua explícita. |
| 4 | My PC Pro | Implementado parcialmente | Completar a apresentação dos sinais já coletados e um histórico local que não contenha dados pessoais. |
| 5 | LinuxFix 2.0 | Implementado parcialmente | Exibir confirmações reais, ranking somente com contagem existente e ações sempre confirmadas. |
| 6 | Stray AI 2.0 | Parcialmente implementado | Oferecer ações contextualizadas e respostas com evidência, confiança e fontes, sem executar comandos. |
| 7 | Perfil do jogador | Parcialmente implementado | Estruturar estatísticas pessoais reais e preferências de visibilidade; sem Achievements. |
| 8 | Compatibility Matrix | Implementada, sem registros publicados | Melhorar matriz e seus estados de falta de evidência; não preencher classificações. |
| 9 | Recomendações pessoais | Parcialmente implementado | Gerar somente razões suportadas por favoritos, biblioteca local e evidência publicada. |
| 10 | Trust & Provenance | Implementado parcialmente | Uniformizar badges, origem, data, confiança e explicação de método. |
| 11 | Achievements | **Excluído** | Não implementar. |
| 12 | Community V2 | Parcialmente implementado | Expandir fluxos moderados de report, confirmação e contribuição, sem promoção automática a VERIFIED. |
| 13 | Game Import | Implementado no desktop | Reforçar rescan, importação/remover da visão Stray e consentimento local Steam. |
| 14 | Performance Center | Ausente | Criar somente telemetria local e opt-in quando houver coleta real; não chamar de benchmark verificado. |
| 15 | Game Session | Ausente | Criar sessões locais consentidas, com envio manual posterior e categoria COMMUNITY. |
| 16 | UI 2.0 | Em evolução | Consolidar o design system e eliminar densidade ruim, espaços vazios e controles inconsistentes. |
| 17 | Linux OS Integration | Parcialmente implementado | Ampliar leitura local e ações seguras, explícitas e confirmadas, sem execução arbitrária. |

## Limites não negociáveis

O produto continua sem feed licenciado de capas ou screenshots Steam, sem Steamworks Partner, sem atualização remota autenticada, e sem métricas de FPS, compatibilidade ou comunidade fabricadas. Dados locais ficam no dispositivo até consentimento explícito de compartilhamento. Toda ação que altera o sistema deve apresentar o que será feito e exigir confirmação do usuário.

## Cobertura medida no banco nesta rodada

| Entidade | Registros | Implicação de interface |
| --- | ---: | --- |
| Compatibilidade | 0 | A matriz deve continuar mostrando ausência explícita, sem níveis sintéticos por distro ou hardware. |
| Benchmarks | 0 | O Benchmark Lab deve mostrar fluxos de consulta/submissão e não gráficos preenchidos. |
| LinuxFix | 6 | Os seis runbooks podem expor fonte e confirmação real; não existe base para ranking amplo. |
| Fontes de conteúdo | 4 | Há quatro fontes registradas, uma marcada oficial; o badge deve revelar o método sem elevar dados comunitários a oficiais. |

## Validação de interface — GameHub e perfil

A navegação de GameHub renderizou a busca server-side, filtros, seções de destaques e registros recentes. A seção de destaques permaneceu vazia de forma explícita quando nenhum jogo possui marca editorial. Um perfil publicado do catálogo foi validado com metadados de desenvolvedor/publicadora/data quando presentes, fonte de catálogo, áreas de cobertura e estados vazios de compatibilidade, benchmark, LinuxFix e guias. Nenhum bloco apresentou FPS, rating Linux, compatibilidade ou atividade comunitária sintéticos.
