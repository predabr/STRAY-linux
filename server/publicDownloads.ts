import type { Express } from "express";

export const publicDownloadTargets = {
  "/downloads/stray-linux/windows-x64.exe": "/manus-storage/Stray-Linux-1.2.0-Setup_66038b5d.exe",
  "/downloads/stray-linux/windows-x64.exe.sha256": "/manus-storage/Stray-Linux-1.2.0-Setup.exe_b65e3102.sha256",
  "/downloads/stray-linux/debian-amd64.deb": "/manus-storage/Stray-Linux-1.2.0-amd64_00f9daf4.deb",
  "/downloads/stray-linux/debian-amd64.deb.sha256": "/manus-storage/Stray-Linux-1.2.0-amd64.deb_e52c2058.sha256",
  "/downloads/stray-linux/rpm-x64.rpm": "/manus-storage/Stray-Linux-1.2.0-x86_64_2b1128da.rpm",
  "/downloads/stray-linux/rpm-x64.rpm.sha256": "/manus-storage/Stray-Linux-1.2.0-x86_64.rpm_37af8e13.sha256",
  "/downloads/stray-linux/arch-x64.pacman": "/manus-storage/Stray-Linux-1.2.0-x64_9be1b372.pacman",
  "/downloads/stray-linux/arch-x64.pacman.sha256": "/manus-storage/Stray-Linux-1.2.0-x64.pacman_f892cc14.sha256",
  "/downloads/stray-linux/linux-x64.AppImage": "/manus-storage/Stray-Linux-1.2.0-x86_64_96796cf3.AppImage",
  "/downloads/stray-linux/linux-x64.AppImage.sha256": "/manus-storage/Stray-Linux-1.2.0-x86_64.AppImage_f6a94c20.sha256",
} as const;

export function registerPublicDownloadRedirects(app: Express) {
  for (const [stablePath, targetPath] of Object.entries(publicDownloadTargets)) {
    app.get(stablePath, (_req, res) => res.redirect(302, targetPath));
  }
}
