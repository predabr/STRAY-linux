import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { afterEach, describe, expect, it } from "vitest";

describe("biblioteca Steam local", () => {
  const tempRoots: string[] = [];
  afterEach(() => { tempRoots.splice(0).forEach((root) => fs.rmSync(root, { recursive: true, force: true })); });

  it("detecta o caminho padrão da Steam Flatpak e lê apenas o manifesto local", () => {
    const home = fs.mkdtempSync(path.join(os.tmpdir(), "stray-steam-flatpak-"));
    tempRoots.push(home);
    const steamApps = path.join(home, ".var", "app", "com.valvesoftware.Steam", ".local", "share", "Steam", "steamapps");
    fs.mkdirSync(steamApps, { recursive: true });
    fs.writeFileSync(path.join(steamApps, "appmanifest_620.acf"), '"AppState"\n{\n  "appid" "620"\n  "name" "Portal 2"\n  "installdir" "Portal 2"\n}\n', "utf8");
    const raw = execFileSync(process.execPath, [path.resolve(process.cwd(), "desktop/bin/stray-library.cjs"), "--home", home], { encoding: "utf8" });
    expect(JSON.parse(raw).games).toEqual([{ appId: 620, name: "Portal 2", installDir: "Portal 2", libraryPath: steamApps, installationType: "flatpak" }]);
  });
});
