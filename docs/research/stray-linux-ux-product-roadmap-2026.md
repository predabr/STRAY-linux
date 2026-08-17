# Stray Linux — roteiro de evolução visual e produto

**Objetivo.** Transformar o Stray Linux de um painel técnico escuro e correto em uma estação de diagnóstico Linux gaming reconhecível, navegável e verificável. A recomendação não é inserir mais gráficos; é tornar cada superfície uma resposta clara a uma pergunta do jogador, com fonte, tempo de leitura e próximo passo explícitos.

> **Direção recomendada:** *terminal-native Linux gaming diagnostics*. Uma interface em grafite, com evidência em azul-claro, títulos editoriais usados de forma consistente e metadados monoespaçados. O aspecto técnico deve vir da estrutura dos dados e da linguagem de evidência, não de ruído visual.

## Diagnóstico da interface atual

| Superfície | O que já funciona | O problema de maior impacto | Correção recomendada |
|---|---|---|---|
| Visão geral | Hierarquia de cards e linguagem de privacidade são claras. | Sem snapshot, a tela parece um dashboard genérico com vários blocos vazios. | Substituir os quatro zeros por uma única missão de ativação: **Ler este computador**; exibir etapas, tempo de última leitura e campos que serão observados. |
| Scanner | Copy local-first e limites de privacidade são honestos. | O comando, o upload e o vazio ocupam a tela sem expressar o que o resultado se tornará. | Converter em uma *prévia de relatório*: cinco categorias de evidência, status de coleta e uma ação principal contextual. |
| Biblioteca | A separação entre navegador e desktop é compreensível. | O estado desktop indisponível é correto, mas visualmente pouco memorável. | Usar um card de descoberta por fonte — Steam, Heroic e pasta escolhida — com explicação curta da permissão e uma única ação de abertura. |
| Performance | Não inventa FPS e deixa os limites explícitos. | O formulário ainda tem aparência administrativa e os campos sem perfil pesam demais visualmente. | Criar uma sequência **jogo → ambiente → coleta → evidência**, mantendo campos desconhecidos recolhidos até que um perfil seja selecionado. |

As recomendações seguem três princípios: um dashboard deve contar uma história, comparações precisam ser entre grandezas compatíveis, e cada componente deve declarar estado e ação. [1] [2] [3]

## Sistema visual proposto

### 1. Linguagem de evidência

Toda informação técnica deve carregar um dos cinco rótulos abaixo. Isso transforma o visual em semântica e impede que cartões escuros pareçam equivalentes.

| Rótulo | Uso | Tratamento visual |
|---|---|---|
| **Observado agora** | Scanner acabou de ler o computador. | Ponto azul-claro, hora local e fonte do comando. |
| **Registrado localmente** | Perfil, sessão ou snapshot persistido no dispositivo. | Borda neutra, ícone de arquivo e data. |
| **Declarado pelo usuário** | Campo preenchido manualmente. | Etiqueta `MANUAL`, sem converter em inferência. |
| **Não informado** | Ferramenta ausente, sem permissão ou nenhum dado. | Texto neutro com explicação e ação de coleta. |
| **Referência externa** | Wiki, documentação de distro ou fonte de compatibilidade. | Ícone externo, URL/fonte e data de atualização. |

### 2. Tipografia e marca

O título editorial serifado deve aparecer em todas as páginas de decisão — Dashboard, Scanner, Biblioteca, LinuxFix e Performance — não apenas na landing. Campos, comandos, versão de driver, fontes e rótulos de estado usam uma família mono. O wordmark **Stray Linux** deve permanecer visível no topo e no cabeçalho de páginas internas; breadcrumbs não substituem identificação de produto.

### 3. Botões e comandos

Uma região deve ter uma única ação primária. A ação primária recebe preenchimento de alto contraste; secundárias usam contorno; links executam apenas navegação. Rótulos precisam ser verbos específicos: **Ler este computador**, **Revisar relatório**, **Abrir Steam**, **Criar plano**, **Tentar novamente**. Sistemas Fluent e WAI-ARIA distinguem claramente botões de links e recomendam uma ação primária dominante por layout. [5] [6]

| Tipo | Exemplo no Stray | Regra |
|---|---|---|
| Primário | `Ler este computador` | Um por bloco de decisão; mostra progresso e impede disparo duplicado. |
| Secundário | `Ver campos coletados` | Não compete com a ação principal. |
| Terciário/link | `Entender privacidade` | Navega ou revela documentação contextual. |
| Destrutivo | `Excluir snapshot local` | Sempre separado e com confirmação. |
| Indisponível | `Iniciar sessão` sem jogo/perfil | Explica o requisito em tooltip ou texto adjacente. |

Estados enabled, hover, focus, pressed e disabled precisam estar presentes em todos os componentes. Foco por teclado deve usar contorno de pelo menos 2 px e contraste perceptível, não apenas uma mudança sutil de cor. [4] [7]

## Playbook de gráficos: somente quando houver uma pergunta e dados

| Pergunta do usuário | Visual correto | Quando habilitar | O que nunca fazer |
|---|---|---|---|
| Quanto espaço cada biblioteca usa? | Barra horizontal proporcional de armazenamento. | Quando caminhos e tamanhos forem lidos. | Somar tamanho de disco total com RAM ou VRAM. |
| O que mudou entre dois scans? | Diff textual agrupado e, depois de 3 leituras, linha temporal por métrica homogênea. | Somente com snapshots do mesmo dispositivo e unidade estável. | Gráfico de tendência com um único snapshot. |
| Quais ferramentas de jogo foram detectadas? | Matriz de disponibilidade com fonte e versão. | Sempre que o scanner concluir. | Donuts para estados binários. |
| Como foi uma sessão local? | Linha de frametime/FPS ou tabela de percentis. | Apenas após importação opt-in de log bruto. | Gerar FPS a partir de duração da sessão. |
| Há um gargalo observado? | Cartão de diagnóstico com evidência e confiança. | Quando a leitura fornecer condição verificável. | Gauge de “saúde do PC” ou nota universal. |

Linhas representam tendência; barras comparam categorias; medidores representam parte de um todo. A fonte e a unidade precisam estar junto do dado, pois a escolha de gráfico depende da pergunta que ele responde. [2] [3]

## Melhorias por área

### Dashboard: transformar ausência em ativação orientada

No primeiro uso, o Dashboard deve trocar quatro cards de contagem zero por um painel **Estação local não inicializada**. O painel contém: o que o scanner lê, o que ele deliberadamente não lê, a última tentativa (se existir), e a ação `Ler este computador`. Após concluir, ele muda para uma grade curta: **Sistema**, **Runtime**, **Bibliotecas** e **Próximo passo**. Cada grade abre uma página específica, evitando o browsing sem direção recomendado contra em dashboards técnicos. [1]

### Scanner: relatório navegável em vez de formulário técnico

Após a coleta, oferecer cinco abas ou seções curtas: **Sistema**, **Gráficos**, **Jogos**, **Displays** e **Runtimes**. No topo, usar uma faixa de evidência com data, duração, ferramentas que responderam e campos ausentes. Cada campo ausente deve explicar a causa conhecida — por exemplo, `vulkaninfo não encontrado` — e oferecer o guia da distro ou simplesmente `não disponível`, sem sugerir instalação automática.

### Biblioteca e GameHub: “case file” por jogo

Cada jogo instalado deve ter um *case file* com capa, fonte da descoberta, caminho revelável, ID Steam quando houver, método de match do catálogo e campos de ambiente: launcher, Proton/Wine conhecido, runtime e última leitura. O detalhe não deve fingir suporte; se não há evidência, deve exibir **Sem evidência local suficiente** com links para diagnóstico e fonte externa relevante.

### Performance: experimento reversível

Criar um fluxo de quatro passos: selecionar jogo, escolher perfil, revisar plano e iniciar coleta. Qualquer alteração futura de ambiente deve ser apresentada como um diff legível: `Proton: Experimental → GE-Proton 10`, motivo, fonte, risco e botão `Reverter`. A inspiração vem da separação de configuração em jogo, runner e sistema do Lutris e das versões/snapshots por ambiente do Bottles. [11] [12] [13]

### LinuxFix: árvore de decisão com prova

Em vez de uma lista de soluções, cada entrada abre uma árvore curta: **Sintoma observado → checagem local → hipótese → ação reversível → confirmação**. Cada passo terá comando copiável, escopo por distro, pré-requisitos, fonte e desfazer. Nenhuma ação deve rodar automaticamente. Esse formato mantém o app como camada de inteligência e não tenta substituir launchers ou gerenciadores de pacote.

## Telemetria real: proposta para uma fase posterior

MangoHud pode monitorar OpenGL/Vulkan e possui opções de logging, pasta de saída, duração e percentis. Isso viabiliza uma importação **opt-in** de logs locais, mas não torna qualquer dado automaticamente comparável ou verificado. [14] [15]

O Stray deve exigir, antes de gerar qualquer gráfico de sessão:

1. consentimento explícito e pasta local escolhida;
2. contexto completo: jogo, versão, GPU, driver, kernel, runtime, resolução, preset e data;
3. classificação fixa: **Local não verificado**;
4. arquivo bruto preservado, checksum e resumo calculado localmente;
5. exclusão por padrão de upload, ranking público e comparação entre hardwares distintos.

## Prioridade de entrega

| Prioridade | Entrega | Impacto | Esforço | Critério de aceite |
|---|---|---:|---:|---|
| P0 | Sistema unificado de evidência e estados vazios | Alto | Médio | Todo card técnico mostra origem, tempo ou ausência explicada. |
| P0 | Botões, foco e hierarquia de ações | Alto | Baixo | Um CTA principal por decisão; teclado e loading cobertos. |
| P0 | Dashboard de primeira leitura | Alto | Médio | Novo usuário entende o próximo passo sem cards `0` ambíguos. |
| P1 | Case file da Biblioteca | Alto | Médio | Jogo instalado mostra fonte, caminho, match e acesso ao detalhe. |
| P1 | Diff e linha do tempo de snapshots | Médio | Médio | Comparação só é habilitada com leituras compatíveis. |
| P1 | Plano reversível de ambiente | Alto | Alto | Toda configuração proposta exibe diff, fonte e reversão. |
| P2 | Importador opt-in de logs MangoHud | Alto | Alto | Logs locais preservam contexto e nunca viram benchmark inventado. |
| P2 | LinuxFix em árvore de decisão | Médio | Alto | Soluções carregam escopo, pré-requisitos, fonte e desfazer. |

## Itens que não devem entrar

- Medidor único de “saúde do PC”, “compatibilidade garantida” ou score sem fonte.
- Gráficos com valores misturados — RAM, VRAM, armazenamento e FPS em uma escala visual.
- Animações constantes, ondas ou partículas atrás de dados técnicos; movimento deve explicar estado, não decorar.
- Botões idênticos para ação, navegação e configuração sensível.
- Coleta silenciosa de biblioteca, tokens, IDs pessoais ou logs.
- Captura de performance que se anuncie como benchmark sem cenário, log bruto e classificação.

## Referências

[1]: https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/best-practices/ "Grafana — Dashboard best practices"
[2]: https://carbondesignsystem.com/data-visualization/chart-types/ "IBM Carbon — Chart types"
[3]: https://help.tableau.com/current/blueprint/en-us/bp_visual_best_practices.htm "Tableau — Visual Best Practices"
[4]: https://m3.material.io/foundations/interaction/states "Material Design 3 — States"
[5]: https://fluent2.microsoft.design/components/web/react/core/button/usage "Fluent 2 — Button usage"
[6]: https://www.w3.org/WAI/ARIA/apg/patterns/button/ "WAI-ARIA APG — Button Pattern"
[7]: https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html "WCAG 2.2 — Focus Appearance"
[8]: https://www.nngroup.com/articles/empty-state-interface-design/ "Nielsen Norman Group — Empty States"
[9]: https://primer.style/product/ui-patterns/loading/ "GitHub Primer — Loading"
[10]: https://design-system.agriculture.gov.au/patterns/loading-error-empty-states "Australian Government Design System — Loading, empty and error states"
[11]: https://heroicgameslauncher.com/faq "Heroic Games Launcher — FAQ"
[12]: https://github.com/lutris/lutris/blob/master/docs/installers.rst "Lutris — Writing installers"
[13]: https://usebottles.com/ "Bottles"
[14]: https://github.com/flightlessmango/MangoHud "MangoHud — README"
[15]: https://docs.fedoraproject.org/en-US/gaming/monitoring/ "Fedora Docs — Performance Monitoring"
