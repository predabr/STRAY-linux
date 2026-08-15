import { appImageInstallPath, distributionAssets, distributionOrigin, linuxInstallers } from "./distribution";
import { describe, expect, it } from "vitest";

describe("manifesto de distribuição pública", () => {
  it("mantém os cinco formatos publicados e um instalador Windows direto", () => {
    expect(distributionOrigin).toBe("https://linuxtoys-ckuyvpj5.manus.space");
    expect(distributionAssets.exe).toBe("/manus-storage/Stray-Linux-1.1.0-Setup_13745d83.exe");
    expect(linuxInstallers.map((installer) => installer.id)).toEqual(["debian", "fedora", "opensuse", "arch", "appimage"]);
  });

  it("verifica integridade antes de cada instalação Linux e não alega repositório Arch", () => {
    for (const installer of linuxInstallers) {
      expect(installer.command).toMatch(/^bash -c '/);
      expect(installer.command).toContain("sha256sum -c -");
      expect(installer.command).toContain("curl -fL");
    }
    expect(linuxInstallers.find((installer) => installer.id === "arch")?.command).toContain("sudo pacman -U /tmp/stray-linux.pacman");
    expect(linuxInstallers.find((installer) => installer.id === "arch")?.command).not.toContain("dpkg");
    expect(linuxInstallers.find((installer) => installer.id === "arch")?.command).not.toContain("apt-get");
    expect(linuxInstallers.find((installer) => installer.id === "arch")?.command).not.toContain("pacman -S stray-linux");
    expect(linuxInstallers.find((installer) => installer.id === "debian")?.command).toContain("48960d0744a9784c3ba8481f254836b964073ad3fa806c28b565c403391c1576");
    expect(linuxInstallers.find((installer) => installer.id === "appimage")?.command).toContain("b231a87c059568aee4dff38bae35f0f1698ce2db2901c08c0f404356a9be43ad");
    expect(linuxInstallers.find((installer) => installer.id === "appimage")?.command).toContain(appImageInstallPath);
  });
});
