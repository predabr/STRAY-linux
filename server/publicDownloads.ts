import type { Express } from "express";

export const publicDownloadTargets = {
  "/downloads/stray-linux/windows-x64.exe": "/manus-storage/Stray-Linux-1.2.0-Setup_36d0ad57.exe",
  "/downloads/stray-linux/windows-x64.exe.sha256": "/manus-storage/Stray-Linux-1.2.0-Setup.exe_6ddf12dc.sha256",
  "/downloads/stray-linux/debian-amd64.deb": "/manus-storage/Stray-Linux-1.2.0-amd64_4e02e1f2.deb",
  "/downloads/stray-linux/debian-amd64.deb.sha256": "/manus-storage/Stray-Linux-1.2.0-amd64.deb_44134649.sha256",
  "/downloads/stray-linux/rpm-x64.rpm": "/manus-storage/Stray-Linux-1.2.0-x86_64_1b3b7080.rpm",
  "/downloads/stray-linux/rpm-x64.rpm.sha256": "/manus-storage/Stray-Linux-1.2.0-x86_64.rpm_6cac5312.sha256",
  "/downloads/stray-linux/arch-x64.pacman": "/manus-storage/Stray-Linux-1.2.0-x64_41b603c9.pacman",
  "/downloads/stray-linux/arch-x64.pacman.sha256": "/manus-storage/Stray-Linux-1.2.0-x64.pacman_cb8e3c0d.sha256",
  "/downloads/stray-linux/linux-x64.AppImage": "/manus-storage/Stray-Linux-1.2.0-x86_64_a70f99e5.AppImage",
  "/downloads/stray-linux/linux-x64.AppImage.sha256": "/manus-storage/Stray-Linux-1.2.0-x86_64.AppImage_25ebca3d.sha256",
} as const;

export function registerPublicDownloadRedirects(app: Express) {
  for (const [stablePath, targetPath] of Object.entries(publicDownloadTargets)) {
    app.get(stablePath, (_req, res) => res.redirect(302, targetPath));
  }
}
