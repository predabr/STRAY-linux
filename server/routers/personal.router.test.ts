import { beforeEach, describe, expect, it, vi } from "vitest";

const harness = vi.hoisted(() => ({ writes: [] as unknown[] }));

vi.mock("../db", () => ({
  getDb: async () => ({
    insert: () => ({ values: async (value: unknown) => { harness.writes.push(value); return [{ insertId: 88 }]; } }),
  }),
}));

import { appRouter } from "../routers";

function caller() {
  return appRouter.createCaller({ user: { id: 71, role: "user", isBanned: false } } as any);
}

describe("ações pessoais persistentes", () => {
  beforeEach(() => { harness.writes.length = 0; });

  it("cria report autenticado com vínculo ao conteúdo e status aberto", async () => {
    const result = await caller().user.reports.create({ subjectType: "game", subjectId: 12, type: "incorrect_information", description: "A fonte do catálogo aponta para uma informação desatualizada." });
    expect(result).toEqual({ id: 88, status: "open" });
    expect(harness.writes[0]).toMatchObject({ reporterId: 71, subjectType: "game", subjectId: 12, type: "incorrect_information" });
  });

  it("registra uma consulta LinuxFix no histórico pessoal", async () => {
    await expect(caller().user.linuxFixHistory.record({ fixId: 9 })).resolves.toEqual({ success: true });
    expect(harness.writes[0]).toMatchObject({ userId: 71, fixId: 9 });
  });
});
