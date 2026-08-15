# Validação de IA e distribuição — 15 de agosto de 2026

## Stray AI em modo visitante

A rota `/assistant` foi aberta sem sessão autenticada no ambiente de desenvolvimento. A interface exibiu o estado **“visitante e pronta”**, os atalhos de diagnóstico e a informação de que nenhum histórico ou perfil pessoal é lido ou salvo.

O atalho **“Verifique meu ambiente para Vulkan indisponível”** foi enviado pela própria interface e retornou uma resposta estruturada com as seções de leitura, evidência, ações seguras, limites e fontes internas. O teste não tratou a resposta como confirmação de compatibilidade, desempenho ou causa. A rota pública também foi exercitada diretamente por tRPC sem credencial de usuário.

## Pacotes desktop

Os cinco artefatos foram reconstruídos após a fase 2.0 de inteligência local. A inspeção de metadados confirmou `stray-linux` na versão `1.0.0` para Debian, RPM e Pacman; o lote inclui Scanner com sinais Vulkan minimizados, System Graph, timeline, pré-voo, Stray AI explicável, recuperação, logs e alertas locais. Os checksums publicados em `INSTALLERS.md` e `Stray-Linux-1.0.0-SHA256SUMS.txt` correspondem ao lote final enviado ao armazenamento do projeto.

| Formato | SHA-256 |
| --- | --- |
| Windows NSIS | `6d9fd112eb8c9d32d54578b89c95917c460df2645c8d158fba4355dede0c7b77` |
| Debian/Ubuntu | `3741412fc4097af1e97ce17b723316e53d5943bdd5818556a0b85f97cd57d9c1` |
| RPM | `c2c349e01da3fc8ac4e12bc172206ff9db19c53dbcb1fd7eb3b0acc7d251bda8` |
| Pacman | `256dfd4ef3d6d95cd0e7bc13b9260a9124e96ad20876d51a89da7033918e5c49` |
| AppImage | `c2e05c03fb95e8d3d973a5bb5bbd98ac51e58dd72f5edd5f936431c324d02f35` |

## Prevenção de pacote incorreto e fish

A página `/download` não exibe mais Debian/Ubuntu como seleção inicial. Antes de mostrar qualquer comando, ela exige que a pessoa escolha uma família Linux e apresenta um aviso de seleção obrigatória. Com **pacman** escolhido, a interface confirma **“Arch / derivadas · pacote pacman”**, informa que `dpkg` e `apt-get` não existem em Arch e exibe somente `sudo pacman -U /tmp/stray-linux.pacman`.

Todos os blocos Linux agora iniciam com `bash -c`, para que `set -e` seja interpretado pelo Bash quando o usuário cola o bloco em fish, zsh ou Bash. Essa mudança não altera o pacote escolhido: ela somente torna a execução do bloco portável entre shells.

## Divergência observada no domínio publicado

Após a publicação do checkpoint de correção, a rota publicada `/download` ainda respondeu com o bundle anterior: Debian/Ubuntu pré-selecionado, sem o invólucro `bash -c` e com o lote anterior de artefatos. O ambiente de desenvolvimento já apresenta a seleção obrigatória e o método Pacman. A publicação deve ser reemitida e verificada no domínio antes de considerar a correção entregue.

Após a reimplantação, a mesma rota foi recarregada no domínio com um parâmetro de cache e passou a apresentar a seleção obrigatória, sem comando pré-selecionado, com o lote de artefatos atual. A confirmação do método Pacman é verificada em seguida como parte do fluxo publicado.

O clique publicado em **pacman** deve exibir **“Arch / derivadas · pacote pacman”**, a URL final `.pacman`, o checksum `256dfd4e…`, `sudo pacman -U /tmp/stray-linux.pacman` e nenhuma instrução `dpkg`, `apt-get` ou `.deb` no bloco escolhido.

## Confirmação pública do lote 2.0

Em 15 de agosto de 2026, os cinco URLs do armazenamento do projeto responderam `206 Partial Content` a uma requisição de faixa de um byte: Windows NSIS, Debian/Ubuntu `.deb`, RPM, Pacman e AppImage. Essa checagem confirma que os downloads estão publicamente acessíveis sem baixar os arquivos completos; a integridade do conteúdo é confirmada pelos SHA-256 registrados acima.
