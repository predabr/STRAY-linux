import { SUPPORTED_LOCALES } from "@/contexts/LanguageContext";
import { roadmapCopy } from "./roadmapCopy";
import { describe, expect, it } from "vitest";

describe("cópias tipadas do Roadmap", () => {
  it("cobre navegação, estados, resumo e limite nas 11 localidades", () => {
    for (const locale of SUPPORTED_LOCALES) {
      const copy = roadmapCopy[locale];
      expect(copy.nav.trim()).not.toBe("");
      expect(copy.title.trim()).not.toBe("");
      expect(copy.planning.trim()).not.toBe("");
      expect(copy.building.trim()).not.toBe("");
      expect(copy.validated.trim()).not.toBe("");
      expect(copy.summary.trim()).not.toBe("");
      expect(copy.disclaimer.trim()).not.toBe("");
    }
  });
});
