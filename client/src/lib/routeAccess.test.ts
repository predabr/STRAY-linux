import { describe, expect, it } from "vitest";
import { normalizeRoute, routeRequiresAccount } from "./routeAccess";

describe("route access policy", () => {
  it("normalizes query strings and fragments before an access decision", () => {
    expect(normalizeRoute("/games?source=audit#catalog")).toBe("/games");
    expect(normalizeRoute("#intro")).toBe("/");
  });

  it.each(["/", "/games", "/games/steam-123", "/benchmark", "/distros", "/wiki", "/setup", "/linuxfix", "/compare", "/windows", "/status"]) (
    "keeps %s public",
    (route) => expect(routeRequiresAccount(route)).toBe(false),
  );

  it.each(["/dashboard", "/dashboard/settings", "/admin", "/admin/sources", "/assistant", "/scanner"]) (
    "protects %s",
    (route) => expect(routeRequiresAccount(route)).toBe(true),
  );

  it("protects account routes even with query strings", () => {
    expect(routeRequiresAccount("/assistant?mode=local#thread")).toBe(true);
  });
});
