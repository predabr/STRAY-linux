import { distributionAssets, distributionOrigin, linuxInstallers } from "./distribution";
import { describe, expect, it } from "vitest";

describe("manifesto de distribuição pública", () => {
  it("mantém os cinco formatos publicados e um instalador Windows direto", () => {
    expect(distributionOrigin).toBe("https://linuxtoys-ckuyvpj5.manus.space");
    expect(distributionAssets.exe).toBe("/manus-storage/Stray-Linux-1.0.0-Setup_be527625.exe");
    expect(linuxInstallers.map((installer) => installer.id)).toEqual(["debian", "fedora", "opensuse", "arch", "appimage"]);
  });

  it("verifica integridade antes de cada instalação Linux e não alega repositório Arch", () => {
    for (const installer of linuxInstallers) {
      expect(installer.command).toContain("sha256sum -c -");
      expect(installer.command).toContain("curl -fL");
    }
    expect(linuxInstallers.find((installer) => installer.id === "arch")?.command).toContain("sudo pacman -U /tmp/stray-linux.pacman");
    expect(linuxInstallers.find((installer) => installer.id === "arch")?.command).not.toContain("pacman -S stray-linux");
    expect(linuxInstallers.find((installer) => installer.id === "debian")?.command).toContain("cc39641f05a96ff314c893624fc5b0c33ca4bd967933e65498b5d575f0bf2ce7");
    expect(linuxInstallers.find((installer) => installer.id === "appimage")?.command).toContain("8e411761c740afbc53c1a0e36b88afb58321e31639e72d9b4a67c36ea691b1ff");
  });
});
