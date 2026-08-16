import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

const { scanHeroicLibrary } = require("../desktop/bin/stray-library.cjs") as { scanHeroicLibrary(home: string): Array<{ id: string; name: string; launcher: string; store: string; coverUrl: string | null }> };

const temporaryDirectories: string[] = [];
const initialXdgConfigHome = process.env.XDG_CONFIG_HOME;
afterEach(() => {
  temporaryDirectories.splice(0).forEach((directory) => fs.rmSync(directory, { recursive: true, force: true }));
  if (initialXdgConfigHome === undefined) delete process.env.XDG_CONFIG_HOME;
  else process.env.XDG_CONFIG_HOME = initialXdgConfigHome;
});

describe("scanHeroicLibrary", () => {
  it("lê somente um jogo Epic instalado e a capa já referenciada nos metadados locais do Heroic", () => {
    const home = fs.mkdtempSync(path.join(os.tmpdir(), "stray-heroic-"));
    temporaryDirectories.push(home);
    process.env.XDG_CONFIG_HOME = path.join(os.tmpdir(), "stray-unrelated-xdg-config");
    const config = path.join(home, ".config", "heroic", "legendaryConfig", "legendary");
    const installation = path.join(home, "Games", "ExampleGame");
    fs.mkdirSync(path.join(config, "metadata"), { recursive: true });
    fs.mkdirSync(installation, { recursive: true });
    fs.writeFileSync(path.join(config, "installed.json"), JSON.stringify({ ExampleGame: { install_path: installation } }));
    fs.writeFileSync(path.join(config, "metadata", "ExampleGame.json"), JSON.stringify({ metadata: { title: "Example Game", keyImages: [{ type: "DieselGameBoxTall", url: "https://cdn.example.test/example-cover.jpg" }] } }));

    expect(scanHeroicLibrary(home)).toEqual([expect.objectContaining({ id: "heroic:ExampleGame", name: "Example Game", launcher: "heroic", store: "epic", coverUrl: "https://cdn.example.test/example-cover.jpg" })]);
  });

  it("não lista entrada sem pasta de instalação existente", () => {
    const home = fs.mkdtempSync(path.join(os.tmpdir(), "stray-heroic-"));
    temporaryDirectories.push(home);
    const config = path.join(home, ".config", "heroic", "legendaryConfig", "legendary");
    fs.mkdirSync(config, { recursive: true });
    fs.writeFileSync(path.join(config, "installed.json"), JSON.stringify({ MissingGame: { install_path: path.join(home, "missing") } }));

    expect(scanHeroicLibrary(home)).toEqual([]);
  });
});
