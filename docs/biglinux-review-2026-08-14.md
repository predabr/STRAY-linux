# Revisão de suporte — BigLinux

## Escopo confirmado

O BigLinux se apresenta oficialmente como um projeto brasileiro de software livre, desenvolvido de modo colaborativo, com foco em uma experiência prática de uso diário. A página oficial informa que a distribuição deriva dos repositórios Manjaro e que o código próprio do projeto é disponibilizado na organização BigLinux no GitHub.[1] [2]

Para não transformar um perfil de catálogo em orientação de instalação do sistema operacional, o Stray Linux trata o BigLinux como **família Arch/Pacman** exclusivamente para o pacote desktop já produzido pelo projeto. O perfil deve apresentar esse formato como uma opção do aplicativo, nunca como instrução genérica para modificar repositórios do BigLinux.

| Tema | Informação que pode ser publicada | Limite operacional |
| --- | --- | --- |
| Base e pacotes | Derivação de repositórios Manjaro; perfil do aplicativo na família Pacman | Não misturar repositórios, nem sugerir repositório adicional. |
| Avaliação antes da instalação | O projeto recomenda testar no modo Live e conferir dispositivos | O Stray Linux não desativa Secure Boot nem altera firmware automaticamente. |
| Imagens do sistema | Página oficial oferece opções com Kernel/Mesa e checksums | A escolha da ISO continua sendo decisão do usuário, após conferir a página oficial. |
| Recursos para jogos | O site menciona Steam e Lutris pré-instalados e opções recentes de Kernel/Mesa para hardware AMD/Intel | Não há promessa de desempenho, FPS ou compatibilidade individual de jogo. |
| Suporte | Fórum, Telegram e GitHub oficiais estão vinculados pelo projeto | O perfil aponta os canais, sem representar endosso ou suporte do BigLinux. |

## Decisão de catálogo

As duas entradas existentes para o mesmo projeto devem ser consolidadas em um único perfil atual: **BigLinux**, seção **Família Arch Linux**, suporte **Pacote por família** e instalador **Pacman**. Isso corrige a classificação histórica e a entrada “pesquisa necessária” que escondiam um projeto ativo em resultados conflitantes.

## Referências

[1] [BigLinux — site oficial](https://www.biglinux.com.br/)

[2] [Download BigLinux — requisitos, modo Live, Kernel/Mesa e checksums](https://www.biglinux.com.br/download/)

[3] [Organização BigLinux no GitHub](https://github.com/biglinux)
