export type BenchmarkEvidenceRow = {
  gpu: string;
  cpu: string;
  distribution: string;
  averageFps: number | null;
};

export type BenchmarkComparisonGroup = {
  label: string;
  averageFps: number;
  sampleSize: number;
  cpuLabels: string[];
  distributions: string[];
};

export function groupBenchmarkEvidence(rows: BenchmarkEvidenceRow[]): BenchmarkComparisonGroup[] {
  const buckets: Record<string, { total: number; sampleSize: number; cpuLabels: string[]; distributions: string[] }> = {};
  rows.forEach((row) => {
    if (row.averageFps === null || !Number.isFinite(row.averageFps)) return;
    const bucket = buckets[row.gpu] ?? { total: 0, sampleSize: 0, cpuLabels: [], distributions: [] };
    bucket.total += row.averageFps;
    bucket.sampleSize += 1;
    if (bucket.cpuLabels.indexOf(row.cpu) === -1) bucket.cpuLabels.push(row.cpu);
    if (bucket.distributions.indexOf(row.distribution) === -1) bucket.distributions.push(row.distribution);
    buckets[row.gpu] = bucket;
  });
  return Object.keys(buckets)
    .map((label) => ({ label, averageFps: buckets[label].total / buckets[label].sampleSize, sampleSize: buckets[label].sampleSize, cpuLabels: buckets[label].cpuLabels, distributions: buckets[label].distributions }))
    .sort((left, right) => right.averageFps - left.averageFps);
}
