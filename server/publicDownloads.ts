import type { Express } from "express";

export const publicDownloadTargets = {
  "/downloads/stray-linux/windows-x64.exe": "/manus-storage/Stray-Linux-1.1.3-Setup_907ff102.exe",
  "/downloads/stray-linux/debian-amd64.deb": "/manus-storage/Stray-Linux-1.1.3-amd64_012ddefa.deb",
  "/downloads/stray-linux/rpm-x64.rpm": "/manus-storage/Stray-Linux-1.1.3-x86_64_cc2975d3.rpm",
  "/downloads/stray-linux/arch-x64.pacman": "/manus-storage/Stray-Linux-1.1.3-x64_6c58cdf6.pacman",
  "/downloads/stray-linux/linux-x64.AppImage": "/manus-storage/Stray-Linux-1.1.3-x86_64_b0d2628d.AppImage",
} as const;

export function registerPublicDownloadRedirects(app: Express) {
  for (const [stablePath, targetPath] of Object.entries(publicDownloadTargets)) {
    app.get(stablePath, (_req, res) => res.redirect(302, targetPath));
  }
}
