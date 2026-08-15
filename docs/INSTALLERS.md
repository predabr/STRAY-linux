# Instalação desktop do Stray Linux 1.0.0

Esta versão inclui pacotes **x86_64/amd64** para Windows e quatro rotas Linux, todos reconstruídos com o snapshot local de **10.000 jogos**. Antes de instalar, compare o checksum SHA-256 do arquivo baixado com o valor nesta página. Não instale um artefato que não corresponda à sua arquitetura ou cuja integridade não possa ser confirmada.

Os arquivos de instrução, fontes e checksums são distribuídos **externamente ao runtime desktop**: acompanham o repositório e a entrega de release, enquanto os instaladores carregam somente os arquivos necessários para executar o aplicativo. Veja a inspeção de cada formato em [`PACKAGING-VALIDATION.md`](PACKAGING-VALIDATION.md).

| Plataforma ou família | Artefato | Instalação recomendada |
|---|---|---|
| Windows 10/11 x64 | `Stray-Linux-1.0.0-Setup.exe` | Execute o instalador NSIS e siga o assistente. O arquivo não possui assinatura de código nesta versão, portanto confira o SHA-256 antes da execução. |
| Debian, Ubuntu e derivadas x64 | `Stray-Linux-1.0.0-amd64.deb` | `sudo apt install ./Stray-Linux-1.0.0-amd64.deb` |
| Fedora, RHEL, openSUSE e derivadas x64 | `Stray-Linux-1.0.0-x86_64.rpm` | Fedora/RHEL: `sudo dnf install ./Stray-Linux-1.0.0-x86_64.rpm`; openSUSE: `sudo zypper install ./Stray-Linux-1.0.0-x86_64.rpm` |
| Arch e derivadas x64 | `Stray-Linux-1.0.0-x64.pacman` | `sudo pacman -U ./Stray-Linux-1.0.0-x64.pacman` |
| Outras distribuições x64 | `Stray-Linux-1.0.0-x86_64.AppImage` | `chmod +x ./Stray-Linux-1.0.0-x86_64.AppImage && ./Stray-Linux-1.0.0-x86_64.AppImage` |

> O pacote `.pacman` é um arquivo local para instalação direta pelo `pacman -U`; não é um pacote do repositório oficial do Arch. Em sistemas imutáveis, use preferencialmente o AppImage até que seja disponibilizado um método específico e verificado para a variante em uso.

## Checksums SHA-256

```text
b7105ebfec348673b68fe6956a597f5f11f84d14ee34e58127efd231d44d4fc3  Stray-Linux-1.0.0-Setup.exe
ee10fc5663244c759d75fcc0f7d6aa83b54e7dcb03765124b0902fa447f06a16  Stray-Linux-1.0.0-x86_64.AppImage
d1c3b0c55e2d230f160ee1264e6097bda5bc349b3bf13497a1d76d1584fd6af2  Stray-Linux-1.0.0-amd64.deb
25a3a3a7193364e3d677818dc6373d53a227fd327acea978189c9512ef44f790  Stray-Linux-1.0.0-x86_64.rpm
78cf968f2442232316c2b2fbbe5c2035e43b4648a6c3e1c9f4d9f694df403dda  Stray-Linux-1.0.0-x64.pacman
```

Em Linux, execute `sha256sum <arquivo>` e compare a saída. Em Windows, use `Get-FileHash .\Stray-Linux-1.0.0-Setup.exe -Algorithm SHA256` no PowerShell.

## Referências

[1] [Documentação do Electron Builder — Linux](https://www.electron.build/linux/)

[2] [Documentação APT — apt(8)](https://manpages.debian.org/apt/apt.8.en.html)

[3] [Documentação do Pacman — pacman(8)](https://man.archlinux.org/man/pacman.8)
