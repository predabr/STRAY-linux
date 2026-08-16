import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "../..");

describe("runtime desktop de produção", () => {
  it("não importa Vite estaticamente no processo do servidor e usa servidor estático próprio", () => {
    const serverEntry = fs.readFileSync(path.join(root, "server/_core/index.ts"), "utf8");
    const staticServer = fs.readFileSync(path.join(root, "server/_core/static.ts"), "utf8");

    expect(serverEntry).toContain('import { serveStatic } from "./static";');
    expect(serverEntry).toContain('await import("./vite")');
    expect(serverEntry).not.toContain('import { serveStatic, setupVite } from "./vite"');
    expect(staticServer).toContain("express.static(distPath)");
  });
});
