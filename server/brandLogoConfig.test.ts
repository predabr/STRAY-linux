import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");
const read = (relativePath: string) => fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
const newLogoPath = "/manus-storage/stray-linux-logo-v2_0835fafe.png";

describe("configuração da logo pública", () => {
  it("expõe a nova marca em um ativo PNG público acessível", async () => {
    const logoUrl = process.env.VITE_APP_LOGO;
    expect(logoUrl).toBe(`https://linuxtoys-ckuyvpj5.manus.space${newLogoPath}`);

    const response = await fetch(logoUrl!, { method: "HEAD" });
    expect(response.ok).toBe(true);
    expect(response.headers.get("content-type")).toContain("image/png");
  });

  it("usa a nova marca no site, no shell do aplicativo, nos metadados e no favicon", () => {
    expect(read("client/src/components/platform/StrayBrandMark.tsx")).toContain(newLogoPath);
    expect(read("client/src/pages/Home.tsx")).toContain(newLogoPath);
    const document = read("client/index.html");
    expect(document).toContain(newLogoPath);
    expect(document).toContain('rel="icon" href="/favicon.ico"');
    expect(fs.statSync(path.join(projectRoot, "client/public/favicon.ico")).size).toBeGreaterThan(10_000);
  });
});
