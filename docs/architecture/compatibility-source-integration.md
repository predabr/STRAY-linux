# Integração de fontes de compatibilidade

## Objetivo

Expor, no detalhe de cada jogo, fontes externas que ajudam a investigar suporte no Linux sem transformar um link, um rótulo de Steam Deck ou uma classificação de IA em garantia de funcionamento.

## Mapeamento do vocabulário enviado

| Vocabulário do arquivo | Campo atual do Stray Linux | Regra de publicação |
| --- | --- | --- |
| `EXCELLENT` | `excellent` | Somente com registro rastreável publicado. |
| `GOOD` | `good` | Somente com registro rastreável publicado. |
| `PLAYABLE` | `playable` | Somente com registro rastreável publicado. |
| `POOR` | `limited` | Não converter automaticamente; requer resumo e origem específicos. |
| `UNSUPPORTED` | `broken` | Exige evidência de não funcionamento ou bloqueio atual. |
| `UNKNOWN` | `unknown` | Estado obrigatório quando não houver registro publicável. |

O valor numérico de `confidence` do arquivo não é inserido no enum do Stray Linux. O sistema atual usa `high`, `medium`, `low` e `unknown`; uma conversão numérica sem metodologia registrada seria enganosa. Os campos Steam Deck e anti-cheat também não são transformados em um resultado geral do jogo.

## Fontes exibidas

| Fonte | Papel no aplicativo | Proveniência | Limite |
| --- | --- | --- | --- |
| Steam / Steam Deck Verified | Consulta da página oficial do jogo e rótulo Deck quando disponível na Store. | Oficial da Valve. | Descreve a experiência no Steam Deck, não certifica todo Linux. |
| ProtonDB | Consulta de relatos agregados e configuração reportada pela comunidade. | Comunidade; export sob ODbL/DbCL. | Não equivale a teste do Stray Linux e requer atribuição se houver importação. |
| Are We Anti-Cheat Yet? | Consulta de sinal de anti-cheat, notas e atualização comunitária. | Comunidade; repositório MIT. | Anti-cheat não substitui diagnóstico geral de compatibilidade. |

## Política de importação futura

Uma importação só poderá criar ou atualizar `compatibility_records` depois de registrar `content_sources`, URL de origem, data do snapshot, hash de entrada, licença e método de mapeamento. O primeiro estágio implementado no produto é de descoberta por link e transparência; ele não coleta, classifica nem publica avaliações externas automaticamente.
