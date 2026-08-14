import fs from "node:fs";
import path from "node:path";

const sourcePath = path.resolve("tmp/ui-static-strings.json");
const outputPath = path.resolve("client/src/i18n/generatedStaticTranslations.json");
const locales = {
  en: "English", es: "Spanish", fr: "French", de: "German", it: "Italian", ru: "Russian", "zh-CN": "Simplified Chinese", ja: "Japanese", ko: "Korean", ar: "Arabic",
};
const endpoint = `${process.env.OPENAI_API_BASE}/chat/completions`;
const key = process.env.OPENAI_API_KEY;
if (!key || !process.env.OPENAI_API_BASE) throw new Error("O proxy de tradução não está configurado.");
const entries = JSON.parse(fs.readFileSync(sourcePath, "utf8")).map((item) => item.text);

async function translateChunk(locale, language, chunk) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "gpt-5-mini", max_completion_tokens: 12000, messages: [
      { role: "system", content: "You are a localization specialist for a Linux gaming desktop application. Translate only visible UI text. Preserve exactly: product names Stray Linux, GameHub, LinuxFix, Steam, Proton, Wine, Vulkan, Mesa, URL fragments, command-line code, keyboard shortcuts, variables in {braces}, template placeholders, versions, acronyms, and numbers. Do not invent features or change technical meaning. Return valid JSON only." },
      { role: "user", content: `Translate every item from Brazilian Portuguese to ${language}. Return one JSON object whose keys are the ORIGINAL strings copied byte-for-byte and whose values are the translations. Do not omit or add keys.\n\n${JSON.stringify(chunk)}` },
    ] }),
  });
  if (!response.ok) throw new Error(`Falha de tradução ${locale}: HTTP ${response.status}.`);
  const payload = await response.json();
  const raw = payload?.choices?.[0]?.message?.content;
  if (typeof raw !== "string") throw new Error(`Resposta vazia para ${locale}.`);
  const cleaned = raw.replace(/^```json\s*/i, "").replace(/\s*```$/, "");
  const translated = JSON.parse(cleaned);
  const expected = new Set(chunk);
  if (Object.keys(translated).length !== chunk.length || Object.keys(translated).some((item) => !expected.has(item)) || Object.values(translated).some((item) => typeof item !== "string" || !item.trim())) throw new Error(`Cobertura incompleta para ${locale}.`);
  return translated;
}

async function translate(locale, language) {
  const chunks = Array.from({ length: Math.ceil(entries.length / 70) }, (_, index) => entries.slice(index * 70, (index + 1) * 70));
  const translated = {};
  for (let index = 0; index < chunks.length; index += 1) {
    console.error(`Traduzindo ${locale}: lote ${index + 1}/${chunks.length}…`);
    Object.assign(translated, await translateChunk(locale, language, chunks[index]));
  }
  return translated;
}

const output = { "pt-BR": Object.fromEntries(entries.map((item) => [item, item])) };
for (const [locale, language] of Object.entries(locales)) {
  output[locale] = await translate(locale, language);
}
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
console.log(JSON.stringify({ locales: Object.keys(output).length, strings: entries.length, output: outputPath }, null, 2));
