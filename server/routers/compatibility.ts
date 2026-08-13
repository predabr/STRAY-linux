import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { compatibilityRecords } from "../../drizzle/schema";
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

  for (const factor of factors) {
    const required = record[factor.record];
    if (required === null || required === undefined || required === "") continue;
    totalWeight += factor.weight;
    const actual = input[factor.input];
    if (actual === null || actual === undefined || actual === "") {
      missingFactors.push(factor.label);
      continue;
    }
    if (normalized(actual) === normalized(required)) matchedWeight += factor.weight;
    else conflictingFactors.push(factor.label);
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
  return { record, classification, coverage, missingFactors, conflictingFactors, priority };
}

export const compatibilityRouter = router({
  forEnvironment: publicProcedure.input(environmentInput).query(async ({ input }) => {
    const db = await requireDatabase();
    const records = await db.select().from(compatibilityRecords).where(eq(compatibilityRecords.gameId, input.gameId)).orderBy(desc(compatibilityRecords.reviewedAt), desc(compatibilityRecords.createdAt)).limit(48);
    if (!records.length) {
      return {
        available: false as const,
        reason: "Não há registro de compatibilidade publicado para este jogo.",
        method: "Nenhuma inferência é feita quando não existe registro com proveniência.",
      };
    }

    const ranked = records.map((record) => rankCompatibilityRecord(record, input)).sort((a, b) => b.priority - a.priority || b.coverage - a.coverage);
    const selected = ranked[0];
    return {
      available: true as const,
      method: "A classificação compara somente os campos explicitamente declarados no registro. Campos ausentes reduzem a cobertura; conflitos são exibidos e não são convertidos em previsão.",
      match: {
        classification: selected.classification,
        coverage: selected.coverage,
        missingFactors: selected.missingFactors,
        conflictingFactors: selected.conflictingFactors,
      },
      record: selected.record,
      alternatives: ranked.slice(1, 5).map(({ record, classification, coverage, missingFactors, conflictingFactors }) => ({ record, classification, coverage, missingFactors, conflictingFactors })),
    };
  }),
});
