# Linux Gaming Hub Desktop

O wrapper Electron empacota o frontend e o servidor Node do Linux Gaming Hub para Windows. Ao abrir, ele inicia o servidor local em `127.0.0.1` e mostra a interface em uma janela nativa. A configuração fica em `linux-gaming-hub.config.json`, dentro da pasta de dados do aplicativo.

> O chat local pode usar uma instalação local do Ollama em `http://127.0.0.1:11434`. O modelo escolhido deve ser instalado pelo próprio usuário. O aplicativo não envia essa pergunta a um serviço remoto quando o provedor **Ollama local** está selecionado.

## Banco de dados

A edição web usa o banco MySQL/TiDB do ambiente gerenciado. O wrapper desktop aceita uma `databaseUrl` no arquivo de configuração para executar o mesmo backend localmente. A atual arquitetura Drizzle utiliza o driver MySQL; por isso, a produção de um instalador realmente autônomo com banco embarcado requer a migração da camada de persistência para SQLite ou a inclusão de um serviço MySQL/MariaDB no instalador. Essa decisão é documentada explicitamente para evitar prometer um banco local que não exista.

## Criar um instalador Windows

Após instalar as dependências de desktop, execute:

```bash
pnpm desktop:build
```

O comando gera o pacote de distribuição em `release/`. A compilação cruzada de um instalador NSIS para Windows pode requerer Wine em uma máquina Linux; a alternativa confiável é executar o comando em um runner Windows do GitHub Actions.
