# Auditoria de integração Heroic e mídia — 2026-08-15

O Stray Linux pode descobrir localmente jogos já instalados pelo **Heroic Games Launcher**, sem acessar credenciais, tokens, conta Epic, rede da loja ou mecanismos de instalação. O Heroic declara suporte a Epic Games Store, GOG e Amazon Games e organiza a instalação Epic por meio do Legendary.[1]

Para jogos Epic já instalados, a implementação do Heroic lê o seu `installed.json` e metadados locais; os metadados podem incluir `keyImages`, inclusive arte de capa. O Stray Linux poderá ler somente os campos necessários do computador do usuário e apresentar a imagem por referência local de origem, sem importar esse arquivo para o catálogo público e sem enviá-lo ao servidor.[2]

> **Limite de mídia:** capas do catálogo público continuam ausentes enquanto não houver uma fonte licenciada e rastreável aprovada. A Epic trata as imagens de ofertas e biblioteca como ativos de storefront sujeitos a requisitos e políticas de mídia; portanto, o projeto não fará coleta ampla ou espelhamento de capas da loja.[3]

| Decisão | Implementação |
|---|---|
| Heroic/Epic | Descoberta somente leitura de instalações já registradas localmente. |
| GOG/Amazon | O retorno preserva a origem `heroic`; a leitura inicial não presume formato interno não confirmado. |
| Capas Heroic | Mostrar somente quando os metadados locais já fornecerem uma URL de imagem; identificar como `Heroic local`. |
| Capas do GameHub público | Continuar com estado sem mídia até existir feed licenciado e documentado. |
| Dados privados | Nunca ler tokens, credenciais, cookies, bibliotecas não instaladas ou executar o launcher. |

## Referências

[1]: https://heroicgameslauncher.com/ "Heroic Games Launcher"
[2]: https://github.com/Heroic-Games-Launcher/HeroicGamesLauncher/blob/main/src/backend/storeManagers/legendary/library.ts "Heroic — Legendary library manager"
[3]: https://dev.epicgames.com/docs/epic-games-store/sales-and-marketing/marketing/storefront-media-guide "Epic Games Store — Storefront Media Guide"
