# Instalação desktop do Stray Linux 1.0.0

Esta versão inclui pacotes **x86_64/amd64** para Windows e quatro rotas Linux, todos reconstruídos com o catálogo publicado de **10.013 jogos**. Antes de instalar, compare o checksum SHA-256 do arquivo baixado com o valor nesta página. Não instale um artefato que não corresponda à sua arquitetura ou cuja integridade não possa ser confirmada.

Os arquivos de instrução, fontes e checksums são distribuídos **externamente ao runtime desktop**: acompanham o repositório e a entrega de release, enquanto os instaladores carregam somente os arquivos necessários para executar o aplicativo. Veja a inspeção de cada formato em [`PACKAGING-VALIDATION.md`](PACKAGING-VALIDATION.md).

| Plataforma ou família | Artefato | Instalação recomendada |
|---|---|---|
| Windows 10/11 x64 | `Stray-Linux-1.0.0-Setup.exe` | Execute o instalador NSIS e siga o assistente. O arquivo não possui assinatura de código nesta versão, portanto confira o SHA-256 antes da execução. |
| Debian, Ubuntu e derivadas x64 | `Stray-Linux-1.0.0-amd64.deb` | Baixe o `.deb` primeiro, valide o SHA-256 e use `sudo dpkg -i /tmp/stray-linux.deb \|\| sudo apt-get -f install -y`. Não execute apenas o nome do arquivo se ele não estiver na pasta atual. |
| Fedora, RHEL, openSUSE e derivadas x64 | `Stray-Linux-1.0.0-x86_64.rpm` | Fedora/RHEL: `sudo dnf install ./Stray-Linux-1.0.0-x86_64.rpm`; openSUSE: `sudo zypper install ./Stray-Linux-1.0.0-x86_64.rpm` |
| Arch e derivadas x64 | `Stray-Linux-1.0.0-x64.pacman` | `sudo pacman -U ./Stray-Linux-1.0.0-x64.pacman` |
| Outras distribuições x64 | `Stray-Linux-1.0.0-x86_64.AppImage` | `chmod +x ./Stray-Linux-1.0.0-x86_64.AppImage && ./Stray-Linux-1.0.0-x86_64.AppImage` |

> O pacote `.pacman` é um arquivo local para instalação direta pelo `pacman -U`; não é um pacote do repositório oficial do Arch. Em sistemas imutáveis, use preferencialmente o AppImage até que seja disponibilizado um método específico e verificado para a variante em uso.

## Confirme a distribuição e o shell antes de instalar

Antes de escolher um formato, execute `cat /etc/os-release`. Se a saída indicar **Arch Linux**, CachyOS, EndeavourOS ou Garuda, use exclusivamente o pacote `.pacman` com `pacman -U`; os comandos `dpkg` e `apt-get` pertencem a Debian/Ubuntu e não existem em Arch. Se houver dúvida, não instale o arquivo baixado: volte à página `/download` e escolha a família correta.

Os blocos publicados pela página de download começam com `bash -c`, portanto podem ser colados em **fish**, zsh ou Bash. Isso faz `set -e` ser interpretado pelo Bash; não muda o pacote que deve ser escolhido para cada distribuição.

## Checksums SHA-256

```text
205318a8f752de745f8a86dc79ed45bc88883acc86b94096878fa0930f606161  Stray-Linux-1.0.0-Setup.exe
5b6942a33499f8a499e91e3b12d52f50f5a73e4b2968696342d513a49816f2e6  Stray-Linux-1.0.0-x86_64.AppImage
3941fe65e2614025a8decb0d024f991a8fe75f895462d78f9db49ee1cb8f1ae7  Stray-Linux-1.0.0-amd64.deb
cde87a9e0e20d524320a1e76fcaeafdd60cc116943697eb0d9b471394b1ca6ef  Stray-Linux-1.0.0-x86_64.rpm
bb669a2890bbaa0481a278578705a0af3214609e374bc886928da791b0c2b279  Stray-Linux-1.0.0-x64.pacman
```

Em Linux, execute `sha256sum <arquivo>` e compare a saída. Em Windows, use `Get-FileHash .\Stray-Linux-1.0.0-Setup.exe -Algorithm SHA256` no PowerShell.

## Referências

[1] [Documentação do Electron Builder — Linux](https://www.electron.build/linux/)

[2] [Documentação APT — apt(8)](https://manpages.debian.org/apt/apt.8.en.html)

[3] [Documentação do Pacman — pacman(8)](https://man.archlinux.org/man/pacman.8)
