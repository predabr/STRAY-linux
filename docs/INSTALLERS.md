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
dce56390abf1cdb42bca2ba17c5841f1741c615551ee77fe213054b3aa41f106  Stray-Linux-1.0.0-Setup.exe
2f46c6a7508bbb4d38149e09cb84eae58d3769d3dece54f4c3f4ef4088623486  Stray-Linux-1.0.0-x86_64.AppImage
c20cdd7e96a00eb82a55cc8d2103fb69d2f9aa3a0235442caf09b97ff61e16f3  Stray-Linux-1.0.0-amd64.deb
bd4deed1189e2765e74d3bc090f17e9e097ed70181a513c9d944b1d20217feaa  Stray-Linux-1.0.0-x86_64.rpm
fae609b4c94aa840ba0f632f8a9c6f247dcf76891fd9fea5e1c94b870dafbe24  Stray-Linux-1.0.0-x64.pacman
```

Em Linux, execute `sha256sum <arquivo>` e compare a saída. Em Windows, use `Get-FileHash .\Stray-Linux-1.0.0-Setup.exe -Algorithm SHA256` no PowerShell.

## Referências

[1] [Documentação do Electron Builder — Linux](https://www.electron.build/linux/)

[2] [Documentação APT — apt(8)](https://manpages.debian.org/apt/apt.8.en.html)

[3] [Documentação do Pacman — pacman(8)](https://man.archlinux.org/man/pacman.8)
