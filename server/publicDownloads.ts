import type { Express } from "express";

export const publicDownloadTargets = {
  "/downloads/stray-linux/windows-x64.exe": "/manus-storage/Stray-Linux-1.1.7-Setup_6697dee2.exe",
  "/downloads/stray-linux/debian-amd64.deb": "/manus-storage/Stray-Linux-1.1.7-amd64_70177ac0.deb",
  "/downloads/stray-linux/rpm-x64.rpm": "/manus-storage/Stray-Linux-1.1.7-x86_64_cf14227a.rpm",
  "/downloads/stray-linux/arch-x64.pacman": "/manus-storage/Stray-Linux-1.1.7-x64_d6cadf98.pacman",
  "/downloads/stray-linux/linux-x64.AppImage": "/manus-storage/Stray-Linux-1.1.7-x86_64_fe52445f.AppImage",
} as const;

export function registerPublicDownloadRedirects(app: Express) {
  for (const [stablePath, targetPath] of Object.entries(publicDownloadTargets)) {
    app.get(stablePath, (_req, res) => res.redirect(302, targetPath));
  }
}
