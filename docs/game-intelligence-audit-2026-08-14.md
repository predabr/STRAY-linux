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

Os cinco formatos foram recompilados com o workspace de aplicativo, os cartões sem mídia externa, as telas de Game Intelligence, a central LinuxFix renovada e o Scanner técnico ampliado. A publicação do empacotador continua desativada durante a geração local.

| Artefato | SHA-256 |
| --- | --- |
| `Stray-Linux-1.0.0-Setup.exe` | `b20be6a38e6bb83a218728a254af180006e3c86955e049350f49257754916714` |
| `Stray-Linux-1.0.0-x86_64.AppImage` | `2ed5044eb7d05eac38db565f935a1f3eea6910f6fab578a2d5b36efd1937d478` |
| `Stray-Linux-1.0.0-amd64.deb` | `97760631b18157239864af4eb87d634d22911b3008e898febc9f1161cae62420` |
| `Stray-Linux-1.0.0-x86_64.rpm` | `0712363a1ce90e7e46862d44572338374c95f4bc3138f0d039d71fbcb92d2a34` |
| `Stray-Linux-1.0.0-x64.pacman` | `ccee0775ae4de2c11a6f31f319583fad2695f6be4bc6087c9715c2f226ab3c34` |

O build foi concluído com sucesso. O Vite preserva um aviso de chunk grande já presente no bundle principal; a divisão adicional de código de Mermaid e de visualizações deve ser tratada em uma rodada separada de desempenho, sem alterar o comportamento atual.

## Scanner técnico e instalação

O Stray Scan agora registra arquitetura, topologia de CPU, adaptadores gráficos, VRAM quando o driver a expõe, pilha Mesa/Vulkan/OpenGL, renderer, armazenamento, monitores, Steam nativo/Flatpak, ferramentas Proton encontradas e sinais de sessão. Cada campo é opcional: uma ferramenta ausente ou uma permissão não disponível produz **não informado**, e não uma estimativa. Os gráficos exibem apenas capacidade detectada em GB e marcadores de disponibilidade local; não calculam FPS, temperatura, estabilidade ou compatibilidade.

O instalador Windows NSIS foi reconstruído em modo por máquina (`perMachine`) com confirmação UAC. A elevação é limitada à instalação: o aplicativo e o Scanner continuam em execução normal de usuário. Pacotes Linux exigem privilégio apenas no gerenciador de pacotes; AppImage continua portátil sem administrador.

## Central LinuxFix e contribuição moderada

Cada etapa LinuxFix agora declara o tipo operacional (`inspect`, `change`, `verify` ou `recover`), risco, como verificar o resultado, reversão quando houver alteração e a fonte específica ou herdada do runbook. A interface deixa explícito que confirmação comunitária descreve experiência de uso e não transforma uma instrução em evidência verificada.

As contribuições seguem uma fila privada: uma pessoa envia observação, reprodução, procedimento proposto e fonte opcional; o contexto técnico é anexado somente por consentimento explícito e é limitado a distribuição, kernel, driver, Proton, Wine e GPU. Nenhuma proposta é publicada automaticamente. Moderadores decidem entre revisão, aceitação para edição ou recusa, e cada submissão, retirada e decisão grava uma ação de auditoria. A aceitação não injeta comandos no runbook: a alteração editorial permanece uma ação separada e revisável.
