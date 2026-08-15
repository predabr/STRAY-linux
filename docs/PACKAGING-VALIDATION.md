# Validação dos artefatos desktop

Esta validação registra a matriz de empacotamento que contém as áreas **Windows**, **Controller Center**, **Mods**, **Cloud Sync**, **biblioteca Steam/Heroic/externa** e **documentação da API pública** do Stray Linux. A inspeção foi executada após o build web, a geração do instalador Windows e a reconstrução dos quatro formatos Linux.

> **Escopo do pacote:** cada instalador leva o runtime Electron e o bundle web dentro de `resources/app.asar`. A rota `/windows` foi confirmada pela busca binária do literal `"/windows"` nesse arquivo. Os manuais Markdown e o arquivo de checksums não pertencem ao runtime do aplicativo; eles acompanham a entrega externa, em `docs/` no repositório e no pacote de release publicado.

| Formato | Local inspecionado | Evidência de rota | SHA-256 |
|---|---|---|---|
| Windows NSIS | `dist/win-unpacked/resources/app.asar` | Scanner 1.3, Diagnóstico, Snapshots SQLite, Stray AI local contextual, configurações e privacidade local incluídos | `205318a8f752de745f8a86dc79ed45bc88883acc86b94096878fa0930f606161` |
| Linux unpacked | `dist/linux-unpacked/resources/app.asar` | Ponte `stray:library:pick-external`, rotas operacionais e UI renovada encontrados | Runtime de referência dos formatos Linux |
| AppImage | `Stray-Linux-1.0.0-x86_64.AppImage` | Reconstruído a partir do mesmo runtime Linux | `5b6942a33499f8a499e91e3b12d52f50f5a73e4b2968696342d513a49816f2e6` |
| Debian/Ubuntu `.deb` | `Stray-Linux-1.0.0-amd64.deb` | Reconstruído a partir do mesmo runtime Linux | `3941fe65e2614025a8decb0d024f991a8fe75f895462d78f9db49ee1cb8f1ae7` |
| RPM | `Stray-Linux-1.0.0-x86_64.rpm` | Reconstruído a partir do mesmo runtime Linux | `cde87a9e0e20d524320a1e76fcaeafdd60cc116943697eb0d9b471394b1ca6ef` |
| Pacman | `Stray-Linux-1.0.0-x64.pacman` | Reconstruído a partir do mesmo runtime Linux | `bb669a2890bbaa0481a278578705a0af3214609e374bc886928da791b0c2b279` |

## Método reproduzível

Para validar as integrações, execute `grep -a -q 'stray:library:pick-external' <caminho-do-app.asar>` para a seleção consentida de pasta externa. Para um pacote `.deb`, extraia com `dpkg-deb -x`; para `.rpm` e `.pacman`, use `bsdtar -xf`; para AppImage, execute `./arquivo.AppImage --appimage-extract` e inspecione `squashfs-root`.

Os hashes da tabela também estão em [`INSTALLERS.md`](INSTALLERS.md) e no arquivo externo `Stray-Linux-1.0.0-SHA256SUMS.txt`. As fontes técnicas dos comandos da área Windows estão em [`sources-windows.md`](sources-windows.md).

## Lote de evolução do aplicativo

O lote atual foi reconstruído depois da correção do modo visitante do Stray AI, do fallback baseado em evidência, da sincronização de conteúdo oficial no SQLite local e da correção do caminho de remoção do AppImage. A inspeção confirmou que os cinco artefatos existem; a validação de metadados e downloads públicos é executada antes da publicação. As rotas públicas de instalação e desinstalação continuam cobertas por regressão de manifesto.
