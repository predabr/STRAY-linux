import { describe, expect, it } from "vitest";
import { publicDownloadTargets } from "./publicDownloads";

describe("downloads públicos estáveis", () => {
  it("mantém URLs estáveis por plataforma apontando aos cinco artefatos validados da release", () => {
    expect(publicDownloadTargets).toEqual({
      "/downloads/stray-linux/windows-x64.exe": "/manus-storage/Stray-Linux-1.1.8-Setup_6e7a5524.exe",
      "/downloads/stray-linux/debian-amd64.deb": "/manus-storage/Stray-Linux-1.1.8-amd64_7eadaea1.deb",
      "/downloads/stray-linux/rpm-x64.rpm": "/manus-storage/Stray-Linux-1.1.8-x86_64_4e0c635e.rpm",
      "/downloads/stray-linux/arch-x64.pacman": "/manus-storage/Stray-Linux-1.1.8-x64_af068a90.pacman",
      "/downloads/stray-linux/linux-x64.AppImage": "/manus-storage/Stray-Linux-1.1.8-x86_64_e94bc095.AppImage",
    });
  });
});
