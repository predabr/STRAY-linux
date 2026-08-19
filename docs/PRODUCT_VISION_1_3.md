# Stray Linux 1.3 — Operação Local Confiável

## Visão

O Stray Linux é uma camada local de inteligência para Linux gaming. Ele organiza leituras técnicas, biblioteca local, guias e diagnósticos sem substituir Steam, Heroic, drivers ou gerenciadores de pacote.

## Compromissos de produto

| Compromisso | Aplicação |
|---|---|
| Dados observados | Scanner, biblioteca e perfis distinguem leitura local de conteúdo publicado. |
| Ações explícitas | O aplicativo não executa comandos destrutivos, não instala pacotes e não altera permissões sem confirmação externa. |
| Limites visíveis | Campos indisponíveis continuam indisponíveis; não se transformam em FPS, compatibilidade ou diagnóstico inventado. |
| Privacidade local-first | Dados técnicos permanecem no dispositivo por padrão; envio e sincronização requerem consentimento. |
| Linguagem acessível | A interface mantém 11 localidades, foco de teclado, contraste e redução de movimento. |

## Roadmap de intenção

Este roadmap orienta desenvolvimento e não representa funcionalidades prometidas ou já concluídas. Cada fase só é publicada quando tem evidência, testes e limites documentados.

1. **Centro de Operações:** leitura recente, campos ausentes e recomendações seguras.
2. **Biblioteca local:** origem clara, ações explícitas e arte somente quando autorizada ou local.
3. **Diagnóstico e LinuxFix:** sintomas, evidência, pré-requisito, risco, verificação e reversão.
4. **Stray AI:** contexto consentido, fontes internas, limites e recusa fora do escopo.
5. **Qualidade:** localização, acessibilidade, contratos IPC, segurança e distribuição.

## Princípios de desenvolvimento

Todo controle deve executar uma ação, abrir uma rota ou explicar indisponibilidade. Recursos locais pertencem ao Electron e nunca devem parecer funcionais no navegador. Credenciais, dados financeiros, identificadores pessoais e conteúdo de pagamento não entram no bundle, QR, interface ou documentação pública. Mudanças exigem testes, typecheck, build e validação apropriada antes da publicação.
