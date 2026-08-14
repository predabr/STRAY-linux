# Auditoria publicada — 14 de agosto de 2026

- A página publicada `https://linuxtoys-ckuyvpj5.manus.space/` respondeu e renderizou a introdução do Stray Linux após a estabilização inicial.
- A primeira captura exibiu somente o indicador de carregamento; a segunda confirmou a renderização da introdução. A auditoria deve verificar se isso excede o tempo aceitável ou se há erros de rede/consola associados.
- Não houve ação em Steam, scraping ou chamada a endpoint não autorizado durante a verificação.

## Fontes LinuxFix revalidadas

As permissões Flatpak restringem por padrão o acesso ao host; a documentação oficial orienta minimizar acessos permanentes ao filesystem e usar portais quando possível. Portanto, qualquer correção para biblioteca Steam Flatpak deve explicar o escopo e a reversibilidade da permissão, em vez de oferecer acesso amplo à pasta pessoal. A documentação Khronos permanece a referência de diagnóstico para Vulkan, e a NVIDIA mantém uma página oficial separando drivers gerais de versões beta; o LinuxFix não deve recomendar beta como solução padrão. [Flatpak permissions](https://docs.flatpak.org/en/latest/sandbox-permissions.html) · [Khronos Vulkan Guide](https://docs.vulkan.org/guide/latest/) · [NVIDIA Vulkan Driver Support](https://developer.nvidia.com/vulkan-driver)

A página ArchWiki de Vulkan confirma que loader, driver por fabricante e variantes `lib32` são distintos para aplicações de 32 bits; também trata `vulkaninfo` como verificação, não como correção. A wiki oficial openSUSE documenta pacotes diferentes para Intel, AMD e NVIDIA. Por isso, LinuxFix deve selecionar comandos apenas após identificar distribuição, GPU e necessidade de 32 bits. [ArchWiki Vulkan](https://wiki.archlinux.org/title/Vulkan) · [openSUSE Vulkan](https://en.opensuse.org/Vulkan)

## Correções aplicadas e revalidadas

Em 14 de agosto de 2026, o domínio publicado passou a servir o GameHub e o Benchmark sem autenticação. A rota `/api/status` retornou JSON operacional com API e banco disponíveis; `externalRefresh` permanece explicitamente em `manual_only`. A primeira captura de cada rota mostrou apenas o skeleton de carregamento, seguido da renderização normal ao aguardar a consulta; não houve erro de console registrado.

| Área | Alteração aplicada | Fonte e limite |
| --- | --- | --- |
| Entrada pública | A política passou a normalizar query string e hash antes de decidir acesso, com lista explícita e testada de rotas pessoais. | Teste unitário cobre páginas públicas e subrotas privadas; não muda a política de autenticação em `/dashboard`, `/admin`, `/assistant` e `/scanner`. |
| Steam em Flatpak | A permissão de filesystem passou a exigir a pasta exata da SteamLibrary e ganhou etapa de reversão com `--nofilesystem`. | A documentação Flatpak recomenda minimizar acesso permanente e evitar `home` quando uma pasta específica é suficiente. [Flatpak Sandbox Permissions](https://docs.flatpak.org/en/latest/sandbox-permissions.html) · [flatpak override](https://docs.flatpak.org/en/latest/flatpak-command-reference.html#flatpak-override) |
| Proton | O LinuxFix passou a referenciar a FAQ do projeto Proton e esclarece a geração e o local do log com `PROTON_LOG=1 %command%`. | A ação continua sendo coleta diagnóstica; não elimina prefixos, saves nem diretórios. [ValveSoftware/Proton FAQ](https://github.com/ValveSoftware/Proton/wiki/Proton-FAQ) |
| Vulkan | `vulkaninfo --summary` permanece apenas como inspeção. O texto agora exige identificação de distribuição, GPU, ICD e necessidade de 32 bits antes de qualquer pacote. | Khronos descreve a API; Arch e openSUSE confirmam que loader/ICD e pacotes variam por GPU e distribuição. [Khronos Vulkan Guide](https://docs.vulkan.org/guide/latest/) · [ArchWiki Vulkan](https://wiki.archlinux.org/title/Vulkan) · [openSUSE Vulkan](https://en.opensuse.org/Vulkan) |
| NVIDIA | A revisão explicita que driver beta não é recomendação padrão e bloqueia downgrade genérico. | A página NVIDIA distingue os canais de driver; o método de instalação continua sendo o da distribuição do usuário. [NVIDIA Vulkan Driver Support](https://developer.nvidia.com/vulkan-driver) |
| Áudio | Para ambientes com WirePlumber, o primeiro passo é `wpctl status`, que apenas inspeciona os dispositivos e fluxos ativos. | O comando fica condicionado a WirePlumber em execução; nenhum reset ou alteração persistente foi incluído. [WirePlumber wpctl](https://pipewire.pages.freedesktop.org/wireplumber/tools/wpctl.html) |
| Stutter | A orientação anterior já era conservadora: reproduzir sem overlays e registrar o cenário sem alegar uma correção universal. | Mantida sem comando novo e com proveniência comunitária declarada. [ArchWiki Gaming](https://wiki.archlinux.org/title/Gaming) |

Nenhuma alteração nesta rodada introduziu texto estático de interface. Portanto, o catálogo das 11 localidades não exigiu novas chaves; a regressão do catálogo de idiomas foi executada junto com a suíte ampliada. O conteúdo LinuxFix permanece editorial em português, com origem, confiança e proveniência existentes preservadas.

## Empacotamento desktop

O `electron-builder` da versão instalada tentava gerar metadados de atualização mesmo sem provedor configurado e falhava ao calcular o canal. Os scripts agora usam `--publish never` e a configuração declara um endpoint local de contrato com `publishAutoUpdate: false`; ele não realiza upload, não habilita atualização automática e não exige conta externa. Esse ajuste permite produzir os formatos Windows NSIS, AppImage, `.deb`, `.rpm` e Pacman localmente.

| Artefato reconstruído | SHA-256 |
| --- | --- |
| `Stray-Linux-1.0.0-Setup.exe` | `aa1b3f513b270e94cbec9966f7fddaed69a98fc6239ae51ae024a8cbb9dd637f` |
| `Stray-Linux-1.0.0-x86_64.AppImage` | `cf1b280e3aab5c42bfba518b9102188bf014fb782d8dbfa4496d49cf745a30df` |
| `Stray-Linux-1.0.0-amd64.deb` | `13177be423e0542e22fde1935f4a1e33a75c0896b9fe6b4246a615b5a020a8b9` |
| `Stray-Linux-1.0.0-x86_64.rpm` | `9f7afab79e06ae7ffc216aa6cb6abe404c0ead4c3ddfda0e1a86761e83b4d9e1` |
| `Stray-Linux-1.0.0-x64.pacman` | `d5a8c861990e21eab626a218b70c84da052cbfce9b9d1240d8eeae709cfcd989` |

O pacote `.deb` foi inspecionado e declara `stray-linux` versão `1.0.0`, arquitetura `amd64` e a autoria configurada. O build de produção ainda informa chunks grandes já existentes para a área de Assistente e componentes de visualização; isso não impediu a compilação, mas permanece uma oportunidade de divisão adicional de código em uma rodada dedicada de desempenho.
