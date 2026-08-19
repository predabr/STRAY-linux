import { describe, expect, it } from "vitest";
import { publicUpdateTargets } from "./publicUpdates";

describe("feed de atualização público", () => {
  it("mantém blockmap e cinco artefatos 1.3.0 sob caminhos estáveis", () => {
    expect(Object.keys(publicUpdateTargets)).toHaveLength(6);
    expect(publicUpdateTargets["/updates/Stray-Linux-1.3.0-Setup.exe"]).toBe("/manus-storage/Stray-Linux-1.3.0-Setup_c4f9bf38.exe");
    expect(publicUpdateTargets["/updates/Stray-Linux-1.3.0-Setup.exe.blockmap"]).toBe("/manus-storage/Stray-Linux-1.3.0-Setup.exe_1c097c89.blockmap");
    expect(Object.values(publicUpdateTargets).every((target) => target.includes("1.3.0"))).toBe(true);
  });
});
