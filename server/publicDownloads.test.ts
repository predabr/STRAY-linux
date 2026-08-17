import { describe, expect, it } from "vitest";
import { publicDownloadTargets } from "./publicDownloads";

describe("downloads públicos estáveis", () => {
  it("mantém URLs estáveis por plataforma apontando aos cinco artefatos validados da release", () => {
    expect(publicDownloadTargets).toEqual({
      "/downloads/stray-linux/windows-x64.exe": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663289073401/VqVjrOHigDKlSYTC.exe",
      "/downloads/stray-linux/debian-amd64.deb": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663289073401/aofiWiAdYHsgMhMU.deb",
      "/downloads/stray-linux/rpm-x64.rpm": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663289073401/UMHdlePHNbFxNqQW.rpm",
      "/downloads/stray-linux/arch-x64.pacman": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663289073401/fiiPVGUxscDvZuhO.pacman",
      "/downloads/stray-linux/linux-x64.AppImage": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663289073401/KEpvLmpIgwJMpuVM.AppImage",
    });
  });
});
