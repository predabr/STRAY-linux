import { describe, expect, it } from "vitest";
import { appRouter } from "../routers";

describe("brand.get", () => {
  it("expõe o título configurado ao cliente pelo endpoint leve de marca", async () => {
    const result = await appRouter.createCaller({} as any).brand.get();
    expect(result.title).toBe("Stray Linux");
  });
});
