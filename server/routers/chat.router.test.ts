import { beforeEach, describe, expect, it, vi } from "vitest";

const harness = vi.hoisted(() => ({
  writes: [] as unknown[],
  session: [{ id: 42 }] as Array<{ id: number }>,
}));

vi.mock("../db", () => ({
  getDb: async () => ({
    select: () => ({
      from: () => ({
        where: () => ({
          orderBy: () => ({ limit: async () => [] }),
          limit: async () => harness.session,
        }),
      }),
    }),
    insert: () => ({
      values: async (value: unknown) => {
        harness.writes.push(value);
        return [{ insertId: 77 }];
      },
    }),
    update: () => ({ set: () => ({ where: async () => undefined }) }),
  }),
}));

vi.mock("../_core/llm", () => ({
  invokeLLM: vi.fn(async () => ({ choices: [{ message: { content: "Resposta baseada no conteúdo interno." } }] })),
}));

import { appRouter } from "../routers";
import { extractContextTerms } from "./chat";

function caller() {
  return appRouter.createCaller({ user: { id: 71, role: "user", isBanned: false } } as any);
}

describe("assistente: continuidade, contexto e autorização", () => {
  beforeEach(() => {
    harness.writes.length = 0;
    harness.session = [{ id: 42 }];
  });

  it("extrai termos significativos em vez de buscar a pergunta inteira como uma frase", () => {
    expect(extractContextTerms("Como instalar Steam pelo Flatpak em outra unidade?")).toEqual(["instalar", "steam", "pelo", "flatpak", "outra", "unidade"]);
  });

  it("reutiliza a sessão da plataforma e grava somente os dois novos turnos", async () => {
    const result = await caller().chat.ask({ sessionId: 42, question: "Como instalar Steam pelo Flatpak?" });
    expect(result.sessionId).toBe(42);
    expect(harness.writes).toHaveLength(2);
    expect(harness.writes[0]).toMatchObject({ sessionId: 42, role: "user" });
    expect(harness.writes[1]).toMatchObject({ sessionId: 42, role: "assistant" });
  });

  it("só permite salvar turnos locais em uma sessão pertencente ao usuário autenticado", async () => {
    await expect(caller().chat.saveLocalTurn({ sessionId: 42, question: "Pergunta local", answer: "Resposta local", citations: [] })).resolves.toEqual({ sessionId: 42 });
    expect(harness.writes[0]).toMatchObject([{ sessionId: 42, role: "user" }, { sessionId: 42, role: "assistant" }]);

    harness.session = [];
    await expect(caller().chat.saveLocalTurn({ sessionId: 99, question: "Pergunta local", answer: "Resposta local", citations: [] })).rejects.toThrow("Sessão de chat não encontrada.");
  });
});
