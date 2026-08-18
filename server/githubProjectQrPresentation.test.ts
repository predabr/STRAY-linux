import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath: string) => fs.readFileSync(path.join(root, relativePath), "utf8");

describe("apresentação do QR institucional", () => {
  it("mantém o GitHub oficial separado do Pix no site, aplicativo e README", () => {
    const component = read("client/src/components/GithubProjectQr.tsx");
    const site = read("client/src/pages/Support.tsx");
    const app = read("client/src/pages/ProjectSupport.tsx");
    const readme = read("README.md");

    expect(component).toContain("trpc.support.githubQr.useQuery");
    expect(component).toContain("Não é um QR de pagamento");
    expect(site).toContain("<GithubProjectQr");
    expect(app).toContain("<GithubProjectQr");
    expect(readme).toContain("QR Code do GitHub oficial do Stray Linux");
    expect(readme).toContain("não é um QR de pagamento");
  });
});
