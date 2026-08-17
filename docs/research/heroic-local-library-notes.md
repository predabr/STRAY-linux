# Heroic — notas de descoberta local

Esta rodada manteve a descoberta do Stray Linux estritamente local e somente leitura. A implementação lê `installed.json` em diretórios de configuração do Heroic para instalações registradas, sem abrir arquivos de autenticação, tokens, cookies, executáveis ou fazer chamadas de rede.

O Heroic se apresenta como launcher de jogos Epic, GOG e Amazon. A estrutura GOG `gog_store/installed.json` foi identificada em discussão pública do projeto; caminhos podem variar entre versões, portanto campos ausentes são tratados como ausência e não como falha de licença ou instalação.

## Referências

- Heroic Games Launcher, página do projeto: https://heroicgameslauncher.com/
- Repositório Heroic Games Launcher: https://github.com/Heroic-Games-Launcher/HeroicGamesLauncher
- Discussão pública sobre `gog_store/installed.json`: https://github.com/Heroic-Games-Launcher/HeroicGamesLauncher/issues/2691
- Repositório `heroic-gogdl`: https://github.com/Heroic-Games-Launcher/heroic-gogdl
