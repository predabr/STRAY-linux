export const distributionOrigin = "https://linuxtoys-ckuyvpj5.manus.space";

export const distributionAssets = {
  exe: "/manus-storage/Stray-Linux-1.0.0-Setup_4f4cbae9_c8ec3c41.exe",
  deb: "/manus-storage/Stray-Linux-1.0.0-amd64_e683dab5_262f4cef.deb",
  rpm: "/manus-storage/Stray-Linux-1.0.0-x86_64_d4f8e02a_f3d37d87.rpm",
  pacman: "/manus-storage/Stray-Linux-1.0.0-x64_5d5cc6d9_7cb33ddf.pacman",
  appImage: "/manus-storage/Stray-Linux-1.0.0-x86_64_594083da_a6eadfe5.AppImage",
} as const;

export const appImageInstallPath = "$HOME/.local/bin/stray-linux";

export const linuxInstallers = [
  { id: "debian", name: "Debian / Ubuntu", signal: "apt", description: "Debian, Ubuntu, Linux Mint e derivadas.", command: `bash -c '\nset -e\ncurl -fL ${distributionOrigin}${distributionAssets.deb} -o /tmp/stray-linux.deb\necho "e683dab519b731bd97f198e1d1784ddad4d5390b7a29e5e7f491c5aac42d5232  /tmp/stray-linux.deb" | sha256sum -c -\nsudo dpkg -i /tmp/stray-linux.deb || sudo apt-get -f install -y\nrm -f /tmp/stray-linux.deb\n'` },
  { id: "fedora", name: "Fedora / RHEL", signal: "dnf", description: "Fedora, RHEL e distribuições compatíveis.", command: `bash -c '\nset -e\ncurl -fL ${distributionOrigin}${distributionAssets.rpm} -o /tmp/stray-linux.rpm\necho "d4f8e02ab166d5f62f4f639d53891ff21a2107ade31df9146c4417185845ecb6  /tmp/stray-linux.rpm" | sha256sum -c -\nsudo dnf install /tmp/stray-linux.rpm\nrm -f /tmp/stray-linux.rpm\n'` },
  { id: "opensuse", name: "openSUSE", signal: "zypper", description: "Tumbleweed, Leap e variantes com Zypper.", command: `bash -c '\nset -e\ncurl -fL ${distributionOrigin}${distributionAssets.rpm} -o /tmp/stray-linux.rpm\necho "d4f8e02ab166d5f62f4f639d53891ff21a2107ade31df9146c4417185845ecb6  /tmp/stray-linux.rpm" | sha256sum -c -\nsudo zypper install /tmp/stray-linux.rpm\nrm -f /tmp/stray-linux.rpm\n'` },
  { id: "arch", name: "Arch / derivadas", signal: "pacman", description: "Arch, CachyOS, EndeavourOS e derivados.", command: `bash -c '\nset -e\ncurl -fL ${distributionOrigin}${distributionAssets.pacman} -o /tmp/stray-linux.pacman\necho "5d5cc6d92ecd9ac2c1d30b51ab9e111cd04ed03d7eb3dafd25e9a97b4806a3ba  /tmp/stray-linux.pacman" | sha256sum -c -\nsudo pacman -U /tmp/stray-linux.pacman\nrm -f /tmp/stray-linux.pacman\n'` },
  { id: "appimage", name: "Qualquer distribuição", signal: "AppImage", description: "Alternativa portátil para Linux x64.", command: `bash -c '\nset -e\nmkdir -p "$HOME/.local/bin"\ncurl -fL ${distributionOrigin}${distributionAssets.appImage} -o "${appImageInstallPath}"\necho "594083dacccb83804df2b2900935ea303d9ca011c1a6219da6d6cd51b69f8f29  ${appImageInstallPath}" | sha256sum -c -\nchmod +x "${appImageInstallPath}"\n"${appImageInstallPath}"\n'` },
] as const;
