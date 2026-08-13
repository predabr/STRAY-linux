# Fontes do assistente e IA local

O modo local do assistente usa o endpoint `POST /api/chat` do Ollama com `model`, `messages` e `stream: false`. A resposta não transmitida retorna conteúdo em `message.content`, contrato compatível com a integração do Stray Linux.[1]

> A documentação do Ollama informa que a API local é servida por padrão em `http://localhost:11434/api` e não requer autenticação para acesso local.[2] [3]

| Limite auditado | Comportamento do Stray Linux |
|---|---|
| Endpoint local | Usa `/api/chat` com URL configurável pelo usuário. |
| Modelo | O modelo deve estar instalado e em execução na máquina do usuário. |
| Contexto | O aplicativo fornece somente trechos do conteúdo interno publicado e solicita declaração explícita de ausência quando não houver evidência. |
| Segurança | O aplicativo não envia token remoto ao endpoint local; a disponibilidade do serviço e regras de CORS permanecem dependentes da instalação do usuário. |

## Referências

[1] [Ollama API — Generate a chat message](https://docs.ollama.com/api/chat)

[2] [Ollama API — Introduction](https://docs.ollama.com/api/introduction)

[3] [Ollama API — Authentication](https://docs.ollama.com/api/authentication)
