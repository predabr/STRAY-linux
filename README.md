# Stray Linux

> Aplicativo desktop local para diagnóstico técnico e gaming no Linux, criado por **Pedro, Brasil**.

[Site oficial](https://linuxtoys-ckuyvpj5.manus.space) · [Downloads verificados](https://linuxtoys-ckuyvpj5.manus.space/download) · [Desinstalação](https://linuxtoys-ckuyvpj5.manus.space/uninstall)

[Arquitetura](docs/ARCHITECTURE.md) · [Ambiente](docs/ENVIRONMENT.md) · [Auditoria final](docs/FINAL_AUDIT_2026-08-18.md) · [Contribuição](CONTRIBUTING.md) · [Segurança](SECURITY.md) · [Conduta](CODE_OF_CONDUCT.md)

O **Stray Linux** combina um site institucional com um aplicativo desktop. O aplicativo é voltado a jogadores Linux que precisam entender o próprio ambiente, organizar a biblioteca local, consultar conteúdo técnico com origem visível e registrar sessões sem converter suposições em métricas. A interface utiliza React e TypeScript; o servidor usa Express/tRPC. No Electron, os dados operacionais ficam em um SQLite local, portanto **não é necessário fornecer `DATABASE_URL`**.

## Versão 1.2.0

A versão **1.2.0** consolida o polimento do Stray Linux como estação local de diagnóstico para Linux gaming. O GameHub recebeu hierarquia de descoberta, filtros e cartões mais claros; a pesquisa global passou a estar disponível também no cabeçalho mobile; e a ferramenta **Comparar** foi restaurada no roteador do aplicativo, deixando de cair em uma tela de rota inexistente. A revisão preserva o funcionamento local, os limites de evidência e os dados já publicados: não cria benchmarks, compatibilidades ou relatos artificiais.

O Scanner é executado automaticamente no aplicativo desktop e também pode ser iniciado manualmente. Ele usa fallbacks locais seguros para distribuição, kernel, CPU, GPU, telas, armazenamento, sessão Wayland/X11, APIs gráficas, drivers e runtimes de gaming. Campos que uma ferramenta não conseguiu observar permanecem como **não informados**, em vez de serem adivinhados. Snapshots alimentam Meu PC, Diagnóstico, Stray AI e a visão geral, e continuam no dispositivo até uma exportação explícita.

Os painéis técnicos separam inventário, disponibilidade, capacidade proporcional e ausência de dados. Diagnóstico traz uma prévia de manutenção por família de pacotes — `pacman -Qdtq`, simulação `apt-get --simulate autoremove` ou `dnf --assumeno autoremove` quando aplicável — apenas para leitura. O aplicativo não remove pacotes, limpa cache, usa `sudo` ou solicita elevação automaticamente. Performance Center registra sessões locais com perfil, CPU, GPU, driver, Proton, Wine e runtime; também permite importar, por escolha explícita, um CSV/LOG/TXT MangoHud local de até 8 MB. A importação não é enviada, não vira benchmark público e só desenha FPS ou frame time se a série existir no arquivo.

## Capacidades

| Área | O que está disponível | Limite explícito |
|---|---|---|
| **GameHub** | Catálogo pesquisável com 10.000 jogos, filtros e páginas de detalhe. | O snapshot não é uma cópia em tempo real da Steam. |
| **Biblioteca local** | Descoberta de Steam, Heroic (Epic, GOG e Amazon) e pastas escolhidas; origem e método de correspondência declarados; detalhes quando o catálogo encontra registro. | Não lê contas, não modifica arquivos e só inicia via ação explícita do usuário. |
| **Scanner e Meu PC** | Distro, kernel, CPU, GPU, RAM, armazenamento, tela, sessão, driver, APIs gráficas, runtimes e ferramentas gaming quando detectáveis. | Campos ausentes são apresentados como não informados; a coleta não é enviada automaticamente. |
| **Diagnóstico** | Sinais técnicos, evidência observada, recomendação segura, nova verificação e prévia consultiva de pacotes. | Não executa limpeza, remoção, cache purge ou elevação de privilégio. |
| **Performance Center** | Sessões locais com retrato do perfil/runtime, gráfico de duração real e importação opt-in de log MangoHud. | Duração de sessão não é benchmark; FPS/frame time só aparecem se existirem no arquivo selecionado. |
| **LinuxFix** | Triagem por sintoma, runbooks categorizados, risco, verificação, reversão, fonte e contribuições moderadas. | Comentários e confirmações nunca são criados artificialmente. |
| **Atlas e Setup** | Conteúdo para 21 distribuições publicadas, guias por família, comandos copiáveis e fontes registradas. | Nenhum comando é apresentado como universal quando depende da distribuição. |
| **Stray AI** | Respostas limitadas ao Stray Linux e gaming no Linux, com contexto de perfil, snapshot e conteúdo interno quando disponível. | Recusa perguntas fora de escopo e não executa comandos. |
| **Atualização** | Feed HTTPS próprio, integridade de artefato e confirmação antes de reiniciar no formato suportado. | O feed não usa GitHub Releases e pacotes Linux seguem o fluxo explícito de cada distribuição. |

## Dados, privacidade e proveniência

O catálogo inicial seleciona 10.000 títulos distintos do snapshot **Steam Games Metadata and Player Reviews (2020–2024)**, disponibilizado sob CC BY 4.0. A popularidade exibida deriva do sinal de avaliações positivas do próprio snapshot; ela não representa dados Steam em tempo real.[1]

O Scanner produz um relatório técnico minimizado. Ele não inclui hostname, usuário, serial, ID de máquina, token Steam, arquivos pessoais ou a lista completa de jogos. Snapshots e diagnósticos ficam no dispositivo até uma ação explícita de exportação ou importação. A mídia da Biblioteca só usa material local autorizado ou uma URL pública determinística derivada de um App ID existente; qualquer ausência de mídia permanece explícita.

> O Stray Linux não inventa FPS, benchmarks, testes de compatibilidade, reviews ou relatos comunitários. A falta de evidência é exibida como indisponibilidade.

## Instalação

Abra a [página oficial de downloads](https://linuxtoys-ckuyvpj5.manus.space/download) e escolha a plataforma. O Windows possui download direto do `.exe`. Em Linux, a página fornece blocos completos e específicos para **Debian/Ubuntu**, **Fedora/RHEL**, **openSUSE**, **Arch** e **AppImage**; cada bloco baixa o arquivo para um diretório temporário, verifica o SHA-256 e usa o gerenciador de pacotes correto.

| Plataforma | Formato publicado | Instalação e remoção |
|---|---|---|
| Windows | Instalador NSIS `.exe` | Download direto; remoção pelo Windows ou pelo desinstalador criado pelo instalador. |
| Debian/Ubuntu | `.deb` | Use apenas o bloco com `dpkg`/APT publicado para esse formato. |
| Fedora/RHEL e openSUSE | `.rpm` | Use apenas o bloco DNF/Zypper apropriado exibido na página. |
| Arch e derivadas | `.pacman` | Use apenas o bloco `pacman -U` publicado para Arch. |
| Distribuições sem pacote nativo | `.AppImage` | Download, verificação de hash e execução explícita; não altera o sistema. |

> Em shells Fish, não execute `set -e`, pois essa sintaxe exige um argumento. A página de downloads fornece um bloco compatível com o shell selecionado. Não use um comando `.deb` em Arch, nem um pacote Pacman em Debian/Ubuntu.

Para remover o aplicativo ou entender a diferença entre removê-lo e apagar dados locais, siga o [guia de desinstalação](https://linuxtoys-ckuyvpj5.manus.space/uninstall). A remoção do pacote **não apaga automaticamente** seu SQLite, logs ou snapshots.

## Atualizações

O aplicativo consulta o feed HTTPS em `https://linuxtoys-ckuyvpj5.manus.space/updates/`. Ele não depende da API de Releases do GitHub. Quando existir uma atualização compatível, o usuário vê a proposta, confere o artefato e confirma antes do reinício. A release **1.2.0** publica feed, blockmap Windows e cinco artefatos com SHA-256 para os comandos Linux e SHA-512 para o atualizador Electron. Os comandos usam um manifesto único, e os links estáveis redirecionam aos arquivos hashed da mesma release. O pipeline foi mantido em Node/TypeScript e Electron; não foi embutido um segundo runtime sem benefício medido, evitando aumentar o tamanho e a superfície de falha dos instaladores.

## Diagnóstico de instalação e inicialização

Se o app não abrir em Linux, consulte primeiro o arquivo `stray-linux-server.log` no diretório de dados da aplicação. O launcher registra saída do servidor local e motivo de término. As releases atuais incluem o `sql-wasm.wasm` como recurso externo e o encaminham ao runtime SQLite, evitando depender do diretório de trabalho do menu ou terminal.

Antes de reportar um problema, registre: distribuição e versão, formato instalado, comando usado, checksum verificado, texto completo do erro e, se desejar compartilhar, um diagnóstico exportado. Não envie tokens, chaves ou dados privados.

## Desenvolvimento

```bash
pnpm install
pnpm dev
```

Os checks essenciais são:

```bash
pnpm check
pnpm test
pnpm build
```

Para gerar um instalador Windows:

```bash
pnpm desktop:build
```

Para gerar a matriz de cinco artefatos:

```bash
pnpm desktop:packages
```

O servidor de desenvolvimento fica em `server/_core/dev.ts`; o servidor de produção em `server/_core/index.ts` não importa Vite. O router de desktop fica em `server/desktop/router.ts`, o armazenamento local em `server/desktop/localStore.ts` e o contrato compartilhado de Scanner em `shared/scannerReport.ts`. A lógica de saúde usada por Scanner e Diagnóstico está em `shared/linuxHealth.ts`.

## Arquitetura e interface

O site e o aplicativo compartilham princípios visuais, mas não a mesma finalidade. O site é institucional: explica o produto, mostra limites e entrega downloads por formato. O aplicativo é operacional: usa uma navegação própria, pré-carrega rotas de uso frequente e separa estado, evidência e ações locais. A reconstrução modular atual distribui landing, navegação desktop, estados vazios, métricas e carregamento de rotas em componentes menores. Consulte [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) para a divisão completa de camadas.

## Fontes e contribuição

Os artigos, guias e runbooks preservam URLs e proveniência. Steam no Flatpak é identificado como um pacote comunitário sem suporte oficial da Valve, conforme a página do Flathub.[2] Os comandos Flatpak seguem a documentação oficial.[3] O fluxo de moderação e contribuição está em [`docs/MODERATION.md`](docs/MODERATION.md); as regras de contribuição de código estão em [`CONTRIBUTING.md`](CONTRIBUTING.md). Consulte também a política de [`segurança`](SECURITY.md) e o [`código de conduta`](CODE_OF_CONDUCT.md).

## Referências

[1] [Mendeley Data — Steam Games Metadata and Player Reviews (2020–2024)](https://data.mendeley.com/datasets/jxy85cr3th/2)

[2] [Flathub — Steam](https://flathub.org/en/apps/com.valvesoftware.Steam)

[3] [Flatpak Documentation — Using Flatpak](https://docs.flatpak.org/en/latest/using-flatpak.html)
