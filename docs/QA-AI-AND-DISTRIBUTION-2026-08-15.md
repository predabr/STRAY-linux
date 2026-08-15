# Validação de IA e distribuição — 15 de agosto de 2026

## Stray AI em modo visitante

A rota `/assistant` foi aberta sem sessão autenticada no ambiente de desenvolvimento. A interface exibiu o estado **“visitante e pronta”**, os atalhos de diagnóstico e a informação de que nenhum histórico ou perfil pessoal é lido ou salvo.

O atalho **“Verifique meu ambiente para Vulkan indisponível”** foi enviado pela própria interface e retornou uma resposta estruturada com as seções de leitura, evidência, ações seguras, limites e fontes internas. O teste não tratou a resposta como confirmação de compatibilidade, desempenho ou causa. A rota pública também foi exercitada diretamente por tRPC sem credencial de usuário.

## Pacotes desktop

Os cinco artefatos foram reconstruídos após a sincronização do snapshot SQLite e o ajuste do modo visitante. A inspeção de metadados confirmou `stray-linux` na versão `1.0.0` para os formatos Debian e RPM. Os checksums publicados em `INSTALLERS.md` e `Stray-Linux-1.0.0-SHA256SUMS.txt` correspondem ao lote final enviado ao armazenamento do projeto.

| Formato | SHA-256 |
| --- | --- |
| Windows NSIS | `dce56390abf1cdb42bca2ba17c5841f1741c615551ee77fe213054b3aa41f106` |
| Debian/Ubuntu | `c20cdd7e96a00eb82a55cc8d2103fb69d2f9aa3a0235442caf09b97ff61e16f3` |
| RPM | `bd4deed1189e2765e74d3bc090f17e9e097ed70181a513c9d944b1d20217feaa` |
| Pacman | `fae609b4c94aa840ba0f632f8a9c6f247dcf76891fd9fea5e1c94b870dafbe24` |
| AppImage | `2f46c6a7508bbb4d38149e09cb84eae58d3769d3dece54f4c3f4ef4088623486` |
