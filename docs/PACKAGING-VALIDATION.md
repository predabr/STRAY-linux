# Validação dos artefatos desktop

Esta validação registra a matriz de empacotamento que contém as áreas **Windows**, **Controller Center**, **Mods**, **Cloud Sync**, **biblioteca Steam/Heroic/externa** e **documentação da API pública** do Stray Linux. A inspeção foi executada após o build web, a geração do instalador Windows e a reconstrução dos quatro formatos Linux.

> **Escopo do pacote:** cada instalador leva o runtime Electron e o bundle web dentro de `resources/app.asar`. A rota `/windows` foi confirmada pela busca binária do literal `"/windows"` nesse arquivo. Os manuais Markdown e o arquivo de checksums não pertencem ao runtime do aplicativo; eles acompanham a entrega externa, em `docs/` no repositório e no pacote de release publicado.

| Formato | Local inspecionado | Evidência de rota | SHA-256 |
|---|---|---|---|
| Windows NSIS | `dist/win-unpacked/resources/app.asar` | Scanner 1.3, System Graph, Timeline, Pré-voo, Snapshots SQLite, recuperação, logs, alertas locais, Stray AI explicável e configurações de privacidade incluídos | `6d9fd112eb8c9d32d54578b89c95917c460df2645c8d158fba4355dede0c7b77` |
| Linux unpacked | `dist/linux-unpacked/resources/app.asar` | Ponte `stray:library:pick-external`, rotas operacionais e UI renovada encontrados | Runtime de referência dos formatos Linux |
| AppImage | `Stray-Linux-1.0.0-x86_64.AppImage` | Reconstruído a partir do mesmo runtime Linux | `c2e05c03fb95e8d3d973a5bb5bbd98ac51e58dd72f5edd5f936431c324d02f35` |
| Debian/Ubuntu `.deb` | `Stray-Linux-1.0.0-amd64.deb` | Reconstruído a partir do mesmo runtime Linux | `3741412fc4097af1e97ce17b723316e53d5943bdd5818556a0b85f97cd57d9c1` |
| RPM | `Stray-Linux-1.0.0-x86_64.rpm` | Reconstruído a partir do mesmo runtime Linux | `c2c349e01da3fc8ac4e12bc172206ff9db19c53dbcb1fd7eb3b0acc7d251bda8` |
| Pacman | `Stray-Linux-1.0.0-x64.pacman` | Reconstruído a partir do mesmo runtime Linux | `256dfd4ef3d6d95cd0e7bc13b9260a9124e96ad20876d51a89da7033918e5c49` |

## Método reproduzível

Para validar as integrações, execute `grep -a -q 'stray:library:pick-external' <caminho-do-app.asar>` para a seleção consentida de pasta externa. Para um pacote `.deb`, extraia com `dpkg-deb -x`; para `.rpm` e `.pacman`, use `bsdtar -xf`; para AppImage, execute `./arquivo.AppImage --appimage-extract` e inspecione `squashfs-root`.

Os hashes da tabela também estão em [`INSTALLERS.md`](INSTALLERS.md) e no arquivo externo `Stray-Linux-1.0.0-SHA256SUMS.txt`. As fontes técnicas dos comandos da área Windows estão em [`sources-windows.md`](sources-windows.md).

## Lote de evolução do aplicativo

O lote atual foi reconstruído após a fase 2.0 de inteligência local: sinais minimizados de Vulkan no Scanner, grafo técnico, comparação de snapshots, pré-voo, detector de regressão condicionado a medições importadas, Stray AI explicável, backup local com prévia, logs e alertas locais. A inspeção confirmou os cinco artefatos, os metadados Debian/RPM/Pacman e os hashes antes da publicação. As rotas públicas de instalação e desinstalação continuam cobertas por regressão de manifesto.
