# Validação dos artefatos desktop

Esta validação registra a matriz de empacotamento que contém as áreas **Windows**, **Controller Center**, **Mods**, **Cloud Sync**, **biblioteca Steam/Heroic/externa** e **documentação da API pública** do Stray Linux. A inspeção foi executada após o build web, a geração do instalador Windows e a reconstrução dos quatro formatos Linux.

> **Escopo do pacote:** cada instalador leva o runtime Electron e o bundle web dentro de `resources/app.asar`. A rota `/windows` foi confirmada pela busca binária do literal `"/windows"` nesse arquivo. Os manuais Markdown e o arquivo de checksums não pertencem ao runtime do aplicativo; eles acompanham a entrega externa, em `docs/` no repositório e no pacote de release publicado.

| Formato | Local inspecionado | Evidência de rota | SHA-256 |
|---|---|---|---|
| Windows NSIS | `dist/win-unpacked/resources/app.asar` | Ponte `stray:library:pick-external`, política de navegação externa, Stray AI com modo visitante, seleção obrigatória de sistema nos downloads e comandos portáveis para fish incluídos | `4f4cbae9a4a934f440d8c3f14860acccd3c93b8257ba08f875d4206581da9786` |
| Linux unpacked | `dist/linux-unpacked/resources/app.asar` | Ponte `stray:library:pick-external`, rotas operacionais e UI renovada encontrados | Runtime de referência dos formatos Linux |
| AppImage | `Stray-Linux-1.0.0-x86_64.AppImage` | Reconstruído a partir do mesmo runtime Linux | `594083dacccb83804df2b2900935ea303d9ca011c1a6219da6d6cd51b69f8f29` |
| Debian/Ubuntu `.deb` | `Stray-Linux-1.0.0-amd64.deb` | Reconstruído a partir do mesmo runtime Linux | `e683dab519b731bd97f198e1d1784ddad4d5390b7a29e5e7f491c5aac42d5232` |
| RPM | `Stray-Linux-1.0.0-x86_64.rpm` | Reconstruído a partir do mesmo runtime Linux | `d4f8e02ab166d5f62f4f639d53891ff21a2107ade31df9146c4417185845ecb6` |
| Pacman | `Stray-Linux-1.0.0-x64.pacman` | Reconstruído a partir do mesmo runtime Linux | `5d5cc6d92ecd9ac2c1d30b51ab9e111cd04ed03d7eb3dafd25e9a97b4806a3ba` |

## Método reproduzível

Para validar as integrações, execute `grep -a -q 'stray:library:pick-external' <caminho-do-app.asar>` para a seleção consentida de pasta externa. Para um pacote `.deb`, extraia com `dpkg-deb -x`; para `.rpm` e `.pacman`, use `bsdtar -xf`; para AppImage, execute `./arquivo.AppImage --appimage-extract` e inspecione `squashfs-root`.

Os hashes da tabela também estão em [`INSTALLERS.md`](INSTALLERS.md) e no arquivo externo `Stray-Linux-1.0.0-SHA256SUMS.txt`. As fontes técnicas dos comandos da área Windows estão em [`sources-windows.md`](sources-windows.md).

## Lote de evolução do aplicativo

O lote atual foi reconstruído depois da correção do modo visitante do Stray AI, do fallback baseado em evidência, da sincronização de conteúdo oficial no SQLite local e da correção do caminho de remoção do AppImage. A inspeção confirmou que os cinco artefatos existem; a validação de metadados e downloads públicos é executada antes da publicação. As rotas públicas de instalação e desinstalação continuam cobertas por regressão de manifesto.
