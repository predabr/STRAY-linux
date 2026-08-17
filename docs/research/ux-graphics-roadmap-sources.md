# Pesquisa de UX, gráficos e Linux gaming

## Síntese aplicável

### Dashboards e gráficos

- Um dashboard deve responder uma pergunta e progredir do geral ao específico. A leitura precisa reduzir carga cognitiva, comparar somente grandezas compatíveis e oferecer drill-downs direcionados. O Stray deve separar **inventário**, **estado observado**, **histórico**, **alerta** e **evidência**, em vez de usar gráficos decorativos ou valores em escala incompatível.
- Barras são adequadas para comparação de categorias; linhas para tendência temporal; medidores para parte-de-todo; e relações técnicas podem usar diagramas de conexão. Cada visual precisa declarar unidade, fonte, período e ausência de dado.
- Cor deve ser escassa e semântica. Para o Stray, neutros sustentam a interface e azul-pálido representa evidência/ação selecionada; alerta técnico precisa de rótulo, ícone e texto, não apenas cor.

### Botões, ação e acessibilidade

- Uma superfície deve ter apenas uma ação primária. Ações secundárias devem ter menor peso visual; links devem navegar e botões devem executar uma ação.
- Estados de enabled, disabled, hover, focus e pressed precisam ser consistentes. Foco de teclado deve ser claramente visível; a referência WCAG explica uma área comparável a contorno sólido de 2 px e alteração de contraste mínima de 3:1.
- Fluxos assíncronos exigem informação perto do conteúdo que está carregando. Para espera curta, usar estado indeterminado discreto; para espera longa e mensurável, progresso determinado; sucesso e falha devem indicar o próximo passo.

### Estados sem dados

- Vazio não significa erro. Cada estado deve dizer se a coleta ainda não foi executada, se o filtro não retornou itens, se um launcher não foi encontrado, ou se houve falha de leitura. Deve existir um caminho direto para executar scanner, limpar filtros ou tentar novamente.

### Padrões Linux gaming a adaptar, não substituir

- O Heroic mantém configurações por jogo e permite seleção de Wine/Proton, mas alerta que resultados podem variar. O Stray deve manter perfis de ambiente e recomendações com proveniência, não aplicar mudanças automaticamente.
- A documentação do Lutris organiza configuração em jogo, runner e sistema, e recomenda reduzir customizações de runner ao necessário. Isso inspira um editor **"Plano de execução"** com diff, reversão e confirmação — nunca comandos executados sem leitura humana.
- Bottles enfatiza ambientes isolados, versões por recipiente e snapshots. O Stray pode oferecer uma linha do tempo de alterações e exportação/backup de perfil antes de sugestões sensíveis.
- MangoHud suporta overlay e logging local, mas logs não equivalem a benchmark verificado. Uma futura captura deve ser opt-in, guardar configuração/contexto e separar **local não verificado**, **verificado** e **estimado indisponível**.

## Fontes

1. Grafana, *Dashboard best practices*: https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/best-practices/
2. IBM Carbon, *Chart types*: https://carbondesignsystem.com/data-visualization/chart-types/
3. Tableau, *Visual Best Practices*: https://help.tableau.com/current/blueprint/en-us/bp_visual_best_practices.htm
4. Material Design 3, *States*: https://m3.material.io/foundations/interaction/states
5. Fluent 2, *Button usage*: https://fluent2.microsoft.design/components/web/react/core/button/usage
6. W3C WAI-ARIA APG, *Button Pattern*: https://www.w3.org/WAI/ARIA/apg/patterns/button/
7. W3C WCAG 2.2, *Focus Appearance*: https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html
8. Nielsen Norman Group, *Designing Empty States in Complex Applications*: https://www.nngroup.com/articles/empty-state-interface-design/
9. GitHub Primer, *Loading*: https://primer.style/product/ui-patterns/loading/
10. Australian Government Design System, *Loading, empty and error states*: https://design-system.agriculture.gov.au/patterns/loading-error-empty-states
11. Heroic Games Launcher, *FAQ*: https://heroicgameslauncher.com/faq
12. Lutris, *Writing installers*: https://github.com/lutris/lutris/blob/master/docs/installers.rst
13. Bottles, página do projeto: https://usebottles.com/
14. MangoHud, repositório e README: https://github.com/flightlessmango/MangoHud
15. Fedora Docs, *Performance Monitoring*: https://docs.fedoraproject.org/en-US/gaming/monitoring/
