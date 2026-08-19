# Auditoria final — Stray Linux 1.3.0

**Data:** 19 de agosto de 2026

Esta auditoria procurou falhas reproduzíveis em código, runtime, build, dependências, distribuição publicada e interface. Correções só seriam aplicadas mediante evidência reproduzível; **nenhum defeito funcional novo foi confirmado** nesta rodada.

| Área | Verificação executada | Resultado |
|---|---|---|
| Repositório | Estado local, versão e comparação com `github/main`. | A versão permanece `1.3.0`; o branch estava alinhado antes do registro desta auditoria. |
| Testes | `pnpm test`. | 188 testes aprovados em 77 arquivos. |
| Tipagem e build | `pnpm check` e `pnpm build`. | Aprovados. O aviso de chunk grande do Vite não impede a compilação e não é tratado como erro de runtime. |
| Instalação reproduzível | `pnpm install --frozen-lockfile --offline`. | Aprovada, sem alterar o lockfile. |
| Dependências | `pnpm audit:security`. | Política aprovada; os advisories revisados continuam documentados pelo projeto. |
| Logs | Dev server, console do navegador e requisições. | Nenhuma exceção ativa, erro de console ou resposta 4xx/5xx recente. Registros antigos de reinicialização não possuem stack trace e o servidor atual está saudável. |
| Site e feeds | `/api/health`, feeds Windows/Linux e cinco redirects de download. | Respostas 200 para saúde/feeds e 302 para os cinco artefatos 1.3.0. |
| Integridade | Sidecars SHA-256 e `ALLOW_NON_ARCH=1 pnpm verify:arch-download`. | Os cinco sidecars correspondem aos artefatos finais; Pacman confirmou redirect, 173595665 bytes, SHA-256, gzip e `opt/Stray Linux/`. |
| Interface | Revisão visual desktop e móvel de Roadmap, Biblioteca, Diagnóstico e Stray AI. | Sem corte, sobreposição ou contraste insuficiente observado nas rotas verificadas. |

> **Limites conhecidos, não erros:** a inspeção `pacman -Qp` requer uma máquina Arch real, e a assinatura Authenticode depende de certificado configurado pelo responsável. Esses limites permanecem visíveis na documentação e não foram simulados.
