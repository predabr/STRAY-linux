import { StrayBrandMark } from "@/components/platform/StrayBrandMark";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { productShellCopy } from "@/i18n/productShellCopy";
import { Activity, BarChart3, BookOpenCheck, BotMessageSquare, Boxes, Camera, Gamepad2, Gauge, HeartHandshake, LayoutDashboard, Library, MonitorCog, Network, Settings, ShieldCheck, Wrench } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useLocation } from "wouter";
import { WorkspaceDisclosureGroup, WorkspaceNavGroup } from "./WorkspaceNavGroup";
import { WorkspaceNavItem } from "./WorkspaceNavItem";
import { WorkspaceStatus } from "./WorkspaceStatus";
import type { WorkspaceNavigationItem } from "./workspaceTypes";
import "@/styles/workspace.css";

export function ProductWorkspace({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { locale, t } = useLanguage();
  const { user } = useAuth();
  const copy = productShellCopy[locale];
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const workspace: WorkspaceNavigationItem[] = [{ href: "/dashboard", label: t("overview"), icon: LayoutDashboard }, { href: "/games", label: t("gameHub"), icon: Gamepad2 }, { href: "/library", label: t("installedGames"), icon: Library }, { href: "/linuxfix", label: t("linuxFix"), icon: Wrench }, { href: "/assistant", label: "Stray AI", icon: BotMessageSquare }];
  const system: WorkspaceNavigationItem[] = [{ href: "/dashboard/pc", label: "Informações do sistema", icon: MonitorCog }, { href: "/scanner", label: t("scanner"), icon: ShieldCheck }, { href: "/diagnostics", label: "Diagnóstico", icon: Activity }, { href: "/performance", label: "Performance", icon: Activity }];
  const advancedTools: WorkspaceNavigationItem[] = [{ href: "/mods", label: "Mods", icon: Boxes }, { href: "/compare", label: copy.compare, icon: BarChart3 }, { href: "/benchmark", label: t("benchmark"), icon: Gauge }, { href: "/setup", label: t("setup"), icon: BookOpenCheck }, { href: "/snapshots", label: "Snapshots", icon: Camera }, { href: "/system-graph", label: "System Graph", icon: Network }, { href: "/system-timeline", label: "Timeline", icon: Activity }, { href: "/preflight", label: "Pré-voo", icon: ShieldCheck }, { href: "/regression", label: "Regressão", icon: Gauge }, { href: "/recovery", label: "Recuperação", icon: ShieldCheck }, { href: "/logs", label: "Logs", icon: Activity }, { href: "/notifications", label: "Alertas", icon: Activity }, { href: "/controllers", label: "Controles", icon: Gamepad2 }];
  const personal: WorkspaceNavigationItem[] = [{ href: "/dashboard/activity", label: "Atividade local", icon: Activity }, { href: "/project-support", label: "Apoie o projeto", icon: HeartHandshake }, { href: "/settings", label: t("settings"), icon: Settings }];
  if (user?.role === "moderator" || user?.role === "admin") personal.unshift({ href: "/moderation", label: t("reports"), icon: ShieldCheck });
  const bottomNavigation = [workspace[0]!, workspace[1]!, workspace[2]!, system[1]!];
  const advancedRouteActive = advancedTools.some((item) => location === item.href || location.startsWith(`${item.href}/`));
  if (location.startsWith("/admin")) return <>{children}</>;
  return <div className="product-workspace min-h-screen bg-background text-foreground"><aside className="product-rail fixed inset-y-0 start-0 z-40 hidden w-56 border-e border-[color:var(--stray-hairline)] px-3 py-4 shadow-[18px_0_40px_rgba(0,0,0,.2)] backdrop-blur-xl lg:flex lg:flex-col"><div className="product-rail-brand px-2"><StrayBrandMark /></div><nav aria-label="Navegação do aplicativo" className="product-rail-navigation mt-8 flex-1 space-y-6 overflow-y-auto"><WorkspaceNavGroup label={copy.workspace} items={workspace} location={location} /><WorkspaceNavGroup label={copy.system} items={system} location={location} /><WorkspaceDisclosureGroup label={copy.tools} items={advancedTools} location={location} open={advancedOpen || advancedRouteActive} onToggle={() => setAdvancedOpen((value) => !value)} /><WorkspaceNavGroup label={copy.personal} items={personal} location={location} /></nav><WorkspaceStatus label={copy.status} version={copy.version} /></aside><div className="min-h-screen pb-16 lg:ps-56 lg:pb-0">{children}</div><nav aria-label="Navegação rápida" className="fixed inset-x-0 bottom-0 z-50 flex h-16 border-t border-white/10 bg-[color:var(--stray-surface)] px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">{bottomNavigation.map((item) => <WorkspaceNavItem key={item.href} item={item} location={location} compact />)}</nav></div>;
}
