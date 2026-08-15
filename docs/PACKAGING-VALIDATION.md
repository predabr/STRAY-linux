# Validação dos artefatos desktop

Esta validação registra a matriz de empacotamento que contém as áreas **Windows**, **Controller Center**, **Mods**, **Cloud Sync**, **biblioteca Steam/Heroic/externa** e **documentação da API pública** do Stray Linux. A inspeção foi executada após o build web, a geração do instalador Windows e a reconstrução dos quatro formatos Linux.

> **Escopo do pacote:** cada instalador leva o runtime Electron e o bundle web dentro de `resources/app.asar`. A rota `/windows` foi confirmada pela busca binária do literal `"/windows"` nesse arquivo. Os manuais Markdown e o arquivo de checksums não pertencem ao runtime do aplicativo; eles acompanham a entrega externa, em `docs/` no repositório e no pacote de release publicado.

| Formato | Local inspecionado | Evidência de rota | SHA-256 |
|---|---|---|---|
| Windows NSIS | `dist/win-unpacked/resources/app.asar` | Ponte `stray:library:pick-external`, política de navegação externa, narrativa de produto, Stray AI/Comparador refinados, Biblioteca com leitura local e dependências transitivas corrigidas incluídas | `492a9d612a5695bb1a0cb741e0f9069ad365a2fd7f8707e32c69084a53186ed6` |
| Linux unpacked | `dist/linux-unpacked/resources/app.asar` | Ponte `stray:library:pick-external`, rotas operacionais e UI renovada encontrados | Runtime de referência dos formatos Linux |
| AppImage | `Stray-Linux-1.0.0-x86_64.AppImage` | Reconstruído a partir do mesmo runtime Linux | `8e411761c740afbc53c1a0e36b88afb58321e31639e72d9b4a67c36ea691b1ff` |
| Debian/Ubuntu `.deb` | `Stray-Linux-1.0.0-amd64.deb` | Reconstruído a partir do mesmo runtime Linux | `cc39641f05a96ff314c893624fc5b0c33ca4bd967933e65498b5d575f0bf2ce7` |
| RPM | `Stray-Linux-1.0.0-x86_64.rpm` | Reconstruído a partir do mesmo runtime Linux | `89ed08d1ef97a808a20756720d65835e9867322d20d60609a1c27c23dd88da7f` |
| Pacman | `Stray-Linux-1.0.0-x64.pacman` | Reconstruído a partir do mesmo runtime Linux | `380968c1f5a5dae3a3e82adf650a1d891bc758c7946c062290575ee366f2e24f` |

## Método reproduzível

Para validar as integrações, execute `grep -a -q 'stray:library:pick-external' <caminho-do-app.asar>` para a seleção consentida de pasta externa. Para um pacote `.deb`, extraia com `dpkg-deb -x`; para `.rpm` e `.pacman`, use `bsdtar -xf`; para AppImage, execute `./arquivo.AppImage --appimage-extract` e inspecione `squashfs-root`.

Os hashes da tabela também estão em [`INSTALLERS.md`](INSTALLERS.md) e no arquivo externo `Stray-Linux-1.0.0-SHA256SUMS.txt`. As fontes técnicas dos comandos da área Windows estão em [`sources-windows.md`](sources-windows.md).

## Lote de evolução do aplicativo

O lote atual foi reconstruído depois da nova narrativa de produto, do refinamento do Stray AI e Comparador, da leitura local aprimorada da Biblioteca e da correção do diretório Steam em `steamapps/common`. A inspeção confirmou que os cinco artefatos existem, o `.deb` declara `stray-linux` versão `1.0.0` com mantenedor público resumido, e os cinco objetos publicados responderam a uma requisição de faixa mínima. As rotas públicas de instalação e desinstalação continuam cobertas por regressão de manifesto.
