import type express from "express";

export const publicUpdateTargets = {
  "/updates/Stray-Linux-1.2.0-Setup.exe": "/manus-storage/Stray-Linux-1.2.0-Setup_36d0ad57.exe",
  "/updates/Stray-Linux-1.2.0-Setup.exe.blockmap": "/manus-storage/Stray-Linux-1.2.0-Setup.exe_163cadf5.blockmap",
  "/updates/Stray-Linux-1.2.0-amd64.deb": "/manus-storage/Stray-Linux-1.2.0-amd64_4e02e1f2.deb",
  "/updates/Stray-Linux-1.2.0-x86_64.rpm": "/manus-storage/Stray-Linux-1.2.0-x86_64_1b3b7080.rpm",
  "/updates/Stray-Linux-1.2.0-x64.pacman": "/manus-storage/Stray-Linux-1.2.0-x64_41b603c9.pacman",
  "/updates/Stray-Linux-1.2.0-x86_64.AppImage": "/manus-storage/Stray-Linux-1.2.0-x86_64_a70f99e5.AppImage",
} as const;

export function registerPublicUpdateRedirects(app: express.Express) {
  for (const [stablePath, targetPath] of Object.entries(publicUpdateTargets)) app.get(stablePath, (_req, res) => res.redirect(302, targetPath));
}
