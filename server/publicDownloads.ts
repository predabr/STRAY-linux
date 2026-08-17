import type { Express } from "express";

export const publicDownloadTargets = {
  "/downloads/stray-linux/windows-x64.exe": "/manus-storage/Stray-Linux-1.1.13-Setup_f3e1e60e.exe",
  "/downloads/stray-linux/windows-x64.exe.sha256": "/manus-storage/Stray-Linux-1.1.13-Setup.exe_17eef105.sha256",
  "/downloads/stray-linux/debian-amd64.deb": "/manus-storage/Stray-Linux-1.1.13-amd64_4cc6cfcc.deb",
  "/downloads/stray-linux/debian-amd64.deb.sha256": "/manus-storage/Stray-Linux-1.1.13-amd64.deb_0c65b1cd.sha256",
  "/downloads/stray-linux/rpm-x64.rpm": "/manus-storage/Stray-Linux-1.1.13-x86_64_e4008bd7.rpm",
  "/downloads/stray-linux/rpm-x64.rpm.sha256": "/manus-storage/Stray-Linux-1.1.13-x86_64.rpm_409048d6.sha256",
  "/downloads/stray-linux/arch-x64.pacman": "/manus-storage/Stray-Linux-1.1.13-x64_680cc9f6.pacman",
  "/downloads/stray-linux/arch-x64.pacman.sha256": "/manus-storage/Stray-Linux-1.1.13-x64.pacman_33e19d30.sha256",
  "/downloads/stray-linux/linux-x64.AppImage": "/manus-storage/Stray-Linux-1.1.13-x86_64_5f65e407.AppImage",
  "/downloads/stray-linux/linux-x64.AppImage.sha256": "/manus-storage/Stray-Linux-1.1.13-x86_64.AppImage_60b5f0c0.sha256",
} as const;

export function registerPublicDownloadRedirects(app: Express) {
  for (const [stablePath, targetPath] of Object.entries(publicDownloadTargets)) {
    app.get(stablePath, (_req, res) => res.redirect(302, targetPath));
  }
}
