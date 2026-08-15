import { describe, expect, it } from "vitest";
import { staticTranslationCatalog, SUPPORTED_LOCALES, translationCatalog } from "../client/src/contexts/LanguageContext";

describe("catálogo de idiomas", () => {
  it("mantém onze localidades e todas as chaves compartilhadas traduzidas", () => {
    const referenceKeys = Object.keys(translationCatalog["pt-BR"]).sort();
    expect(SUPPORTED_LOCALES).toHaveLength(11);
    for (const locale of SUPPORTED_LOCALES) {
      expect(Object.keys(translationCatalog[locale]).sort()).toEqual(referenceKeys);
      expect(Object.values(translationCatalog[locale]).every((text) => text.trim().length > 0)).toBe(true);
    }
  });

  it("mantém os textos estáticos de interface completos em cada localidade", () => {
    const referenceKeys = Object.keys(staticTranslationCatalog["pt-BR"]).sort();
    expect(referenceKeys).toHaveLength(481);
    for (const locale of SUPPORTED_LOCALES) {
      expect(Object.keys(staticTranslationCatalog[locale]).sort()).toEqual(referenceKeys);
      expect(Object.values(staticTranslationCatalog[locale]).every((text) => text.trim().length > 0)).toBe(true);
    }
  });
});
