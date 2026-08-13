# Fontes e Política de Proveniência

## Catálogo de jogos

A importação de jogos será orientada por fontes públicas ou licenciadas e cada lote armazenará fonte, URL, data de coleta e versão do importador. A documentação Steamworks para `ISteamApps` confirma que endpoints de aplicações podem requerer chave de editor e exigem chamadas feitas exclusivamente no servidor. A aplicação, portanto, nunca chamará esses endpoints diretamente no navegador.

| Fonte | Uso planejado | Estado de acesso | URL |
|---|---|---|---|
| Steamworks `ISteamApps` | Referência oficial de interfaces de aplicações Steam | Documento consultado; algumas operações exigem chave de editor | https://partner.steamgames.com/doc/webapi/isteamapps |
| Steam App List público | Catálogo base de identificadores e títulos a ser verificado no importador | A validar em integração server-side | https://api.steampowered.com/ISteamApps/GetAppList/v2/ |
| Mendeley Data — Steam Games Metadata and Player Reviews (2020–2024) | Snapshot licenciado para carga inicial de títulos e metadados; a importação usará apenas `games.json`, não os reviews | Consultado; CC BY 4.0; cobertura histórica de 2020 a 2024 | https://data.mendeley.com/datasets/jxy85cr3th/2 |

## Wiki de Linux gaming

| Fonte | Conteúdo autorizado para referência | Estado de acesso | URL |
|---|---|---|---|
| ArchWiki — Gaming | Dependências, ambientes, compatibilidade, launchers, configuração e desempenho | Consultada | https://wiki.archlinux.org/title/Gaming |
| Fedora Docs — Gaming | Referência oficial para gaming e drivers Fedora | Bloqueada por desafio anti-bot no ambiente de pesquisa; não será copiada ou importada automaticamente | https://docs.fedoraproject.org/en-US/gaming/ |
| Flathub — Steam | Referência para identificador do aplicativo Flatpak, requisitos de arquitetura e permissões adicionais de biblioteca | Consultada; o pacote é sinalizado como comunitário e sem suporte oficial da Valve | https://flathub.org/en/apps/com.valvesoftware.Steam |
| Flatpak Docs — Using Flatpak | Sintaxe de instalação e execução para comandos apresentados nos guias | Consultada | https://docs.flatpak.org/en/latest/using-flatpak.html |
| Vulkan.org | Referência geral para a plataforma Vulkan e para o diagnóstico apresentado com ressalvas de pacote por distribuição | Consultada | https://vulkan.org/ |
| NVIDIA Vulkan Driver Support | Referência oficial para a disponibilidade de drivers Vulkan NVIDIA, sem recomendar pacote genérico por distribuição | Consultada | https://developer.nvidia.com/vulkan-driver |
| Red Hat Enterprise Linux Docs | Referência oficial para a família RHEL; os artigos não presumem suporte de gaming nem reutilizam comandos de Fedora | Referência de família | https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/ |
| Rocky Linux Docs | Referência de documentação para derivada compatível com RHEL | Referência de família | https://docs.rockylinux.org/ |
| AlmaLinux Wiki | Referência de documentação para derivada compatível com RHEL | Referência de família | https://wiki.almalinux.org/ |

## Regras de qualidade de dados

1. Registros de benchmark devem manter `provenance`, `sourceUrl`, `sourceLabel`, data de medição e status de revisão.
2. A interface só poderá mostrar FPS quando houver um registro com proveniência declarada. Dados sem fonte aparecerão como indisponíveis.
3. O estado `VERIFIED` é reservado a dados revisados por moderação e com evidência rastreável. O estado `COMMUNITY` não é equivalente a verificado.
4. Guias internos devem citar a documentação de origem, ter versão e data de revisão. A plataforma não copiará conteúdos bloqueados, protegidos por acesso ou sem condições claras de uso.

## Aplicativo Windows e IA local opcional

| Fonte | Decisão fundamentada | URL |
|---|---|---|
| Electron — Application Packaging | A aplicação desktop será empacotada com ferramenta de distribuição Electron e terá configuração própria para artefatos Windows. A assinatura de código será tratada como etapa de release. | https://www.electronjs.org/docs/latest/tutorial/application-distribution |
| Ollama — API Introduction | O assistente local será opcional e se conectará, quando habilitado pelo usuário, à API local padrão do Ollama. A plataforma continuará funcional sem o serviço local instalado. | https://docs.ollama.com/api/introduction |

O conector de IA local só poderá enviar ao servidor local selecionado uma pergunta e trechos recuperados do conteúdo interno. Ele não enviará dados privados para um serviço remoto sem uma escolha explícita do usuário.

## Observação sobre a carga inicial de jogos

O endpoint de lista pública Steam testado no ambiente retornou `404` em duas variantes de URL. Como alternativa, o dataset Mendeley consultado informa um arquivo `games.json` de 256 MB com 23.107 jogos Steam lançados entre 2020 e 2024 e licença CC BY 4.0. O importador manterá o nome da fonte, URL, data do snapshot e DOI do dataset em cada lote. A base poderá satisfazer o requisito de 1.000 títulos, mas não será apresentada como catálogo Steam em tempo real; atualizações posteriores devem usar uma fonte disponível e autorizada.
