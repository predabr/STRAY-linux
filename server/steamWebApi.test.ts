import { describe, expect, it } from "vitest";
import { countSteamInterfaces } from "./lib/steamWebApi";

describe("metadados de resposta da Steam Web API", () => {
  it("conta interfaces sem depender de estrutura de catálogo ou dados fictícios", () => {
    expect(countSteamInterfaces({ apilist: { interfaces: [{ name: "ISteamApps" }, { name: "ISteamUser" }] } })).toBe(2);
  });

  it("rejeita respostas que não tenham a estrutura documentada", () => {
    expect(() => countSteamInterfaces({ response: {} })).toThrow("lista esperada");
  });
});
