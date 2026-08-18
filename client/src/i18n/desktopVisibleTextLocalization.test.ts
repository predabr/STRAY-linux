import generatedStaticTranslations from "@/i18n/generatedStaticTranslations.json";
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import ts from "typescript";

const root = join(import.meta.dirname, "../../..");
const excludedPageNames = new Set(["Home.tsx", "Support.tsx", "Uninstall.tsx", "Changelog.tsx", "NotFound.tsx", "ComponentShowcase.tsx"]);
const ignoredTags = new Set(["code", "pre", "kbd", "textarea", "option", "script", "style"]);

function filesIn(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = join(directory, entry.name);
    if (entry.isDirectory()) return filesIn(target);
    return entry.name.endsWith(".tsx") && !excludedPageNames.has(entry.name) ? [target] : [];
  });
}

function tagName(node: ts.Node | undefined): string {
  if (!node) return "";
  if (ts.isJsxElement(node)) return node.openingElement.tagName.getText();
  if (ts.isJsxSelfClosingElement(node)) return node.tagName.getText();
  return "";
}

function isInsideIgnoredTag(node: ts.Node): boolean {
  let current = node.parent;
  while (current) {
    if (ignoredTags.has(tagName(current).toLowerCase())) return true;
    current = current.parent;
  }
  return false;
}

function normalize(value: string) { return value.replace(/\s+/g, " ").trim(); }

function collectMissingDesktopTexts() {
  const catalog = generatedStaticTranslations["pt-BR"];
  const files = [join(root, "client/src/pages"), join(root, "client/src/components/platform"), join(root, "client/src/components/operational")].flatMap(filesIn);
  const missing = new Map<string, Set<string>>();
  const record = (value: string, file: string) => {
    const text = normalize(value);
    if (text.length < 2 || text.length > 300 || !/[\p{L}]/u.test(text) || catalog[text]) return;
    const references = missing.get(text) ?? new Set<string>();
    references.add(relative(root, file));
    missing.set(text, references);
  };
  for (const file of files) {
    const source = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const visit = (node: ts.Node): void => {
      if (ts.isJsxText(node) && !isInsideIgnoredTag(node)) record(node.getText(source), file);
      if (ts.isJsxAttribute(node) && ["aria-label", "placeholder", "title"].includes(node.name.text) && node.initializer && ts.isStringLiteral(node.initializer)) record(node.initializer.text, file);
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
  return [...missing.entries()].map(([text, sources]) => `${text} (${[...sources].join(", ")})`);
}

describe("desktop visible text localization", () => {
  it("covers visible JSX text and accessibility labels from desktop screens in the static catalog", () => {
    expect(collectMissingDesktopTexts()).toEqual([]);
  });
});
