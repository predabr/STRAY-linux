# Auditoria de Profundidade do Desktop — 2026-08-15

## Escopo

Esta auditoria cobre exclusivamente o aplicativo Electron e seu SQLite local. A landing pública foi preservada; não foi redesenhada nesta fase. A meta é aprofundar capacidades reais e locais, sem criar FPS, benchmarks, compatibilidade ou telemetria fictícios.

## Capacidades já reais

| Área | Estado atual | Evidência de implementação |
|---|---|---|
| Scanner local | Implementado por execução explícita em Electron ou CLI | CPU, GPU/adaptadores, RAM, armazenamento, kernel, distribuição, arquitetura, desktop, sessão Wayland/X11, display, Mesa, OpenGL, Vulkan, driver, Steam, Proton/GE-Proton, Wine, GameMode, MangoHud, Gamescope, vkBasalt, Winetricks, Flatpak e grupos gráficos são coletados quando detectáveis. |
| Segurança do Scanner | Implementado | A ponte IPC aceita apenas a janela principal; o processo é filho local, sem envio automático; relatório JSON deixa hostname, usuário, IDs, tokens e lista de jogos fora do contrato. |
| Biblioteca | Implementado, leitura local | Steam nativo/Flatpak, manifests, bibliotecas adicionais, Workshop e instalações Epic registradas pelo Heroic/Legendary são lidos sem credenciais, rede, escrita ou execução automática. Pastas externas são escolhidas pelo usuário. |
| Lançamento | Limitado e explícito | Somente URI `steam://run/<appid>` é aberta após confirmar que o jogo Steam está instalado. Heroic e jogos externos não são iniciados pelo Stray. |
| Perfil técnico | Implementado parcialmente | Um relatório pode ser revisado e importado como perfil ativo local; o perfil preserva distribuição, kernel, driver, Proton, Wine, armazenamento e monitor. |
| Sessões | Implementado parcialmente | Performance registra início, término e duração em `localStorage`; não declara métricas que não coletou. |
| Offline | Implementado parcialmente | Catálogo, wiki, guias, LinuxFix, favoritos, guias salvos e perfis usam SQLite local. Não há indicador central de modo offline nem persistência local de snapshots completos. |

## Lacunas comprovadas

| Área | Lacuna | Tratamento necessário |
|---|---|---|
| Scanner | Heroic, prefixes Wine e prefixes Proton não são apresentados pelo relatório técnico; a descoberta atual fica restrita à biblioteca. | Estender o contrato do relatório somente com caminhos/contagens locais minimizados e sem credenciais; apresentar `detectado`, `não detectado` ou `desconhecido`. |
| Diagnóstico | Há avaliação de saúde por relatório, mas não existe fluxo persistido de “o que há de errado”, evidência, recomendação e verificação. | Criar diagnóstico local explicável e reversível, sem executar comandos automaticamente. |
| Snapshots | O SQLite não possui tabela de snapshots de scanner nem comparação antes/depois. | Armazenar somente relatórios aprovados pelo usuário, com timestamp e campos técnicos; comparar mudanças textuais, não inventar impacto. |
| Performance | Há duração de sessão, mas não coletor autorizado de FPS, percentis, frame time, GPU, CPU ou VRAM. | Manter essas métricas indisponíveis até existir importação local com origem e método explícitos. Não estimar números. |
| Runtimes por jogo | O Scanner encontra ferramentas globais; a biblioteca não associa prefixos Proton/Wine a cada jogo. | Mapear somente caminhos conhecidos de Steam/compatdata e prefixes escolhidos pelo usuário, sem indicar “melhor runtime” sem evidência. |
| Stray AI local | O roteador desktop devolve orientação estática do snapshot e não recupera perfil, relatório, LinuxFix ou guias relevantes. | Implementar recuperação local estruturada, com “o que sabe”, “o que não sabe”, fontes e ações seguras. |
| Configurações e privacidade | Dashboard possui idioma, tema e nota de privacidade, mas não há centro detalhado com opt-in e reset. | Centralizar preferências locais e tornar telemetria, compartilhamento e dados de IA explicitamente opt-in. |
| Estados | Páginas principais possuem vários estados vazios, mas não há contrato único de disponibilidade offline para todo o desktop. | Adicionar indicador e estados offline/indisponível onde a fonte não estiver disponível. |

## Limites mantidos

O Stray Linux não adicionará Achievements, feed social, ranking artificial, avaliações falsas, benchmarks falsos, FPS falsos, pirataria, cracks, bypass de DRM ou telemetria obrigatória. Não haverá execução destrutiva automática: toda ação recomendada deverá informar motivo, risco, fonte e exigir confirmação.

## Revisão visual de desenvolvimento

As rotas `/diagnostics`, `/snapshots` e `/settings` foram verificadas no navegador. No navegador comum, Diagnóstico informa corretamente que a leitura local está disponível somente no aplicativo desktop; Snapshots mantém a captura desabilitada, declara que não há leituras salvas e não mostra métricas inventadas; Configurações mantém os controles de privacidade e telemetria explicitamente desativados por padrão. A navegação desktop apresenta as três áreas como extensões do shell existente, sem alterar a landing pública.
