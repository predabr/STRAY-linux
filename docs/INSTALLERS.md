# Instalação desktop do Stray Linux 1.1.1

Esta versão inclui pacotes **x86_64/amd64** para Windows e quatro rotas Linux, todos reconstruídos com o catálogo publicado de **10.013 jogos**. Antes de instalar, compare o checksum SHA-256 do arquivo baixado com o valor nesta página. Não instale um artefato que não corresponda à sua arquitetura ou cuja integridade não possa ser confirmada.

Os arquivos de instrução, fontes e checksums são distribuídos **externamente ao runtime desktop**: acompanham o repositório e a entrega de release, enquanto os instaladores carregam somente os arquivos necessários para executar o aplicativo. Veja a inspeção de cada formato em [`PACKAGING-VALIDATION.md`](PACKAGING-VALIDATION.md).

| Plataforma ou família | Artefato | Instalação recomendada |
|---|---|---|
| Windows 10/11 x64 | `Stray-Linux-1.1.1-Setup.exe` | Execute o instalador NSIS e siga o assistente. O arquivo não possui assinatura de código nesta versão, portanto confira o SHA-256 antes da execução. |
| Debian, Ubuntu e derivadas x64 | `Stray-Linux-1.1.1-amd64.deb` | Baixe o `.deb` primeiro, valide o SHA-256 e use `sudo dpkg -i /tmp/stray-linux.deb \|\| sudo apt-get -f install -y`. Não execute apenas o nome do arquivo se ele não estiver na pasta atual. |
| Fedora, RHEL, openSUSE e derivadas x64 | `Stray-Linux-1.1.1-x86_64.rpm` | Fedora/RHEL: `sudo dnf install ./Stray-Linux-1.1.1-x86_64.rpm`; openSUSE: `sudo zypper install ./Stray-Linux-1.1.1-x86_64.rpm` |
| Arch e derivadas x64 | `Stray-Linux-1.1.1-x64.pacman` | `sudo pacman -U ./Stray-Linux-1.1.1-x64.pacman` |
| Outras distribuições x64 | `Stray-Linux-1.1.1-x86_64.AppImage` | `chmod +x ./Stray-Linux-1.1.1-x86_64.AppImage && ./Stray-Linux-1.1.1-x86_64.AppImage` |

> O pacote `.pacman` é um arquivo local para instalação direta pelo `pacman -U`; não é um pacote do repositório oficial do Arch. Em sistemas imutáveis, use preferencialmente o AppImage até que seja disponibilizado um método específico e verificado para a variante em uso.

## Confirme a distribuição e o shell antes de instalar

Antes de escolher um formato, execute `cat /etc/os-release`. Se a saída indicar **Arch Linux**, CachyOS, EndeavourOS ou Garuda, use exclusivamente o pacote `.pacman` com `pacman -U`; os comandos `dpkg` e `apt-get` pertencem a Debian/Ubuntu e não existem em Arch. Se houver dúvida, não instale o arquivo baixado: volte à página `/download` e escolha a família correta.

Os blocos publicados pela página de download começam com `bash -c`, portanto podem ser colados em **fish**, zsh ou Bash. Isso faz `set -e` ser interpretado pelo Bash; não muda o pacote que deve ser escolhido para cada distribuição.

## Checksums SHA-256

```text
e6a04c0b5b15e1fdea351e8dfe733ecd166946fc90dc03c4e39936b0b3fe2be3  Stray-Linux-1.1.1-Setup.exe
ffa82409f8346feadc46bbc58174827bb5901c0279c5d86d062cdd2b9f3b439e  Stray-Linux-1.1.1-x86_64.AppImage
f89420de1e3d896c39b831b75ee6f416e9487bb7cf4f3c9e385914e40bd5e6bd  Stray-Linux-1.1.1-amd64.deb
1ea5e294a256c733b5b0127b001cbb87783c8739c76598935e9d1c5081fa6a7d  Stray-Linux-1.1.1-x86_64.rpm
968a12bd19c1ab49f48fad8494f6a860f462901733af795524ce3b47c824ad0f  Stray-Linux-1.1.1-x64.pacman
```

Em Linux, execute `sha256sum <arquivo>` e compare a saída. Em Windows, use `Get-FileHash .\Stray-Linux-1.1.1-Setup.exe -Algorithm SHA256` no PowerShell.

## Atualizações controladas

O aplicativo empacotado consulta um feed HTTPS de releases. Quando encontra uma versão mais nova, baixa o artefato publicado, valida os metadados de integridade e pede confirmação antes de reiniciar. Em Debian, RPM e Pacman, a conclusão permanece sujeita à autorização do sistema e ao gerenciador de pacotes. A arquitetura e seus limites estão em [`AUTO-UPDATE-ARCHITECTURE.md`](AUTO-UPDATE-ARCHITECTURE.md).

## Referências

[1] [Documentação do Electron Builder — Linux](https://www.electron.build/linux/)

[2] [Documentação APT — apt(8)](https://manpages.debian.org/apt/apt.8.en.html)

[3] [Documentação do Pacman — pacman(8)](https://man.archlinux.org/man/pacman.8)
