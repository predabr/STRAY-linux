# Ambiente e configurações

O Stray Linux usa configuração por ambiente exclusivamente no servidor, no empacotamento desktop e em scripts de manutenção. **Nunca** registre valores reais em `.env`, no frontend, no repositório ou em capturas de tela. Os arquivos `.env*` estão ignorados pelo Git; na plataforma, os valores devem ser mantidos na área de segredos do projeto.

> O aplicativo Electron funciona com SQLite local e não exige `DATABASE_URL` na máquina de quem instala o Stray Linux.

## Plataforma web e autenticação

| Variável | Escopo | Obrigatoriedade | Uso |
|---|---|---:|---|
| `DATABASE_URL` | Servidor web | Necessária para recursos web persistentes | Conexão Drizzle/MySQL. Não é usada pelo modo desktop local. |
| `JWT_SECRET` | Servidor | Gerenciada pela plataforma | Assinatura de sessão. Nunca expor ao cliente. |
| `VITE_APP_ID` | Servidor e build | Gerenciada pela plataforma | Identificação do aplicativo OAuth. |
| `OAUTH_SERVER_URL` | Servidor | Gerenciada pela plataforma | Serviço OAuth. |
| `VITE_OAUTH_PORTAL_URL` | Cliente | Gerenciada pela plataforma | Portal de autenticação; é uma variável pública de build, não um segredo. |
| `OWNER_OPEN_ID` | Servidor | Gerenciada pela plataforma | Identificação do proprietário para autorização administrativa. |
| `OWNER_NAME` | Plataforma | Opcional | Metadado de proprietário; não é utilizado como segredo. |

## IA e fontes de catálogo

| Variável | Escopo | Obrigatoriedade | Uso |
|---|---|---:|---|
| `BUILT_IN_FORGE_API_URL` | Servidor | Gerenciada pela plataforma | Endpoint do serviço de IA integrado. |
| `BUILT_IN_FORGE_API_KEY` | Servidor | Necessária quando a IA integrada for chamada | Credencial do serviço de IA. Nunca expor no browser. |
| `VITE_FRONTEND_FORGE_API_URL` | Cliente | Gerenciada pela plataforma | Endpoint público autorizado da plataforma; não deve conter segredo. |
| `VITE_FRONTEND_FORGE_API_KEY` | Cliente | Gerenciada pela plataforma | Credencial de escopo público da plataforma; não substitui nem autoriza chaves privadas de terceiros. |
| `STEAM_WEB_API_KEY` | Servidor e scripts | Opcional | Atualização administrativa do catálogo e verificações externas opt-in. Sem a chave, esses fluxos informam indisponibilidade; o catálogo local continua disponível. |

O runtime do Stray AI usa `BUILT_IN_FORGE_API_URL` e `BUILT_IN_FORGE_API_KEY`. `OPENAI_API_BASE` e `OPENAI_API_KEY` são exclusivos do script manual `scripts/translate-ui-static.mjs`; não habilitam o Stray AI e não devem ser configuradas para usuários finais.

## Apoio Pix opcional

O QR Pix manual fica indisponível até que **todas** as variáveis abaixo estejam configuradas exclusivamente no servidor. A interface recebe somente SVG, nunca a chave nem o payload em texto. Consulte também [`PAYMENT_SECURITY.md`](PAYMENT_SECURITY.md).

| Variável | Obrigatoriedade | Uso |
|---|---:|---|
| `PIX_STATIC_KEY` | Necessária para QR manual | Chave Pix válida do recebedor. Segredo operacional: não publicar em código ou conteúdo estático. |
| `PIX_MERCHANT_NAME` | Necessária para QR manual | Nome do recebedor, normalizado no BR Code. |
| `PIX_MERCHANT_CITY` | Necessária para QR manual | Cidade do recebedor, normalizada no BR Code. |
| `PIX_TRANSACTION_ID` | Opcional | Identificador de transação estática; usa `***` quando ausente. |

Essas variáveis **não** ativam confirmação automática. Cobrança individual, webhook assinado e idempotência dependem de um provedor Pix autorizado e de credenciais adicionais que não existem nesta versão.

## Desktop, build e manutenção

| Variável | Escopo | Uso |
|---|---|---|
| `DESKTOP_MODE` | Processo Electron | Ativa o roteador SQLite local. Definida pelo launcher; não configurar manualmente no uso normal. |
| `DESKTOP_DATA_DIR` | Processo Electron e testes | Diretório dos dados locais. O launcher a define a partir do diretório de dados do usuário. |
| `DESKTOP_SEED_PATH` | Processo Electron e testes | Caminho do snapshot inicial do catálogo local. |
| `DESKTOP_SQL_WASM_PATH` | Processo Electron | Caminho do `sql-wasm.wasm` empacotado. |
| `DESKTOP_GAME_LIMIT` | Script de exportação | Limite de jogos no snapshot desktop; o script exige ao menos 10.000. |
| `PORT` | Servidor | Porta preferencial para desenvolvimento e produção; o processo procura uma porta próxima disponível. |
| `NODE_ENV` | Servidor e build | Seleciona desenvolvimento ou produção. |
| `STRAY_DOWNLOAD_BASE_URL` | Auditoria de distribuição | Sobrescreve a origem apenas no verificador de download. |
| `ALLOW_NON_ARCH` | Auditoria de distribuição | Permite validar download/checksum fora de Arch; não simula a inspeção `pacman`. |
| `RUN_EXTERNAL_STEAM_TESTS` | Testes | Quando definido como `1`, habilita testes externos que também exigem `STEAM_WEB_API_KEY`. |

Variáveis de sessão gráfica como `DISPLAY`, `WAYLAND_DISPLAY`, `XDG_CURRENT_DESKTOP` e `XDG_SESSION_TYPE` são apenas **lidas** pelo Scanner para observação local. Elas vêm do sistema operacional e não devem ser gravadas no arquivo de configuração do projeto.
