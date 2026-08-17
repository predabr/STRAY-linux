type RouteLoader = () => Promise<unknown>;

const routeLoaders: Array<{ prefix: string; load: RouteLoader }> = [
  { prefix: "/dashboard", load: () => import("@/pages/Dashboard") },
  { prefix: "/games", load: () => import("@/pages/Games") },
  { prefix: "/library", load: () => import("@/pages/Library") },
  { prefix: "/linuxfix", load: () => import("@/pages/Knowledge") },
  { prefix: "/assistant", load: () => import("@/pages/Assistant") },
  { prefix: "/scanner", load: () => import("@/pages/Scanner") },
  { prefix: "/diagnostics", load: () => import("@/pages/Diagnostics") },
  { prefix: "/performance", load: () => import("@/pages/Performance") },
  { prefix: "/mods", load: () => import("@/pages/Mods") },
  { prefix: "/compare", load: () => import("@/pages/Compare") },
  { prefix: "/benchmark", load: () => import("@/pages/Benchmark") },
  { prefix: "/setup", load: () => import("@/pages/Knowledge") },
  { prefix: "/snapshots", load: () => import("@/pages/Snapshots") },
  { prefix: "/system-graph", load: () => import("@/pages/SystemGraph") },
  { prefix: "/system-timeline", load: () => import("@/pages/SystemTimeline") },
  { prefix: "/preflight", load: () => import("@/pages/GamePreflight") },
  { prefix: "/regression", load: () => import("@/pages/Regression") },
  { prefix: "/recovery", load: () => import("@/pages/RecoveryCenter") },
  { prefix: "/logs", load: () => import("@/pages/LogsCenter") },
  { prefix: "/notifications", load: () => import("@/pages/NotificationsCenter") },
  { prefix: "/controllers", load: () => import("@/pages/Controllers") },
  { prefix: "/settings", load: () => import("@/pages/SettingsCenter") },
];

const preloaded = new Set<string>();

export function preloadRoute(href: string) {
  const route = routeLoaders.find((entry) => href === entry.prefix || href.startsWith(`${entry.prefix}/`));
  if (!route || preloaded.has(route.prefix)) return;
  preloaded.add(route.prefix);
  void route.load().catch(() => preloaded.delete(route.prefix));
}
