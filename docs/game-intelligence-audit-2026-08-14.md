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

Os cinco formatos foram recompilados com o workspace de aplicativo, os cartões sem mídia externa e as telas de Game Intelligence. A publicação do empacotador continua desativada durante a geração local.

| Artefato | SHA-256 |
| --- | --- |
| `Stray-Linux-1.0.0-Setup.exe` | `7c2340324dae1edaae6f795df9f59dd5d2e5a81aa1417ab8d4e5f9a6f1e2d566` |
| `Stray-Linux-1.0.0-x86_64.AppImage` | `17ff26b228781e1a1bc8d9e1a55b51b32b4a7cc81ef555ac1c8fd153d4b2ca81` |
| `Stray-Linux-1.0.0-amd64.deb` | `ab82e006a6fb253755530124d374f632248dff751b7542f4781b01ae300c22c9` |
| `Stray-Linux-1.0.0-x86_64.rpm` | `1d4e8958dcff3632c40c808cbfea81569427da6c1ea182cd4954301fee51e6ac` |
| `Stray-Linux-1.0.0-x64.pacman` | `2253e360e84d407dc020a3c8a5fce9c47f21e931cd0437cc90b9025b1da987ab` |

O build foi concluído com sucesso. O Vite preserva um aviso de chunk grande já presente no bundle principal; a divisão adicional de código de Mermaid e de visualizações deve ser tratada em uma rodada separada de desempenho, sem alterar o comportamento atual.
