export const distributionOrigin = "https://linuxtoys-ckuyvpj5.manus.space";

export const distributionAssets = {
  exe: "/manus-storage/Stray-Linux-1.0.0-Setup_77d35f72.exe",
  deb: "/manus-storage/Stray-Linux-1.0.0-amd64_a04a5424.deb",
  rpm: "/manus-storage/Stray-Linux-1.0.0-x86_64_fad145a2.rpm",
  pacman: "/manus-storage/Stray-Linux-1.0.0-x64_e47eaca5.pacman",
  appImage: "/manus-storage/Stray-Linux-1.0.0-x86_64_aa80474b.AppImage",
} as const;

export const linuxInstallers = [
  { id: "debian", name: "Debian / Ubuntu", signal: "apt", description: "Debian, Ubuntu, Linux Mint e derivadas.", command: `set -e\ncurl -fL ${distributionOrigin}${distributionAssets.deb} -o /tmp/stray-linux.deb\necho "36ce2009ebb2cef89b94b2afd03aea1787990f50e8854ae034ef0796f3ceca9d  /tmp/stray-linux.deb" | sha256sum -c -\nsudo dpkg -i /tmp/stray-linux.deb || sudo apt-get -f install -y\nrm -f /tmp/stray-linux.deb` },
  { id: "fedora", name: "Fedora / RHEL", signal: "dnf", description: "Fedora, RHEL e distribuições compatíveis.", command: `set -e\ncurl -fL ${distributionOrigin}${distributionAssets.rpm} -o /tmp/stray-linux.rpm\necho "cc406cd01d303207b6d490bcabf3d88ccb685547fd7864ca3197045a7aff6969  /tmp/stray-linux.rpm" | sha256sum -c -\nsudo dnf install /tmp/stray-linux.rpm\nrm -f /tmp/stray-linux.rpm` },
  { id: "opensuse", name: "openSUSE", signal: "zypper", description: "Tumbleweed, Leap e variantes com Zypper.", command: `set -e\ncurl -fL ${distributionOrigin}${distributionAssets.rpm} -o /tmp/stray-linux.rpm\necho "cc406cd01d303207b6d490bcabf3d88ccb685547fd7864ca3197045a7aff6969  /tmp/stray-linux.rpm" | sha256sum -c -\nsudo zypper install /tmp/stray-linux.rpm\nrm -f /tmp/stray-linux.rpm` },
  { id: "arch", name: "Arch / derivadas", signal: "pacman", description: "Arch, CachyOS, EndeavourOS e derivados.", command: `set -e\ncurl -fL ${distributionOrigin}${distributionAssets.pacman} -o /tmp/stray-linux.pacman\necho "b92e5e3a105a040c53928b348f800269a6e65ff534f8372cef3278dd9543bdbb  /tmp/stray-linux.pacman" | sha256sum -c -\nsudo pacman -U /tmp/stray-linux.pacman\nrm -f /tmp/stray-linux.pacman` },
  { id: "appimage", name: "Qualquer distribuição", signal: "AppImage", description: "Alternativa portátil para Linux x64.", command: `set -e\nmkdir -p "$HOME/.local/bin"\ncurl -fL ${distributionOrigin}${distributionAssets.appImage} -o "$HOME/.local/bin/stray-linux"\necho "94a1294fabd4e6a1b06f538d6c31c5d8cf6e6e56e23f3acbe939906482d4a425  $HOME/.local/bin/stray-linux" | sha256sum -c -\nchmod +x "$HOME/.local/bin/stray-linux"\n"$HOME/.local/bin/stray-linux"` },
] as const;
