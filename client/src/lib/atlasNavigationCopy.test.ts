import { describe, expect, it } from "vitest";
import { SUPPORTED_LOCALES } from "@/contexts/LanguageContext";
import { atlasNavigationCopy } from "@/i18n/atlasNavigationCopy";

describe("textos de navegação e Atlas", () => {
  it("mantém todos os rótulos novos completos nas onze localidades", () => {
    expect(Object.keys(atlasNavigationCopy).sort()).toEqual([...SUPPORTED_LOCALES].sort());

    for (const locale of SUPPORTED_LOCALES) {
      const copy = atlasNavigationCopy[locale];
      expect(copy.mappedFamily(3).trim()).not.toHaveLength(0);
      expect(Object.entries(copy).filter(([, value]) => typeof value === "string").every(([, value]) => (value as string).trim().length > 0)).toBe(true);
    }
  });
});
