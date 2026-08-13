export type PlatformRole = "user" | "moderator" | "admin";
export type BenchmarkDecision = "verified" | "rejected";

export function hasModerationAccess(role: PlatformRole) {
  return role === "moderator" || role === "admin";
}

export function hasAdministrationAccess(role: PlatformRole) {
  return role === "admin";
}

export function hasBenchmarkEvidence(input: { sourceUrl?: string | null; evidenceNote?: string | null; results: { averageFps?: number | null }[] }) {
  const hasSource = Boolean(input.sourceUrl?.trim() || input.evidenceNote?.trim());
  const hasAverageFps = input.results.some((result) => typeof result.averageFps === "number" && Number.isFinite(result.averageFps) && result.averageFps > 0);
  return hasSource && hasAverageFps;
}

export function reviewedBenchmarkProvenance(decision: BenchmarkDecision) {
  return decision === "verified" ? "verified" as const : "community" as const;
}

export function canPublishWithSource(status: "draft" | "published" | "archived", sourceUrl?: string | null) {
  return status !== "published" || Boolean(sourceUrl?.trim());
}
