export const distributionOrigin = "https://linuxtoys-ckuyvpj5.manus.space";

export const distributionAssets = {
  exe: "/manus-storage/Stray-Linux-1.0.0-Setup_5f0e4b96.exe",
  deb: "/manus-storage/Stray-Linux-1.0.0-amd64_a95df672.deb",
  rpm: "/manus-storage/Stray-Linux-1.0.0-x86_64_0f1e960b.rpm",
  pacman: "/manus-storage/Stray-Linux-1.0.0-x64_5fceb89c.pacman",
  appImage: "/manus-storage/Stray-Linux-1.0.0-x86_64_73ae752d.AppImage",
} as const;

export const appImageInstallPath = "$HOME/.local/bin/stray-linux";

export const linuxInstallers = [
  { id: "debian", name: "Debian / Ubuntu", signal: "apt", description: "Debian, Ubuntu, Linux Mint e derivadas.", command: `bash -c '\nset -e\ncurl -fL ${distributionOrigin}${distributionAssets.deb} -o /tmp/stray-linux.deb\necho "3941fe65e2614025a8decb0d024f991a8fe75f895462d78f9db49ee1cb8f1ae7  /tmp/stray-linux.deb" | sha256sum -c -\nsudo dpkg -i /tmp/stray-linux.deb || sudo apt-get -f install -y\nrm -f /tmp/stray-linux.deb\n'` },
  { id: "fedora", name: "Fedora / RHEL", signal: "dnf", description: "Fedora, RHEL e distribuições compatíveis.", command: `bash -c '\nset -e\ncurl -fL ${distributionOrigin}${distributionAssets.rpm} -o /tmp/stray-linux.rpm\necho "cde87a9e0e20d524320a1e76fcaeafdd60cc116943697eb0d9b471394b1ca6ef  /tmp/stray-linux.rpm" | sha256sum -c -\nsudo dnf install /tmp/stray-linux.rpm\nrm -f /tmp/stray-linux.rpm\n'` },
  { id: "opensuse", name: "openSUSE", signal: "zypper", description: "Tumbleweed, Leap e variantes com Zypper.", command: `bash -c '\nset -e\ncurl -fL ${distributionOrigin}${distributionAssets.rpm} -o /tmp/stray-linux.rpm\necho "cde87a9e0e20d524320a1e76fcaeafdd60cc116943697eb0d9b471394b1ca6ef  /tmp/stray-linux.rpm" | sha256sum -c -\nsudo zypper install /tmp/stray-linux.rpm\nrm -f /tmp/stray-linux.rpm\n'` },
  { id: "arch", name: "Arch / derivadas", signal: "pacman", description: "Arch, CachyOS, EndeavourOS e derivados.", command: `bash -c '\nset -e\ncurl -fL ${distributionOrigin}${distributionAssets.pacman} -o /tmp/stray-linux.pacman\necho "bb669a2890bbaa0481a278578705a0af3214609e374bc886928da791b0c2b279  /tmp/stray-linux.pacman" | sha256sum -c -\nsudo pacman -U /tmp/stray-linux.pacman\nrm -f /tmp/stray-linux.pacman\n'` },
  { id: "appimage", name: "Qualquer distribuição", signal: "AppImage", description: "Alternativa portátil para Linux x64.", command: `bash -c '\nset -e\nmkdir -p "$HOME/.local/bin"\ncurl -fL ${distributionOrigin}${distributionAssets.appImage} -o "${appImageInstallPath}"\necho "5b6942a33499f8a499e91e3b12d52f50f5a73e4b2968696342d513a49816f2e6  ${appImageInstallPath}" | sha256sum -c -\nchmod +x "${appImageInstallPath}"\n"${appImageInstallPath}"\n'` },
] as const;
