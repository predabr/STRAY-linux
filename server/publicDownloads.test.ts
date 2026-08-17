import { describe, expect, it } from "vitest";
import { publicDownloadTargets } from "./publicDownloads";

describe("downloads públicos estáveis", () => {
  it("mantém artefatos e sidecars finais 1.1.13 por plataforma", () => {
    expect(Object.keys(publicDownloadTargets)).toHaveLength(10);
    expect(publicDownloadTargets["/downloads/stray-linux/windows-x64.exe"]).toBe("/manus-storage/Stray-Linux-1.1.13-Setup_f3e1e60e.exe");
    expect(publicDownloadTargets["/downloads/stray-linux/windows-x64.exe.sha256"]).toBe("/manus-storage/Stray-Linux-1.1.13-Setup.exe_17eef105.sha256");
    expect(publicDownloadTargets["/downloads/stray-linux/debian-amd64.deb"]).toBe("/manus-storage/Stray-Linux-1.1.13-amd64_4cc6cfcc.deb");
    expect(publicDownloadTargets["/downloads/stray-linux/debian-amd64.deb.sha256"]).toBe("/manus-storage/Stray-Linux-1.1.13-amd64.deb_0c65b1cd.sha256");
    expect(publicDownloadTargets["/downloads/stray-linux/rpm-x64.rpm"]).toBe("/manus-storage/Stray-Linux-1.1.13-x86_64_e4008bd7.rpm");
    expect(publicDownloadTargets["/downloads/stray-linux/rpm-x64.rpm.sha256"]).toBe("/manus-storage/Stray-Linux-1.1.13-x86_64.rpm_409048d6.sha256");
    expect(publicDownloadTargets["/downloads/stray-linux/arch-x64.pacman"]).toBe("/manus-storage/Stray-Linux-1.1.13-x64_680cc9f6.pacman");
    expect(publicDownloadTargets["/downloads/stray-linux/arch-x64.pacman.sha256"]).toBe("/manus-storage/Stray-Linux-1.1.13-x64.pacman_33e19d30.sha256");
    expect(publicDownloadTargets["/downloads/stray-linux/linux-x64.AppImage"]).toBe("/manus-storage/Stray-Linux-1.1.13-x86_64_5f65e407.AppImage");
    expect(publicDownloadTargets["/downloads/stray-linux/linux-x64.AppImage.sha256"]).toBe("/manus-storage/Stray-Linux-1.1.13-x86_64.AppImage_60b5f0c0.sha256");
  });
});
