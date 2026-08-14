import fs from "node:fs";
import path from "node:path";

const root = path.resolve("client/src");
const output = path.resolve("tmp/ui-static-strings.json");
const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(target);
    else if (/\.(tsx|ts)$/.test(entry.name) && !target.includes("/components/ui/") && !target.includes("/hooks/") && !target.endsWith("LanguageContext.tsx") && !target.endsWith("ComponentShowcase.tsx")) files.push(target);
  }
}
function collect(value, source, bucket) {
  const text = value.replace(/\s+/g, " ").trim();
  if (text.length < 2 || text.length > 240 || /^[\d\s.,:+/()×@—–-]+$/.test(text) || /^(true|false|null|undefined|className|key|value)$/i.test(text) || /^(?:[?:;!.=@$]|const\b|return\b|if\b|else\b|[a-z]+\.|[\w.]+\s*(?:\?\?|\|\||&&|=>))/.test(text) || /[{};]/.test(text)) return;
  bucket.set(text, [...(bucket.get(text) ?? []), source]);
}
walk(root);
const strings = new Map();
for (const file of files) {
  const body = fs.readFileSync(file, "utf8");
  const source = path.relative(process.cwd(), file);
  for (const match of body.matchAll(/>([^<>{}\n]{2,240})</g)) collect(match[1], source, strings);
  for (const match of body.matchAll(/(?:placeholder|aria-label|title|alt)="([^"]{2,240})"/g)) collect(match[1], source, strings);
  for (const match of body.matchAll(/(?:placeholder|aria-label|title|alt)=\{`([^`]{2,240})`\}/g)) collect(match[1], source, strings);
}
const rows = [...strings.entries()].map(([text, sources]) => ({ text, sources: [...new Set(sources)] })).sort((a, b) => a.text.localeCompare(b.text, "pt-BR"));
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(rows, null, 2));
console.log(JSON.stringify({ files: files.length, strings: rows.length, output }, null, 2));
