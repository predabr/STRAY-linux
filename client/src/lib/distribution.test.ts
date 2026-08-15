import { appImageInstallPath, distributionAssets, distributionOrigin, linuxInstallers } from "./distribution";
import { describe, expect, it } from "vitest";

describe("manifesto de distribuição pública", () => {
  it("mantém os cinco formatos publicados e um instalador Windows direto", () => {
    expect(distributionOrigin).toBe("https://linuxtoys-ckuyvpj5.manus.space");
    expect(distributionAssets.exe).toBe("/manus-storage/Stray-Linux-1.0.0-Setup_dce56390_159ec40e.exe");
    expect(linuxInstallers.map((installer) => installer.id)).toEqual(["debian", "fedora", "opensuse", "arch", "appimage"]);
  });

  it("verifica integridade antes de cada instalação Linux e não alega repositório Arch", () => {
    for (const installer of linuxInstallers) {
      expect(installer.command).toContain("sha256sum -c -");
      expect(installer.command).toContain("curl -fL");
    }
    expect(linuxInstallers.find((installer) => installer.id === "arch")?.command).toContain("sudo pacman -U /tmp/stray-linux.pacman");
    expect(linuxInstallers.find((installer) => installer.id === "arch")?.command).not.toContain("pacman -S stray-linux");
    expect(linuxInstallers.find((installer) => installer.id === "debian")?.command).toContain("c20cdd7e96a00eb82a55cc8d2103fb69d2f9aa3a0235442caf09b97ff61e16f3");
    expect(linuxInstallers.find((installer) => installer.id === "appimage")?.command).toContain("2f46c6a7508bbb4d38149e09cb84eae58d3769d3dece54f4c3f4ef4088623486");
    expect(linuxInstallers.find((installer) => installer.id === "appimage")?.command).toContain(appImageInstallPath);
  });
});
