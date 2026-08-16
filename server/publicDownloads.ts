import type { Express } from "express";

export const publicDownloadTargets = {
  "/downloads/stray-linux/windows-x64.exe": "/manus-storage/Stray-Linux-1.1.4-Setup_b0f618d1.exe",
  "/downloads/stray-linux/debian-amd64.deb": "/manus-storage/Stray-Linux-1.1.4-amd64_9c221c89.deb",
  "/downloads/stray-linux/rpm-x64.rpm": "/manus-storage/Stray-Linux-1.1.4-x86_64_99058c82.rpm",
  "/downloads/stray-linux/arch-x64.pacman": "/manus-storage/Stray-Linux-1.1.4-x64_2310d96e.pacman",
  "/downloads/stray-linux/linux-x64.AppImage": "/manus-storage/Stray-Linux-1.1.4-x86_64_33e229af.AppImage",
} as const;

export function registerPublicDownloadRedirects(app: Express) {
  for (const [stablePath, targetPath] of Object.entries(publicDownloadTargets)) {
    app.get(stablePath, (_req, res) => res.redirect(302, targetPath));
  }
}
