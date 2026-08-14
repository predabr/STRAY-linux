# Experiência, BigLinux e dependências — revisão de 2026-08-14

## Mudanças publicáveis

Os perfis de distribuições foram reorganizados em uma sequência de contexto, formato e comandos, com comandos mantidos fora do Atlas e exibidos apenas no perfil correspondente. O BigLinux foi consolidado como uma única entrada atual da família Arch/Pacman e recebeu um painel separado com links oficiais de download e comunidade. A classificação não promete desempenho de jogos nem modifica configurações do sistema.

A primeira abertura passou a ser uma sequência curta de marca em fundo fosco, com varredura visual, título progressivo e cortina de saída. A trilha é carregada apenas após escolha explícita da pessoa usuária. O fluxo respeita `prefers-reduced-motion`, mantém os controles por teclado e leva à página inicial pública após a abertura; recursos pessoais continuam exigindo autenticação.

## Base de evidências do BigLinux

| Assunto | Registro usado |
| --- | --- |
| Projeto e colaboração | O site oficial descreve o BigLinux como projeto brasileiro de software livre e apresenta os canais de comunidade.[1] |
| Base e código | A página de download informa derivação dos repositórios Manjaro e aponta a organização oficial no GitHub.[2] [3] |
| Teste e mídia | A documentação de download orienta usar o modo Live para checar dispositivos e oferece checksums de ISO.[2] |
| Contexto gaming | O site cita Steam, Lutris e escolhas de Kernel/Mesa; o produto não converte isso em promessa de FPS ou compatibilidade.[1] [2] |

## Dependências

As configurações de pnpm foram movidas para `pnpm-workspace.yaml`, como orienta a documentação recente do pnpm.[4] A atualização coordenada de AWS SDK, tRPC, Axios, Drizzle ORM, Nano ID e Streamdown eliminou o alerta crítico de `fast-xml-parser`; após a verificação de produção, o total crítico passou de **1 para 0**.

Permanecem dois alertas altos transitivos marcados pela auditoria como **review**, ligados a `path-to-regexp` e `lodash`. Eles dependem de mudanças maiores de cadeia/framework e não foram forçados por override incompatível. A próxima rodada de manutenção deve avaliar migração de Express e a cadeia de renderização de diagramas em um ambiente de compatibilidade dedicado.

## Referências

[1] [BigLinux — site oficial](https://www.biglinux.com.br/)

[2] [Download BigLinux — requisitos, modo Live, Kernel/Mesa e checksums](https://www.biglinux.com.br/download/)

[3] [Organização BigLinux no GitHub](https://github.com/biglinux)

[4] [pnpm — configurações em pnpm-workspace.yaml](https://pnpm.io/settings)
