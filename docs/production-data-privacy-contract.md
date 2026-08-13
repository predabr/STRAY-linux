# Contrato de dados, privacidade e operação do Stray Linux

## Princípios obrigatórios

O Stray Linux diferencia **dados técnicos coletados localmente**, **dados importados de fontes externas** e **contribuições da comunidade**. Nenhum relatório de sistema, chave de serviço, benchmark, comentário ou captura é publicado, enviado ou usado para pontuação sem uma ação explícita do usuário ou revisão administrativa aplicável.

| Categoria | Coleta permitida | Uso | Proibido por padrão |
| --- | --- | --- | --- |
| Scanner local | Distro, versão, kernel, CPU, GPU, RAM, driver, Mesa, Vulkan/OpenGL, Wine, Proton e presença local de Steam | Pré-preencher perfil e produzir um arquivo local revisável | Envio automático, leitura de arquivos pessoais, tokens Steam, nomes de usuário, biblioteca de jogos ou identificadores de máquina. |
| Perfil do usuário | Campos técnicos confirmados após prévia | Compatibilidade contextual e formulários de benchmark | Inferir configuração ausente ou reter relatórios brutos sem consentimento. |
| Dados externos | Campos com URL, licença, fonte, lote e data de coleta | Catálogo, releases e referências técnicas | Scraping contra termos, atribuir status oficial a fonte comunitária ou expor chaves. |
| Benchmarks e comunidade | Evidência submetida, contexto de ambiente e revisão | Comparação, LinuxFix e moderação | Converter relatos em `VERIFIED` sem revisão, fabricar votos/reviews, ou publicar conteúdo removido. |

## Retenção e proveniência

Cada importação externa deve registrar fonte, URL, licença/termos aplicáveis, hash de entrada, data/hora de coleta, responsável técnico e campos alterados. Cada apresentação ao usuário deverá informar **origem**, **data da última atualização** e categoria de evidência quando existente.

Relatórios de scanner permanecem locais até a confirmação de importação do perfil. O aplicativo deve permitir ao usuário descartar a prévia antes de gravar; a primeira versão não envia o relatório a serviços remotos. Registros de perfil podem ser editados ou excluídos pelo próprio usuário conforme os controles já existentes do produto.

## Evidência e decisão

`VERIFIED` representa um benchmark ou compatibilidade revisados com evidência suficiente. `COMMUNITY` representa contribuição identificada como comunitária, incluindo fontes como ProtonDB. `ESTIMATED` só é permitido quando o método é declarado e nunca pode substituir uma medição. Se não houver dados, o resultado é **indisponível** — não uma nota calculada.

Capturas de benchmark são opcionais e, quando enviadas, aceitam apenas PNG, JPEG ou WebP de até 5 MB. O servidor confere tipo, tamanho e assinatura binária antes do armazenamento; a captura permanece associada a uma submissão `COMMUNITY` até a revisão de moderação.

## Segurança e produção

Chaves Steam e demais credenciais ficam somente em variáveis seguras do servidor e não são inseridas no cliente, snapshot SQLite ou repositório. A sincronização automática deverá ter limites de requisição, logs sem segredos, execução idempotente, revisão de alterações e caminho de rollback. Antes da publicação pública, domínio, política de backup/restauração, armazenamento de evidências, CDN, observabilidade, rate limiting, alertas e CI/CD precisam de configuração explícita.
