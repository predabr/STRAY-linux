import { beforeEach, describe, expect, it, vi } from "vitest";

const harness = vi.hoisted(() => ({ writes: [] as Array<{ operation: string; value: unknown }> }));

vi.mock("../db", () => ({
  getDb: async () => ({
    update: () => ({ set: (value: unknown) => ({ where: async () => { harness.writes.push({ operation: "update", value }); } }) }),
    insert: () => ({ values: async (value: unknown) => { harness.writes.push({ operation: "insert", value }); return [{ insertId: 77 }]; } }),
    select: () => ({ from: () => ({ where: () => ({ limit: async () => [] }) }) }),
  }),
}));

import { appRouter } from "../routers";

function caller(role: "moderator" | "admin") {
  return appRouter.createCaller({ user: { id: 44, role, isBanned: false } } as any);
}

describe("mutações críticas de moderação e administração", () => {
  beforeEach(() => { harness.writes.length = 0; });

  it("registra revisão verificada e cria trilha de auditoria", async () => {
    const result = await caller("moderator").benchmarks.review({ id: 20, decision: "verified", reviewNote: "Medição analisada com fonte declarada." });
    expect(result).toEqual({ success: true, status: "verified" });
    expect(harness.writes).toHaveLength(2);
    expect(harness.writes[0]).toMatchObject({ operation: "update", value: { verificationStatus: "verified", provenance: "verified", reviewedById: 44 } });
    expect(harness.writes[1].operation).toBe("insert");
  });

  it("rebaixa benchmark rejeitado para proveniência comunitária e registra auditoria", async () => {
    const result = await caller("moderator").benchmarks.review({ id: 21, decision: "rejected", reviewNote: "Fonte insuficiente para verificação." });
    expect(result).toEqual({ success: true, status: "rejected" });
    expect(harness.writes[0]).toMatchObject({ operation: "update", value: { verificationStatus: "rejected", provenance: "community" } });
    expect(harness.writes[1].operation).toBe("insert");
  });

  it("publica jogo administrativo com fonte e trilha de auditoria", async () => {
    const result = await caller("admin").admin.games.save({ slug: "router-test-game", title: "Router Test Game", shortDescription: "Registro isolado de teste.", steamAppId: null, status: "published", sourceUrl: "https://example.org/catalog-source" });
    expect(result).toEqual({ id: 77 });
    expect(harness.writes).toHaveLength(2);
    expect(harness.writes[0]).toMatchObject({ operation: "insert", value: { slug: "router-test-game", status: "published", sourceUrl: "https://example.org/catalog-source" } });
    expect(harness.writes[1].operation).toBe("insert");
  });
});
