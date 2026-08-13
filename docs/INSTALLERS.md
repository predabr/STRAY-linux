# Instalação desktop do Stray Linux 1.0.0

Esta versão inclui pacotes **x86_64/amd64** para Windows e quatro rotas Linux. Antes de instalar, compare o checksum SHA-256 do arquivo baixado com o valor nesta página. Não instale um artefato que não corresponda à sua arquitetura ou cuja integridade não possa ser confirmada.

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
d7928284f7767713520aaafd22b05ec7332b94d51af96ef3fe06a2fb4052f4a3  Stray-Linux-1.0.0-Setup.exe
7dc4b5d413f3d5ad7410cf8ed6fa179f4f295624e98ef71edbd93cc1cb894e56  Stray-Linux-1.0.0-x86_64.AppImage
486edee028d7ca9ee5c22edfa25dec0bb9bd8926facbefa9285819df1365aa7c  Stray-Linux-1.0.0-amd64.deb
0ebeb80b334e3b4b2e82a039984c6d972c7b316bcc46f678f14660fe5e94576a  Stray-Linux-1.0.0-x86_64.rpm
54176d53041653bb24d00366b7a97250f396d0642a428c76dda9ba8655760e05  Stray-Linux-1.0.0-x64.pacman
```

Em Linux, execute `sha256sum <arquivo>` e compare a saída. Em Windows, use `Get-FileHash .\Stray-Linux-1.0.0-Setup.exe -Algorithm SHA256` no PowerShell.

## Referências

[1] [Documentação do Electron Builder — Linux](https://www.electron.build/linux/)

[2] [Documentação APT — apt(8)](https://manpages.debian.org/apt/apt.8.en.html)

[3] [Documentação do Pacman — pacman(8)](https://man.archlinux.org/man/pacman.8)
