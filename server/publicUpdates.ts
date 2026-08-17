import type express from "express";

export const publicUpdateTargets = {
  "/updates/Stray-Linux-1.1.13-Setup.exe": "/manus-storage/Stray-Linux-1.1.13-Setup_f3e1e60e.exe",
  "/updates/Stray-Linux-1.1.13-Setup.exe.blockmap": "/manus-storage/Stray-Linux-1.1.13-Setup.exe_8848e572.blockmap",
  "/updates/Stray-Linux-1.1.13-amd64.deb": "/manus-storage/Stray-Linux-1.1.13-amd64_4cc6cfcc.deb",
  "/updates/Stray-Linux-1.1.13-x86_64.rpm": "/manus-storage/Stray-Linux-1.1.13-x86_64_e4008bd7.rpm",
  "/updates/Stray-Linux-1.1.13-x64.pacman": "/manus-storage/Stray-Linux-1.1.13-x64_680cc9f6.pacman",
  "/updates/Stray-Linux-1.1.13-x86_64.AppImage": "/manus-storage/Stray-Linux-1.1.13-x86_64_5f65e407.AppImage",
} as const;

export function registerPublicUpdateRedirects(app: express.Express) {
  for (const [stablePath, targetPath] of Object.entries(publicUpdateTargets)) app.get(stablePath, (_req, res) => res.redirect(302, targetPath));
}
