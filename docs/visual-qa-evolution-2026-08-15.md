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
