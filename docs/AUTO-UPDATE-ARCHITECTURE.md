# Arquitetura de atualização controlada

## Decisão

O Stray Linux usa um feed HTTPS de releases publicados. O aplicativo verifica a existência de uma versão mais recente apenas quando está empacotado; se houver atualização, baixa o artefato e seus metadados de integridade, mas **não reinicia nem instala sem confirmação explícita**.

| Plataforma/formato | Comportamento adotado |
|---|---|
| Windows NSIS | Consulta o feed, baixa a atualização validada e pede confirmação para reiniciar. A instalação por máquina pode solicitar UAC. |
| AppImage | Consulta o feed, baixa a atualização validada e pede confirmação antes de reiniciar. |
| Debian, RPM e Pacman | Consulta o feed e pode preparar a atualização, mas a conclusão depende da autorização e do mecanismo de pacote da distribuição. |
| Desenvolvimento | Não consulta feed nem baixa arquivos. |

O feed usa o provedor HTTP genérico documentado pelo empacotador. Ele contém metadados `latest*.yml` e artefatos publicados; a publicação manual desses arquivos é obrigatória para esse tipo de provedor.[1]

> A verificação de integridade do artefato é feita pelo cliente de atualização a partir dos metadados de release. A aplicação não aceita downgrade e mantém a confirmação explícita antes de encerrar a sessão.

## Limites de segurança

O certificado de assinatura de código para Windows não está configurado neste projeto. Portanto, o feed valida os checksums do release, mas a reputação e o aviso do Windows continuam dependentes da futura aquisição/configuração de certificado de assinatura. Nenhuma chave é incluída no aplicativo.

As distribuições Linux continuam respeitando a autorização do sistema e o gerenciador de pacotes. O Stray não executa `sudo`, `pacman`, `dnf`, `apt` ou `zypper` automaticamente.

## Referências

[1] [electron-builder — Auto Update](https://www.electron.build/docs/features/auto-update/)

[2] [electron-builder — Publish](https://www.electron.build/docs/publish)

[3] [Electron — autoUpdater](https://www.electronjs.org/docs/latest/api/auto-updater)
