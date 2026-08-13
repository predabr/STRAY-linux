# Fontes editoriais para guias de drivers

Esta nota registra fontes verificadas em agosto de 2026 para a revisão dos guias Linux Setup. Ela não substitui a documentação vinculada em cada guia publicado.

| Família ou componente | Fonte | Achado editorial aplicado |
|---|---|---|
| Arch NVIDIA | https://wiki.archlinux.org/title/NVIDIA | A ArchWiki orienta preferir pacotes `pacman` ao instalador do site da NVIDIA e exige observar família da GPU, kernel e suporte de 32 bits. |
| Arch AMD | https://wiki.archlinux.org/title/AMDGPU | A página identifica Mesa e `vulkan-radeon` como componentes da pilha para hardware suportado e orienta validar o driver carregado antes de ajustes. |
| Fedora NVIDIA | https://docs.fedoraproject.org/en-US/gaming/drivers/ | A documentação alerta que o driver binário NVIDIA não é mantido pelo Fedora, utiliza repositório externo e pode depender da disponibilidade para o kernel. |
| NVIDIA Vulkan | https://developer.nvidia.com/vulkan-driver | A NVIDIA mantém uma página de suporte Vulkan para drivers Linux, mas a integração de pacote deve seguir a distribuição. |
| openSUSE Vulkan | https://en.opensuse.org/Vulkan | A wiki do openSUSE lista explicitamente `libvulkan_intel`/`libvulkan_intel-32bit` para Intel e `libvulkan_radeon`/`libvulkan_radeon-32bit` para AMD, com requisitos de geração de GPU. |
| Mesa RADV | https://docs.mesa3d.org/drivers/radv.html | RADV é o driver Vulkan Mesa para GPUs AMD GCN/RDNA suportadas; distribuições normalmente o fornecem dentro de seus pacotes Mesa. |

Os guias associados devem declarar claramente quando um comando é específico de uma família e quando uma alteração de repositório ou kernel precisa de confirmação adicional.
