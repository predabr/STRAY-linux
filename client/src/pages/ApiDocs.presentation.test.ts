import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync("client/src/pages/ApiDocs.tsx", "utf8");

describe("documentação da API pública", () => {
  it("documenta a descoberta e os formatos de resposta em recurso ausente", () => {
    expect(source).toContain('["GET", "/api/v1",');
    expect(source).toContain("widget devolve JSON 404");
    expect(source).toContain("badge devolve SVG 404");
  });
});
