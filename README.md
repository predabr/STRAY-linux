# Stray Linux

O **Stray Linux**, criado no Brasil, é um aplicativo desktop técnico para descoberta de jogos, compatibilidade Linux, benchmarks rastreáveis, Atlas de distribuições, Linux Setup, LinuxFix e perfis de hardware. A interface web é React/TypeScript, o backend é Express/tRPC e a persistência usa Drizzle com MySQL/TiDB. O aplicativo Electron usa SQLite local e não exige `DATABASE_URL` do usuário.

> A plataforma não apresenta FPS como medição se não houver proveniência. Benchmarks são classificados como **Verified**, **Community**, **Estimated** ou **Unknown**; a ausência de evidência é exibida como indisponibilidade, e não substituída por dados fictícios.

## O que está incluído

| Área | Implementação |
|---|---|
| GameHub | Catálogo pesquisável com mais de 10.000 jogos distintos importados de snapshot licenciado, ordenação por popularidade declarada pela fonte, filtros server-side e páginas de detalhe. |
| Compatibilidade | Modelo por jogo, distro, versão, kernel, CPU/GPU, drivers e Proton/Wine, com níveis de compatibilidade e proveniência. |
| Benchmarks | Workflow de submissão, evidência obrigatória, revisão por MODERATOR/ADMIN, comparação V2 por GPU/CPU/distro/Proton e estimativa apenas a partir de benchmarks verificados com ambiente exato. |
| Wiki e Setup | Wiki para 17 distribuições, 36 guias versionados, comandos copiáveis, passos recolhíveis e progresso autenticado por etapa. |
| Atlas de Distribuições | Registro pesquisável de 753 entradas únicas da lista editorial, separado entre família de pacote, variante histórica, referência não Linux e avaliação necessária. |
| LinuxFix | Soluções categorizadas com sintomas, causas, confiança, origem, comandos e alertas, com votos, comentários e confirmações persistentes de usuários autenticados. |
| Windows | Área de diagnóstico, manutenção, reparo, energia, armazenamento e aplicativos úteis, com comandos individuais, requisitos, níveis de risco e fontes oficiais. |
| Conta e moderação | Roles USER/MODERATOR/ADMIN, perfil de hardware completo, favoritos, guias salvos, reports, fila de benchmark e audit log. |
| Navegação e indexação | Paleta global em `Ctrl/Cmd+K`, pesquisa categorizada, metadados por rota, OpenGraph, Twitter Cards, `robots.txt`, sitemap e JSON-LD. |
| Assistente | Stray AI contextual para dúvidas sobre Stray Linux e gaming no Linux, com recusa explícita de pedidos fora do escopo. |
| Desktop | Electron inicia o servidor Node local com SQLite, sem `DATABASE_URL`, detecta Steam, Heroic e pastas externas selecionadas manualmente e oferece pacotes Windows e Linux por formato compatível. |

## Dados e proveniência

O catálogo ampliado usa somente metadados do arquivo `games.json` do dataset **Steam Games Metadata and Player Reviews (2020–2024)**, disponibilizado sob CC BY 4.0. O importador seleciona **10.000 títulos distintos** pelo sinal de avaliações positivas presente no próprio snapshot, grava o lote, AppID, URL e origem no banco, e mantém esse sinal como ordenação de popularidade. O snapshot não é apresentado como catálogo Steam em tempo real.[1]

Os conteúdos iniciais de distribuição e configuração registram URL de fonte por artigo. O guia de Steam via Flatpak identifica explicitamente que o pacote Flathub é comunitário e sem suporte oficial da Valve, como informa sua página.[2] A sintaxe de instalação exibida segue a documentação do Flatpak.[3]

A área Windows não executa comandos, não aplica scripts de “debloat” e não recomenda desativar componentes de segurança. Ela apresenta ações individuais com requisito, risco e fonte, priorizando WinGet, DISM/SFC e Storage Sense documentados pela Microsoft. Consulte [`docs/sources-windows.md`](docs/sources-windows.md) para o escopo e as referências.

## Instalação para usuários

No Windows, baixe o instalador direto [na página oficial do Stray Linux](https://linuxtoys-ckuyvpj5.manus.space/#instalar). Em Linux, a página exibe um comando específico para Debian/Ubuntu, Fedora/RHEL, openSUSE, Arch ou AppImage. Cada comando baixa o pacote correto, valida o SHA-256 antes da instalação e remove o arquivo temporário quando aplicável.

> A distribuição Linux é intencionalmente apresentada pelo terminal. O Stray Linux não anuncia repositórios APT, DNF ou Pacman que não foram publicados e mantidos como repositórios de pacotes.

Para desinstalar, consulte o [guia público de remoção](https://linuxtoys-ckuyvpj5.manus.space/uninstall). A remoção do aplicativo não apaga automaticamente dados locais.

## Desenvolvimento web

Instale dependências e inicie o ambiente:

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

O banco é modelado em `drizzle/schema.ts`. Após mudanças de esquema, gere a migration, revise o SQL e aplique-a pelo fluxo de banco do ambiente. O script `scripts/import-steam-catalog.mjs` é idempotente e pode recriar o catálogo a partir de um download local do snapshot licenciado.

Para importar a seleção de 10.000 jogos, disponibilize o arquivo `games.json` e execute:

```bash
STEAM_DATASET_PATH=/caminho/para/games.json STEAM_IMPORT_LIMIT=10000 node scripts/import-steam-catalog.mjs
DESKTOP_GAME_LIMIT=10000 node scripts/export-desktop-seed.mjs
```

A migração `drizzle/0004_solid_exiles.sql` acrescenta a métrica `sourcePositiveReviews` e o índice utilizado na ordenação do catálogo. O modo desktop armazena a mesma métrica no snapshot SQLite e indexa o título e a popularidade para busca e listagem local. Consulte também [`docs/sources-game-catalog.md`](docs/sources-game-catalog.md).

Para a evolução de perfil e engajamento, a migração `drizzle/0003_left_chat.sql` adiciona campos de armazenamento e monitor ao perfil, votos, comentários e confirmações de LinuxFix, além de progresso de guia por etapa. A migração é **aditiva** e não remove tabelas ou colunas existentes. O procedimento de trabalho, as rotas públicas e os limites de moderação estão descritos em [`docs/OPERATIONS.md`](docs/OPERATIONS.md).

## Stray AI contextual

O Stray AI recupera apenas contexto publicado de wiki, guias, LinuxFix e perfil técnico disponível. O fluxo exige que ele declare a falta de dados em vez de inventar compatibilidade, FPS ou comandos, e recusa pedidos que não estejam relacionados ao Stray Linux, ao gaming no Linux ou ao conteúdo técnico do aplicativo.

## Desktop, Windows e Linux

O comando abaixo cria um instalador Windows com NSIS:

```bash
pnpm desktop:build
```

O instalador gerado é `dist/Stray-Linux-<versão>-Setup.exe`. A configuração desktop é criada em `stray-linux.config.json` na pasta de dados do aplicativo; uma configuração antiga é migrada na abertura. O modo desktop usa SQLite local e não exige `DATABASE_URL`.

Os alvos Linux são escolhidos por família: `.deb` para Debian/Ubuntu e derivadas, `.rpm` para Fedora/RHEL/openSUSE, `.pacman` para Arch e derivadas e `.AppImage` como rota portátil. O comando e o artefato devem corresponder à release e à arquitetura detectadas; variantes imutáveis são orientadas ao fluxo portátil. Consulte [`docs/sources-installers.md`](docs/sources-installers.md) e o Atlas no aplicativo.

## Limitações deliberadas

O repositório não finge que possui dados que ainda não foram pesquisados. Não há benchmark verificado de exemplo nem avaliação de usuário simulada. O Atlas não fornece comandos nativos para projetos descontinuados, sistemas não Linux ou formatos sem artefato publicado e validado; nesses casos, o produto apresenta o limite explicitamente.

Os workflows de revisão estão em [`docs/MODERATION.md`](docs/MODERATION.md) e as regras para contribuir no repositório estão em [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Referências

[1] [Mendeley Data — Steam Games Metadata and Player Reviews (2020–2024)](https://data.mendeley.com/datasets/jxy85cr3th/2)

[2] [Flathub — Steam](https://flathub.org/en/apps/com.valvesoftware.Steam)

[3] [Flatpak Documentation — Using Flatpak](https://docs.flatpak.org/en/latest/using-flatpak.html)
