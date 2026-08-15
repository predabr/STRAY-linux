import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

const { describeExternalGameDirectory } = require("../desktop/bin/stray-library.cjs") as { describeExternalGameDirectory(directory: string): { id: string; name: string; launcher: string; store: string; coverUrl: null } };
const temporaryDirectories: string[] = [];
afterEach(() => temporaryDirectories.splice(0).forEach((directory) => fs.rmSync(directory, { recursive: true, force: true })));

describe("biblioteca externa local", () => {
  it("descreve somente uma pasta escolhida, sem inferir origem ou procurar mídia", () => {
    const gameFolder = fs.mkdtempSync(path.join(os.tmpdir(), "stray-external-game-"));
    temporaryDirectories.push(gameFolder);
    const game = describeExternalGameDirectory(gameFolder);
    expect(game).toMatchObject({ name: path.basename(gameFolder), launcher: "external", store: "external", coverUrl: null });
    expect(game.id).toMatch(/^external:[a-f0-9]{16}$/);
  });

  it("recusa um caminho que não seja uma pasta existente", () => {
    expect(() => describeExternalGameDirectory(path.join(os.tmpdir(), "stray-directory-not-found"))).toThrow("Pasta de jogo inválida.");
  });
});
