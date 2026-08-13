# Linux Gaming Hub

O **Linux Gaming Hub** é uma plataforma técnica para descoberta de jogos, compatibilidade Linux, benchmarks rastreáveis, wiki de distribuições, Linux Setup, LinuxFix, perfis de hardware e moderação comunitária. A interface web é React/TypeScript, o backend é Express/tRPC e a persistência usa Drizzle com MySQL/TiDB. O projeto também inclui um wrapper Electron para Windows.

> A plataforma não apresenta FPS como medição se não houver proveniência. Benchmarks são classificados como **Verified**, **Community**, **Estimated** ou **Unknown**; a ausência de evidência é exibida como indisponibilidade, e não substituída por dados fictícios.

## O que está incluído

| Área | Implementação |
|---|---|
| GameHub | Catálogo pesquisável com 1.500 jogos importados de snapshot licenciado, filtros server-side e páginas de detalhe. |
| Compatibilidade | Modelo por jogo, distro, versão, kernel, CPU/GPU, drivers e Proton/Wine, com níveis de compatibilidade e proveniência. |
| Benchmarks | Workflow de submissão, evidência obrigatória, revisão por MODERATOR/ADMIN e estimativa apenas a partir de benchmarks verificados com ambiente exato. |
| Wiki e Setup | Wiki para 14 distribuições, guias versionados e comandos copiáveis com avisos e fonte registrada. |
| LinuxFix | Soluções categorizadas com sintomas, causas, confiança, origem, comandos e alertas. |
| Conta e moderação | Roles USER/MODERATOR/ADMIN, perfil de hardware, favoritos, guias salvos, reports, fila de benchmark e audit log. |
| Assistente | Chat contextual com recuperação de conteúdo interno; opção de modelo local via Ollama. |
| Desktop | Electron inicia o servidor Node local e oferece script para criar Setup Windows. |

## Dados e proveniência

O catálogo inicial usa somente metadados do arquivo `games.json` do dataset **Steam Games Metadata and Player Reviews (2020–2024)**, que informa 23.107 jogos e é disponibilizado sob CC BY 4.0. O importador seleciona 1.500 títulos reais e grava o lote, URL e origem no banco. O snapshot não é apresentado como catálogo Steam em tempo real.[1]

Os conteúdos iniciais de distribuição e configuração registram URL de fonte por artigo. O guia de Steam via Flatpak identifica explicitamente que o pacote Flathub é comunitário e sem suporte oficial da Valve, como informa sua página.[2] A sintaxe de instalação exibida segue a documentação do Flatpak.[3]

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

## IA contextual e Ollama local

O modo **Plataforma** chama o modelo apenas no servidor e entrega ao modelo trechos recuperados de wiki, guias e LinuxFix. O prompt exige que ele declare a falta de dados, em vez de inventar compatibilidade, FPS ou comandos.

O modo **Ollama local** consulta `http://127.0.0.1:11434` por padrão e não usa token remoto. Instale e execute um modelo local antes de selecioná-lo. No navegador, a máquina deve permitir que a página alcance o endpoint local; no Electron, esse é o fluxo recomendado.

## Windows / Electron

O comando abaixo cria um instalador Windows com NSIS:

```bash
pnpm desktop:build
```

O instalador gerado é `dist/Linux-Gaming-Hub-<versão>-Setup.exe`. A configuração desktop é criada em `linux-gaming-hub.config.json` na pasta de dados do aplicativo. Consulte [`docs/ELECTRON.md`](docs/ELECTRON.md) para as limitações atuais de banco local: a camada atual usa MySQL/TiDB, portanto um banco realmente embarcado exige uma migração para SQLite ou a inclusão explícita de um serviço MySQL/MariaDB.

## Limitações deliberadas

O repositório não finge que possui dados que ainda não foram pesquisados. Na primeira versão, há um único guia Steam via Flatpak e uma correção LinuxFix, ambos com fonte. O schema, a administração e os fluxos de publicação permitem expansão por moderadores sem remover a exigência de origem. Não há benchmark verificado de exemplo nem avaliação de usuário simulada.

Os workflows de revisão estão em [`docs/MODERATION.md`](docs/MODERATION.md) e as regras para contribuir no repositório estão em [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Referências

[1] [Mendeley Data — Steam Games Metadata and Player Reviews (2020–2024)](https://data.mendeley.com/datasets/jxy85cr3th/2)

[2] [Flathub — Steam](https://flathub.org/en/apps/com.valvesoftware.Steam)

[3] [Flatpak Documentation — Using Flatpak](https://docs.flatpak.org/en/latest/using-flatpak.html)
