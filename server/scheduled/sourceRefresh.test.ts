import { describe, expect, it } from "vitest";
import { isCronTask } from "./sourceRefresh";

describe("contrato de refresh agendado", () => {
  it("aceita somente uma identidade cron com taskUid não vazio", () => {
    expect(isCronTask({ isCron: true, taskUid: "task_123" })).toBe(true);
    expect(isCronTask({ isCron: true })).toBe(false);
    expect(isCronTask({ isCron: false, taskUid: "task_123" })).toBe(false);
  });
});
