import { describe, expect, it } from "vitest";
import { desktopRouter } from "./router";

describe("Stray AI no modo desktop", () => {
  it("mantém a recusa fora do escopo sem consultar conteúdo local", async () => {
    const caller = desktopRouter.createCaller({} as never);
    const result = await caller.chat.ask({ question: "Crie o código de um jogo de corrida" });
    expect(result.context.inScope).toBe(false);
    expect(result.citations).toEqual([]);
  });
});
