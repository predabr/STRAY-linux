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

const installerCommand = (
  artifactUrl: string,
  artifactPath: string,
  checksumPath: string,
  artifactName: string,
  installCommand: string,
  preparation = "",
) => [
  preparation,
  `curl --fail --location --show-error --silent --retry 5 --retry-all-errors --retry-delay 2 "${distributionOrigin}${artifactUrl}" -o "${artifactPath}"`,
  `test -s "${artifactPath}"`,
  `curl --fail --location --show-error --silent --retry 5 --retry-all-errors --retry-delay 2 "${distributionOrigin}${checksumPath}" -o "${artifactPath}.sha256"`,
  `test -s "${artifactPath}.sha256"`,
  `awk 'NF { print $1 "  ${artifactPath}"; exit }' "${artifactPath}.sha256" | sha256sum --check --status -`,
  `printf 'Stray Linux ${releaseManifest.version}: ${artifactName} verificado\\n'`,
  installCommand,
  `rm -f "${artifactPath}" "${artifactPath}.sha256"`,
].filter(Boolean).join(" && ");

export const linuxInstallers = [
  { id: "debian", name: "Debian / Ubuntu", signal: "apt", description: "Debian, Ubuntu, Linux Mint e derivadas.", command: installerCommand(distributionAssets.deb, "/tmp/stray-linux.deb", releaseManifest.integrityAssets.deb, ".deb", "sudo dpkg -i /tmp/stray-linux.deb || sudo apt-get -f install -y") },
  { id: "fedora", name: "Fedora / RHEL", signal: "dnf", description: "Fedora, RHEL e distribuições compatíveis.", command: installerCommand(distributionAssets.rpm, "/tmp/stray-linux.rpm", releaseManifest.integrityAssets.rpm, ".rpm", "sudo dnf install -y /tmp/stray-linux.rpm") },
  { id: "opensuse", name: "openSUSE", signal: "zypper", description: "Tumbleweed, Leap e variantes com Zypper.", command: installerCommand(distributionAssets.rpm, "/tmp/stray-linux.rpm", releaseManifest.integrityAssets.rpm, ".rpm", "sudo zypper --non-interactive install --allow-unsigned-rpm /tmp/stray-linux.rpm") },
  { id: "arch", name: "Arch / derivadas", signal: "pacman", description: "Arch, CachyOS, EndeavourOS e derivados.", command: installerCommand(distributionAssets.pacman, "/tmp/stray-linux.pacman", releaseManifest.integrityAssets.pacman, ".pacman", "sudo pacman -U /tmp/stray-linux.pacman") },
  { id: "appimage", name: "Qualquer distribuição", signal: "AppImage", description: "Alternativa portátil para Linux x64.", command: installerCommand(distributionAssets.appImage, appImageInstallPath, releaseManifest.integrityAssets.appImage, "AppImage", `mkdir -p "$(dirname "${appImageInstallPath}")"\nchmod +x "${appImageInstallPath}"\n"${appImageInstallPath}"`) },
] as const;
