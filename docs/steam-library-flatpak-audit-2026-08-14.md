# Auditoria de descoberta Steam Flatpak — 2026-08-14

## Correção aplicada

O leitor local passou a reconhecer o caminho padrão atual da Steam Flatpak em `~/.var/app/com.valvesoftware.Steam/.local/share/Steam`, além de caminhos nativos e de compatibilidade já usados por lançadores Linux. A leitura continua limitada a `libraryfolders.vdf` e `appmanifest_*.acf`; não acessa credenciais, conta, nuvem, títulos na rede ou APIs Steam autenticadas.

| Evidência consultada | Uso na correção |
| --- | --- |
| Issue do cliente Steam com rótulo Flatpak, que documenta a biblioteca padrão em `~/.var/app/com.valvesoftware.Steam/.local/share/Steam/steamapps` [1] | Inclusão do caminho padrão Flatpak correto. |
| Discussão do repositório Flathub sobre bibliotecas externas e isolamento do sandbox [2] | Manutenção da leitura local passiva e sem alterar permissões Flatpak. |

O aplicativo não modifica permissões de sandbox, não roda `flatpak override` e não cria bibliotecas. Quando a Steam Flatpak não enxergar uma pasta externa, a configuração deve ser feita pelo usuário no cliente Steam ou por procedimento documentado da própria distribuição.

## Referências

[1] [ValveSoftware/steam-for-linux #10487](https://github.com/ValveSoftware/steam-for-linux/issues/10487)

[2] [Flathub com.valvesoftware.Steam #425](https://github.com/flathub/com.valvesoftware.Steam/issues/425)
