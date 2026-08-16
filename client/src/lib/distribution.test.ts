import { appImageInstallPath, distributionAssets, distributionOrigin, linuxInstallers } from "./distribution";
import { describe, expect, it } from "vitest";

describe("manifesto de distribuição pública", () => {
  it("mantém os cinco formatos publicados e um instalador Windows direto", () => {
    expect(distributionOrigin).toBe("https://linuxtoys-ckuyvpj5.manus.space");
    expect(distributionAssets.exe).toBe("/manus-storage/Stray-Linux-1.1.1-Setup_eb412ad7.exe");
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
    expect(linuxInstallers.find((installer) => installer.id === "debian")?.command).toContain("080422e2068479c4998c4557ed13ebcfdf4fdf254c268b58390f5717975a399b");
    expect(linuxInstallers.find((installer) => installer.id === "appimage")?.command).toContain("15321cb8c3462879612d583170199bc3ff4b5e6f85c1d50786112528a198503c");
    expect(linuxInstallers.find((installer) => installer.id === "appimage")?.command).toContain(appImageInstallPath);
  });
});
