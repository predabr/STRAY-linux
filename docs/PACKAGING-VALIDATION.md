# Validação dos artefatos desktop

Esta validação registra a matriz de empacotamento que contém as áreas **Windows**, **Controller Center**, **Mods**, **Cloud Sync** e **documentação da API pública** do Stray Linux. A inspeção foi executada após o build web, a geração do instalador Windows e a reconstrução dos quatro formatos Linux.

> **Escopo do pacote:** cada instalador leva o runtime Electron e o bundle web dentro de `resources/app.asar`. A rota `/windows` foi confirmada pela busca binária do literal `"/windows"` nesse arquivo. Os manuais Markdown e o arquivo de checksums não pertencem ao runtime do aplicativo; eles acompanham a entrega externa, em `docs/` no repositório e no pacote de release publicado.

| Formato | Local inspecionado | Evidência de rota | SHA-256 |
|---|---|---|---|
| Windows NSIS | `dist/win-unpacked/resources/app.asar` | Detector `scanHeroicLibrary` incluído e nenhuma referência ao provedor legado encontrada | `4ab778b34668c84a1f42c80bded32a550e47eec01c19a91af1d42d4d776d98a1` |
| Linux unpacked | `dist/linux-unpacked/resources/app.asar` | Literais `"/controllers"`, `"/mods"`, `"/sync"` e `"/api/docs"` encontrados | Runtime de referência dos formatos Linux |
| AppImage | `Stray-Linux-1.0.0-x86_64.AppImage` | Reconstruído a partir do mesmo runtime Linux | `08912c946ae37e028cd8eb8621562b2f4ab7a03956f458b3b6cb602d64f54dd0` |
| Debian/Ubuntu `.deb` | `Stray-Linux-1.0.0-amd64.deb` | Reconstruído a partir do mesmo runtime Linux | `8959b483e6c4d9a9afa1db83c9a9b1953c706a5103ba3ae8241dc92e75e3ddca` |
| RPM | `Stray-Linux-1.0.0-x86_64.rpm` | Reconstruído a partir do mesmo runtime Linux | `100a3d0957fd8d840b69438d4ceeea9ff18c1bdf682ca86f70075f94b038b503` |
| Pacman | `Stray-Linux-1.0.0-x64.pacman` | Reconstruído a partir do mesmo runtime Linux | `91c0db2ba0fc3c264da0a0737d2e56cb2da7ae2bce27b3f13944456a132c214e` |

## Método reproduzível

Para validar as integrações, execute `grep -a -q '"/controllers"'`, `grep -a -q '"/mods"'`, `grep -a -q '"/sync"'` e `grep -a -q '"/api/docs"' <caminho-do-app.asar>`. Para um pacote `.deb`, extraia com `dpkg-deb -x`; para `.rpm` e `.pacman`, use `bsdtar -xf`; para AppImage, execute `./arquivo.AppImage --appimage-extract` e inspecione `squashfs-root`.

Os hashes da tabela também estão em [`INSTALLERS.md`](INSTALLERS.md) e no arquivo externo `Stray-Linux-1.0.0-SHA256SUMS.txt`. As fontes técnicas dos comandos da área Windows estão em [`sources-windows.md`](sources-windows.md).
