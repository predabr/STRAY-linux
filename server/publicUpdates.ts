import type express from "express";

export const publicUpdateTargets = {
  "/updates/Stray-Linux-1.3.0-Setup.exe": "/manus-storage/Stray-Linux-1.3.0-Setup_c4f9bf38.exe",
  "/updates/Stray-Linux-1.3.0-Setup.exe.blockmap": "/manus-storage/Stray-Linux-1.3.0-Setup.exe_1c097c89.blockmap",
  "/updates/Stray-Linux-1.3.0-amd64.deb": "/manus-storage/Stray-Linux-1.3.0-amd64_fac3ee5d.deb",
  "/updates/Stray-Linux-1.3.0-x86_64.rpm": "/manus-storage/Stray-Linux-1.3.0-x86_64_f923fe40.rpm",
  "/updates/Stray-Linux-1.3.0-x64.pacman": "/manus-storage/Stray-Linux-1.3.0-x64_056e4f03.pacman",
  "/updates/Stray-Linux-1.3.0-x86_64.AppImage": "/manus-storage/Stray-Linux-1.3.0-x86_64_88275693.AppImage",
} as const;

export function registerPublicUpdateRedirects(app: express.Express) {
  for (const [stablePath, targetPath] of Object.entries(publicUpdateTargets)) app.get(stablePath, (_req, res) => res.redirect(302, targetPath));
}
