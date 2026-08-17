# Política de segurança

O Stray Linux é um aplicativo local-first. Relatos de vulnerabilidades envolvendo Electron, IPC, execução de comandos, acesso a arquivos, atualizador, autenticação, dependências ou exposição de dados locais devem ser enviados de forma privada ao mantenedor, sem publicar tokens, diagnósticos ou provas de conceito exploráveis.

## O que informar

Informe a versão do aplicativo, formato instalado, distribuição, passos mínimos de reprodução, impacto observado e uma forma segura de validar a correção. Não inclua credenciais Steam, tokens, arquivos pessoais, identificação de máquina ou relatórios completos de hardware.

## Limites de resposta

O projeto prioriza correções reproduzíveis para releases ativas. Não há programa de recompensa. Uma correção pode resultar em atualização do aplicativo, dos feeds de distribuição, da documentação ou de todos esses itens quando necessário.

## Dependências e CI

Cada pull request executa instalação congelada, auditoria, typecheck, testes e build. A política bloqueia vulnerabilidades altas ou críticas novas. No estado atual, o advisory de `extract-zip` é reportado para a cadeia de desenvolvimento do Electron e informa que não existe versão corrigida publicada; ele permanece visível como revisão upstream e não é tratado como resolvido. Dependências com versão corrigida são fixadas por overrides no `pnpm-workspace.yaml`.

## Verificação de distribuição Arch

A auditoria reproduzível está em `scripts/verify-arch-download.mjs`. Ela segue o redirect estável, compara o artefato com o sidecar SHA-256, verifica o contêiner publicado e inspeciona o conteúdo `opt/Stray Linux/`. Em Arch, a inspeção adicional usa `pacman -Qp`; fora de Arch, `ALLOW_NON_ARCH=1` valida apenas download, integridade e arquivo. A auditoria não instala, executa nem altera o sistema.
