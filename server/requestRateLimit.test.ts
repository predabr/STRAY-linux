import { describe, expect, it } from "vitest";
import { createRateWindowGate } from "./lib/requestRateLimit";

describe("limite de requisições", () => {
  it("bloqueia somente após o limite e libera uma nova janela", () => {
    let current = 0;
    const gate = createRateWindowGate({ windowMs: 60_000, maxRequests: 2, now: () => current });
    expect(gate("127.0.0.1").allowed).toBe(true);
    expect(gate("127.0.0.1").allowed).toBe(true);
    expect(gate("127.0.0.1")).toMatchObject({ allowed: false, retryAfterSeconds: 60 });
    current = 60_000;
    expect(gate("127.0.0.1").allowed).toBe(true);
  });
});
