# Fontes da área Windows

A área **Windows** do Stray Linux usa comandos e rotas de interface que possuem fonte oficial da Microsoft. Ela não executa comandos remotamente, não recomenda scripts de “debloat”, alterações de Registro ou remoção de componentes do sistema.

| Assunto | Instrução adotada | Fonte |
|---|---|---|
| Gerenciador de pacotes | Usar `winget search` antes de instalar e `winget install --id <ID> --exact` somente após conferir o pacote. | [1] |
| Apps úteis | Os IDs são apresentados de forma individual para revisão do usuário; o usuário deve confirmar detalhes com `winget show --id <ID>`. | [1] |
| Reparo de imagem | Usar `DISM /Online /Cleanup-Image /CheckHealth` para diagnóstico e reservar `RestoreHealth` a terminal elevado. | [2] [3] |
| Arquivos do sistema | Executar `sfc /scannow` após DISM, em terminal elevado, e aguardar o término da verificação. | [2] |
| Espaço em disco | Preferir o Storage Sense nas Configurações; Downloads não são limpos pela configuração padrão sem ação explícita. | [4] |

> A Microsoft informa que o WinGet pode pesquisar, instalar, atualizar, remover e configurar aplicativos, mas orienta cautela ao executá-lo em terminal de administrador. O Stray Linux portanto fornece comandos individuais e não um instalador em lote.[1]

## Referências

[1] [Microsoft Learn — Use WinGet to install and manage applications](https://learn.microsoft.com/en-us/windows/package-manager/winget/)

[2] [Microsoft Support — Use the System File Checker tool to repair missing or corrupted system files](https://support.microsoft.com/en-us/windows/experience/backup-recovery/use-the-system-file-checker-tool-to-repair-missing-or-corrupted-system-files)

[3] [Microsoft Learn — Repair a Windows Image](https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/repair-a-windows-image?view=windows-11)

[4] [Microsoft Support — Manage drive space with Storage Sense](https://support.microsoft.com/en-us/windows/experience/storage-filemanagement/manage-drive-space-with-storage-sense)
