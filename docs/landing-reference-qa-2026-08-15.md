# QA visual — landing inspirada na referência fornecida

## Composição validada

Em 15 de agosto de 2026, a landing pública foi reconstruída em código a partir da referência visual fornecida pelo criador. A composição preserva o hero em duas colunas, fundo azul-marinho com acento violeta, preview de workspace, sequência de seis capacidades, painéis de sistema/jogo/benchmark/LinuxFix/Stray AI e instalação final em duas plataformas.

| Viewport | Resultado observado |
| --- | --- |
| 1280 × 720, página completa | A hierarquia, distribuição de painéis, CTAs principais e rodapé renderizaram sem sobreposição visível. Os painéis de benchmark e compatibilidade exibem estados de evidência ou indisponibilidade, não métricas inventadas. |
| 375 × 812, página completa | Hero, preview, sequência de capacidades, cartões e blocos de instalação empilharam sem corte horizontal visível. CTAs mantiveram área de toque e legibilidade. |

Os links da landing são implementados como ações reais: download direto do instalador Windows publicado, âncoras para as seções públicas e rotas existentes para Scanner, GameHub, LinuxFix, biblioteca, Benchmark, Stray AI, documentação e métodos de instalação.

## Aplicação da arte original

Por solicitação posterior do criador, a página inicial passou a exibir o arquivo PNG original fornecido, sem alterações visuais. A captura em 864 px de largura corresponde ao layout original integral; em 375 px, a imagem inteira escala proporcionalmente, sem recorte. Hotspots transparentes e focáveis foram aplicados por coordenada relativa para ligar as áreas de ação ao download, workspace, documentação, Scanner, GameHub, Biblioteca, Setup, Benchmark, LinuxFix, Stray AI, instalação e desinstalação.

## Auditoria técnica posterior

As rotas públicas `/`, `/download`, `/uninstall`, `/games`, `/scanner`, `/assistant`, `/benchmark`, `/linuxfix` e `/api/docs` responderam com HTTP 200 após o restart. Não foram encontrados erros recentes no console ou no servidor; o erro histórico de importação de `Setup` continuou apenas como registro anterior à criação da página.

A auditoria de dependências de produção identificou duas vulnerabilidades de alta severidade transitivas. `express` foi atualizado para a série `4.22.2` e os overrides do workspace fixaram `path-to-regexp` em `0.1.13` e `lodash` em `4.18.1`. A nova auditoria retornou `No known vulnerabilities found` para dependências de produção. O único aviso restante é de compatibilidade de peer para uma ferramenta de localização JSX de desenvolvimento; não há falha de compilação ou execução associada.

## Correção da regressão estática

Em resposta ao incidente reportado pelo criador, o componente de imagem estática foi removido da rota pública. As capturas em desktop e celular confirmam que a landing voltou a exibir hero, preview de produto, fluxo de recursos, leitura de sistema, GameHub, Benchmark, LinuxFix, Stray AI, instalação e rodapé como componentes reais. Os CTAs e links internos permanecem no DOM e a página não usa mais a imagem original como substituta da interface.

Após o primeiro checkpoint de correção, o domínio publicado continuou a servir o bundle anterior com a imagem estática. A publicação será acionada novamente e verificada com cache-busting antes de confirmar a recuperação externa.
