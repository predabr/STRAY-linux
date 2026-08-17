# Arquitetura do Stray Linux

O projeto separa três superfícies: o **site institucional**, o **aplicativo Electron local** e a **camada de serviços/tRPC**. O site descreve o produto, apresenta downloads e aponta para desinstalação. O aplicativo abre a área operacional em `/dashboard` e mantém leitura de hardware, biblioteca e sessões no dispositivo.

| Camada | Responsabilidade | Limite |
|---|---|---|
| React/TypeScript | Rotas, superfícies de produto, internacionalização, acessibilidade e estados de evidência. | Não executa comandos do sistema diretamente. |
| Electron/preload | Ponte restrita para Scanner, Biblioteca, atualizador, prévia de manutenção e importação MangoHud escolhida pelo usuário. | Não expõe APIs genéricas de filesystem ou shell ao navegador. |
| Express/tRPC | Catálogo, conteúdo, contratos e fluxos web. | Não substitui o armazenamento local desktop. |
| SQLite desktop | Snapshots, preferências e registros locais. | Não exige `DATABASE_URL` do usuário final. |
| Distribuição | Artefatos versionados, sidecars SHA-256 e feeds HTTPS SHA-512. | O pacote correto continua dependente da distribuição do usuário. |

## Organização visual e desempenho

A landing está dividida em componentes de navegação, hero, método, downloads, evidência e rodapé. A área operacional divide navegação, status, pré-carregamento de rotas e primitivas de estado. O build separa framework, ícones, cliente de dados, gráficos e diagramas para evitar que telas ocasionais definam a carga inicial.

> O sistema não transforma ausência de dados em FPS, benchmark, compatibilidade ou relato comunitário.
