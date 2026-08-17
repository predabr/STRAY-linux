import type express from "express";

export const publicUpdateTargets = {
  "/updates/Stray-Linux-1.2.0-Setup.exe": "/manus-storage/Stray-Linux-1.2.0-Setup_66038b5d.exe",
  "/updates/Stray-Linux-1.2.0-Setup.exe.blockmap": "/manus-storage/Stray-Linux-1.2.0-Setup.exe_41dd018f.blockmap",
  "/updates/Stray-Linux-1.2.0-amd64.deb": "/manus-storage/Stray-Linux-1.2.0-amd64_00f9daf4.deb",
  "/updates/Stray-Linux-1.2.0-x86_64.rpm": "/manus-storage/Stray-Linux-1.2.0-x86_64_2b1128da.rpm",
  "/updates/Stray-Linux-1.2.0-x64.pacman": "/manus-storage/Stray-Linux-1.2.0-x64_9be1b372.pacman",
  "/updates/Stray-Linux-1.2.0-x86_64.AppImage": "/manus-storage/Stray-Linux-1.2.0-x86_64_96796cf3.AppImage",
} as const;

export function registerPublicUpdateRedirects(app: express.Express) {
  for (const [stablePath, targetPath] of Object.entries(publicUpdateTargets)) app.get(stablePath, (_req, res) => res.redirect(302, targetPath));
}
