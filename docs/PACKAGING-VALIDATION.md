# Validação dos artefatos desktop

Esta validação registra a matriz de empacotamento que contém as áreas **Windows**, **Controller Center**, **Mods**, **Cloud Sync** e **documentação da API pública** do Stray Linux. A inspeção foi executada após o build web, a geração do instalador Windows e a reconstrução dos quatro formatos Linux.

> **Escopo do pacote:** cada instalador leva o runtime Electron e o bundle web dentro de `resources/app.asar`. A rota `/windows` foi confirmada pela busca binária do literal `"/windows"` nesse arquivo. Os manuais Markdown e o arquivo de checksums não pertencem ao runtime do aplicativo; eles acompanham a entrega externa, em `docs/` no repositório e no pacote de release publicado.

| Formato | Local inspecionado | Evidência de rota | SHA-256 |
|---|---|---|---|
| Windows NSIS | `dist/win-unpacked/resources/app.asar` | Literais `"/controllers"`, `"/mods"`, `"/sync"` e `"/api/docs"` encontrados | `ce3af547f8183b54067c9301b18913a573753a21a3e39b2db6d46b8670b012c8` |
| Linux unpacked | `dist/linux-unpacked/resources/app.asar` | Literais `"/controllers"`, `"/mods"`, `"/sync"` e `"/api/docs"` encontrados | Runtime de referência dos formatos Linux |
| AppImage | `Stray-Linux-1.0.0-x86_64.AppImage` | Reconstruído a partir do mesmo runtime Linux | `45e92560047d12ec3f593ce65124959335481139ccb49e7d547bdd761c43c3ad` |
| Debian/Ubuntu `.deb` | `Stray-Linux-1.0.0-amd64.deb` | Reconstruído a partir do mesmo runtime Linux | `aaa90ba02c17f6861826eee9e6f8ff58ac11b839b6ecb08febdb7a58da4235c3` |
| RPM | `Stray-Linux-1.0.0-x86_64.rpm` | Reconstruído a partir do mesmo runtime Linux | `447d32f534da9ba5fad0b07fe39018ffc3f54e9f0c49a5a108355b0347a8477f` |
| Pacman | `Stray-Linux-1.0.0-x64.pacman` | Reconstruído a partir do mesmo runtime Linux | `804662bcefc4057f6342a596b08648206364f80b390436d7b195adc0200fe8d3` |

## Método reproduzível

Para validar as integrações, execute `grep -a -q '"/controllers"'`, `grep -a -q '"/mods"'`, `grep -a -q '"/sync"'` e `grep -a -q '"/api/docs"' <caminho-do-app.asar>`. Para um pacote `.deb`, extraia com `dpkg-deb -x`; para `.rpm` e `.pacman`, use `bsdtar -xf`; para AppImage, execute `./arquivo.AppImage --appimage-extract` e inspecione `squashfs-root`.

Os hashes da tabela também estão em [`INSTALLERS.md`](INSTALLERS.md) e no arquivo externo `Stray-Linux-1.0.0-SHA256SUMS.txt`. As fontes técnicas dos comandos da área Windows estão em [`sources-windows.md`](sources-windows.md).
