# Auditoria de expansão de conteúdo — 15 de agosto de 2026

## Estado inicial

O banco publicado contém **10.013 jogos**, **18 distribuições**, **18 artigos wiki**, **39 guias de setup** e **6 LinuxFix**. Não há registros de compatibilidade nem benchmarks verificados; esses estados devem permanecer explícitos até receberem evidência rastreável.

## Distribuições candidatas verificadas

| Distribuição | Base ou foco confirmado | Escopo seguro para o Stray Linux | Fonte oficial |
| --- | --- | --- | --- |
| PikaOS | Base Debian; foco em gaming e otimização | Perfil de descoberta e wiki de orientação, sem score de compatibilidade | [1] |
| Garuda Linux | Base Arch; ferramentas e snapshots BTRFS | Perfil de descoberta e encaminhamento aos guias de família Arch | [2] |
| ChimeraOS | Experiência de console gaming para PC e interface compatível com controle | Perfil de descoberta sem presumir comandos de manutenção | [3] |

> Nenhuma dessas fontes comprova FPS, qualidade de compatibilidade por jogo ou suporte de hardware para todos os ambientes. Por isso, os novos perfis não receberão pontuação de gaming nem resultados de compatibilidade.

## Catálogo de jogos

O crescimento do catálogo só poderá usar registros de fonte pública ou licenciada com URL, data de consulta e campos preservados. Descrições, capas, screenshots, requisitos, recomendações de Proton, benchmarks e compatibilidade continuam bloqueados quando a fonte não os autorizar.

## Diagnósticos e ferramentas de execução verificados

| Tema | Informação confirmada | Limite aplicado no Stray Linux | Fonte |
| --- | --- | --- | --- |
| Proton | A Valve documenta `PROTON_LOG` e opções de inicialização que podem ser removidas para restaurar o comportamento padrão. | Registrar logs e testar uma mudança por vez; não recomendar uma variável como correção universal. | [4] |
| Flatpak | A documentação descreve inspeção, histórico, reparo e restauração de permissões por aplicativo. | Apresentar primeiro leitura e diagnóstico; qualquer reparo ou redefinição exige confirmação explícita do usuário fora do Stray. | [5] [6] |
| GameMode | O projeto documenta `gamemoderun %command%` e o teste `gamemoded -t`. | Tratar como teste temporário por jogo, não como promessa de ganho de desempenho. | [7] |
| MangoHud | O projeto documenta a ativação por jogo e a configuração por arquivo. | Usar somente para observação e coleta local; nunca preencher benchmark automaticamente. | [8] |
| Gamescope | A Valve documenta exemplos de resolução, escala e limite de taxa em launch options. | Marcar como opção avançada e reversível; não presumir suporte para toda GPU, driver ou sessão gráfica. | [9] |
| Wine | O Wine é uma camada de compatibilidade para aplicações Windows em sistemas POSIX. | Não confundir a existência da camada com confirmação de compatibilidade de um jogo. | [10] |
| Gentoo e Portage | A documentação explica que `emerge --info` relata informações do sistema e que `--ask` ou `--pretend` devem preceder mudanças planejadas. | O guia Gentoo registra primeiro o ambiente e não executa instalações ou remoções automáticas. | [11] [12] |
| Bazzite | A documentação trata a imagem como sistema Atomic, recomenda `rpm-ostree status` para inspeção e alerta que layering pode bloquear atualizações. | O guia usa inspeção primeiro e exclui `dnf install`, layering e rebase como ações automáticas. | [13] [14] |
| ChimeraOS | A documentação orienta atualizações pela tela System e exige reinicialização para aplicar mudanças. Também alerta que nem todos os jogos funcionam. | O guia não publica comando de pacote, não aciona remote launch e não converte a página de compatibilidade do projeto em score do Stray. | [15] |
| Bazzite — atualização | A documentação informa atualização automática diária nas imagens desktop, atualização manual pelo Steam Gaming Mode nas imagens Deck e aplicação após reinicialização. | Orientar o usuário ao fluxo gráfico publicado e registrar que mudanças do sistema não se aplicam até reiniciar; não sugerir instalação de pacotes por DNF. | [16] |
| Garuda Linux | A wiki oficial se apresenta como complemento da Arch Wiki e reúne rotas específicas de gaming, snapshots e manutenção. | Vincular o perfil aos guias Arch e à wiki Garuda; não tratar uma instrução do fórum como procedimento oficial. | [17] |
| ChimeraOS — releases | As notas de release registram mudanças e limitações por versão, inclusive ressalvas específicas para NVIDIA em releases diferentes. | Exibir apenas referência de release e evitar concluir suporte universal de GPU, controle ou jogo a partir de uma nota específica. | [18] |
| PikaOS | A wiki oficial apresenta base Debian Sid e ferramentas próprias para boas-vindas, atualização e gestão de kernel/dispositivo. | Descrever as ferramentas sem presumir que elas corrigem um jogo, driver ou problema de kernel. | [19] |
| CachyOS | O guia oficial recomenda verificar drivers primeiro e alerta que otimizações podem ter impacto pequeno ou nulo conforme jogo e hardware. | Orientar uma mudança por vez; não publicar previsão de FPS ou usar Proton personalizado como padrão universal. | [20] |
| Nobara | A wiki oficial orienta o atualizador do próprio projeto, diferencia drivers estáveis de alternativas e alerta sobre conflitos com repositórios externos. | Priorizar o fluxo Nobara e não converter instruções de Fedora genérica em reparo seguro para toda instalação Nobara. | [21] |

> As referências técnicas acima descrevem ferramentas e opções, não resultados por jogo. Assim, os LinuxFix resultantes devem preservar fonte, nível de confiança e avisos de reversão, sem publicar FPS, scores ou alegações de compatibilidade.

## Referências

[1] [PikaOS — documentação oficial](https://wiki.pika-os.com/)

[2] [Garuda Linux — site oficial](https://garudalinux.org/)

[3] [ChimeraOS — site oficial](https://chimeraos.org/)

[4] [ValveSoftware/Proton — opções de runtime](https://github.com/ValveSoftware/Proton)

[5] [Flatpak — uso e solução de problemas](https://docs.flatpak.org/en/latest/using-flatpak.html)

[6] [Flatpak — referência de comandos](https://docs.flatpak.org/en/latest/flatpak-command-reference.html)

[7] [Feral Interactive GameMode — documentação](https://github.com/FeralInteractive/gamemode)

[8] [MangoHud — documentação](https://github.com/flightlessmango/MangoHud)

[9] [ValveSoftware/gamescope — documentação](https://github.com/ValveSoftware/gamescope)

[10] [WineHQ — documentação do projeto](https://www.winehq.org/)

[11] [Gentoo Wiki — emerge](https://wiki.gentoo.org/wiki/Emerge)

[12] [Gentoo Wiki — Steam](https://wiki.gentoo.org/wiki/Steam)

[13] [Bazzite — Package Layering](https://docs.bazzite.gg/Installing_and_Managing_Software/rpm-ostree/)

[14] [Bazzite — FAQ](https://docs.bazzite.gg/General/FAQ/)

[15] [ChimeraOS — Getting Started](https://github.com/ChimeraOS/chimeraos/wiki/Getting-Started)

[16] [Bazzite Documentation — Update Guide](https://docs.bazzite.gg/Installing_and_Managing_Software/Updates_Rollbacks_and_Rebasing/updating_guide/)

[17] [Garuda Linux Wiki](https://garudalinux.org/wiki)

[18] [ChimeraOS — Release Notes](https://github.com/ChimeraOS/chimeraos/wiki/Release-Notes)

[19] [PikaOS Wiki — What makes PikaOS different?](https://wiki.pika-os.com/en/why-pikaos)

[20] [CachyOS Wiki — Gaming with CachyOS](https://wiki.cachyos.org/configuration/gaming/)

[21] [Nobara Project Wiki — New User Guide and General Usage Guidelines](https://wiki.nobaraproject.org/en/new-user-guide-general-guidelines)
