# Moderação e publicação

O Linux Gaming Hub separa **dados enviados pela comunidade**, **conteúdo revisado** e **lacunas de evidência**. A classificação não é decorativa: ela determina como o dado é apresentado ao usuário e se pode alimentar uma estimativa de desempenho.

| Role | Pode fazer | Não pode fazer |
|---|---|---|
| USER | Criar perfil de hardware, salvar itens, enviar benchmark com evidência e abrir reports. | Verificar benchmark, publicar conteúdo ou alterar roles. |
| MODERATOR | Revisar ou rejeitar benchmarks submetidos. | Alterar roles, bloquear usuários ou executar CRUD administrativo completo. |
| ADMIN | Executar CRUD, revisar reports, gerenciar usuários, alterar roles e consultar auditoria. | Publicar conteúdo sem uma fonte registrada. |

## Workflow de benchmark

Uma submissão deve conter pelo menos um FPS médio, mais uma URL de fonte ou uma descrição de evidência. O status inicial é `submitted` com proveniência `community`. Um MODERATOR ou ADMIN deve conferir jogo, ambiente, resolução, preset, hardware, distro, driver/runtime e a evidência apresentada.

Após a revisão, a decisão `verified` altera a proveniência para `verified`; a decisão `rejected` mantém o registro como comunitário, mas o remove da consulta pública verificada. A calculadora de desempenho considera somente resultados `verified` com ambiente exatamente compatível. Quando não há amostra suficiente, ela retorna indisponibilidade.

## Workflow de reports

Reports podem sinalizar informação incorreta, benchmark inválido, duplicidade, link quebrado, conteúdo impróprio, spam ou outro problema. A equipe move o report entre `open`, `in_review`, `resolved` e `rejected`, adicionando uma resolução quando a decisão é final. A ação é armazenada no audit log.

## Publicação editorial

Conteúdo em `draft` pode ser incompleto. Para mudar um jogo ou distribuição a `published`, a interface administrativa exige URL de fonte. Para wiki, guias e LinuxFix, registre também a proveniência, o nível de confiança quando aplicável e qualquer aviso necessário antes de exibir um comando.
