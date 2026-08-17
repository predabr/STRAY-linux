import { describe, expect, it } from "vitest";
import { publicDownloadTargets } from "./publicDownloads";

describe("downloads públicos estáveis", () => {
  it("mantém URLs estáveis por plataforma apontando aos cinco artefatos validados da release", () => {
    expect(publicDownloadTargets).toEqual({
      "/downloads/stray-linux/windows-x64.exe": "/manus-storage/Stray-Linux-1.1.12-Setup_f90915d2.exe",
      "/downloads/stray-linux/debian-amd64.deb": "/manus-storage/Stray-Linux-1.1.12-amd64_0f89fb24.deb",
      "/downloads/stray-linux/rpm-x64.rpm": "/manus-storage/Stray-Linux-1.1.12-x86_64_879e6851.rpm",
      "/downloads/stray-linux/arch-x64.pacman": "/manus-storage/Stray-Linux-1.1.12-x64_a052877f.pacman",
      "/downloads/stray-linux/linux-x64.AppImage": "/manus-storage/Stray-Linux-1.1.12-x86_64_f6a1c485.AppImage",
    });
  });
});
