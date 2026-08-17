import { describe, expect, it } from "vitest";
import { publicDownloadTargets } from "./publicDownloads";

describe("downloads públicos estáveis", () => {
  it("mantém URLs estáveis por plataforma apontando aos cinco artefatos validados da release", () => {
    expect(publicDownloadTargets).toEqual({
      "/downloads/stray-linux/windows-x64.exe": "/manus-storage/Stray-Linux-1.1.7-Setup_6697dee2.exe",
      "/downloads/stray-linux/debian-amd64.deb": "/manus-storage/Stray-Linux-1.1.7-amd64_70177ac0.deb",
      "/downloads/stray-linux/rpm-x64.rpm": "/manus-storage/Stray-Linux-1.1.7-x86_64_cf14227a.rpm",
      "/downloads/stray-linux/arch-x64.pacman": "/manus-storage/Stray-Linux-1.1.7-x64_d6cadf98.pacman",
      "/downloads/stray-linux/linux-x64.AppImage": "/manus-storage/Stray-Linux-1.1.7-x86_64_fe52445f.AppImage",
    });
  });
});
