# Linux Gaming Hub Desktop

O wrapper Electron empacota o frontend e o servidor Node do Linux Gaming Hub para Windows. Ao abrir, ele inicia o servidor local em `127.0.0.1` e mostra a interface em uma janela nativa. A configuração fica em `linux-gaming-hub.config.json`, dentro da pasta de dados do aplicativo.

> O chat local pode usar uma instalação local do Ollama em `http://127.0.0.1:11434`. O modelo escolhido deve ser instalado pelo próprio usuário. O aplicativo não envia essa pergunta a um serviço remoto quando o provedor **Ollama local** está selecionado.

## Banco de dados local

A edição web permanece no banco MySQL/TiDB gerenciado. O Electron usa um **SQLite local** separado, criado automaticamente em `linux-gaming-hub.sqlite` dentro da pasta de dados do aplicativo. A primeira abertura importa o snapshot publicado de jogos, distribuições, wiki, guias e LinuxFix; favoritos, perfis de hardware, guias salvos, histórico, reports e submissões de benchmark são persistidos apenas nesse banco local.

> A edição desktop não exige `DATABASE_URL`, nem inicia MySQL/MariaDB no computador do usuário. O snapshot não contém FPS inventados: benchmarks sem amostra verificada continuam indisponíveis até que o usuário registre uma submissão local com evidência.

Para atualizar conteúdo no desktop, gere um novo snapshot durante o desenvolvimento com `node scripts/export-desktop-seed.mjs` e publique uma nova versão do instalador. A edição web continua sendo a fonte colaborativa e moderada.

## Criar um instalador Windows

Após instalar as dependências de desktop, execute:

```bash
pnpm desktop:build
```

O comando gera o instalador NSIS em `dist/Linux-Gaming-Hub-<versão>-Setup.exe`. A compilação cruzada de um instalador Windows em Linux pode requerer Wine; o workflow do GitHub Actions é o caminho reproduzível para releases.
