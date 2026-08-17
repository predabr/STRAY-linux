#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const result = spawnSync("pnpm", ["audit", "--json"], { encoding: "utf8" });
let report;
try {
  report = JSON.parse(result.stdout);
} catch {
  console.error(result.stdout || result.stderr || "pnpm audit não produziu JSON válido");
  process.exit(result.status ?? 1);
}

const advisories = Object.values(report.advisories ?? {});
const blocking = advisories.filter((advisory) => {
  const isHighOrCritical = advisory.severity === "high" || advisory.severity === "critical";
  const isKnownUnpatchedElectronExtractZip =
    advisory.module_name === "extract-zip" &&
    advisory.patched_versions === "<0.0.0" &&
    (advisory.findings ?? []).some((finding) => finding.paths?.some((path) => path.includes("electron@")));
  return isHighOrCritical && !isKnownUnpatchedElectronExtractZip;
});

for (const advisory of advisories) {
  const marker = blocking.includes(advisory) ? "BLOCK" : "REVIEW";
  console.log(`[${marker}] ${advisory.severity} ${advisory.module_name}: ${advisory.title ?? "advisory"}`);
  if (marker === "REVIEW") console.log(`  patched: ${advisory.patched_versions ?? "none published"}`);
}

if (blocking.length > 0) {
  console.error(`\n${blocking.length} advisory(s) high/critical require remediation.`);
  process.exit(1);
}

console.log("\nDependency policy passed: no unreviewed high/critical advisory remains.");
