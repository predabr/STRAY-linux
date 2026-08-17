import { describe, expect, it } from "vitest";
import { publicUpdateTargets } from "./publicUpdates";

describe("feed de atualização público", () => {
  it("mantém blockmap e cinco artefatos 1.2.0 sob caminhos estáveis", () => {
    expect(Object.keys(publicUpdateTargets)).toHaveLength(6);
    expect(publicUpdateTargets["/updates/Stray-Linux-1.2.0-Setup.exe"]).toBe("/manus-storage/Stray-Linux-1.2.0-Setup_36d0ad57.exe");
    expect(Object.values(publicUpdateTargets).every((target) => target.includes("1.2.0"))).toBe(true);
  });
});
