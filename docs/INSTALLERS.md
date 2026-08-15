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

## Checksums SHA-256

```text
492a9d612a5695bb1a0cb741e0f9069ad365a2fd7f8707e32c69084a53186ed6  Stray-Linux-1.0.0-Setup.exe
8e411761c740afbc53c1a0e36b88afb58321e31639e72d9b4a67c36ea691b1ff  Stray-Linux-1.0.0-x86_64.AppImage
cc39641f05a96ff314c893624fc5b0c33ca4bd967933e65498b5d575f0bf2ce7  Stray-Linux-1.0.0-amd64.deb
89ed08d1ef97a808a20756720d65835e9867322d20d60609a1c27c23dd88da7f  Stray-Linux-1.0.0-x86_64.rpm
380968c1f5a5dae3a3e82adf650a1d891bc758c7946c062290575ee366f2e24f  Stray-Linux-1.0.0-x64.pacman
```

Em Linux, execute `sha256sum <arquivo>` e compare a saída. Em Windows, use `Get-FileHash .\Stray-Linux-1.0.0-Setup.exe -Algorithm SHA256` no PowerShell.

## Referências

[1] [Documentação do Electron Builder — Linux](https://www.electron.build/linux/)

[2] [Documentação APT — apt(8)](https://manpages.debian.org/apt/apt.8.en.html)

[3] [Documentação do Pacman — pacman(8)](https://man.archlinux.org/man/pacman.8)
