# Fontes de empacotamento e instalação do Stray Linux

O Stray Linux separa a compatibilidade de instalação por família de pacote. Um formato não é tratado como universal quando a distribuição usa um fluxo transacional, imutável, histórico ou de arquitetura incompatível.

| Família ou formato | Referência | Aplicação no projeto |
| --- | --- | --- |
| Arch e derivadas | https://wiki.archlinux.org/title/Pacman | Pacote `pacman` e instalação local com `pacman -U`. Atualizações completas usam `pacman -Syu`; o projeto não sugere atualização parcial. |
| Debian, Ubuntu e derivadas | https://www.debian.org/doc/manuals/debian-reference/ch02.en.html | Pacote `.deb` instalado por `apt`, preservando resolução de dependências. |
| Fedora e RHEL | https://docs.fedoraproject.org/en-US/quick-docs/dnf/ | Pacote `.rpm` instalado por `dnf`; variantes Atomic são direcionadas a Flatpak/AppImage. |
| openSUSE e SLE | https://en.opensuse.org/Package_management | Pacote `.rpm` instalado por `zypper`; a documentação alerta contra misturar pacotes de releases diferentes. |
| Distribuição universal | https://www.electron.build/docs/appimage/ | AppImage portátil, sem privilégio de root, com instrução explícita de `chmod +x`. |
| Matriz Electron | https://www.electron.build/docs/linux/ | Alvos `deb`, `rpm`, `pacman`, `AppImage`, `apk` e outros são escolhidos apenas quando o formato se aplica à família. |
