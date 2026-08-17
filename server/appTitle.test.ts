import { describe, expect, it } from "vitest";

describe("título público do app", () => {
  it("mantém o título configurado e responde pelo endpoint público", async () => {
    const title = process.env.VITE_APP_TITLE ?? "Stray Linux";
    const response = await fetch("http://127.0.0.1:3000/");
    expect(title).toBe("Stray Linux");
    expect(response.ok).toBe(true);
  });
});
