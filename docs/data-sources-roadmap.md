# Roadmap de fontes — dados reais e compatibilidade

## Constatações iniciais

| Domínio | Fonte | Classificação proposta | Limite de uso |
| --- | --- | --- | --- |
| Steam Web API | [Steamworks Web API authentication][1] | Oficial | Alguns métodos são públicos; métodos com chave exigem conta Steam, domínio associado e aceite dos termos. Chaves devem permanecer somente no servidor. |
| Proton | [ValveSoftware/Proton releases][2] | Oficial | Usar apenas para catálogo/versionamento de releases publicadas pela Valve, com URL, tag, commit e data de coleta. |
| ProtonDB | [ProtonDB data exports][3] | Comunitária licenciada | O repositório declara exportações sob ODbL e conteúdo individual sob DBCL. Relatórios devem continuar rotulados como comunitários; não equivalem a benchmark verificado nem suporte oficial da Valve. |
| Mesa | [Mesa 3D][4] | Oficial | Usar como referência de release e componentes de driver open-source. A página separa drivers oficialmente suportados, comunitários e não endossados; a versão upstream não garante disponibilidade em cada distribuição. |

> A fase de dados não deve importar preços, avaliações, capturas, relatórios ou metadados sem confirmar licença, termos e origem de cada campo. Cada sincronização precisa preservar URL de origem e data de coleta.

## Referências

[1]: https://partner.steamgames.com/doc/webapi_overview/auth "Steamworks: Authentication using Web API Keys"
[2]: https://github.com/ValveSoftware/Proton/releases "ValveSoftware/Proton releases"
[3]: https://github.com/bdefore/protondb-data "ProtonDB data exports under ODbL"
[4]: https://www.mesa3d.org/ "Mesa 3D Graphics Library"

## Limite atual da integração Steam

O ambiente validou a credencial contra a lista oficial de interfaces e registra cada verificação em `source_refresh_runs`. A sincronização não importa páginas, capas, screenshots ou metadados de loja por endpoints não documentados. A próxima importação deverá usar somente uma interface explicitamente permitida para a chave do projeto ou um feed licenciado aprovado, preservando `Steam App ID`, URL, data de coleta e campos alterados.
