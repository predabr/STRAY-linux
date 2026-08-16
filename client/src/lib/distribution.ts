export const distributionOrigin = "https://linuxtoys-ckuyvpj5.manus.space";

export const distributionAssets = {
  exe: "/manus-storage/Stray-Linux-1.1.1-Setup_eb412ad7.exe",
  deb: "/manus-storage/Stray-Linux-1.1.1-amd64_f33eda20.deb",
  rpm: "/manus-storage/Stray-Linux-1.1.1-x86_64_ea8994da.rpm",
  pacman: "/manus-storage/Stray-Linux-1.1.1-x64_9d9f82e1.pacman",
  appImage: "/manus-storage/Stray-Linux-1.1.1-x86_64_aa851244.AppImage",
} as const;

export const appImageInstallPath = "$HOME/.local/bin/stray-linux";

export const linuxInstallers = [
  { id: "debian", name: "Debian / Ubuntu", signal: "apt", description: "Debian, Ubuntu, Linux Mint e derivadas.", command: `bash -c '\nset -e\ncurl -fL ${distributionOrigin}${distributionAssets.deb} -o /tmp/stray-linux.deb\necho "080422e2068479c4998c4557ed13ebcfdf4fdf254c268b58390f5717975a399b  /tmp/stray-linux.deb" | sha256sum -c -\nsudo dpkg -i /tmp/stray-linux.deb || sudo apt-get -f install -y\nrm -f /tmp/stray-linux.deb\n'` },
  { id: "fedora", name: "Fedora / RHEL", signal: "dnf", description: "Fedora, RHEL e distribuições compatíveis.", command: `bash -c '\nset -e\ncurl -fL ${distributionOrigin}${distributionAssets.rpm} -o /tmp/stray-linux.rpm\necho "192108aa77b74f5c912e4969e5c37601999ddd13a474189ab330758b4be9e2e3  /tmp/stray-linux.rpm" | sha256sum -c -\nsudo dnf install /tmp/stray-linux.rpm\nrm -f /tmp/stray-linux.rpm\n'` },
  { id: "opensuse", name: "openSUSE", signal: "zypper", description: "Tumbleweed, Leap e variantes com Zypper.", command: `bash -c '\nset -e\ncurl -fL ${distributionOrigin}${distributionAssets.rpm} -o /tmp/stray-linux.rpm\necho "192108aa77b74f5c912e4969e5c37601999ddd13a474189ab330758b4be9e2e3  /tmp/stray-linux.rpm" | sha256sum -c -\nsudo zypper install /tmp/stray-linux.rpm\nrm -f /tmp/stray-linux.rpm\n'` },
  { id: "arch", name: "Arch / derivadas", signal: "pacman", description: "Arch, CachyOS, EndeavourOS e derivados.", command: `bash -c '\nset -e\ncurl -fL ${distributionOrigin}${distributionAssets.pacman} -o /tmp/stray-linux.pacman\necho "fd247a12349cc384fef214ddefe898f5a36411210199c6827a0d149f396ca22b  /tmp/stray-linux.pacman" | sha256sum -c -\nsudo pacman -U /tmp/stray-linux.pacman\nrm -f /tmp/stray-linux.pacman\n'` },
  { id: "appimage", name: "Qualquer distribuição", signal: "AppImage", description: "Alternativa portátil para Linux x64.", command: `bash -c '\nset -e\nmkdir -p "$HOME/.local/bin"\ncurl -fL ${distributionOrigin}${distributionAssets.appImage} -o "${appImageInstallPath}"\necho "15321cb8c3462879612d583170199bc3ff4b5e6f85c1d50786112528a198503c  ${appImageInstallPath}" | sha256sum -c -\nchmod +x "${appImageInstallPath}"\n"${appImageInstallPath}"\n'` },
] as const;
