import { Link } from "wouter";
import { useRoutePreload } from "@/hooks/useRoutePreload";
import type { WorkspaceNavigationItem } from "./workspaceTypes";

export function WorkspaceNavItem({ item, location, compact = false }: { item: WorkspaceNavigationItem; location: string; compact?: boolean }) {
  const Icon = item.icon;
  const active = item.href === "/" ? location === "/" : location === item.href || location.startsWith(`${item.href}/`);
  const preload = useRoutePreload(item.href);
  return <Link href={item.href} aria-current={active ? "page" : undefined} {...preload} className={`product-rail-link group flex min-w-0 items-center gap-3 rounded-xl text-sm font-medium outline-none transition-[background-color,color,transform] duration-200 focus-visible:ring-2 focus-visible:ring-ring ${compact ? "flex-1 flex-col justify-center gap-1 px-1 py-2 text-[10px]" : "px-3 py-2.5"} ${active ? "product-rail-link-active text-primary" : "text-white/58 hover:text-white"}`}><Icon className={`${compact ? "h-4 w-4" : "h-[18px] w-[18px]"} shrink-0 ${active ? "text-primary" : "text-white/50 group-hover:text-white"}`} /><span className={compact ? "max-w-full truncate" : "truncate"}>{item.label}</span></Link>;
}
