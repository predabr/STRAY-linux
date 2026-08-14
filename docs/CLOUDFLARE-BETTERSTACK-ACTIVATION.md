# Ativação externa — Cloudflare + Better Stack

## Escopo e limite

Este documento **não executa** alterações em DNS, Cloudflare ou Better Stack. Ele define a configuração inicial a ser aplicada manualmente pelo proprietário depois que o domínio estiver publicado e apontando ao Stray Linux.

| Camada | Finalidade | Estado desta versão |
| --- | --- | --- |
| Aplicação | Limite local para mutações tRPC, headers de segurança e health check sem segredos. | Ativo no código. |
| Cloudflare | Limite na borda antes da origem para abuso amplo e requests automatizados. | Especificado, não configurado. |
| Better Stack | Monitorar saúde HTTP, certificado/domínio e, futuramente, tarefas Heartbeat. | Especificado, não configurado. |

## Regras Cloudflare propostas

As regras abaixo são limites iniciais de segurança, não uma medida de capacidade. A Cloudflare informa que rate limiting pode permitir alguns pedidos adicionais antes da mitigação se propagar; mantenha o limitador local do aplicativo como segunda camada [1]. Cada regra deve ser criada depois de revisar o plano contratado, pois campos e períodos disponíveis variam por plano [1].

| Prioridade | Expressão de correspondência | Janela / limite inicial | Ação | Observação |
| --- | --- | --- | --- | --- |
| 1 | `http.request.method eq "POST" and starts_with(http.request.uri.path, "/api/trpc")` | 60 segundos / 60 por IP | Managed Challenge ou Block por 60 s | Protege mutações; o app mantém limite local de 120/minuto como fallback. |
| 2 | `http.request.method eq "POST" and http.request.uri.path contains "/chat."` | 60 segundos / 12 por IP | Managed Challenge ou Block por 60 s | Restringe custo de IA e reduz abuso do chat. Validar a expressão pela rota tRPC efetiva antes de aplicar. |
| 3 | `http.request.method eq "POST" and http.request.uri.path contains "/benchmarks."` | 60 segundos / 10 por IP | Managed Challenge ou Block por 60 s | Protege submissões e upload de evidência; não deve bloquear moderadores legítimos sem observar logs. |
| 4 | `http.request.method eq "POST" and http.request.uri.path contains "/admin."` | 60 segundos / 20 por IP | Block por 60 s | É defesa complementar; autorização ADMIN continua no servidor. |

Não aplicar regra de rate limiting a `GET /api/health`, `/robots.txt` ou `/sitemap.xml`. Não criar bypass genérico por user-agent; bots verificados e SEO precisam ser avaliados conforme o plano e o tráfego observado [1].

## Monitores Better Stack propostos

| Monitor | URL/condição | Intervalo inicial | Critério de sucesso | Alerta |
| --- | --- | --- | --- | --- |
| Saúde do backend | `GET https://<domínio>/api/health` | 60 s ou menor intervalo permitido pelo plano | HTTP 200 e JSON com `ok: true`. | E-mail do proprietário inicialmente; adicionar canal de equipe depois. |
| Página inicial | `GET https://<domínio>/` | 3 min | HTTP 200 e conteúdo carregável. | Mesmo grupo de incidente do monitor de saúde para evitar duplicidade. |
| Certificado e domínio | Monitor nativo de SSL/domínio, se disponível no plano. | Conforme plano | Certificado válido e domínio não próximo de expirar. | Aviso antecipado ao proprietário. |
| Job de fonte futuro | Heartbeat/cron monitorado somente após criar a tarefa e registrar `taskUid`. | Conforme cron aprovado | Execução no horário, sem `failed`. | Alerta separado de disponibilidade HTTP. |

A Better Stack documenta monitores, heartbeats, alertas e status pages como recursos do Uptime; use token de API somente se o proprietário preferir automação posterior [2].

## Rollback

Se uma regra bloquear usuários legítimos, desative somente a regra específica, mantenha os logs de incidente e reduza ou ajuste o escopo antes de reativar. Se o monitor causar falsos positivos, não desative o health check: verifique DNS, TLS, código de resposta e região de origem, depois ajuste o limiar. O backend continua operando sem Cloudflare e Better Stack; essas camadas não devem se tornar requisito do modo desktop.

## Dados necessários para ativação

| Dado | Necessário para | Como fornecer |
| --- | --- | --- |
| Domínio já publicado | Criar zona Cloudflare e URL pública de monitoramento. | Informar o domínio ou configurá-lo em Settings → Domains. |
| Acesso Cloudflare | Regras de borda e DNS. | O proprietário executa no painel; não enviar token em chat. |
| Conta Better Stack e e-mail de alerta | Criar monitores e rota de incidente. | O proprietário executa no painel; token só é necessário para automação futura. |
| Confirmação de publicação do checkpoint atual | Habilitar cron e validar origin público. | Responder após clicar Publish. |

## Referências

[1]: https://developers.cloudflare.com/waf/rate-limiting-rules/ "Cloudflare Rate Limiting Rules"
[2]: https://betterstack.com/docs/uptime/ "Better Stack Uptime documentation"
