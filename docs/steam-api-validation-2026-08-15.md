# Validação de integração Steam — 15 de agosto de 2026

## Conclusão operacional

O Stray Linux mantém como fonte primária da biblioteca instalada os manifestos locais que o próprio Steam registra no computador do usuário. Essa leitura é local, consentida e não exige credenciais, acesso à conta, cookies ou chamadas remotas.

A documentação pública da Steam informa que o uso da Steam Web API requer uma chave. A referência Steamworks também registra que `ISteamApps/GetAppList/v2` está depreciado por não escalar ao número atual de itens. As operações de parceiro exigem chave Steamworks de publisher e devem permanecer no servidor seguro do titular do App ID. Por isso, o produto não ativa importação remota de metadados, biblioteca de conta ou recursos de publisher sem credenciais autorizadas.

## Integração mantida

| Fluxo | Implementação | Estado |
|---|---|---|
| Jogos Steam instalados | Leitura de `appmanifest_*.acf` e `libraryfolders.vdf` locais | Permitido e local |
| Steam Flatpak | Caminhos locais Flatpak deduplicados | Permitido e local |
| Steam Workshop | Inventário de diretórios locais em modo de leitura | Permitido e local |
| Catálogo publicado | Base licenciada e versionada já presente no produto | Mantido sem sincronização Steam |
| Metadados remotos Steam | Exigem fonte autorizada e/ou chave aplicável | Não ativado |

## Catálogo confirmado

Uma consulta direta ao banco de produção confirmou **10.013 jogos publicados**, dos quais **9.985** possuem descrição registrada. O aprimoramento da Biblioteca não cria registros de instalação nem importa dados remotos: ele organiza melhor as leituras Steam, Heroic e pastas externas e direciona a descoberta ampla para o GameHub publicado.

## Fontes

1. [Steam Web API Documentation](https://steamcommunity.com/dev)
2. [Steamworks — ISteamApps Interface](https://partner.steamgames.com/doc/webapi/isteamapps)
