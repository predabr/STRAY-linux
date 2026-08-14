# Auditoria LinuxFix — 2026-08-14

## Estado observado

| Área | Situação encontrada | Implicação de produto |
|---|---:|---|
| Diagnósticos publicados | 6 | Cobertura ainda muito pequena para o escopo de Linux gaming. |
| Etapas editoriais | 12 | Existem fluxos iniciais, mas não há estrutura explícita de pré-requisito, verificação ou reversão. |
| Votos, confirmações e comentários | 0 | A interface deve declarar a ausência de relatos reais; não deve inferir confiança comunitária. |
| Reports de LinuxFix | 0 | Existe canal de revisão, mas não existe proposta estruturada de melhoria. |
| Fontes | Proton, Flatpak, Vulkan e fornecedores quando aplicável | A fonte precisa acompanhar cada procedimento e não apenas o diagnóstico como um todo. |

## Problemas de experiência

O diagnóstico mostra feedback e report antes do procedimento técnico. Isso dá mais peso visual a uma comunidade ainda sem dados do que aos sintomas, à causa provável e às etapas de baixo risco. Os cartões também descrevem o problema, mas não deixam claro o próximo teste, o escopo afetado ou se existe uma verificação segura.

## Direção aprovada para a implementação

O LinuxFix passará a usar linguagem de console de diagnóstico: contexto, hipótese, nível de risco, pré-requisitos, procedimento, verificação, reversão e fonte. Comentários permanecerão como relato de ambiente, sem aumentar automaticamente a confiança editorial. Propostas de solução ficarão em revisão até publicação por moderador, com autoria, estado e trilha de auditoria.

## Referências técnicas consultadas

1. Valve documenta `PROTON_LOG=1 %command%`, o caminho do log e que opções de execução podem ser removidas para reverter o comportamento. <https://github.com/ValveSoftware/Proton/wiki/Proton-FAQ>
2. A documentação do Flatpak recomenda conceder o mínimo de acesso ao sistema de arquivos, preferindo caminho específico e evitando acesso amplo à home. <https://docs.flatpak.org/en/latest/sandbox-permissions.html>
