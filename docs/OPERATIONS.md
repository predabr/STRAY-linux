# Operação e manutenção do Stray Linux

Este documento descreve o fluxo de desenvolvimento e operação da versão que inclui perfil de hardware completo, comparações de benchmark, progresso em Linux Setup, feedback autenticado em LinuxFix e indexação técnica pública. O objetivo é manter os dados rastreáveis e evitar que interfaces concluam mais do que as fontes permitem.

## Fluxos de dados

| Recurso | Persistência | Regra de publicação ou apresentação |
|---|---|---|
| Perfil de hardware | `user_hardware_profiles` | CPU, GPU, RAM, distro, kernel, driver, runtimes, armazenamento e monitor são declarados pelo usuário; campos ausentes não são inferidos. |
| Benchmark V2 | `benchmarks` e `benchmark_results` | A comparação usa somente amostras com `verificationStatus = verified` e mantém resolução, preset, ambiente e URL de origem. |
| LinuxFix | `linux_fix_votes`, `linux_fix_comments` e `linux_fix_confirmations` | Votos, comentários e confirmações exigem autenticação. Eles registram experiência de uso e não substituem procedência técnica. |
| Linux Setup | `setup_guide_step_progress` | O progresso é individual, vinculado à conta e à etapa publicada; ele não altera o texto editorial do guia. |
| Recomendações de perfil | `compatibility_records` | O painel exibe apenas registros verificados que coincidem com os campos declarados do perfil ativo. Ausência de resultado não é diagnosticada como incompatibilidade. |

## Desenvolvimento local

Execute os comandos abaixo na raiz do repositório. As validações devem ser realizadas antes de criar qualquer pacote desktop.

```bash
pnpm install
pnpm check
pnpm test
pnpm build
```

O modo web usa a conexão configurada para MySQL/TiDB. O modo Electron mantém o fluxo SQLite local já configurado e não exige `DATABASE_URL` do usuário final.

## Alterações de schema

Ao alterar `drizzle/schema.ts`, gere uma migração, revise o SQL e aplique o conjunto em ordem de dependência. Não aplique mudanças destrutivas sem um plano de restauração e uma revisão explícita do impacto.

```bash
pnpm drizzle-kit generate
```

> A migração `0003_left_chat.sql` é aditiva: cria tabelas de engajamento e progresso e adiciona os campos de descrição de armazenamento e monitor. Ela não remove dados existentes.

## Moderação e limites

| Ação | Quem pode executar | Evidência exigida |
|---|---|---|
| Submeter benchmark | Usuário ativo | FPS medido e uma URL de fonte ou nota de evidência. |
| Verificar ou rejeitar benchmark | Moderador ou administrador | Revisão do ambiente e da fonte antes de promover a medição a verificada. |
| Publicar guia, fix ou artigo | Administração editorial | Fonte declarada e status de publicação apropriado. |
| Votar, comentar ou confirmar LinuxFix | Usuário ativo | Autenticação; o feedback permanece separado da origem editorial. |

O painel administrativo preserva decisões de revisão em auditoria. O sistema não inclui avaliações, comentários, votos, confirmações ou resultados de benchmark fictícios.

## Indexação e performance

As rotas públicas têm títulos e descrições atualizados no cliente, além de OpenGraph, Twitter Card e JSON-LD de aplicação web. `robots.txt` bloqueia áreas pessoais, administração e API; `sitemap.xml` expõe apenas as rotas públicas de alto nível. Páginas são carregadas sob demanda no roteador React para reduzir o JavaScript inicial, mantendo um skeleton transitório durante o carregamento.

## Referências

[1] [Drizzle ORM — migrations](https://orm.drizzle.team/docs/migrations)

[2] [Google Search Central — sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)

[3] [Schema.org — WebApplication](https://schema.org/WebApplication)
