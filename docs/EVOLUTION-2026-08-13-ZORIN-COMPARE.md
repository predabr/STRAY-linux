# Evolução do Stray Linux — Zorin OS, comparação e qualidade editorial

## Escopo concluído

Esta evolução verificou a lacuna entre o **Atlas** amplo e o conteúdo técnico publicado. O Atlas já continha variantes Zorin, mas o banco web e o snapshot SQLite não possuíam a distribuição **Zorin OS**, artigo de referência ou guias específicos. A distribuição foi incluída com a família Ubuntu/APT, uma wiki editorial e três guias publicados: Steam via Flatpak, ativação NVIDIA e preparação segura para atualização e gaming.

## Delimitação desta rodada

Esta rodada **aprofundou a lacuna comprovada do Zorin OS**. As demais famílias de distribuição preservam a cobertura e as fontes já auditadas em iterações anteriores; elas não foram reaprovadas integralmente nesta entrega. O Atlas continua classificando 753 entradas, mas uma entrada de catálogo só recebe comandos ou uma wiki operacional adicional após pesquisa da distribuição, release e fonte oficial específicas.

| Entrega | Regra de qualidade aplicada |
| --- | --- |
| Zorin OS no banco e no SQLite desktop | Fonte oficial registrada; exportação do snapshot após o seed. |
| Wiki de gaming do Zorin | Sem score de gaming; versão, driver e compatibilidade tratados como contexto verificável. |
| Steam, NVIDIA e atualização | Comandos somente para identificação, Flatpak ou diagnóstico; driver e upgrade seguem os fluxos de interface oficialmente documentados pelo Zorin. |
| Links no Atlas | Os perfis Zorin Core, Pro, Lite e Education passam a apontar para a wiki e os guias comuns do Zorin OS. |
| Comparador | Agrupa apenas resultados de benchmarks com status `verified`; mantém ambiente e fonte, sem estimar FPS. |
| Content Health administrativo | Conta lacunas reais de benchmarks, compatibilidade, LinuxFix, guias e cobertura de distribuição. |

> O comparador é uma ferramenta de leitura de evidências, não um gerador de recomendações de compra. CPU, driver, distribuição, resolução e preset são preservados para não transformar uma média em promessa de desempenho.

Nesta entrega, as novas relações navegáveis foram: **perfis Zorin do Atlas → wiki e três guias técnicos**, além de **catálogo de jogos → comparação de benchmarks verificados**. As áreas de GameHub, compatibilidade, LinuxFix, favoritos e moderação existentes foram preservadas; não houve alegação de que suas relações fossem todas ampliadas nesta rodada.

## Evidências e validação

| Validação | Resultado |
| --- | --- |
| Banco web | Zorin OS publicado com wiki e três guias, todos com URL de fonte. |
| Snapshot Electron | 10.000 jogos, 18 distribuições, 18 artigos de wiki, 39 guias e 6 LinuxFix. |
| Regressões | `pnpm check` aprovado; 14 arquivos e 39 testes aprovados. |
| Responsividade | Rotas `/compare` e `/distros/familia-ubuntu-zorin-os-core` verificadas em desktop e viewport de 375 px. |
| Paginação pública | `games.list` respondeu com página 1, `pageSize: 24` e total de 10.013 jogos publicados. |
| Estado vazio do comparador | Não havia benchmark com status `verified` no banco no momento da validação; o comparador não criou estimativas e apresenta a ausência de evidência como estado vazio legítimo. |

## Artefatos desktop reconstruídos

| Formato | Arquivo | SHA-256 |
| --- | --- | --- |
| Windows NSIS | `Stray-Linux-1.0.0-Setup.exe` | `ff417dc542812807dceb7819b5f6c31f060b2a9cb8de0f39e2eea927302e4232` |
| AppImage | `Stray-Linux-1.0.0-x86_64.AppImage` | `17755b845a598ad3cf29f228e0692ac722690273e94b37c374b44c2b415aef2b` |
| Debian/Ubuntu | `Stray-Linux-1.0.0-amd64.deb` | `3a937ee1f53a725e4591ad5f2acbd7778ff42d95fe08c4f445bf5aa92549a799` |
| RPM | `Stray-Linux-1.0.0-x86_64.rpm` | `af44221247db50e3da55b6ace456e00e00fb8b0919cbc8ba95623fa7c45b3de6` |
| Pacman | `Stray-Linux-1.0.0-x64.pacman` | `d8eb4bfdfdd027428490faa8c1052a38ecfa76193fe7d9c982e6b976146b26b3` |

O `app.asar` do bundle Windows foi inspecionado por busca binária local: o snapshot contém `zorin-os` e `zorin-steam-flatpak`.

## Limites editoriais preservados

O Atlas contém **753 entradas classificadas**, inclusive variantes, projetos históricos e itens que exigem pesquisa. Essa abrangência de catálogo não significa que cada entrada tenha uma wiki operacional ou comandos seguros. Conteúdo técnico novo deve ser publicado somente quando houver fonte verificável, distribuição/release clara e caminho de pacote ou procedimento oficialmente sustentado.

## Referências

[1]: https://zorin.com/os/ "Zorin OS"
[2]: https://help.zorin.com/docs/getting-started/install-zorin-os/ "Zorin Help: Install Zorin OS"
[3]: https://help.zorin.com/docs/hardware/activate-nvidia-drivers/ "Zorin Help: Activate NVIDIA Graphics Card"
[4]: https://help.zorin.com/docs/getting-started/upgrade-zorin-os/ "Zorin Help: Upgrade Zorin OS"
[5]: https://flathub.org/en/apps/com.valvesoftware.Steam "Flathub: Steam"
