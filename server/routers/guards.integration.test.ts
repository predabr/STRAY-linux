import { describe, expect, it } from "vitest";
import { appRouter } from "../routers";

function caller(role: "user" | "moderator" | "admin", isBanned = false) {
  return appRouter.createCaller({ user: { id: 900001, role, isBanned } } as any);
}

describe("guards tRPC de procedimentos críticos", () => {
  it("impede que usuário comum leia a visão administrativa", async () => {
    await expect(caller("user").admin.overview()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("impede que usuário comum inicie revisão de benchmark", async () => {
    await expect(caller("user").benchmarks.review({ id: 1, decision: "verified", reviewNote: "Revisão técnica com evidência suficiente." })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("permite que o moderador alcance a validação do procedimento sem executar mutação", async () => {
    await expect(caller("moderator").benchmarks.review({ id: 1, decision: "verified", reviewNote: "x" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("bloqueia operações pessoais de conta banida antes do acesso ao banco", async () => {
    await expect(caller("user", true).user.reports.list()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
