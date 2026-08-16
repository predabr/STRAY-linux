import { describe, expect, it } from "vitest";
import { publicDownloadTargets } from "./publicDownloads";

describe("downloads públicos estáveis", () => {
  it("mantém URLs estáveis por plataforma apontando aos cinco artefatos validados da release", () => {
    expect(publicDownloadTargets).toEqual({
      "/downloads/stray-linux/windows-x64.exe": "/manus-storage/Stray-Linux-1.1.3-Setup_907ff102.exe",
      "/downloads/stray-linux/debian-amd64.deb": "/manus-storage/Stray-Linux-1.1.3-amd64_012ddefa.deb",
      "/downloads/stray-linux/rpm-x64.rpm": "/manus-storage/Stray-Linux-1.1.3-x86_64_cc2975d3.rpm",
      "/downloads/stray-linux/arch-x64.pacman": "/manus-storage/Stray-Linux-1.1.3-x64_6c58cdf6.pacman",
      "/downloads/stray-linux/linux-x64.AppImage": "/manus-storage/Stray-Linux-1.1.3-x86_64_b0d2628d.AppImage",
    });
  });
});
