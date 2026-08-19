import { appImageInstallPath, distributionAssets, distributionOrigin, linuxInstallers } from "./distribution";
import { releaseManifest } from "./releaseManifest";
import { describe, expect, it } from "vitest";

describe("manifesto de distribuição pública", () => {
  it("mantém os cinco formatos publicados e um instalador Windows direto", () => {
    expect(distributionOrigin).toBe("https://linuxtoys-ckuyvpj5.manus.space");
    expect(distributionAssets.exe).toBe("/downloads/stray-linux/windows-x64.exe");
    expect(linuxInstallers.map((installer) => installer.id)).toEqual(["debian", "fedora", "opensuse", "arch", "appimage"]);
  });

  it("verifica integridade antes de cada instalação Linux e não alega repositório Arch", () => {
    for (const installer of linuxInstallers) {
      expect(installer.command).toContain("sha256sum --check --status -");
      expect(installer.command).toContain("curl --fail --location --show-error --silent --retry 5 --retry-all-errors");
      expect(installer.command).toContain("awk 'NF { print $1");
      expect(installer.command).not.toContain("bash -c '");
    }
    expect(linuxInstallers.find((installer) => installer.id === "arch")?.command).toContain("sudo pacman -U /tmp/stray-linux.pacman");
    expect(linuxInstallers.find((installer) => installer.id === "arch")?.command).not.toContain("dpkg");
    expect(linuxInstallers.find((installer) => installer.id === "arch")?.command).not.toContain("apt-get");
    expect(linuxInstallers.find((installer) => installer.id === "arch")?.command).not.toContain("pacman -S stray-linux");
    expect(releaseManifest.version).toBe("1.3.0");
    expect(linuxInstallers.find((installer) => installer.id === "debian")?.command).toContain(releaseManifest.integrityAssets.deb);
    expect(linuxInstallers.find((installer) => installer.id === "fedora")?.command).toContain(releaseManifest.integrityAssets.rpm);
    expect(linuxInstallers.find((installer) => installer.id === "opensuse")?.command).toContain(releaseManifest.integrityAssets.rpm);
    expect(linuxInstallers.find((installer) => installer.id === "arch")?.command).toContain(releaseManifest.integrityAssets.pacman);
    expect(linuxInstallers.find((installer) => installer.id === "appimage")?.command).toContain(releaseManifest.integrityAssets.appImage);
    expect(linuxInstallers.find((installer) => installer.id === "appimage")?.command).toContain(appImageInstallPath);
  });
});
