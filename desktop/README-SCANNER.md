# Stray Scan

`stray-scan` gera um JSON técnico local para importação voluntária no perfil do Stray Linux. Ele lê apenas informações de distribuição, kernel, CPU, GPU, memória, APIs gráficas, Wine e presença do Steam; não coleta hostname, usuário, serial, ID de máquina, tokens, biblioteca de jogos ou arquivos pessoais.

No código-fonte, execute:

```bash
node desktop/bin/stray-scan.cjs --pretty --output stray-system-report.json
```

Revise o arquivo antes de importá-lo. A primeira versão não envia dados pela rede e não cria benchmark, compatibilidade ou comentário automaticamente.
