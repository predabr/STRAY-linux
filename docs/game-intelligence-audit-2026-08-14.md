# Auditoria de Game Intelligence — 2026-08-14

## Base de dados publicada

| Dimensão | Cobertura confirmada | Implicação para a interface |
| --- | ---: | --- |
| Jogos publicados | 10.013 | Catálogo, busca e paginação podem ser tratados como fluxos principais. |
| Descrições de catálogo | 9.985 | A tela de jogo deve expor descrição e fonte quando disponíveis; os demais casos devem mostrar ausência explícita. |
| Desenvolvedora e publicadora | 0 | Não exibir campos vazios como se fossem metadados confirmados. |
| Data de lançamento | 10.013 | Pode integrar os detalhes de jogo como metadado de catálogo. |
| Mídia licenciada em `game_media` | 0 | Não criar capa, screenshot ou artwork alternativo até existir uma fonte licenciada. |
| Registros de compatibilidade | 0 | Não calcular selo, score ou recomendação de Proton para o catálogo. |
| Benchmarks verificados e resultados | 0 | Gráficos devem permanecer em estado de evidência indisponível, sem preencher FPS. |
| Guias e LinuxFix ligados a jogos | 0 | A interface precisa indicar ausência de vínculo específico em vez de sugerir problemas conhecidos. |

## Capacidades que podem ser evoluídas imediatamente

O GameHub já suporta paginação, busca e filtros server-side. Os detalhes de jogo já possuem vínculo com origem de catálogo, plataformas, tags, descrição licenciada quando presente, favoritos, perfil pessoal e estados de ausência para compatibilidade, benchmarks, guias e LinuxFix. A biblioteca desktop detecta apenas instalações Steam locais por manifestos e só inicia títulos por URI `steam://` validada.

O dashboard autenticado já mantém perfil de hardware, favoritos, guias salvos, histórico LinuxFix, relatórios e recomendações — estas últimas retornam somente compatibilidades verificadas correspondentes ao perfil, portanto ficam vazias enquanto não houver registros publicados.

## Limites obrigatórios para a evolução

1. Nenhuma capa, FPS, compatibilidade, recomendação de Proton, requisito, desenvolvedora, publicadora, Steam Deck status ou problema conhecido pode ser criado para preencher uma tela.
2. Os painéis de comparação, histórico e confiança devem usar apenas registros publicados; na ausência deles, precisam explicar o limite de forma direta e oferecer uma próxima ação real.
3. O modo desktop SQLite possui catálogo e leitura de biblioteca local, mas não tem o mesmo conjunto de compatibilidade, hardware ou recomendações do modo web. A experiência local deve declarar essa diferença em vez de imitar dados do servidor.
4. O redesenho deve reutilizar os filtros e a paginação existentes; não será introduzido carregamento integral do catálogo de 10.013 jogos.

## Artefatos desktop reconstruídos

Os cinco formatos foram recompilados com o workspace de aplicativo, os cartões sem mídia externa, as telas de Game Intelligence e a central LinuxFix renovada. A publicação do empacotador continua desativada durante a geração local.

| Artefato | SHA-256 |
| --- | --- |
| `Stray-Linux-1.0.0-Setup.exe` | `c74476a7c772ff33ed989cfa76fd04b1b0fecf196aa20933f1d184d5cda043c6` |
| `Stray-Linux-1.0.0-x86_64.AppImage` | `ee3ed056e698774149318ef4d3734eaf0ca862730f44fa850143eedaba737e4c` |
| `Stray-Linux-1.0.0-amd64.deb` | `913b865801fc0bb2bad92c8a4869e0bbc21944fce789dc7e0fa82346e06e520d` |
| `Stray-Linux-1.0.0-x86_64.rpm` | `fb4cb7ff18214c8de4acf18b2b37b52d0168027d8f7d3f2e18290c612183ebde` |
| `Stray-Linux-1.0.0-x64.pacman` | `43d7549cdda5475148d6ca2c0463b934791bb3cb6c7c6244a4b47b1a930fb9c6` |

O build foi concluído com sucesso. O Vite preserva um aviso de chunk grande já presente no bundle principal; a divisão adicional de código de Mermaid e de visualizações deve ser tratada em uma rodada separada de desempenho, sem alterar o comportamento atual.

## Central LinuxFix e contribuição moderada

Cada etapa LinuxFix agora declara o tipo operacional (`inspect`, `change`, `verify` ou `recover`), risco, como verificar o resultado, reversão quando houver alteração e a fonte específica ou herdada do runbook. A interface deixa explícito que confirmação comunitária descreve experiência de uso e não transforma uma instrução em evidência verificada.

As contribuições seguem uma fila privada: uma pessoa envia observação, reprodução, procedimento proposto e fonte opcional; o contexto técnico é anexado somente por consentimento explícito e é limitado a distribuição, kernel, driver, Proton, Wine e GPU. Nenhuma proposta é publicada automaticamente. Moderadores decidem entre revisão, aceitação para edição ou recusa, e cada submissão, retirada e decisão grava uma ação de auditoria. A aceitação não injeta comandos no runbook: a alteração editorial permanece uma ação separada e revisável.
