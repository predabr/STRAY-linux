import { describe, expect, it } from "vitest";
import { serverBindingHost } from "./serverBinding";

describe("escuta do servidor", () => {
  it("restringe o servidor embutido ao loopback", () => {
    expect(serverBindingHost("1")).toBe("127.0.0.1");
  });

  it("mantém a hospedagem web sem host forçado", () => {
    expect(serverBindingHost(undefined)).toBeUndefined();
    expect(serverBindingHost("0")).toBeUndefined();
  });
});
