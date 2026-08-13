# Fonte de expansão do catálogo de jogos

O catálogo ampliado do Stray Linux utilizará apenas metadados de jogos obtidos de uma fonte com licença e proveniência explícitas. A fonte selecionada é **Steam Games Metadata and Player Reviews (2020–2024)**, versão 2, publicada no Mendeley Data por Hisham Abdelqader em 30 de junho de 2025, sob licença CC BY 4.0.[1]

> A página da fonte declara que o arquivo `games.json` contém metadados de **23.107 jogos** Steam lançados de 2020 em diante. Esse conjunto é suficiente para selecionar 10.000 títulos distintos sem criar registros sintéticos.[1]

O pipeline usará somente os campos de metadados necessários ao catálogo, como AppID, título, descrição, desenvolvedor, publicador, data de lançamento, gênero e categoria. Comentários e avaliações de usuários não serão importados como conteúdo do Stray Linux. A seleção priorizará sinais reais do próprio snapshot, preservando AppID e URL de origem em cada registro.

| Elemento | Decisão operacional |
|---|---|
| Fonte | Mendeley Data, DOI `10.17632/jxy85cr3th.2` |
| Licença declarada | CC BY 4.0 |
| Arquivo necessário | `games.json` |
| Escopo de importação | 10.000 jogos Steam distintos do snapshot 2020–2024 |
| Metadados exibidos | Apenas campos presentes na fonte e sanitizados pelo pipeline |
| Não inferido | Compatibilidade Linux, FPS, avaliações, screenshots ou status Steam Deck sem uma fonte específica |

## Referências

[1] [Mendeley Data — Steam Games Metadata and Player Reviews (2020–2024), versão 2](https://data.mendeley.com/datasets/jxy85cr3th/2)

[2] [Mendeley Data API — documentação](https://data.mendeley.com/api/docs/)
