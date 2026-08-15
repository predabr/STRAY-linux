export const distributionOrigin = "https://linuxtoys-ckuyvpj5.manus.space";

export const distributionAssets = {
  exe: "/manus-storage/Stray-Linux-1.0.0-Setup_dce56390_159ec40e.exe",
  deb: "/manus-storage/Stray-Linux-1.0.0-amd64_c20cdd7e_b75e1274.deb",
  rpm: "/manus-storage/Stray-Linux-1.0.0-x86_64_bd4deed1_73c6c7a7.rpm",
  pacman: "/manus-storage/Stray-Linux-1.0.0-x64_fae609b4_978f2139.pacman",
  appImage: "/manus-storage/Stray-Linux-1.0.0-x86_64_2f46c6a7_14d42b06.AppImage",
} as const;

export const appImageInstallPath = "$HOME/.local/bin/stray-linux";

export const linuxInstallers = [
  { id: "debian", name: "Debian / Ubuntu", signal: "apt", description: "Debian, Ubuntu, Linux Mint e derivadas.", command: `set -e\ncurl -fL ${distributionOrigin}${distributionAssets.deb} -o /tmp/stray-linux.deb\necho "c20cdd7e96a00eb82a55cc8d2103fb69d2f9aa3a0235442caf09b97ff61e16f3  /tmp/stray-linux.deb" | sha256sum -c -\nsudo dpkg -i /tmp/stray-linux.deb || sudo apt-get -f install -y\nrm -f /tmp/stray-linux.deb` },
  { id: "fedora", name: "Fedora / RHEL", signal: "dnf", description: "Fedora, RHEL e distribuições compatíveis.", command: `set -e\ncurl -fL ${distributionOrigin}${distributionAssets.rpm} -o /tmp/stray-linux.rpm\necho "bd4deed1189e2765e74d3bc090f17e9e097ed70181a513c9d944b1d20217feaa  /tmp/stray-linux.rpm" | sha256sum -c -\nsudo dnf install /tmp/stray-linux.rpm\nrm -f /tmp/stray-linux.rpm` },
  { id: "opensuse", name: "openSUSE", signal: "zypper", description: "Tumbleweed, Leap e variantes com Zypper.", command: `set -e\ncurl -fL ${distributionOrigin}${distributionAssets.rpm} -o /tmp/stray-linux.rpm\necho "bd4deed1189e2765e74d3bc090f17e9e097ed70181a513c9d944b1d20217feaa  /tmp/stray-linux.rpm" | sha256sum -c -\nsudo zypper install /tmp/stray-linux.rpm\nrm -f /tmp/stray-linux.rpm` },
  { id: "arch", name: "Arch / derivadas", signal: "pacman", description: "Arch, CachyOS, EndeavourOS e derivados.", command: `set -e\ncurl -fL ${distributionOrigin}${distributionAssets.pacman} -o /tmp/stray-linux.pacman\necho "fae609b4c94aa840ba0f632f8a9c6f247dcf76891fd9fea5e1c94b870dafbe24  /tmp/stray-linux.pacman" | sha256sum -c -\nsudo pacman -U /tmp/stray-linux.pacman\nrm -f /tmp/stray-linux.pacman` },
  { id: "appimage", name: "Qualquer distribuição", signal: "AppImage", description: "Alternativa portátil para Linux x64.", command: `set -e\nmkdir -p "$HOME/.local/bin"\ncurl -fL ${distributionOrigin}${distributionAssets.appImage} -o "${appImageInstallPath}"\necho "2f46c6a7508bbb4d38149e09cb84eae58d3769d3dece54f4c3f4ef4088623486  ${appImageInstallPath}" | sha256sum -c -\nchmod +x "${appImageInstallPath}"\n"${appImageInstallPath}"` },
] as const;
