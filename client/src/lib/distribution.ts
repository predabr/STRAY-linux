export const distributionOrigin = "https://linuxtoys-ckuyvpj5.manus.space";

export const distributionAssets = {
  exe: "/manus-storage/Stray-Linux-1.0.0-Setup_ad43788b.exe",
  deb: "/manus-storage/Stray-Linux-1.0.0-amd64_8b1ff213.deb",
  rpm: "/manus-storage/Stray-Linux-1.0.0-x86_64_9bff31ed.rpm",
  pacman: "/manus-storage/Stray-Linux-1.0.0-x64_b6657e3c.pacman",
  appImage: "/manus-storage/Stray-Linux-1.0.0-x86_64_b55c59b6.AppImage",
} as const;

export const linuxInstallers = [
  { id: "debian", name: "Debian / Ubuntu", signal: "apt", description: "Debian, Ubuntu, Linux Mint e derivadas.", command: `set -e\ncurl -fL ${distributionOrigin}${distributionAssets.deb} -o /tmp/stray-linux.deb\necho "289bebb48d9d4c070d053a8273c0cba41c336a9d1a778fd1efc564f16d3d14e3  /tmp/stray-linux.deb" | sha256sum -c -\nsudo dpkg -i /tmp/stray-linux.deb || sudo apt-get -f install -y\nrm -f /tmp/stray-linux.deb` },
  { id: "fedora", name: "Fedora / RHEL", signal: "dnf", description: "Fedora, RHEL e distribuições compatíveis.", command: `set -e\ncurl -fL ${distributionOrigin}${distributionAssets.rpm} -o /tmp/stray-linux.rpm\necho "f4ba15159e79619cb619b49f33cad89ebbd15a6c98a6455b3ea765c64a31e73c  /tmp/stray-linux.rpm" | sha256sum -c -\nsudo dnf install /tmp/stray-linux.rpm\nrm -f /tmp/stray-linux.rpm` },
  { id: "opensuse", name: "openSUSE", signal: "zypper", description: "Tumbleweed, Leap e variantes com Zypper.", command: `set -e\ncurl -fL ${distributionOrigin}${distributionAssets.rpm} -o /tmp/stray-linux.rpm\necho "f4ba15159e79619cb619b49f33cad89ebbd15a6c98a6455b3ea765c64a31e73c  /tmp/stray-linux.rpm" | sha256sum -c -\nsudo zypper install /tmp/stray-linux.rpm\nrm -f /tmp/stray-linux.rpm` },
  { id: "arch", name: "Arch / derivadas", signal: "pacman", description: "Arch, CachyOS, EndeavourOS e derivados.", command: `set -e\ncurl -fL ${distributionOrigin}${distributionAssets.pacman} -o /tmp/stray-linux.pacman\necho "584a7da5fd306a17e5758e102f5b116687a977b2de8572c071f51b48295761dd  /tmp/stray-linux.pacman" | sha256sum -c -\nsudo pacman -U /tmp/stray-linux.pacman\nrm -f /tmp/stray-linux.pacman` },
  { id: "appimage", name: "Qualquer distribuição", signal: "AppImage", description: "Alternativa portátil para Linux x64.", command: `set -e\nmkdir -p "$HOME/.local/bin"\ncurl -fL ${distributionOrigin}${distributionAssets.appImage} -o "$HOME/.local/bin/stray-linux"\necho "aa632ab2e926adc7185ae00ab43d24be8b1ee235388d0ff8307d842ad9eb7957  $HOME/.local/bin/stray-linux" | sha256sum -c -\nchmod +x "$HOME/.local/bin/stray-linux"\n"$HOME/.local/bin/stray-linux"` },
] as const;
