# Operação autônoma sem conta externa

## Padrão ativo

O Stray Linux pode operar sem Cloudflare, Better Stack, CDN, monitor de terceiros ou conta externa adicional. O modo ativo utiliza apenas o próprio aplicativo, o banco já configurado no web app e o SQLite embutido no desktop.

| Recurso | Implementação ativa | Limite explícito |
| --- | --- | --- |
| Saúde | `GET /api/health` para disponibilidade básica e `GET /api/status` para API, banco e modo de atualização. | Não há verificação independente quando todo o servidor estiver indisponível. |
| Página de status | Rota pública `/status`, com atualização manual e sem login. | Não envia alerta nem armazena histórico de uptime. |
| Limite de requisições | Janela local por IP para mutações tRPC. | Em autoscaling, o contador é por instância; não substitui rate limiting distribuído. |
| Segurança | Payload máximo de 8 MB, `nosniff`, proteção contra frame e política de referrer. | Não substitui WAF/CDN ou resposta a DDoS no edge. |
| Fontes | Histórico interno, verificação manual Steam e refresh agendado inativo por padrão. | Sem uma fonte autorizada, não há importação automática de metadados ou mídia. |

## Operação diária

Use `/status` para uma visão pública, sem dados de usuários ou segredos. Administradores podem verificar a Steam no painel de Fontes; essa ação apenas valida a credencial server-side e grava uma execução rastreável. A aplicação não executa `setInterval`, `node-cron` ou upload de scanner sem confirmação.

## Alternativas futuras

`CLOUDFLARE-BETTERSTACK-ACTIVATION.md` permanece como uma **opção futura**, não como requisito. Só aplique essas camadas depois que houver domínio publicado, acesso do proprietário e decisão explícita sobre custos, dados de alerta e DNS.
