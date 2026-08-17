import { releaseManifest } from "./releaseManifest";

export const distributionOrigin = "https://linuxtoys-ckuyvpj5.manus.space";

export const distributionAssets = {
  exe: "/downloads/stray-linux/windows-x64.exe",
  deb: "/downloads/stray-linux/debian-amd64.deb",
  rpm: "/downloads/stray-linux/rpm-x64.rpm",
  pacman: "/downloads/stray-linux/arch-x64.pacman",
  appImage: "/downloads/stray-linux/linux-x64.AppImage",
} as const;

export const appImageInstallPath = "$HOME/.local/bin/stray-linux";

const verifyCommand = (artifactPath: string, checksumPath: string) => `curl -fL ${distributionOrigin}${checksumPath} -o /tmp/stray-linux.sha256
expected="$(awk '{print $1}' /tmp/stray-linux.sha256)"
printf '%s  %s\\n' "$expected" ${artifactPath} | sha256sum -c -
rm -f /tmp/stray-linux.sha256`;

export const linuxInstallers = [
  { id: "debian", name: "Debian / Ubuntu", signal: "apt", description: "Debian, Ubuntu, Linux Mint e derivadas.", command: `bash -c '\nset -e\ncurl -fL ${distributionOrigin}${distributionAssets.deb} -o /tmp/stray-linux.deb\n${verifyCommand("/tmp/stray-linux.deb", releaseManifest.integrityAssets.deb)}\nsudo dpkg -i /tmp/stray-linux.deb || sudo apt-get -f install -y\nrm -f /tmp/stray-linux.deb\n'` },
  { id: "fedora", name: "Fedora / RHEL", signal: "dnf", description: "Fedora, RHEL e distribuições compatíveis.", command: `bash -c '\nset -e\ncurl -fL ${distributionOrigin}${distributionAssets.rpm} -o /tmp/stray-linux.rpm\n${verifyCommand("/tmp/stray-linux.rpm", releaseManifest.integrityAssets.rpm)}\nsudo dnf install /tmp/stray-linux.rpm\nrm -f /tmp/stray-linux.rpm\n'` },
  { id: "opensuse", name: "openSUSE", signal: "zypper", description: "Tumbleweed, Leap e variantes com Zypper.", command: `bash -c '\nset -e\ncurl -fL ${distributionOrigin}${distributionAssets.rpm} -o /tmp/stray-linux.rpm\n${verifyCommand("/tmp/stray-linux.rpm", releaseManifest.integrityAssets.rpm)}\nsudo zypper install /tmp/stray-linux.rpm\nrm -f /tmp/stray-linux.rpm\n'` },
  { id: "arch", name: "Arch / derivadas", signal: "pacman", description: "Arch, CachyOS, EndeavourOS e derivados.", command: `bash -c '\nset -e\ncurl -fL ${distributionOrigin}${distributionAssets.pacman} -o /tmp/stray-linux.pacman\n${verifyCommand("/tmp/stray-linux.pacman", releaseManifest.integrityAssets.pacman)}\nsudo pacman -U /tmp/stray-linux.pacman\nrm -f /tmp/stray-linux.pacman\n'` },
  { id: "appimage", name: "Qualquer distribuição", signal: "AppImage", description: "Alternativa portátil para Linux x64.", command: `bash -c '\nset -e\nmkdir -p "$HOME/.local/bin"\ncurl -fL ${distributionOrigin}${distributionAssets.appImage} -o "${appImageInstallPath}"\n${verifyCommand(appImageInstallPath, releaseManifest.integrityAssets.appImage)}\nchmod +x "${appImageInstallPath}"\n"${appImageInstallPath}"\n'` },
] as const;
