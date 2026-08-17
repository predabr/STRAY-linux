import { describe, expect, it } from "vitest";
import { publicDownloadTargets } from "./publicDownloads";

describe("downloads públicos estáveis", () => {
  it("mantém artefatos e sidecars finais 1.2.0 por plataforma", () => {
    expect(Object.keys(publicDownloadTargets)).toHaveLength(10);
    expect(publicDownloadTargets["/downloads/stray-linux/windows-x64.exe"]).toBe("/manus-storage/Stray-Linux-1.2.0-Setup_36d0ad57.exe");
    expect(publicDownloadTargets["/downloads/stray-linux/windows-x64.exe.sha256"]).toBe("/manus-storage/Stray-Linux-1.2.0-Setup.exe_6ddf12dc.sha256");
    expect(publicDownloadTargets["/downloads/stray-linux/debian-amd64.deb"]).toBe("/manus-storage/Stray-Linux-1.2.0-amd64_4e02e1f2.deb");
    expect(publicDownloadTargets["/downloads/stray-linux/debian-amd64.deb.sha256"]).toBe("/manus-storage/Stray-Linux-1.2.0-amd64.deb_44134649.sha256");
    expect(publicDownloadTargets["/downloads/stray-linux/rpm-x64.rpm"]).toBe("/manus-storage/Stray-Linux-1.2.0-x86_64_1b3b7080.rpm");
    expect(publicDownloadTargets["/downloads/stray-linux/rpm-x64.rpm.sha256"]).toBe("/manus-storage/Stray-Linux-1.2.0-x86_64.rpm_6cac5312.sha256");
    expect(publicDownloadTargets["/downloads/stray-linux/arch-x64.pacman"]).toBe("/manus-storage/Stray-Linux-1.2.0-x64_41b603c9.pacman");
    expect(publicDownloadTargets["/downloads/stray-linux/arch-x64.pacman.sha256"]).toBe("/manus-storage/Stray-Linux-1.2.0-x64.pacman_cb8e3c0d.sha256");
    expect(publicDownloadTargets["/downloads/stray-linux/linux-x64.AppImage"]).toBe("/manus-storage/Stray-Linux-1.2.0-x86_64_a70f99e5.AppImage");
    expect(publicDownloadTargets["/downloads/stray-linux/linux-x64.AppImage.sha256"]).toBe("/manus-storage/Stray-Linux-1.2.0-x86_64.AppImage_25ebca3d.sha256");
  });
});
