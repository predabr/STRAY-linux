import { describe, expect, it } from "vitest";
import { publicUpdateTargets } from "./publicUpdates";

describe("feed de atualização público", () => {
  it("mantém blockmap e cinco artefatos 1.1.13 sob caminhos estáveis", () => {
    expect(Object.keys(publicUpdateTargets)).toHaveLength(6);
    expect(publicUpdateTargets["/updates/Stray-Linux-1.1.13-Setup.exe"]).toBe("/manus-storage/Stray-Linux-1.1.13-Setup_f3e1e60e.exe");
    expect(Object.values(publicUpdateTargets).every((target) => target.includes("1.1.13"))).toBe(true);
  });
});
