# Auditoria publicada — 14 de agosto de 2026

- A página publicada `https://linuxtoys-ckuyvpj5.manus.space/` respondeu e renderizou a introdução do Stray Linux após a estabilização inicial.
- A primeira captura exibiu somente o indicador de carregamento; a segunda confirmou a renderização da introdução. A auditoria deve verificar se isso excede o tempo aceitável ou se há erros de rede/consola associados.
- Não houve ação em Steam, scraping ou chamada a endpoint não autorizado durante a verificação.

## Fontes LinuxFix revalidadas

As permissões Flatpak restringem por padrão o acesso ao host; a documentação oficial orienta minimizar acessos permanentes ao filesystem e usar portais quando possível. Portanto, qualquer correção para biblioteca Steam Flatpak deve explicar o escopo e a reversibilidade da permissão, em vez de oferecer acesso amplo à pasta pessoal. A documentação Khronos permanece a referência de diagnóstico para Vulkan, e a NVIDIA mantém uma página oficial separando drivers gerais de versões beta; o LinuxFix não deve recomendar beta como solução padrão. [Flatpak permissions](https://docs.flatpak.org/en/latest/sandbox-permissions.html) · [Khronos Vulkan Guide](https://docs.vulkan.org/guide/latest/) · [NVIDIA Vulkan Driver Support](https://developer.nvidia.com/vulkan-driver)
