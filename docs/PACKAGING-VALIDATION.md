# Validação dos artefatos desktop

Esta validação registra a matriz de empacotamento que contém as áreas **Windows**, **Controller Center**, **Mods**, **Cloud Sync**, **biblioteca Steam/Heroic/externa** e **documentação da API pública** do Stray Linux. A inspeção foi executada após o build web, a geração do instalador Windows e a reconstrução dos quatro formatos Linux.

> **Escopo do pacote:** cada instalador leva o runtime Electron e o bundle web dentro de `resources/app.asar`. A rota `/windows` foi confirmada pela busca binária do literal `"/windows"` nesse arquivo. Os manuais Markdown e o arquivo de checksums não pertencem ao runtime do aplicativo; eles acompanham a entrega externa, em `docs/` no repositório e no pacote de release publicado.

| Formato | Local inspecionado | Evidência de rota | SHA-256 |
|---|---|---|---|
| Windows NSIS | `dist/win-unpacked/resources/app.asar` | Ponte `stray:library:pick-external`, política de navegação externa, landing por arte original e dependências transitivas corrigidas incluídas | `7bc75da30d15b556ff636e5f4db4595ec718668a02c9525b316ffd3b159d3ddd` |
| Linux unpacked | `dist/linux-unpacked/resources/app.asar` | Ponte `stray:library:pick-external`, rotas operacionais e UI renovada encontrados | Runtime de referência dos formatos Linux |
| AppImage | `Stray-Linux-1.0.0-x86_64.AppImage` | Reconstruído a partir do mesmo runtime Linux | `aa632ab2e926adc7185ae00ab43d24be8b1ee235388d0ff8307d842ad9eb7957` |
| Debian/Ubuntu `.deb` | `Stray-Linux-1.0.0-amd64.deb` | Reconstruído a partir do mesmo runtime Linux | `289bebb48d9d4c070d053a8273c0cba41c336a9d1a778fd1efc564f16d3d14e3` |
| RPM | `Stray-Linux-1.0.0-x86_64.rpm` | Reconstruído a partir do mesmo runtime Linux | `f4ba15159e79619cb619b49f33cad89ebbd15a6c98a6455b3ea765c64a31e73c` |
| Pacman | `Stray-Linux-1.0.0-x64.pacman` | Reconstruído a partir do mesmo runtime Linux | `584a7da5fd306a17e5758e102f5b116687a977b2de8572c071f51b48295761dd` |

## Método reproduzível

Para validar as integrações, execute `grep -a -q 'stray:library:pick-external' <caminho-do-app.asar>` para a seleção consentida de pasta externa. Para um pacote `.deb`, extraia com `dpkg-deb -x`; para `.rpm` e `.pacman`, use `bsdtar -xf`; para AppImage, execute `./arquivo.AppImage --appimage-extract` e inspecione `squashfs-root`.

Os hashes da tabela também estão em [`INSTALLERS.md`](INSTALLERS.md) e no arquivo externo `Stray-Linux-1.0.0-SHA256SUMS.txt`. As fontes técnicas dos comandos da área Windows estão em [`sources-windows.md`](sources-windows.md).
