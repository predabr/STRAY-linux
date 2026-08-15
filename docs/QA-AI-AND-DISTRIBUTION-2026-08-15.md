# Validação de IA e distribuição — 15 de agosto de 2026

## Stray AI em modo visitante

A rota `/assistant` foi aberta sem sessão autenticada no ambiente de desenvolvimento. A interface exibiu o estado **“visitante e pronta”**, os atalhos de diagnóstico e a informação de que nenhum histórico ou perfil pessoal é lido ou salvo.

O atalho **“Verifique meu ambiente para Vulkan indisponível”** foi enviado pela própria interface e retornou uma resposta estruturada com as seções de leitura, evidência, ações seguras, limites e fontes internas. O teste não tratou a resposta como confirmação de compatibilidade, desempenho ou causa. A rota pública também foi exercitada diretamente por tRPC sem credencial de usuário.

## Pacotes desktop

Os cinco artefatos foram reconstruídos após a sincronização do snapshot SQLite e o ajuste do modo visitante. A inspeção de metadados confirmou `stray-linux` na versão `1.0.0` para os formatos Debian e RPM. Os checksums publicados em `INSTALLERS.md` e `Stray-Linux-1.0.0-SHA256SUMS.txt` correspondem ao lote final enviado ao armazenamento do projeto.

| Formato | SHA-256 |
| --- | --- |
| Windows NSIS | `205318a8f752de745f8a86dc79ed45bc88883acc86b94096878fa0930f606161` |
| Debian/Ubuntu | `3941fe65e2614025a8decb0d024f991a8fe75f895462d78f9db49ee1cb8f1ae7` |
| RPM | `cde87a9e0e20d524320a1e76fcaeafdd60cc116943697eb0d9b471394b1ca6ef` |
| Pacman | `bb669a2890bbaa0481a278578705a0af3214609e374bc886928da791b0c2b279` |
| AppImage | `5b6942a33499f8a499e91e3b12d52f50f5a73e4b2968696342d513a49816f2e6` |

## Prevenção de pacote incorreto e fish

A página `/download` não exibe mais Debian/Ubuntu como seleção inicial. Antes de mostrar qualquer comando, ela exige que a pessoa escolha uma família Linux e apresenta um aviso de seleção obrigatória. Com **pacman** escolhido, a interface confirma **“Arch / derivadas · pacote pacman”**, informa que `dpkg` e `apt-get` não existem em Arch e exibe somente `sudo pacman -U /tmp/stray-linux.pacman`.

Todos os blocos Linux agora iniciam com `bash -c`, para que `set -e` seja interpretado pelo Bash quando o usuário cola o bloco em fish, zsh ou Bash. Essa mudança não altera o pacote escolhido: ela somente torna a execução do bloco portável entre shells.

## Divergência observada no domínio publicado

Após a publicação do checkpoint de correção, a rota publicada `/download` ainda respondeu com o bundle anterior: Debian/Ubuntu pré-selecionado, sem o invólucro `bash -c` e com o lote anterior de artefatos. O ambiente de desenvolvimento já apresenta a seleção obrigatória e o método Pacman. A publicação deve ser reemitida e verificada no domínio antes de considerar a correção entregue.

Após a reimplantação, a mesma rota foi recarregada no domínio com um parâmetro de cache e passou a apresentar a seleção obrigatória, sem comando pré-selecionado, com o lote de artefatos atual. A confirmação do método Pacman é verificada em seguida como parte do fluxo publicado.

O clique publicado em **pacman** exibe **“Arch / derivadas · pacote pacman”**, a URL final `.pacman`, o checksum `bb669a28…`, `sudo pacman -U /tmp/stray-linux.pacman` e nenhuma instrução `dpkg`, `apt-get` ou `.deb` no bloco escolhido.
