# Stray Linux 2.0 — auditoria de inteligência local

## Objetivo e limites

Esta fase aprofunda o Stray Linux como uma ferramenta de **leitura, comparação e explicação local**. Ela não cria Achievements, não instala pacotes, não executa comandos sem uma ação explícita da pessoa usuária e não converte ausência de dados em FPS, compatibilidade, causalidade ou pontuação.

> Uma recomendação só pode ser apresentada como fato quando houver um campo observado ou uma fonte rastreável. Hipóteses, estimativas e desconhecimentos permanecem rotulados.

## Capacidades já verificadas

| Área | Base existente | Aproveitamento na fase 2.0 |
|---|---|---|
| Scanner local | Relatório minimizado de CPU, GPU, driver, Mesa, Vulkan, sessão, Steam, Heroic, Wine, Proton e ferramentas de gaming. | System Graph, Driver Health, Vulkan Diagnostics e Gaming Stack. |
| Snapshots SQLite | Captura local de relatórios completos, com criação, listagem, remoção e comparação visual. | Timeline, comparação de configurações e detecção de mudanças. |
| Sessões locais | Registro de início, fim, duração, jogo e perfil, sem telemetria de desempenho. | Timeline e relatório pós-jogo limitado à duração até existir coletor autorizado. |
| Stray AI | Recupera perfil e conteúdo local, mostra fontes internas e recusa pedidos fora de escopo. | Explicação “Por quê?”, taxonomia de evidência e memória opcional. |
| Busca e comandos | Busca agrupada e paleta Ctrl/Cmd+K já são apenas de navegação. | Busca recente, filtros e atalhos seguros para as novas áreas. |
| Privacidade | Preferências locais e telemetria desativada por padrão. | Consentimento explícito para memória, exportação e backup locais. |

## Decisões de implementação

| Requisito do briefing | Decisão verificável |
|---|---|
| Regressão de performance | Só aparece quando existirem duas leituras de desempenho compatíveis, com fonte e campos numéricos importados. Sessões de duração não contam como desempenho. |
| Análise pós-jogo | Exibe duração e contexto local já gravados; FPS, 1% low, frame time, VRAM e uso de CPU/GPU ficam como indisponíveis sem coletor autorizado. |
| Matriz Proton/Wine/Native | Mostra apenas registros publicados ou importados. Sem registro, mostra “desconhecido” e não calcula nota. |
| Pré-voo e lançamento | Confere somente sinais detectáveis: runtime conhecido, Vulkan, driver, armazenamento, permissões/grupo e prefixos contados. Nunca bloqueia sem sinal técnico concreto. |
| Atualizações e canais | Exibem estado, versão empacotada e limites. Download, instalação e reinício só aparecem quando houver atualizador implementado e uma fonte de release configurada. |
| Notificações | São locais, relevantes e derivadas de mudanças observadas; não existe telemetria obrigatória ou push externo. |

## Modelo de evidência comum

| Classe | Significado | Exemplos aceitos |
|---|---|---|
| `official` | Fonte técnica ou documentação oficial rastreável. | Guia com URL oficial, release ou documentação de distribuição. |
| `verified` | Medição ou registro com evidência verificável. | Benchmark aprovado ou importação local com campos completos. |
| `community` | Relato contextualizado, sem equivaler a fato universal. | Report moderado com hardware, distro, runtime e data. |
| `estimated` | Inferência metodológica declarada. | Projeção somente quando o método e os dados de entrada existirem. |
| `unknown` | Ausência de informação suficiente. | Nenhum resultado de runtime, benchmark ou diagnóstico disponível. |

## Dados que não serão coletados nesta fase

O Scanner continua sem ler credenciais, tokens, caminhos detalhados de bibliotecas, conteúdo de prefixos, arquivos de jogos ou dados pessoais desnecessários. Backups e exportações excluem segredos e exigem prévia antes de gravar ou restaurar dados.

## Critérios de aceite

1. Todo sinal exibido na inteligência local deve apontar para scanner, snapshot, sessão, fonte publicada ou importação explícita.
2. A interface deve declarar quando uma conclusão é fato, inferência, estimativa ou desconhecida.
3. Toda função de backup, restauração, exportação, modo seguro ou logs deve permanecer local e reversível quando tecnicamente possível.
4. Os recursos devem continuar disponíveis sem banco remoto obrigatório no desktop e sem alterações automáticas do sistema.
