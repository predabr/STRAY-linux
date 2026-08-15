# Validação dos artefatos desktop

Esta validação registra a matriz de empacotamento que contém as áreas **Windows**, **Controller Center**, **Mods**, **Cloud Sync**, **biblioteca Steam/Heroic/externa** e **documentação da API pública** do Stray Linux. A inspeção foi executada após o build web, a geração do instalador Windows e a reconstrução dos quatro formatos Linux.

> **Escopo do pacote:** cada instalador leva o runtime Electron e o bundle web dentro de `resources/app.asar`. A rota `/windows` foi confirmada pela busca binária do literal `"/windows"` nesse arquivo. Os manuais Markdown e o arquivo de checksums não pertencem ao runtime do aplicativo; eles acompanham a entrega externa, em `docs/` no repositório e no pacote de release publicado.

| Formato | Local inspecionado | Evidência de rota | SHA-256 |
|---|---|---|---|
| Windows NSIS | `dist/win-unpacked/resources/app.asar` | Ponte `stray:library:pick-external`, política de navegação externa, shell desktop refinado, Biblioteca com filtros locais e dependências transitivas corrigidas incluídas | `1b2646bc3472e417d4d586e44998e50f3979ffc3e95c6c182c6f702577ae7244` |
| Linux unpacked | `dist/linux-unpacked/resources/app.asar` | Ponte `stray:library:pick-external`, rotas operacionais e UI renovada encontrados | Runtime de referência dos formatos Linux |
| AppImage | `Stray-Linux-1.0.0-x86_64.AppImage` | Reconstruído a partir do mesmo runtime Linux | `408209b161b1c811835921d2c85e90c3d8c141ed8ce30037e438ec206fc1ea82` |
| Debian/Ubuntu `.deb` | `Stray-Linux-1.0.0-amd64.deb` | Reconstruído a partir do mesmo runtime Linux | `85b469c0a351d26fba00f503a0d83a45d190c3b823cf74f200da8469f9ba70dc` |
| RPM | `Stray-Linux-1.0.0-x86_64.rpm` | Reconstruído a partir do mesmo runtime Linux | `844fda73baa330b5e1909cb0e2e6bfa01ae26d364a8d63013a73e3cfea86ec68` |
| Pacman | `Stray-Linux-1.0.0-x64.pacman` | Reconstruído a partir do mesmo runtime Linux | `72fc51fa6249c78b96df9524147a8a5a03b7164ed0671f60c30bb029a90b9a6f` |

## Método reproduzível

Para validar as integrações, execute `grep -a -q 'stray:library:pick-external' <caminho-do-app.asar>` para a seleção consentida de pasta externa. Para um pacote `.deb`, extraia com `dpkg-deb -x`; para `.rpm` e `.pacman`, use `bsdtar -xf`; para AppImage, execute `./arquivo.AppImage --appimage-extract` e inspecione `squashfs-root`.

Os hashes da tabela também estão em [`INSTALLERS.md`](INSTALLERS.md) e no arquivo externo `Stray-Linux-1.0.0-SHA256SUMS.txt`. As fontes técnicas dos comandos da área Windows estão em [`sources-windows.md`](sources-windows.md).

## Lote de evolução do aplicativo

O lote atual foi reconstruído depois do refinamento do shell desktop, dos filtros locais da Biblioteca e da correção do diretório Steam em `steamapps/common`. A inspeção confirmou que os cinco artefatos existem, o `.deb` declara `stray-linux` versão `1.0.0` com mantenedor público resumido, e os cinco objetos publicados responderam a uma requisição de faixa mínima. As rotas públicas de instalação e desinstalação continuam cobertas por regressão de manifesto.
