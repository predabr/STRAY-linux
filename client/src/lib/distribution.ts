export const distributionOrigin = "https://linuxtoys-ckuyvpj5.manus.space";

export const distributionAssets = {
  exe: "/manus-storage/Stray-Linux-1.0.0-Setup_be527625.exe",
  deb: "/manus-storage/Stray-Linux-1.0.0-amd64_a2eb79fd.deb",
  rpm: "/manus-storage/Stray-Linux-1.0.0-x86_64_0915ae48.rpm",
  pacman: "/manus-storage/Stray-Linux-1.0.0-x64_894861be.pacman",
  appImage: "/manus-storage/Stray-Linux-1.0.0-x86_64_a3285103.AppImage",
} as const;

export const linuxInstallers = [
  { id: "debian", name: "Debian / Ubuntu", signal: "apt", description: "Debian, Ubuntu, Linux Mint e derivadas.", command: `set -e\ncurl -fL ${distributionOrigin}${distributionAssets.deb} -o /tmp/stray-linux.deb\necho "cc39641f05a96ff314c893624fc5b0c33ca4bd967933e65498b5d575f0bf2ce7  /tmp/stray-linux.deb" | sha256sum -c -\nsudo dpkg -i /tmp/stray-linux.deb || sudo apt-get -f install -y\nrm -f /tmp/stray-linux.deb` },
  { id: "fedora", name: "Fedora / RHEL", signal: "dnf", description: "Fedora, RHEL e distribuições compatíveis.", command: `set -e\ncurl -fL ${distributionOrigin}${distributionAssets.rpm} -o /tmp/stray-linux.rpm\necho "89ed08d1ef97a808a20756720d65835e9867322d20d60609a1c27c23dd88da7f  /tmp/stray-linux.rpm" | sha256sum -c -\nsudo dnf install /tmp/stray-linux.rpm\nrm -f /tmp/stray-linux.rpm` },
  { id: "opensuse", name: "openSUSE", signal: "zypper", description: "Tumbleweed, Leap e variantes com Zypper.", command: `set -e\ncurl -fL ${distributionOrigin}${distributionAssets.rpm} -o /tmp/stray-linux.rpm\necho "89ed08d1ef97a808a20756720d65835e9867322d20d60609a1c27c23dd88da7f  /tmp/stray-linux.rpm" | sha256sum -c -\nsudo zypper install /tmp/stray-linux.rpm\nrm -f /tmp/stray-linux.rpm` },
  { id: "arch", name: "Arch / derivadas", signal: "pacman", description: "Arch, CachyOS, EndeavourOS e derivados.", command: `set -e\ncurl -fL ${distributionOrigin}${distributionAssets.pacman} -o /tmp/stray-linux.pacman\necho "380968c1f5a5dae3a3e82adf650a1d891bc758c7946c062290575ee366f2e24f  /tmp/stray-linux.pacman" | sha256sum -c -\nsudo pacman -U /tmp/stray-linux.pacman\nrm -f /tmp/stray-linux.pacman` },
  { id: "appimage", name: "Qualquer distribuição", signal: "AppImage", description: "Alternativa portátil para Linux x64.", command: `set -e\nmkdir -p "$HOME/.local/bin"\ncurl -fL ${distributionOrigin}${distributionAssets.appImage} -o "$HOME/.local/bin/stray-linux"\necho "8e411761c740afbc53c1a0e36b88afb58321e31639e72d9b4a67c36ea691b1ff  $HOME/.local/bin/stray-linux" | sha256sum -c -\nchmod +x "$HOME/.local/bin/stray-linux"\n"$HOME/.local/bin/stray-linux"` },
] as const;
