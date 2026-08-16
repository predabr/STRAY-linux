import { describe, expect, it } from "vitest";
import { publicDownloadTargets } from "./publicDownloads";

describe("downloads públicos estáveis", () => {
  it("mantém URLs estáveis por plataforma apontando aos cinco artefatos validados da release", () => {
    expect(publicDownloadTargets).toEqual({
      "/downloads/stray-linux/windows-x64.exe": "/manus-storage/Stray-Linux-1.1.4-Setup_b0f618d1.exe",
      "/downloads/stray-linux/debian-amd64.deb": "/manus-storage/Stray-Linux-1.1.4-amd64_9c221c89.deb",
      "/downloads/stray-linux/rpm-x64.rpm": "/manus-storage/Stray-Linux-1.1.4-x86_64_99058c82.rpm",
      "/downloads/stray-linux/arch-x64.pacman": "/manus-storage/Stray-Linux-1.1.4-x64_2310d96e.pacman",
      "/downloads/stray-linux/linux-x64.AppImage": "/manus-storage/Stray-Linux-1.1.4-x86_64_33e229af.AppImage",
    });
  });
});
