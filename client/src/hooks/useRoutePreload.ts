import { useCallback } from "react";
import { preloadRoute } from "@/lib/routePreload";

export function useRoutePreload(href: string) {
  const preload = useCallback(() => preloadRoute(href), [href]);
  return { onMouseEnter: preload, onFocus: preload, onTouchStart: preload };
}
