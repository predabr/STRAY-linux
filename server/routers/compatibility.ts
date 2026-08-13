import { and, desc, eq, inArray, isNull } from "drizzle-orm";
import { z } from "zod";
import { compatibilityRecords, compatibilityReports, linuxFixes } from "../../drizzle/schema";
import { publicProcedure, router } from "../_core/trpc";
import { requireDatabase } from "./_guards";

const environmentInput = z.object({
  gameId: z.number().int().positive(),
  gameVersion: z.string().trim().max(160).nullable().optional(),
  distributionId: z.number().int().positive().nullable().optional(),
  distributionVersionId: z.number().int().positive().nullable().optional(),
  cpuId: z.number().int().positive().nullable().optional(),
  gpuId: z.number().int().positive().nullable().optional(),
  kernelVersion: z.string().trim().max(160).nullable().optional(),
  driverVersion: z.string().trim().max(160).nullable().optional(),
  protonVersion: z.string().trim().max(160).nullable().optional(),
  wineVersion: z.string().trim().max(160).nullable().optional(),
  runtimeVersion: z.string().trim().max(160).nullable().optional(),
});

const factors = [
  { input: "gameVersion", record: "gameVersion", label: "versão do jogo", weight: 12 },
  { input: "distributionId", record: "distributionId", label: "distribuição", weight: 24 },
  { input: "distributionVersionId", record: "distributionVersionId", label: "versão da distribuição", weight: 8 },
  { input: "cpuId", record: "cpuId", label: "CPU", weight: 10 },
  { input: "gpuId", record: "gpuId", label: "GPU", weight: 24 },
  { input: "kernelVersion", record: "kernelConstraint", label: "kernel", weight: 9 },
  { input: "driverVersion", record: "driverConstraint", label: "driver", weight: 9 },
  { input: "protonVersion", record: "protonVersion", label: "Proton", weight: 7 },
  { input: "wineVersion", record: "wineVersion", label: "Wine", weight: 4 },
  { input: "runtimeVersion", record: "runtimeVersion", label: "runtime", weight: 5 },
] as const;

const normalized = (value: unknown) => typeof value === "string" ? value.trim().toLocaleLowerCase("pt-BR") : value;

export function rankCompatibilityRecord(record: typeof compatibilityRecords.$inferSelect, input: z.infer<typeof environmentInput>) {
  let totalWeight = 0;
  let matchedWeight = 0;
  const missingFactors: string[] = [];
  const conflictingFactors: string[] = [];
  const evaluatedFactors: Array<{ key: string; label: string; required: string | number; actual: string | number | null; state: "match" | "missing" | "conflict" }> = [];

  for (const factor of factors) {
    const required = record[factor.record];
    if (required === null || required === undefined || required === "") continue;
    totalWeight += factor.weight;
    const actual = input[factor.input];
    if (actual === null || actual === undefined || actual === "") {
      missingFactors.push(factor.label);
      evaluatedFactors.push({ key: factor.input, label: factor.label, required, actual: null, state: "missing" });
      continue;
    }
    if (normalized(actual) === normalized(required)) {
      matchedWeight += factor.weight;
      evaluatedFactors.push({ key: factor.input, label: factor.label, required, actual, state: "match" });
    } else {
      conflictingFactors.push(factor.label);
      evaluatedFactors.push({ key: factor.input, label: factor.label, required, actual, state: "conflict" });
    }
  }

  const coverage = totalWeight === 0 ? 0 : Math.round((matchedWeight / totalWeight) * 100);
  const classification = conflictingFactors.length > 0
    ? "conflict"
    : totalWeight === 0
      ? "general"
      : missingFactors.length === 0 && matchedWeight === totalWeight
        ? "exact"
        : matchedWeight > 0
          ? "partial"
          : "general";
  const priority = classification === "exact" ? 4 : classification === "partial" ? 3 : classification === "general" ? 2 : 1;
  return { record, classification, coverage, missingFactors, conflictingFactors, evaluatedFactors, priority };
}

export function explainCompatibilityMatch(match: ReturnType<typeof rankCompatibilityRecord>) {
  return {
    result: match.record.level,
    confidence: match.record.confidence,
    provenance: match.record.provenance,
    environmentCoverage: match.coverage,
    classification: match.classification,
    sourceUrl: match.record.sourceUrl,
    reviewedAt: match.record.reviewedAt,
    factors: match.evaluatedFactors,
    limitations: [
      ...(match.missingFactors.length ? [`Ambiente sem dados para: ${match.missingFactors.join(", ")}.`] : []),
      ...(match.conflictingFactors.length ? [`Conflito com o registro em: ${match.conflictingFactors.join(", ")}.`] : []),
    ],
  };
}

export const compatibilityRouter = router({
  forEnvironment: publicProcedure.input(environmentInput).query(async ({ input }) => {
    const db = await requireDatabase();
    const [records, knownIssues] = await Promise.all([
      db.select().from(compatibilityRecords).where(eq(compatibilityRecords.gameId, input.gameId)).orderBy(desc(compatibilityRecords.reviewedAt), desc(compatibilityRecords.createdAt)).limit(48),
      db.select({ id: linuxFixes.id, title: linuxFixes.title, slug: linuxFixes.slug, symptoms: linuxFixes.symptoms, confidence: linuxFixes.confidence, provenance: linuxFixes.provenance, sourceUrl: linuxFixes.sourceUrl }).from(linuxFixes).where(and(eq(linuxFixes.gameId, input.gameId), eq(linuxFixes.status, "published"), isNull(linuxFixes.deletedAt))).orderBy(desc(linuxFixes.reviewedAt)).limit(8),
    ]);
    if (!records.length) {
      return {
        available: false as const,
        reason: "Não há registro de compatibilidade publicado para este jogo.",
        method: "Nenhuma inferência é feita quando não existe registro com proveniência.",
      };
    }

    const ranked = records.map((record) => rankCompatibilityRecord(record, input)).sort((a, b) => b.priority - a.priority || b.coverage - a.coverage);
    const selected = ranked[0];
    const communityReports = await db.select({ id: compatibilityReports.id, compatibilityId: compatibilityReports.compatibilityId, title: compatibilityReports.title, body: compatibilityReports.body, isConfirmed: compatibilityReports.isConfirmed, createdAt: compatibilityReports.createdAt }).from(compatibilityReports).where(inArray(compatibilityReports.compatibilityId, records.map((record) => record.id))).orderBy(desc(compatibilityReports.createdAt)).limit(12);
    return {
      available: true as const,
      method: "A decisão vem do registro publicado. A cobertura expressa somente a correspondência de fatores declarados no ambiente, não uma previsão de FPS ou garantia de funcionamento.",
      match: {
        classification: selected.classification,
        coverage: selected.coverage,
        missingFactors: selected.missingFactors,
        conflictingFactors: selected.conflictingFactors,
      },
      assessment: explainCompatibilityMatch(selected),
      record: selected.record,
      knownIssues,
      communityReports,
      alternatives: ranked.slice(1, 5).map(({ record, classification, coverage, missingFactors, conflictingFactors, evaluatedFactors }) => ({ record, classification, coverage, missingFactors, conflictingFactors, evaluatedFactors })),
    };
  }),
});
