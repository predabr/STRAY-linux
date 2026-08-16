import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "../..");

describe("runtime desktop de produção", () => {
  it("mantém Vite e sua configuração fora do entrypoint empacotado de produção", () => {
    const serverEntry = fs.readFileSync(path.join(root, "server/_core/index.ts"), "utf8");
    const staticServer = fs.readFileSync(path.join(root, "server/_core/static.ts"), "utf8");
    const devEntry = fs.readFileSync(path.join(root, "server/_core/dev.ts"), "utf8");

    expect(serverEntry).toContain('import { serveStatic } from "./static";');
    expect(serverEntry).toContain("export async function startServer");
    expect(serverEntry).not.toContain('import("./vite")');
    expect(serverEntry).not.toContain('from "./vite"');
    expect(devEntry).toContain('import { setupVite } from "./vite";');
    expect(devEntry).toContain("startServer(setupVite)");
    expect(staticServer).toContain("express.static(distPath)");
  });
});
