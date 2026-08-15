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
import { buildStrayAiSystemPrompt, extractContextTerms } from "./chat";
import { isStrayAiDomainQuestion, STRAY_AI_OUT_OF_SCOPE_RESPONSE } from "../lib/strayAiScope";

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

  it("aceita somente questões do Stray Linux e bloqueia criação de código antes do modelo", async () => {
    expect(isStrayAiDomainQuestion("Como verificar Vulkan no meu PC Linux?")).toBe(true);
    expect(isStrayAiDomainQuestion("Estou no PikaOS: qual guia do Stray devo consultar?")).toBe(true);
    expect(isStrayAiDomainQuestion("Como atualizo o ChimeraOS pela interface Steam?")).toBe(true);
    expect(isStrayAiDomainQuestion("Crie um código para um jogo em Python")).toBe(false);

    const result = await caller().chat.ask({ question: "Crie um código para um jogo em Python" });
    expect(result.answer).toBe(STRAY_AI_OUT_OF_SCOPE_RESPONSE);
    expect(result.context).toEqual({ inScope: false, profileAvailable: false, internalSources: 0 });
    expect(harness.writes).toHaveLength(3);
    expect(harness.writes[2]).toMatchObject({ role: "assistant", content: STRAY_AI_OUT_OF_SCOPE_RESPONSE });
  });

  it("exige diagnóstico estruturado, evidência e limites sem prometer resultado", () => {
    const prompt = buildStrayAiSystemPrompt("PERFIL TÉCNICO ATIVO: indisponível.");
    expect(prompt).toContain("Leitura do caso");
    expect(prompt).toContain("Evidência disponível");
    expect(prompt).toContain("Ações seguras");
    expect(prompt).toContain("Limites");
    expect(prompt).toContain("guia da distribuição ativa");
    expect(prompt).toContain("não invente comandos, compatibilidade, FPS, versões, mídia, causa ou resultado");
  });

  it("reutiliza a sessão da plataforma e grava somente os dois novos turnos", async () => {
    const result = await caller().chat.ask({ sessionId: 42, question: "Como instalar Steam pelo Flatpak?" });
    expect(result.sessionId).toBe(42);
    expect(result.context).toMatchObject({ inScope: true, internalSources: 0 });
    expect(typeof result.context.profileAvailable).toBe("boolean");
    expect(harness.writes).toHaveLength(2);
    expect(harness.writes[0]).toMatchObject({ sessionId: 42, role: "user" });
    expect(harness.writes[1]).toMatchObject({ sessionId: 42, role: "assistant" });
  });

});
