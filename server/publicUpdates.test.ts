import { describe, expect, it } from "vitest";
import { publicUpdateTargets } from "./publicUpdates";

describe("feed de atualização público", () => {
  it("mantém blockmap e cinco artefatos 1.1.12 sob caminhos estáveis", () => {
    expect(Object.keys(publicUpdateTargets)).toHaveLength(6);
    expect(publicUpdateTargets["/updates/Stray-Linux-1.1.12-Setup.exe"]).toBe("/manus-storage/Stray-Linux-1.1.12-Setup_f90915d2.exe");
    expect(Object.values(publicUpdateTargets).every((target) => target.includes("1.1.12"))).toBe(true);
  });
});
