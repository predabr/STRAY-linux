export const distributionOrigin = "https://linuxtoys-ckuyvpj5.manus.space";

export const distributionAssets = {
  exe: "/manus-storage/Stray-Linux-1.0.0-Setup_f0b76dde.exe",
  deb: "/manus-storage/Stray-Linux-1.0.0-amd64_c8c2c751.deb",
  rpm: "/manus-storage/Stray-Linux-1.0.0-x86_64_0cfda9cc.rpm",
  pacman: "/manus-storage/Stray-Linux-1.0.0-x64_d34b52de.pacman",
  appImage: "/manus-storage/Stray-Linux-1.0.0-x86_64_4acb85a2.AppImage",
} as const;

export const linuxInstallers = [
  { id: "debian", name: "Debian / Ubuntu", signal: "apt", description: "Debian, Ubuntu, Linux Mint e derivadas.", command: `set -e\ncurl -fL ${distributionOrigin}${distributionAssets.deb} -o /tmp/stray-linux.deb\necho "85b469c0a351d26fba00f503a0d83a45d190c3b823cf74f200da8469f9ba70dc  /tmp/stray-linux.deb" | sha256sum -c -\nsudo dpkg -i /tmp/stray-linux.deb || sudo apt-get -f install -y\nrm -f /tmp/stray-linux.deb` },
  { id: "fedora", name: "Fedora / RHEL", signal: "dnf", description: "Fedora, RHEL e distribuições compatíveis.", command: `set -e\ncurl -fL ${distributionOrigin}${distributionAssets.rpm} -o /tmp/stray-linux.rpm\necho "844fda73baa330b5e1909cb0e2e6bfa01ae26d364a8d63013a73e3cfea86ec68  /tmp/stray-linux.rpm" | sha256sum -c -\nsudo dnf install /tmp/stray-linux.rpm\nrm -f /tmp/stray-linux.rpm` },
  { id: "opensuse", name: "openSUSE", signal: "zypper", description: "Tumbleweed, Leap e variantes com Zypper.", command: `set -e\ncurl -fL ${distributionOrigin}${distributionAssets.rpm} -o /tmp/stray-linux.rpm\necho "844fda73baa330b5e1909cb0e2e6bfa01ae26d364a8d63013a73e3cfea86ec68  /tmp/stray-linux.rpm" | sha256sum -c -\nsudo zypper install /tmp/stray-linux.rpm\nrm -f /tmp/stray-linux.rpm` },
  { id: "arch", name: "Arch / derivadas", signal: "pacman", description: "Arch, CachyOS, EndeavourOS e derivados.", command: `set -e\ncurl -fL ${distributionOrigin}${distributionAssets.pacman} -o /tmp/stray-linux.pacman\necho "72fc51fa6249c78b96df9524147a8a5a03b7164ed0671f60c30bb029a90b9a6f  /tmp/stray-linux.pacman" | sha256sum -c -\nsudo pacman -U /tmp/stray-linux.pacman\nrm -f /tmp/stray-linux.pacman` },
  { id: "appimage", name: "Qualquer distribuição", signal: "AppImage", description: "Alternativa portátil para Linux x64.", command: `set -e\nmkdir -p "$HOME/.local/bin"\ncurl -fL ${distributionOrigin}${distributionAssets.appImage} -o "$HOME/.local/bin/stray-linux"\necho "408209b161b1c811835921d2c85e90c3d8c141ed8ce30037e438ec206fc1ea82  $HOME/.local/bin/stray-linux" | sha256sum -c -\nchmod +x "$HOME/.local/bin/stray-linux"\n"$HOME/.local/bin/stray-linux"` },
] as const;
