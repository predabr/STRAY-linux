# Stray Linux — Design System

## Princípio

O Stray Linux usa uma linguagem de **diagnóstico para Linux gaming**: base grafite quase preta, informação operacional clara, acento azul para ação, ciano para evidência e estados semânticos para resultados. A atmosfera deve dar profundidade, mas nunca competir com o conteúdo.

| Camada | Papel | Regra de uso |
|---|---|---|
| Canvas | Fundo de aplicação | Gradientes ambientais discretos; sem linhas decorativas aleatórias. |
| Surface | Blocos de leitura | Borda de baixo contraste, raio compacto e densidade informativa. |
| Elevated | Controle ou painel principal | Usado para formulário, resultado ou contexto que exige foco. |
| Primary | Ação deliberada | Azul. Uma ação principal por contexto. |
| Evidence | Origem, método e estado técnico | Ciano monoespaçado; nunca substitui o conteúdo principal. |
| Success / warning / danger | Estado semântico | Sempre combinado com texto, ícone ou rótulo. |

## Tipografia e espaçamento

Títulos são curtos, compactos e de alto contraste. Metadados, proveniência e estados operacionais usam monoespaçada. A escala de espaçamento parte de 4 px e privilegia grupos compactos, evitando dashboards com áreas vazias excessivas.

## Movimento

Interações de alta frequência usam transição curta de cor, borda, sombra e transformação. Carregamentos usam skeletons e o estado de entrada do aplicativo, respeitando `prefers-reduced-motion`. Não são usados bounce, glitch, pulsação neon contínua ou efeitos que ocultem a leitura.

## Fallback de mídia

Quando não houver mídia licenciada ou local, jogos recebem uma capa gráfica abstrata baseada no identificador e no estado de proveniência. O fallback não sugere arte oficial e não usa imagens de terceiros.
