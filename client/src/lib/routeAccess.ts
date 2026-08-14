const accountRoutePrefixes = ["/dashboard", "/admin", "/assistant", "/scanner"] as const;

export function normalizeRoute(location: string): string {
  const pathOnly = location.split("?")[0]?.split("#")[0];
  return pathOnly || "/";
}

export function routeRequiresAccount(location: string): boolean {
  const path = normalizeRoute(location);
  return accountRoutePrefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}
