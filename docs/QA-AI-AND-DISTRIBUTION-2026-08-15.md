# Validação de IA e distribuição — 15 de agosto de 2026

## Stray AI em modo visitante

A rota `/assistant` foi aberta sem sessão autenticada no ambiente de desenvolvimento. A interface exibiu o estado **“visitante e pronta”**, os atalhos de diagnóstico e a informação de que nenhum histórico ou perfil pessoal é lido ou salvo.

O atalho **“Verifique meu ambiente para Vulkan indisponível”** foi enviado pela própria interface e retornou uma resposta estruturada com as seções de leitura, evidência, ações seguras, limites e fontes internas. O teste não tratou a resposta como confirmação de compatibilidade, desempenho ou causa. A rota pública também foi exercitada diretamente por tRPC sem credencial de usuário.

## Pacotes desktop

Os cinco artefatos foram reconstruídos após a sincronização do snapshot SQLite e o ajuste do modo visitante. A inspeção de metadados confirmou `stray-linux` na versão `1.0.0` para os formatos Debian e RPM. Os checksums publicados em `INSTALLERS.md` e `Stray-Linux-1.0.0-SHA256SUMS.txt` correspondem ao lote final enviado ao armazenamento do projeto.

| Formato | SHA-256 |
| --- | --- |
| Windows NSIS | `4f4cbae9a4a934f440d8c3f14860acccd3c93b8257ba08f875d4206581da9786` |
| Debian/Ubuntu | `e683dab519b731bd97f198e1d1784ddad4d5390b7a29e5e7f491c5aac42d5232` |
| RPM | `d4f8e02ab166d5f62f4f639d53891ff21a2107ade31df9146c4417185845ecb6` |
| Pacman | `5d5cc6d92ecd9ac2c1d30b51ab9e111cd04ed03d7eb3dafd25e9a97b4806a3ba` |
| AppImage | `594083dacccb83804df2b2900935ea303d9ca011c1a6219da6d6cd51b69f8f29` |

## Prevenção de pacote incorreto e fish

A página `/download` não exibe mais Debian/Ubuntu como seleção inicial. Antes de mostrar qualquer comando, ela exige que a pessoa escolha uma família Linux e apresenta um aviso de seleção obrigatória. Com **pacman** escolhido, a interface confirma **“Arch / derivadas · pacote pacman”**, informa que `dpkg` e `apt-get` não existem em Arch e exibe somente `sudo pacman -U /tmp/stray-linux.pacman`.

Todos os blocos Linux agora iniciam com `bash -c`, para que `set -e` seja interpretado pelo Bash quando o usuário cola o bloco em fish, zsh ou Bash. Essa mudança não altera o pacote escolhido: ela somente torna a execução do bloco portável entre shells.
