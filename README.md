# Stray Linux

> Plataforma desktop para Linux gaming com diagnóstico local, catálogo de jogos, compatibilidade rastreável e guias técnicos por distribuição. Criado por **Pedro, Brasil**.

[Site oficial](https://linuxtoys-ckuyvpj5.manus.space) · [Downloads verificados](https://linuxtoys-ckuyvpj5.manus.space/download) · [Desinstalação segura](https://linuxtoys-ckuyvpj5.manus.space/uninstall) · [Contribuir](CONTRIBUTING.md)

## Visão geral

O **Stray Linux** reúne descoberta de jogos, análise de ambiente, Atlas de distribuições, Linux Setup, LinuxFix e evidências de benchmark em uma experiência única. O produto separa fatos publicados, inferências e lacunas de informação: não apresenta FPS, compatibilidade ou soluções como confirmados quando não há evidência declarada.

A interface web usa React e TypeScript; a API usa Express e tRPC; o banco web é modelado com Drizzle. No modo desktop, o Electron executa um servidor local com **SQLite**, sem exigir `DATABASE_URL` da pessoa que instala o aplicativo.

## Release atual — 1.1.1

A release pública atual usa a nova identidade visual do Stray Linux no site, no aplicativo, nos metadados de compartilhamento e nos ícones dos instaladores. O launcher Linux também inclui um fallback explícito de GPU para reduzir falhas de inicialização em ambientes com drivers ou processos gráficos instáveis. O aplicativo seleciona uma porta local disponível e informa quando o servidor local não inicia corretamente.

As atualizações são lidas de feeds HTTPS com metadados de integridade. O aplicativo pede confirmação antes de reiniciar para instalar uma atualização; ele não executa comandos administrativos automaticamente.

## Recursos

| Área | O que o Stray Linux oferece |
|---|---|
| **GameHub** | Catálogo pesquisável de mais de 10.000 jogos distintos, filtros, páginas de detalhe, metadados de origem e biblioteca local. |
| **Compatibilidade** | Contexto por jogo, distribuição, kernel, CPU, GPU, driver, Proton/Wine e runtime, sempre com proveniência ou limitação explícita. |
| **Benchmarks** | Evidências separadas em `Verified`, `Community`, `Estimated` e `Unknown`; não há FPS de demonstração inventado. |
| **Scanner e diagnóstico** | Leitura local de sistema, Steam, Heroic, runtimes, drivers, Vulkan, ambiente gráfico e bibliotecas selecionadas. |
| **Atlas, Wiki e Setup** | Perfis de distribuições, famílias de pacote, guias versionados, comandos copiáveis, avisos e progresso por etapa. |
| **LinuxFix** | Base de problemas com sintomas, causas, confiança, fontes, soluções e confirmações persistentes de pessoas autenticadas. |
| **Windows** | Diagnóstico, reparo, energia, armazenamento e aplicativos úteis com pré-requisitos, risco e referências oficiais. |
| **Stray AI** | Assistente contextual limitado a Stray Linux, gaming no Linux e conteúdo técnico publicado no produto. |
| **Conta e moderação** | Papéis `USER`, `MODERATOR` e `ADMIN`, perfil de hardware, favoritos, reports, fila de revisão e trilha de auditoria. |

## Instalação

Use sempre a página oficial de [downloads verificados](https://linuxtoys-ckuyvpj5.manus.space/download). Ela entrega o formato correto, o SHA-256 correspondente e o comando completo de instalação.

| Plataforma ou família | Formato | Método publicado |
|---|---|---|
| Windows 10/11 x64 | `.exe` | Download direto do instalador NSIS. |
| Debian, Ubuntu, Linux Mint e derivadas | `.deb` | Bloco de terminal que baixa, valida e instala com `dpkg`/APT. |
| Fedora, RHEL e compatíveis | `.rpm` | Bloco de terminal que baixa, valida e instala com DNF. |
| openSUSE Leap e Tumbleweed | `.rpm` | Bloco de terminal que baixa, valida e instala com Zypper. |
| Arch, CachyOS, EndeavourOS e derivadas | `.pacman` | Bloco de terminal que baixa, valida e instala com `pacman -U`. |
| Linux x64 em geral | AppImage | Alternativa portátil com checksum e permissão de execução. |

> **Importante:** o Stray Linux não declara repositórios APT, DNF, Zypper ou Pacman que não existem. Em Linux, copie o bloco completo da família escolhida; ele baixa o arquivo correto, verifica a integridade e remove o temporário quando aplicável.

Para remover o aplicativo, siga o [guia de desinstalação por plataforma](https://linuxtoys-ckuyvpj5.manus.space/uninstall). A remoção do pacote não apaga automaticamente os dados locais do usuário.

## Dados, privacidade e proveniência

O catálogo ampliado parte do arquivo `games.json` do dataset **Steam Games Metadata and Player Reviews (2020–2024)**, disponibilizado sob CC BY 4.0. A importação deduplica títulos, registra lote, AppID, URL e fonte, e não descreve esse snapshot como um catálogo Steam em tempo real.[1]

O scanner, a biblioteca e os diagnósticos começam no dispositivo. A aplicação não envia dados automaticamente. Os conteúdos técnicos publicados registram fonte por artigo; recomendações de comando são apresentadas com escopo, pré-requisitos e avisos. A área Windows não aplica scripts de “debloat” nem recomenda desativar mecanismos de segurança. Consulte [`docs/sources-windows.md`](docs/sources-windows.md) para as referências de manutenção Windows.

## Desenvolvimento

### Requisitos

Use Node.js 22 e pnpm 10, de acordo com o campo `packageManager` do projeto.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

### Verificações

```bash
pnpm check
pnpm test
pnpm build
```

### Banco e catálogo

O schema web está em [`drizzle/schema.ts`](drizzle/schema.ts). Para alterações de banco, gere a migration, revise o SQL e aplique-o pelo fluxo apropriado do ambiente. O importador de jogos é idempotente e recebe um snapshot local licenciado:

```bash
STEAM_DATASET_PATH=/caminho/para/games.json STEAM_IMPORT_LIMIT=10000 node scripts/import-steam-catalog.mjs
DESKTOP_GAME_LIMIT=10000 node scripts/export-desktop-seed.mjs
```

Veja também [`docs/sources-game-catalog.md`](docs/sources-game-catalog.md), [`docs/OPERATIONS.md`](docs/OPERATIONS.md) e [`docs/MODERATION.md`](docs/MODERATION.md).

## Pacotes desktop

```bash
# Instalador Windows NSIS
pnpm desktop:build

# EXE, DEB, RPM, Pacman e AppImage
pnpm desktop:packages
```

Os ícones de build são gerados a partir da marca oficial por `scripts/create_brand_icons.py`. O Electron usa SQLite no diretório de dados do usuário, migra a configuração legada quando existente e não depende de `DATABASE_URL` no computador instalado.

Em Linux, o launcher desativa aceleração GPU e composição antes da inicialização do Electron, além de reservar uma porta local disponível. Esse comportamento privilegia a abertura previsível em distribuições e drivers variados; o aplicativo não altera drivers, runtimes, jogos ou pacotes do sistema sem uma ação explícita.

## Limites deliberados

O projeto não cria avaliações, comentários, pontuações de comunidade ou benchmarks fictícios. Quando uma informação não foi pesquisada ou não possui evidência aplicável, a interface indica a indisponibilidade. Da mesma forma, o Atlas não oferece comandos nativos para projetos descontinuados, sistemas não Linux ou formatos sem artefato validado.

O suporte a Steam, Heroic e pastas externas selecionadas manualmente serve para leitura e diagnóstico de bibliotecas. O Stray Linux não distribui jogos, não contorna licenças e não substitui launchers de terceiros.

## Referências

[1] [Mendeley Data — Steam Games Metadata and Player Reviews (2020–2024)](https://data.mendeley.com/datasets/jxy85cr3th/2)
