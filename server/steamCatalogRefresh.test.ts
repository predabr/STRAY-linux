import { describe, expect, it } from "vitest";
import { parseSteamCatalogApps, parseSteamCatalogPage, slugifySteamTitle } from "./lib/steamWebApi";

describe("catálogo Steam documentado", () => {
  it("aceita somente apps válidos da resposta IStoreService", () => {
    expect(parseSteamCatalogApps({ response: { apps: [{ appid: 620, name: "Portal 2", last_modified: 100 }, { appid: "x", name: "Inválido" }, { appid: 1, name: "" }] } })).toEqual([{ appId: 620, name: "Portal 2", lastModified: 100, priceChangeNumber: null }]);
  });
  it("gera slug estável sem usar mídia ou descrição de loja", () => expect(slugifySteamTitle("Açúcar & Ação!")).toBe("acucar-acao"));
  it("preserva a paginação indicada pela resposta oficial", () => {
    expect(parseSteamCatalogPage({ response: { apps: [{ appid: 620, name: "Portal 2" }], have_more_results: true, last_appid: 620 } })).toMatchObject({ haveMoreResults: true, lastAppId: 620 });
  });
});
