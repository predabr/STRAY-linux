# Runbook de produção — Stray Linux

## Estado da preparação

O Stray Linux já mantém perfis técnicos, fontes editoriais, lotes de importação, histórico de refresh, revisão de benchmarks e evidências armazenadas fora do banco. A chave Steam Web API foi validada apenas no servidor por uma chamada leve à lista de interfaces; nenhum valor secreto é exibido, enviado ao cliente ou incluído no aplicativo Electron.

| Área | Implementado nesta versão | Limite deliberado |
| --- | --- | --- |
| Segurança de API | Limite local de 120 mutações tRPC por IP/minuto, payload máximo de 8 MB, `nosniff`, `DENY` para frames e política de referrer. | O limite em memória é uma proteção por instância; produção pública de alto volume deve incluir rate limiting no edge ou serviço distribuído. |
| Saúde | `GET /api/health` informa modo e timestamp sem detalhes internos. | Não substitui alertas externos de disponibilidade. |
| Fontes | `content_sources`, `source_refresh_runs` e campos de última verificação/sucesso. | A Steam somente é verificada em endpoint documentado; loja, capas e screenshots não são importados por interfaces não aprovadas. |
| Benchmarks | `COMMUNITY` por padrão, revisão administrativa, URL/nota de evidência e captura opcional PNG/JPEG/WebP de até 5 MB. | Uma captura não promove uma submissão a `VERIFIED`; revisão humana continua obrigatória. |
| Scanner | Relatório técnico local, prévia, consentimento e importação para perfil. | Não há upload automático nem coleta de identificadores pessoais. |

## Sequência obrigatória de release

Antes de configurar qualquer tarefa recorrente, salve um checkpoint e publique a versão. A plataforma só consegue chamar URLs de produção, e tarefas programadas devem usar caminhos `/api/scheduled/*`, autenticação da plataforma e lógica idempotente [1]. Esta versão **não cria cron automaticamente**: uma fonte precisa primeiro ter endpoint autorizado, escopo de campos, frequência e política de rollback aprovados.

Após publicar, configure o domínio em **Settings → Domains** e execute os testes operacionais abaixo. O armazenamento de capturas usa chave e URL de storage; os bytes não ficam no banco. Para cada sincronização, registre URL de origem, hash de entrada quando aplicável, contagem, campos alterados, horário e resultado.

| Teste pós-publicação | Resultado esperado |
| --- | --- |
| `GET /api/health` | HTTP 200 com `ok: true`, sem segredo ou detalhes de infraestrutura. |
| Login, perfil e scanner | Nenhum relatório é persistido antes da confirmação explícita do usuário. |
| Submissão de benchmark | Status inicial `submitted` e proveniência `community`, mesmo com captura válida. |
| Revisão administrativa | Somente moderador/admin pode promover a evidência a `verified` ou rejeitá-la; ação fica no audit log. |
| Fonte Steam | A verificação cria uma execução rastreável, atualiza a data de checagem e não importa conteúdo de loja não autorizado. |

## Decisões pendentes para produção pública

> Não habilite sincronização recorrente, importação de catálogo ou publicação de dados externos até que cada fonte tenha contrato técnico, licença/termos, limite de requisição e estratégia de rollback aprovados.

| Decisão do proprietário | Estado | Próxima ação |
| --- | --- | --- |
| Domínio público | Pendente | Configurar ou vincular no painel de domínios após publicar. |
| Atualização automática de fontes | Preparada, não agendada | Criar handler idempotente e job Heartbeat somente após deploy, para endpoint e frequência aprovados. |
| Steam App ID e metadados | Chave validada; catálogo não iniciado | Aprovar interface Steam autorizada ou feed licenciado para os campos desejados. |
| CDN/edge rate limiting | Pendente | Escolher provedor ou camada gerenciada compatível com a política de tráfego esperada. |
| Observabilidade externa | Pendente | Integrar monitoramento de uptime e alertas sem coletar segredos ou conteúdo pessoal. |
| Backup e recuperação | Requer ação do proprietário se a conta receber aviso de elegibilidade | Usar o backup de tarefa oficial; um download de código não inclui banco, uploads, segredos nem capacidades hospedadas [2]. |

## Backup e restauração de website hospedado

Se a conta receber aviso de que é afetada pela separação de dados de agosto de 2026, o aviso no produto e o e-mail são a fonte de verdade. O backup de tarefa precisa ser criado manualmente até **23 de agosto de 2026, 7:59 SGT**; ele preserva código, banco, arquivos, configurações, segredos e integrações do site [2] [3]. Depois de qualquer alteração material, gere uma nova cópia antes do prazo, pois o backup é um retrato no tempo.

## Referências

[1] [Atualizações periódicas e Heartbeat](../skills/webdev-periodic-updates/SKILL.md) — contrato de callbacks, idempotência e publicação prévia.

[2] [Backup de sites e conteúdo do backup](https://help.manus.im/en/articles/16147892-service-change-overview-how-to-back-up-your-data) — orientação oficial de backup.

[3] [Política de websites durante a separação de dados](../skills/data-backup-restoration/references/websites.md) — escopo de banco, arquivos, domínio, restauração e indisponibilidade.
