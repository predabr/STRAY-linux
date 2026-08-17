import type { Express } from "express";

export const publicDownloadTargets = {
  "/downloads/stray-linux/windows-x64.exe": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663289073401/hvWZjdCpcxjegBwb.exe",
  "/downloads/stray-linux/debian-amd64.deb": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663289073401/sewnpfplypuhscRe.deb",
  "/downloads/stray-linux/rpm-x64.rpm": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663289073401/VGQPLXStHfkTFUPq.rpm",
  "/downloads/stray-linux/arch-x64.pacman": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663289073401/aCeCPSwiDsOpwktV.pacman",
  "/downloads/stray-linux/linux-x64.AppImage": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663289073401/DtVhWQVFDrpSfXbT.AppImage",
} as const;

export function registerPublicDownloadRedirects(app: Express) {
  for (const [stablePath, targetPath] of Object.entries(publicDownloadTargets)) {
    app.get(stablePath, (_req, res) => res.redirect(302, targetPath));
  }
}
