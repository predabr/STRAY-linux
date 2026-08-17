import { SUPPORTED_LOCALES } from "@/contexts/LanguageContext";
import { distroProfileCopy } from "@/i18n/distroProfileCopy";
import { homeDiagnosticsCopy } from "@/i18n/homeDiagnosticsCopy";
import { introCopy } from "@/i18n/introCopy";
import { gameCardCopy } from "@/i18n/gameCardCopy";
import { linuxFixContributionCopy, linuxFixCopy, linuxFixModerationCopy } from "@/i18n/linuxFixCopy";
import { landingCopy } from "@/i18n/landingCopy";
import { overviewCopy } from "@/i18n/overviewCopy";
import { productShellCopy } from "@/i18n/productShellCopy";
import { distroRegistry } from "@shared/distro-registry";
import { describe, expect, it } from "vitest";

describe("experience copy", () => {
  it("keeps the distribution profile and opening copy complete in every supported locale", () => {
    for (const locale of SUPPORTED_LOCALES) {
      const profile = distroProfileCopy[locale];
      const intro = introCopy[locale];
      const diagnostics = homeDiagnosticsCopy[locale];
      const shell = productShellCopy[locale];
      const overview = overviewCopy[locale];
      const gameCard = gameCardCopy[locale];
      const linuxFix = linuxFixCopy[locale];
      const contribution = linuxFixContributionCopy[locale];
      const moderation = linuxFixModerationCopy[locale];
      const landing = landingCopy[locale];
      expect(profile.backToAtlas.trim()).not.toBe("");
      expect(profile.bigLinuxTitle.trim()).not.toBe("");
      expect(profile.installArtifact(".deb")).toContain(".deb");
      expect(intro.title.trim()).not.toBe("");
      expect(intro.enableSound.trim()).not.toBe("");
      expect(intro.skip.trim()).not.toBe("");
      expect(diagnostics.title.trim()).not.toBe("");
      expect(diagnostics.previewNote.trim()).not.toBe("");
      expect(diagnostics.credit).not.toMatch(/Henrique|14 anos/i);
      expect(shell.workspace.trim()).not.toBe("");
      expect(shell.status.trim()).not.toBe("");
      expect(overview.title.trim()).not.toBe("");
      expect(overview.scannerAction.trim()).not.toBe("");
      expect(gameCard.catalogRecord.trim()).not.toBe("");
      expect(gameCard.openGame("Stray Linux").trim()).not.toBe("");
      expect(linuxFix.catalogTitle.trim()).not.toBe("");
      expect(linuxFix.kind.inspect.trim()).not.toBe("");
      expect(linuxFix.risk.reversible.trim()).not.toBe("");
      expect(contribution.consent.trim()).not.toBe("");
      expect(contribution.statuses.in_review.trim()).not.toBe("");
      expect(moderation.description.trim()).not.toBe("");
      expect(moderation.accept.trim()).not.toBe("");
      expect(landing.heroMain.trim()).not.toBe("");
      expect(landing.downloadsEyebrow).toContain("1.2.0");
      expect(landing.cards).toHaveLength(3);
      expect(landing.evidenceCards).toHaveLength(3);
    }
  });

  it("publishes exactly one current BigLinux profile through the Pacman family", () => {
    const bigLinuxEntries = distroRegistry.entries.filter((entry) => entry.name === "BigLinux");
    expect(bigLinuxEntries).toHaveLength(1);
    expect(bigLinuxEntries[0]).toMatchObject({
      section: "FAMÍLIA ARCH LINUX",
      family: "Arch e derivadas",
      installer: "pacman",
      support: "package-family",
    });
  });
});
