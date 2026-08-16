# Revisão de fontes de compatibilidade de jogos

Data de pesquisa: 2026-08-16

## Steam Deck Verified — Valve

Fonte: <https://steamdeck.com/en/verified>

A Valve publica quatro categorias para a compatibilidade no Steam Deck: **Verified**, **Playable**, **Unsupported** e **Unknown**. Os critérios de *Verified* cobrem entrada, resolução e legibilidade, integração com launcher e suporte de sistema, incluindo middleware e anti-cheat quando o jogo roda por Proton. Esse rótulo descreve o Steam Deck; ele não deve ser convertido automaticamente em uma garantia de desempenho ou compatibilidade geral em todo Linux.

## ProtonDB

Fontes consultadas: <https://www.protondb.com/> e <https://www.protondb.com/news/report-exports-odbl>

O repositório oficial `bdefore/protondb-data` declara que os exports de relatórios do ProtonDB são disponibilizados sob Open Database License (ODbL), enquanto direitos sobre conteúdos individuais são licenciados sob Database Contents License (DbCL). O ProtonDB se apresenta como base comunitária, usa também dados Steam/SteamDB e declara não ter afiliação com a Valve. Antes de importar dados em massa, a integração deve preservar atribuição, URL de origem, data do snapshot e as obrigações aplicáveis de ODbL/DbCL.

## Decisão provisória

O Stray Linux pode exibir links externos e metadados próprios com fonte e data. A aplicação não deve gerar níveis por IA nem converter automaticamente rótulos Steam Deck ou tiers comunitários em registros publicados de compatibilidade. Dados externos só entram após confirmação de formato, licença, atribuição e método de atualização permitidos. O rótulo Steam Deck é uma certificação para essa plataforma portátil e não equivale, isoladamente, a uma garantia universal de suporte Linux.

## Are We Anti-Cheat Yet?

Fontes: <https://areweanticheatyet.com/> e <https://github.com/AreWeAntiCheatYet/AreWeAntiCheatYet>

O projeto mantém uma lista comunitária de jogos com anti-cheat e respectivos estados para GNU/Linux, Wine ou Proton. O repositório público declara licença MIT e mantém os dados em `games.json`; a página inclui estado, anti-cheat, notas e data de atualização. Esse dado é útil como **sinal específico de anti-cheat** e deve ser apresentado como comunitário, com URL e data de origem. Ele não é, sozinho, uma classificação geral de desempenho ou suporte de um jogo.
