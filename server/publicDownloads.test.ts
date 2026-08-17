import { describe, expect, it } from "vitest";
import { publicDownloadTargets } from "./publicDownloads";

describe("downloads públicos estáveis", () => {
  it("mantém artefatos e sidecars finais 1.2.0 por plataforma", () => {
    expect(Object.keys(publicDownloadTargets)).toHaveLength(10);
    expect(publicDownloadTargets["/downloads/stray-linux/windows-x64.exe"]).toBe("/manus-storage/Stray-Linux-1.2.0-Setup_66038b5d.exe");
    expect(publicDownloadTargets["/downloads/stray-linux/windows-x64.exe.sha256"]).toBe("/manus-storage/Stray-Linux-1.2.0-Setup.exe_b65e3102.sha256");
    expect(publicDownloadTargets["/downloads/stray-linux/debian-amd64.deb"]).toBe("/manus-storage/Stray-Linux-1.2.0-amd64_00f9daf4.deb");
    expect(publicDownloadTargets["/downloads/stray-linux/debian-amd64.deb.sha256"]).toBe("/manus-storage/Stray-Linux-1.2.0-amd64.deb_e52c2058.sha256");
    expect(publicDownloadTargets["/downloads/stray-linux/rpm-x64.rpm"]).toBe("/manus-storage/Stray-Linux-1.2.0-x86_64_2b1128da.rpm");
    expect(publicDownloadTargets["/downloads/stray-linux/rpm-x64.rpm.sha256"]).toBe("/manus-storage/Stray-Linux-1.2.0-x86_64.rpm_37af8e13.sha256");
    expect(publicDownloadTargets["/downloads/stray-linux/arch-x64.pacman"]).toBe("/manus-storage/Stray-Linux-1.2.0-x64_9be1b372.pacman");
    expect(publicDownloadTargets["/downloads/stray-linux/arch-x64.pacman.sha256"]).toBe("/manus-storage/Stray-Linux-1.2.0-x64.pacman_f892cc14.sha256");
    expect(publicDownloadTargets["/downloads/stray-linux/linux-x64.AppImage"]).toBe("/manus-storage/Stray-Linux-1.2.0-x86_64_96796cf3.AppImage");
    expect(publicDownloadTargets["/downloads/stray-linux/linux-x64.AppImage.sha256"]).toBe("/manus-storage/Stray-Linux-1.2.0-x86_64.AppImage_f6a94c20.sha256");
  });
});
