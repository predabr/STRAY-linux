import type { Express } from "express";

export const publicDownloadTargets = {
  "/downloads/stray-linux/windows-x64.exe": "/manus-storage/Stray-Linux-1.3.0-Setup_c4f9bf38.exe",
  "/downloads/stray-linux/windows-x64.exe.sha256": "/manus-storage/Stray-Linux-1.3.0-Setup.exe_b2b603e8.sha256",
  "/downloads/stray-linux/debian-amd64.deb": "/manus-storage/Stray-Linux-1.3.0-amd64_fac3ee5d.deb",
  "/downloads/stray-linux/debian-amd64.deb.sha256": "/manus-storage/Stray-Linux-1.3.0-amd64.deb_bcf4f9a4.sha256",
  "/downloads/stray-linux/rpm-x64.rpm": "/manus-storage/Stray-Linux-1.3.0-x86_64_f923fe40.rpm",
  "/downloads/stray-linux/rpm-x64.rpm.sha256": "/manus-storage/Stray-Linux-1.3.0-x86_64.rpm_ba356795.sha256",
  "/downloads/stray-linux/arch-x64.pacman": "/manus-storage/Stray-Linux-1.3.0-x64_056e4f03.pacman",
  "/downloads/stray-linux/arch-x64.pacman.sha256": "/manus-storage/Stray-Linux-1.3.0-x64.pacman_0b60cfa8.sha256",
  "/downloads/stray-linux/linux-x64.AppImage": "/manus-storage/Stray-Linux-1.3.0-x86_64_88275693.AppImage",
  "/downloads/stray-linux/linux-x64.AppImage.sha256": "/manus-storage/Stray-Linux-1.3.0-x86_64.AppImage_d7a69375.sha256",
} as const;

export function registerPublicDownloadRedirects(app: Express) {
  for (const [stablePath, targetPath] of Object.entries(publicDownloadTargets)) {
    app.get(stablePath, (_req, res) => res.redirect(302, targetPath));
  }
}
