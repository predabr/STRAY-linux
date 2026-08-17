export const distributionOrigin = "https://linuxtoys-ckuyvpj5.manus.space";

export const distributionAssets = {
  exe: "/downloads/stray-linux/windows-x64.exe",
  deb: "/downloads/stray-linux/debian-amd64.deb",
  rpm: "/downloads/stray-linux/rpm-x64.rpm",
  pacman: "/downloads/stray-linux/arch-x64.pacman",
  appImage: "/downloads/stray-linux/linux-x64.AppImage",
} as const;

export const appImageInstallPath = "$HOME/.local/bin/stray-linux";

export const linuxInstallers = [
  { id: "debian", name: "Debian / Ubuntu", signal: "apt", description: "Debian, Ubuntu, Linux Mint e derivadas.", command: `bash -c '\nset -e\ncurl -fL ${distributionOrigin}${distributionAssets.deb} -o /tmp/stray-linux.deb\necho "99b8feec23af5bc3ed4ee7937c65fc0ca186b26b53db8392dd707ef2e665f044  /tmp/stray-linux.deb" | sha256sum -c -\nsudo dpkg -i /tmp/stray-linux.deb || sudo apt-get -f install -y\nrm -f /tmp/stray-linux.deb\n'` },
  { id: "fedora", name: "Fedora / RHEL", signal: "dnf", description: "Fedora, RHEL e distribuições compatíveis.", command: `bash -c '\nset -e\ncurl -fL ${distributionOrigin}${distributionAssets.rpm} -o /tmp/stray-linux.rpm\necho "65f13d0b93ba2166fbdaf177ab04740c2f42df7b31f013aee45930974051197d  /tmp/stray-linux.rpm" | sha256sum -c -\nsudo dnf install /tmp/stray-linux.rpm\nrm -f /tmp/stray-linux.rpm\n'` },
  { id: "opensuse", name: "openSUSE", signal: "zypper", description: "Tumbleweed, Leap e variantes com Zypper.", command: `bash -c '\nset -e\ncurl -fL ${distributionOrigin}${distributionAssets.rpm} -o /tmp/stray-linux.rpm\necho "65f13d0b93ba2166fbdaf177ab04740c2f42df7b31f013aee45930974051197d  /tmp/stray-linux.rpm" | sha256sum -c -\nsudo zypper install /tmp/stray-linux.rpm\nrm -f /tmp/stray-linux.rpm\n'` },
  { id: "arch", name: "Arch / derivadas", signal: "pacman", description: "Arch, CachyOS, EndeavourOS e derivados.", command: `bash -c '\nset -e\ncurl -fL ${distributionOrigin}${distributionAssets.pacman} -o /tmp/stray-linux.pacman\necho "c8b3a6e3ffe3f920971b33f61870c5ba938b9ea88002ccddddfc425f314230d2  /tmp/stray-linux.pacman" | sha256sum -c -\nsudo pacman -U /tmp/stray-linux.pacman\nrm -f /tmp/stray-linux.pacman\n'` },
  { id: "appimage", name: "Qualquer distribuição", signal: "AppImage", description: "Alternativa portátil para Linux x64.", command: `bash -c '\nset -e\nmkdir -p "$HOME/.local/bin"\ncurl -fL ${distributionOrigin}${distributionAssets.appImage} -o "${appImageInstallPath}"\necho "086e0fb32d433a20b3eafa5a54a5bb4b285818c1b6924a8f93f617423ad9c75b  ${appImageInstallPath}" | sha256sum -c -\nchmod +x "${appImageInstallPath}"\n"${appImageInstallPath}"\n'` },
] as const;
