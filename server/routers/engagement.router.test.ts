import { describe, expect, it } from "vitest";
import { appRouter } from "../routers";

describe("engagement router", () => {
  it("bloqueia voto LinuxFix sem uma conta autenticada", async () => {
    const caller = appRouter.createCaller({ user: null } as any);
    await expect(caller.engagement.linuxFix.vote({ fixId: 1, value: 1 })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejeita valores de voto fora da escala suportada", async () => {
    const caller = appRouter.createCaller({ user: { id: 1, role: "user", isBanned: false } } as any);
    await expect(caller.engagement.linuxFix.vote({ fixId: 1, value: 0 as never })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("rejeita comentários curtos antes de tentar persistir", async () => {
    const caller = appRouter.createCaller({ user: { id: 1, role: "user", isBanned: false } } as any);
    await expect(caller.engagement.linuxFix.comment({ fixId: 1, body: "curto" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
