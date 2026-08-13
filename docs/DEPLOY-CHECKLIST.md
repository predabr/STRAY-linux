# Checklist de deploy — Stray Linux

## Antes de publicar

| Verificação | Comando ou ação | Critério de aceite |
| --- | --- | --- |
| Dependências | `pnpm install --frozen-lockfile` | Lockfile reproduzível, sem atualização implícita. |
| Tipos | `pnpm check` | Sem erros TypeScript. |
| Regressões | `pnpm test` | Todos os testes passam. O teste Steam é ignorado quando a chave não existe em CI; nunca grave a chave no workflow. |
| Build | `pnpm build` | Cliente e servidor compilam. |
| Rotas | Revisar `/api/health`, `/scanner`, `/benchmark`, `/compare`, `/admin` | Health público sem detalhes internos; áreas pessoais continuam autenticadas. |
| Dados | Revisar migrações Drizzle e aplicar SQL antes do deploy | Apenas migrações aditivas ou alteração analisada, com rollback conhecido. |
| Segredos | Conferir painel de secrets | `STEAM_WEB_API_KEY` e chaves futuras apenas no servidor; nenhuma aparece em código, snapshot ou artefato desktop. |
| Evidências | Testar submissão de benchmark | Captura opcional válida; status inicial `submitted`; moderação obrigatória. |

## Depois de publicar

Verifique `GET /api/health`, login, criação/edição de perfil, prévia do scanner e uma consulta sem dados de benchmark. A ausência de evidência deve continuar apresentada como indisponibilidade, sem FPS ou score sintetizado.

Antes de agendar atualização automática, publique o código do handler, salve checkpoint e só então crie a tarefa Heartbeat para uma URL de produção. Registre o `taskUid`, frequência, endpoint, fonte, campos alterados e plano de rollback. Não use `setInterval` ou `node-cron` no processo da aplicação.

## Variáveis operacionais

| Variável | Escopo | Finalidade |
| --- | --- | --- |
| `STEAM_WEB_API_KEY` | Servidor | Verificação e futuras interfaces Steam autorizadas; nunca cliente. |
| `DATABASE_URL` | Servidor | Banco do web app; não é exigida pelo modo desktop SQLite. |
| `BUILT_IN_FORGE_API_URL` e `BUILT_IN_FORGE_API_KEY` | Servidor | Storage de evidências e serviços internos configurados pela plataforma. |
| `JWT_SECRET` e OAuth | Servidor | Sessão e autenticação; não alterar sem plano de rotação. |
