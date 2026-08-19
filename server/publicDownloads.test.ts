import { describe, expect, it } from "vitest";
import { publicDownloadTargets } from "./publicDownloads";

describe("downloads públicos estáveis", () => {
  it("mantém artefatos e sidecars finais 1.3.0 por plataforma", () => {
    expect(Object.keys(publicDownloadTargets)).toHaveLength(10);
    expect(publicDownloadTargets["/downloads/stray-linux/windows-x64.exe"]).toBe("/manus-storage/Stray-Linux-1.3.0-Setup_c4f9bf38.exe");
    expect(publicDownloadTargets["/downloads/stray-linux/windows-x64.exe.sha256"]).toBe("/manus-storage/Stray-Linux-1.3.0-Setup.exe_b2b603e8.sha256");
    expect(publicDownloadTargets["/downloads/stray-linux/debian-amd64.deb"]).toBe("/manus-storage/Stray-Linux-1.3.0-amd64_fac3ee5d.deb");
    expect(publicDownloadTargets["/downloads/stray-linux/debian-amd64.deb.sha256"]).toBe("/manus-storage/Stray-Linux-1.3.0-amd64.deb_bcf4f9a4.sha256");
    expect(publicDownloadTargets["/downloads/stray-linux/rpm-x64.rpm"]).toBe("/manus-storage/Stray-Linux-1.3.0-x86_64_f923fe40.rpm");
    expect(publicDownloadTargets["/downloads/stray-linux/rpm-x64.rpm.sha256"]).toBe("/manus-storage/Stray-Linux-1.3.0-x86_64.rpm_ba356795.sha256");
    expect(publicDownloadTargets["/downloads/stray-linux/arch-x64.pacman"]).toBe("/manus-storage/Stray-Linux-1.3.0-x64_056e4f03.pacman");
    expect(publicDownloadTargets["/downloads/stray-linux/arch-x64.pacman.sha256"]).toBe("/manus-storage/Stray-Linux-1.3.0-x64.pacman_0b60cfa8.sha256");
    expect(publicDownloadTargets["/downloads/stray-linux/linux-x64.AppImage"]).toBe("/manus-storage/Stray-Linux-1.3.0-x86_64_88275693.AppImage");
    expect(publicDownloadTargets["/downloads/stray-linux/linux-x64.AppImage.sha256"]).toBe("/manus-storage/Stray-Linux-1.3.0-x86_64.AppImage_d7a69375.sha256");
  });
});
