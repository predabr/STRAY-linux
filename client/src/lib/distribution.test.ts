import { appImageInstallPath, distributionAssets, distributionOrigin, linuxInstallers } from "./distribution";
import { describe, expect, it } from "vitest";

describe("manifesto de distribuição pública", () => {
  it("mantém os cinco formatos publicados e um instalador Windows direto", () => {
    expect(distributionOrigin).toBe("https://linuxtoys-ckuyvpj5.manus.space");
    expect(distributionAssets.exe).toBe("/manus-storage/Stray-Linux-1.0.0-Setup_5f0e4b96.exe");
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
    expect(linuxInstallers.find((installer) => installer.id === "debian")?.command).toContain("3941fe65e2614025a8decb0d024f991a8fe75f895462d78f9db49ee1cb8f1ae7");
    expect(linuxInstallers.find((installer) => installer.id === "appimage")?.command).toContain("5b6942a33499f8a499e91e3b12d52f50f5a73e4b2968696342d513a49816f2e6");
    expect(linuxInstallers.find((installer) => installer.id === "appimage")?.command).toContain(appImageInstallPath);
  });
});
