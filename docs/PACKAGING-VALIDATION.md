# Validação dos artefatos desktop

Esta validação registra a matriz de empacotamento que contém as áreas **Windows**, **Controller Center**, **Mods**, **Cloud Sync**, **biblioteca Steam/Heroic/externa** e **documentação da API pública** do Stray Linux. A inspeção foi executada após o build web, a geração do instalador Windows e a reconstrução dos quatro formatos Linux.

> **Escopo do pacote:** cada instalador leva o runtime Electron e o bundle web dentro de `resources/app.asar`. A rota `/windows` foi confirmada pela busca binária do literal `"/windows"` nesse arquivo. Os manuais Markdown e o arquivo de checksums não pertencem ao runtime do aplicativo; eles acompanham a entrega externa, em `docs/` no repositório e no pacote de release publicado.

| Formato | Local inspecionado | Evidência de rota | SHA-256 |
|---|---|---|---|
| Windows NSIS | `dist/win-unpacked/resources/app.asar` | Ponte `stray:library:pick-external`, política de navegação externa, Stray AI com modo visitante e fallback baseado em evidência, Biblioteca com leitura local e conteúdo oficial sincronizado incluídos | `dce56390abf1cdb42bca2ba17c5841f1741c615551ee77fe213054b3aa41f106` |
| Linux unpacked | `dist/linux-unpacked/resources/app.asar` | Ponte `stray:library:pick-external`, rotas operacionais e UI renovada encontrados | Runtime de referência dos formatos Linux |
| AppImage | `Stray-Linux-1.0.0-x86_64.AppImage` | Reconstruído a partir do mesmo runtime Linux | `2f46c6a7508bbb4d38149e09cb84eae58d3769d3dece54f4c3f4ef4088623486` |
| Debian/Ubuntu `.deb` | `Stray-Linux-1.0.0-amd64.deb` | Reconstruído a partir do mesmo runtime Linux | `c20cdd7e96a00eb82a55cc8d2103fb69d2f9aa3a0235442caf09b97ff61e16f3` |
| RPM | `Stray-Linux-1.0.0-x86_64.rpm` | Reconstruído a partir do mesmo runtime Linux | `bd4deed1189e2765e74d3bc090f17e9e097ed70181a513c9d944b1d20217feaa` |
| Pacman | `Stray-Linux-1.0.0-x64.pacman` | Reconstruído a partir do mesmo runtime Linux | `fae609b4c94aa840ba0f632f8a9c6f247dcf76891fd9fea5e1c94b870dafbe24` |

## Método reproduzível

Para validar as integrações, execute `grep -a -q 'stray:library:pick-external' <caminho-do-app.asar>` para a seleção consentida de pasta externa. Para um pacote `.deb`, extraia com `dpkg-deb -x`; para `.rpm` e `.pacman`, use `bsdtar -xf`; para AppImage, execute `./arquivo.AppImage --appimage-extract` e inspecione `squashfs-root`.

Os hashes da tabela também estão em [`INSTALLERS.md`](INSTALLERS.md) e no arquivo externo `Stray-Linux-1.0.0-SHA256SUMS.txt`. As fontes técnicas dos comandos da área Windows estão em [`sources-windows.md`](sources-windows.md).

## Lote de evolução do aplicativo

O lote atual foi reconstruído depois da correção do modo visitante do Stray AI, do fallback baseado em evidência, da sincronização de conteúdo oficial no SQLite local e da correção do caminho de remoção do AppImage. A inspeção confirmou que os cinco artefatos existem; a validação de metadados e downloads públicos é executada antes da publicação. As rotas públicas de instalação e desinstalação continuam cobertas por regressão de manifesto.
