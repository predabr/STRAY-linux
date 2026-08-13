# Validação dos artefatos desktop

Esta validação registra a matriz de empacotamento que contém a área **Windows** do Stray Linux. A inspeção foi executada após o build web, a geração do instalador Windows e a reconstrução dos quatro formatos Linux.

> **Escopo do pacote:** cada instalador leva o runtime Electron e o bundle web dentro de `resources/app.asar`. A rota `/windows` foi confirmada pela busca binária do literal `"/windows"` nesse arquivo. Os manuais Markdown e o arquivo de checksums não pertencem ao runtime do aplicativo; eles acompanham a entrega externa, em `docs/` no repositório e no pacote de release publicado.

| Formato | Local inspecionado | Evidência de rota | SHA-256 |
|---|---|---|---|
| Windows NSIS | `dist/win-unpacked/resources/app.asar` | Literal `"/windows"` encontrado | `19b9e59bb6ba65badd563f959e1bed0f21128b5798610224c4ac358c6a9d24c8` |
| Linux unpacked | `dist/linux-unpacked/resources/app.asar` | Literal `"/windows"` encontrado | Runtime de referência dos formatos Linux |
| AppImage | `squashfs-root/resources/app.asar` após `--appimage-extract` | Literal `"/windows"` encontrado | `ac1d308a4fd234f96743b68945211be408b79b6520dabf3bac8a83ac0b53c9ec` |
| Debian/Ubuntu `.deb` | `opt/Stray Linux/resources/app.asar` após `dpkg-deb -x` | Literal `"/windows"` encontrado | `e01d8ff844865df0b487a6bd1350c846f3e4a111a31aea5f1d70cf35054646b2` |
| RPM | `opt/Stray Linux/resources/app.asar` após extração com `bsdtar` | Literal `"/windows"` encontrado | `be19ff97491d980b5a6e13922e0d958c711b5d5ac78cbf36e8d11a8e43cdf580` |
| Pacman | `opt/Stray Linux/resources/app.asar` após extração com `bsdtar` | Literal `"/windows"` encontrado | `5b9f47963915b77669cfd527014e9063123b83dcefdf4a068f6aa54f1b8b6e03` |

## Método reproduzível

Para a rota, execute `grep -a -q '"/windows"' <caminho-do-app.asar>`. Para um pacote `.deb`, extraia com `dpkg-deb -x`; para `.rpm` e `.pacman`, use `bsdtar -xf`; para AppImage, execute `./arquivo.AppImage --appimage-extract` e inspecione `squashfs-root`.

Os hashes da tabela também estão em [`INSTALLERS.md`](INSTALLERS.md) e no arquivo externo `Stray-Linux-1.0.0-SHA256SUMS.txt`. As fontes técnicas dos comandos da área Windows estão em [`sources-windows.md`](sources-windows.md).
