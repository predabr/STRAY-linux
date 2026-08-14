# Stray Scan

`stray-scan` gera um JSON técnico local para importação voluntária no perfil do Stray Linux. No aplicativo Electron, o usuário pode executar o scanner por uma ação explícita em **Scanner**; a ponte entre a interface e o processo principal expõe somente essa operação, sem acesso genérico a comandos, filesystem ou IPC.

O relatório pode conter distribuição, kernel, ambiente gráfico, CPU, GPU, memória, espaço de armazenamento da raiz, monitores detectados, APIs gráficas, Wine, presença do Steam e a **contagem local** de instalações Steam encontradas. Ele não coleta hostname, nome de usuário, serial, ID de máquina, tokens, títulos de jogos, App IDs, biblioteca identificável, arquivos pessoais ou identificadores persistentes.

No código-fonte, execute:

```bash
node desktop/bin/stray-scan.cjs --pretty --output stray-system-report.json
```

Revise o arquivo antes de importá-lo. A execução do scanner não envia dados pela rede; a criação do perfil requer confirmação na tela de prévia. O relatório não cria benchmark, compatibilidade ou comentário automaticamente.
