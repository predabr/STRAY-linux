import { ChevronDown } from "lucide-react";
import { WorkspaceNavItem } from "./WorkspaceNavItem";
import type { WorkspaceNavigationItem } from "./workspaceTypes";

export function WorkspaceNavGroup({ label, items, location }: { label: string; items: WorkspaceNavigationItem[]; location: string }) {
  return <section><p className="mb-2 px-3 font-tech text-[10px] font-bold tracking-[0.16em] text-white/35">{label}</p><div className="space-y-1">{items.map((item) => <WorkspaceNavItem key={item.href} item={item} location={location} />)}</div></section>;
}

export function WorkspaceDisclosureGroup({ label, items, location, open, onToggle }: { label: string; items: WorkspaceNavigationItem[]; location: string; open: boolean; onToggle: () => void }) {
  return <section><button type="button" aria-expanded={open} onClick={onToggle} className="flex w-full items-center justify-between px-3 py-1.5 text-left font-tech text-[10px] font-bold tracking-[.16em] text-white/35 transition-colors hover:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><span>{label}</span><ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} /></button>{open ? <div className="mt-1 space-y-1">{items.map((item) => <WorkspaceNavItem key={item.href} item={item} location={location} />)}</div> : null}</section>;
}
