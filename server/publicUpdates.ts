import type express from "express";

export const publicUpdateTargets = {
  "/updates/Stray-Linux-1.1.12-Setup.exe": "/manus-storage/Stray-Linux-1.1.12-Setup_f90915d2.exe",
  "/updates/Stray-Linux-1.1.12-Setup.exe.blockmap": "/manus-storage/Stray-Linux-1.1.12-Setup.exe_e66feb99.blockmap",
  "/updates/Stray-Linux-1.1.12-amd64.deb": "/manus-storage/Stray-Linux-1.1.12-amd64_0f89fb24.deb",
  "/updates/Stray-Linux-1.1.12-x86_64.rpm": "/manus-storage/Stray-Linux-1.1.12-x86_64_879e6851.rpm",
  "/updates/Stray-Linux-1.1.12-x64.pacman": "/manus-storage/Stray-Linux-1.1.12-x64_a052877f.pacman",
  "/updates/Stray-Linux-1.1.12-x86_64.AppImage": "/manus-storage/Stray-Linux-1.1.12-x86_64_f6a1c485.AppImage",
} as const;

export function registerPublicUpdateRedirects(app: express.Express) {
  for (const [stablePath, targetPath] of Object.entries(publicUpdateTargets)) app.get(stablePath, (_req, res) => res.redirect(302, targetPath));
}
