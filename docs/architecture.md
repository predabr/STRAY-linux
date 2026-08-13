# Arquitetura do Linux Gaming Hub

## Objetivo operacional

O Linux Gaming Hub será uma plataforma composta por uma aplicação web full-stack e uma edição desktop para Windows. As duas edições compartilharão interface, contratos tRPC, tipos de domínio, regras de compatibilidade, validação e catálogo versionado. A edição web utilizará o banco MySQL/TiDB provisionado pelo ambiente; a edição desktop executará o mesmo servidor Node localmente e persistirá seus dados em um banco SQLite instalado no diretório de dados da aplicação.

| Camada | Edição web | Edição desktop Windows |
|---|---|---|
| Cliente | React, Vite, Tailwind e componentes shadcn/ui | O mesmo cliente em uma janela Electron |
| API | Express e tRPC sob `/api/trpc` | O mesmo processo Express iniciado pelo processo principal do Electron |
| Persistência | Drizzle com MySQL/TiDB | Adaptador Drizzle para SQLite no perfil local |
| Autenticação | OAuth do ambiente e RBAC persistido | Perfil local, sem dependência de OAuth para modo offline |
| Dados técnicos | Banco, importações rastreáveis e moderação | Snapshot local + dados e ações do usuário local |
| Assistente | Contexto interno; provedor configurado pelo administrador | Contexto interno + Ollama local opcional |

## Fronteiras de domínio

O frontend não calcula compatibilidade, não decide origem de benchmark e não altera estados de moderação. Essas decisões ficam em procedimentos tRPC no servidor. Cada procedimento valida entrada com Zod, obtém usuário da sessão, aplica autorização contextual e então acessa o repositório correspondente.

```text
React client
  → tRPC procedure
    → validação Zod
      → guard de usuário/role/propriedade
        → serviço de domínio
          → repositório Drizzle
            → MySQL/TiDB (web) ou SQLite (desktop)
```

## Modelo de confiança de dados

Todo conteúdo técnico terá origem e ciclo de vida próprios. `VERIFIED` identifica informação revisada com evidência rastreável; `COMMUNITY` identifica submissão de usuário ainda não verificada; `ESTIMATED` identifica saída calculada por metodologia documentada; e `UNKNOWN` identifica ausência de evidência suficiente. O sistema não converte dados comunitários ou estimados em verificados automaticamente.

| Tipo de conteúdo | Campos obrigatórios de rastreabilidade | Regra de publicação |
|---|---|---|
| Benchmark | origem, URL/descrição da fonte, ambiente, data de medição, autor e status | FPS só aparece com origem declarada; `VERIFIED` exige revisão de MODERATOR ou ADMIN |
| Compatibilidade | jogo, ambiente, nível, origem, confiança e revisão | Ausência de relato resulta em `UNKNOWN`, nunca em suporte presumido |
| Guia e wiki | fonte, versão, revisão e autor | Conteúdo de comunidade inicia em rascunho e depende de moderação |
| LinuxFix | sintomas, causa, solução, origem, confiança e escopo afetado | Publicação controlada por moderação |

## Catálogo e importação

O catálogo será abastecido por um importador versionado no servidor. O importador cria um lote com fonte, momento de coleta, hash de entrada e contagem de itens; cada jogo preserva identificador externo e URL de origem. O primeiro lote terá pelo menos 1.000 jogos de fonte pública rastreável. Metadados como suporte nativo, Steam Deck, multiplayer, anti-cheat e gênero só serão preenchidos quando vierem de fonte associada ou tiverem origem identificada. Campos ausentes permanecem desconhecidos e não são deduzidos.

A documentação Steamworks confirma que algumas interfaces para aplicações requerem chave de editor e não podem ser chamadas pelo navegador. Por isso, qualquer conector com credencial ficará exclusivamente no servidor, enquanto a importação de lista pública ficará isolada em comando administrativo de execução manual ou pipeline de release. [1]

## Wiki e conteúdo técnico

O conteúdo editorial será modelado como artigos e passos versionados, com distribuição, versão, arquitetura, driver e pacote opcionais. A wiki não copiará integralmente documentação de terceiros; ela registrará instruções originais, a fonte consultada e a data de revisão. As páginas apresentarão claramente quando uma instrução for geral, específica de versão ou ainda não revisada.

O conteúdo inicial cobrirá Arch, CachyOS, Fedora, Nobara, Ubuntu, Bazzite, Pop!_OS, Linux Mint, Debian, openSUSE e EndeavourOS. Os guias de Steam, Proton GE, MangoHud, GameMode, Vulkan, FSR e drivers terão comandos separados por distribuição e uma área de alerta para operações que exigirem atenção do usuário.

## Compatibilidade e benchmarks

O motor de compatibilidade seleciona evidências por ordem de especificidade: combinação exata de jogo e ambiente; combinação parcial por distribuição/hardware/runtime; e, por último, ausência de dados. O resultado inclui explicação, limitações, nível e confiança. Não há regra que transforme dados sem correspondência em `GOOD` ou `EXCELLENT`.

A calculadora de benchmark agrega apenas registros com ambiente compatível. Se a amostra cumprir critérios de metodologia, ela retorna uma estimativa com intervalo, tamanho da amostra, confiança e método. Se os critérios não forem cumpridos, retorna indisponibilidade. Nenhum endpoint gera FPS sintético apenas para preencher a interface.

## Autenticação e roles

`USER` pode manter perfil, hardware, favoritos, guias salvos, submissões e reports próprios. `MODERATOR` revisa conteúdo comunitário, reports e benchmarks no escopo permitido. `ADMIN` executa CRUD de catálogo, altera roles, bane usuários, controla publicação e consulta a auditoria. Toda alteração administrativa cria um registro imutável de auditoria com ator, entidade, ação, dados mínimos e data.

## Chat contextual e IA local

O chat recupera primeiro artigos, guias e LinuxFix relevantes do banco. O contexto recuperado, as referências internas e a pergunta do usuário formam a requisição para o provedor selecionado. A resposta deve indicar fontes internas utilizadas e responder `não há informação interna suficiente` quando não houver contexto adequado.

Na edição desktop, o usuário pode ativar o provedor Ollama local e escolher um modelo já instalado. A API oficial do Ollama é normalmente atendida em `http://localhost:11434/api`; a aplicação testa disponibilidade e mantém o chat desabilitado, sem falha, quando o serviço não estiver presente. [2] O produto não promete execução ilimitada: a capacidade depende do modelo instalado e dos recursos da máquina do usuário.

## Empacotamento Windows

O processo principal Electron iniciará o servidor local em uma porta efêmera, aguardará sua saúde e só então abrirá a janela da aplicação. O banco SQLite será mantido no diretório de dados do usuário, fora do diretório de instalação, para preservar atualizações e permitir backup. O projeto conterá configuração de build e uma ação de release no GitHub executada em Windows, que produz o instalador `.exe`. A documentação do Electron recomenda empacotar e renomear a aplicação com ferramental especializado para distribuição. [3]

### Referências

[1]: https://partner.steamgames.com/doc/webapi/isteamapps "Steamworks Documentation — ISteamApps"
[2]: https://docs.ollama.com/api/introduction "Ollama API — Introduction"
[3]: https://www.electronjs.org/docs/latest/tutorial/application-distribution "Electron — Application Packaging"
