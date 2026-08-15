# Validação visual — evolução Stray Linux

## Rotas públicas verificadas

Em 15 de agosto de 2026, a landing (`/`) e a nova rota pública de download (`/download`) foram verificadas no servidor de desenvolvimento. A landing preserva a distinção editorial entre o site público e o workspace do aplicativo. A rota de download expõe apenas o instalador Windows direto e comandos Linux completos, com download do pacote, validação SHA-256 e instalação por família.

| Rota | Viewport | Resultado observado |
| --- | --- | --- |
| `/` | 1280 × 720, página completa | Hero, blocos de produto, seção de distribuição, terminal e rodapé renderizados sem sobreposição visível. |
| `/download` | 1280 × 720, página completa | Hero de distribuição, download `.EXE`, terminal selecionável, cartões auxiliares e rodapé renderizados com hierarquia consistente. |
| `/download` | 375 × 812, página completa | Cabeçalho compacto, texto de hero, botão `.EXE`, abas de família, comando rolável e cartões empilhados permaneceram legíveis. |

Nenhuma captura é prova de execução da instalação. A validade dos comandos e checksums é coberta separadamente por teste do manifesto de distribuição e pelas validações de artefato já registradas.

## Workspace e responsividade

Na mesma rodada, foram verificadas as rotas `/games`, `/scanner`, `/assistant` e `/benchmark` no viewport desktop de 1280 × 720. O catálogo exibiu o fallback editorial de mídia sem alegar capas licenciadas; Scanner, Stray AI e Benchmark mantiveram cards de evidência e estados explícitos de ausência de perfil ou amostras verificadas.

Em 375 × 812, as rotas `/scanner` e `/assistant` preservaram navegação compacta, botões alcançáveis, caixas de texto legíveis e empilhamento lógico de contexto e contrato de resposta. Nenhuma sobreposição visível foi observada nas capturas.

## Gate de qualidade

O gate integral executou **36 arquivos de teste e 100 testes aprovados**, seguido de build de produção concluído. Os cinco artefatos desktop foram reconstruídos e verificados por presença. A inspeção do pacote Debian confirmou o mantenedor público resumido como `Pedro <creator@straylinux.local>`; o bundle Windows contém a política de URLs externas e a referência ao loopback local.

## Verificação pós-publicação

Logo após o checkpoint `60755535`, a primeira consulta ao domínio público ainda respondeu com o bundle anterior e a rota `/download` retornou 404. Após a propagação automática, uma nova consulta com cache-busting confirmou o título `Download | Stray Linux`, o botão do instalador Windows e o comando Debian/Ubuntu com o pacote `Stray-Linux-1.0.0-amd64_a04a5424.deb` e checksum `36ce2009…ceca9d`. A publicação foi, portanto, confirmada no domínio.

## Shell desktop refinado

As capturas atuais de `/dashboard` e `/library` no viewport de 1280 × 720 confirmaram a rail de aplicativo refinada: superfície mais profunda, separador sob a marca, item ativo com gradiente de evidência e marcador luminoso, e painel de status local mais legível. O Dashboard preservou a densidade operacional; a Biblioteca continuou a exibir corretamente o limite de leitura local quando aberta fora do Electron, sem simular instalações Steam ou Heroic.

No viewport de 375 × 812, Dashboard e Biblioteca mantiveram cabeçalho compacto, breadcrumbs legíveis, superfícies empilhadas e navegação inferior com alvo ativo distinguível. A página de Biblioteca mostrou a ação para explorar o GameHub publicado como alternativa ao detector local indisponível no navegador; não houve sobreposição observável no conteúdo visível.

## Auditoria final de erros

A inspeção dos trechos recentes de servidor, console do navegador e rede não encontrou erros ativos nem respostas HTTP 4xx/5xx novas. A única ocorrência de `ELIFECYCLE` no log corresponde a um restart histórico do servidor às 02:27; o processo foi reiniciado automaticamente e as verificações subsequentes de tipo, testes, build, auditoria de dependências e rotas concluíram sem falhas. O build mantém apenas o aviso conhecido de chunks grandes, que não impede a geração do bundle.

## Narrativa autoral de produto

A landing foi revisada em 1280 × 720 e 375 × 812 depois da nova camada de narrativa. Em desktop, o hero preserva um foco claro entre contexto editorial, dois CTAs e preview funcional do workspace, com gradação violeta/azul contida e superfícies de evidência legíveis. Em celular, o título, a cópia, os dois CTAs, os quatro sinais e o preview mantiveram ordenação vertical sem corte no viewport. O motion do preview é desabilitado quando o sistema solicita redução de movimento.

As rotas `/assistant` e `/compare` foram revisadas em 1280 × 720 e 375 × 812. O Stray AI apresenta briefing, estado de sessão, método, segurança e escopo antes do chat; o Comparador apresenta estado, seleção e limite metodológico antes dos resultados. Em celular, as duas superfícies mantiveram leitura vertical e navegação inferior sem encobrir o conteúdo visível.

## Biblioteca como leitura local

A Biblioteca revisada foi verificada em 1280 × 720 e 375 × 812. Fora do Electron, ela mantém explicitamente o estado de disponibilidade desktop e a alternativa de explorar o GameHub, sem exibir jogos ou números de instalações sintéticos. A superfície móvel preservou breadcrumb, título, explicação de privacidade e CTA para o catálogo sem sobreposição com a navegação inferior.
