# Opções de infraestrutura pública

## Decisão pendente

O Stray Linux já aplica uma proteção local por instância para mutações tRPC. Para tráfego público multi-instância, a decisão de produção deve acrescentar uma camada distribuída; isso não é ativado por padrão porque requer domínio, conta externa e credenciais controladas pelo proprietário.

| Opção | Rate limiting | Monitoramento | Vantagem | Limite e credenciais |
| --- | --- | --- | --- | --- |
| **A. Cloudflare + Better Stack** | Regras no edge por caminho e IP antes da origem. | Uptime, endpoint de saúde, domínio/SSL e status page externos. | Protege login e API antes de chegar ao app; integra domínio e borda. | Exige delegação/configuração de DNS e conta Cloudflare; campos, períodos e número de regras dependem do plano [1]. Better Stack requer conta e destinatários de alerta [3]. |
| **B. Upstash Ratelimit + Better Stack** | Limite distribuído HTTP/Redis aplicado no backend por IP/usuário/rota. | Igual à opção A para disponibilidade pública. | Mantém a política de limite junto ao código e funciona em ambientes serverless. | Exige banco Upstash, URL/token secretos e integração de biblioteca; a latência e o custo por requisição devem ser monitorados [2]. |
| **C. Camadas combinadas** | Cloudflare na borda para abuso amplo + Upstash para cotas por usuário e endpoints sensíveis. | Better Stack ou provedor equivalente para health, fluxo de login e cron. | Melhor separação entre mitigação pública e regra de negócio. | Maior complexidade operacional; configurar alertas, orçamento, resposta a incidentes e rotação de três conjuntos de credenciais. |

## Configuração mínima recomendada após a escolha

Independentemente da opção, proteger `POST /api/trpc/*`, em especial login, chat, upload de evidência e procedimentos administrativos. Manter `GET /api/health` disponível para monitores, sem incluir segredos ou detalhes internos na resposta. As regras de borda não são contadores exatos: a Cloudflare alerta que alguns pedidos podem alcançar a origem antes da mitigação ser aplicada [1].

O monitor deve consultar `https://<domínio>/api/health` e um fluxo autenticado sintético somente depois de existir uma conta de monitoração autorizada. Para tarefas Heartbeat, configurar um monitor de cron depois que a tarefa estiver efetivamente criada; o contrato preparado nesta versão ainda não cria tarefas.

## Dados necessários do proprietário

| Escolha | Informações necessárias | Onde ficam |
| --- | --- | --- |
| Cloudflare | Domínio e acesso para configurar DNS/regra de borda. | Painel do provedor; nenhum token no cliente. |
| Upstash | URL REST e token do banco Redis. | Secret server-side, após aprovação explícita. |
| Better Stack | URL de webhook ou integração de alerta, se desejada. | Secret server-side quando aplicável. |
| Domínio | Nome escolhido e permissão para vinculação. | Settings → Domains do projeto. |

## Referências

[1]: https://developers.cloudflare.com/waf/rate-limiting-rules/ "Cloudflare: Rate limiting rules"
[2]: https://upstash.com/docs/redis/sdks/ratelimit-ts/overview "Upstash Rate Limit overview"
[3]: https://betterstack.com/uptime "Better Stack Uptime Monitoring"
