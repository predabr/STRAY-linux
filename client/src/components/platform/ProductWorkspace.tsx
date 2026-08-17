import { StrayBrandMark } from "@/components/platform/StrayBrandMark";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { productShellCopy } from "@/i18n/productShellCopy";
import { Activity, BarChart3, BookOpenCheck, BotMessageSquare, Boxes, Camera, ChevronDown, ExternalLink, Gamepad2, Gauge, LayoutDashboard, Library, MonitorCog, Network, Settings, ShieldCheck, Wrench } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";

type NavigationItem = { href: string; label: string; icon: typeof LayoutDashboard };

export function ProductWorkspace({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { locale, t } = useLanguage();
  const { user } = useAuth();
  const copy = productShellCopy[locale];
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const workspace: NavigationItem[] = [
    { href: "/dashboard", label: t("overview"), icon: LayoutDashboard },
    { href: "/games", label: t("gameHub"), icon: Gamepad2 },
    { href: "/library", label: t("installedGames"), icon: Library },
    { href: "/linuxfix", label: t("linuxFix"), icon: Wrench },
    { href: "/assistant", label: "Stray AI", icon: BotMessageSquare },
  ];
  const system: NavigationItem[] = [
    { href: "/dashboard/pc", label: "Informações do sistema", icon: MonitorCog },
    { href: "/scanner", label: t("scanner"), icon: ShieldCheck },
    { href: "/diagnostics", label: "Diagnóstico", icon: Activity },
    { href: "/performance", label: "Performance", icon: Activity },
  ];
  const advancedTools: NavigationItem[] = [
    { href: "/mods", label: "Mods", icon: Boxes },
    { href: "/compare", label: copy.compare, icon: BarChart3 },
    { href: "/benchmark", label: t("benchmark"), icon: Gauge },
    { href: "/setup", label: t("setup"), icon: BookOpenCheck },
    { href: "/snapshots", label: "Snapshots", icon: Camera },
    { href: "/system-graph", label: "System Graph", icon: Network },
    { href: "/system-timeline", label: "Timeline", icon: Activity },
    { href: "/preflight", label: "Pré-voo", icon: ShieldCheck },
    { href: "/regression", label: "Regressão", icon: Gauge },
    { href: "/recovery", label: "Recuperação", icon: ShieldCheck },
    { href: "/logs", label: "Logs", icon: Activity },
    { href: "/notifications", label: "Alertas", icon: Activity },
    { href: "/controllers", label: "Controles", icon: Gamepad2 },
  ];
  const personal: NavigationItem[] = [
    { href: "/dashboard/activity", label: "Atividade local", icon: Activity },
    { href: "/settings", label: t("settings"), icon: Settings },
  ];
  if (user?.role === "moderator" || user?.role === "admin") personal.unshift({ href: "/moderation", label: t("reports"), icon: ShieldCheck });
  const bottomNavigation = [workspace[0]!, workspace[1]!, workspace[2]!, system[1]!];
  const advancedRouteActive = advancedTools.some((item) => location === item.href || location.startsWith(`${item.href}/`));
  const isDashboardRoute = location.startsWith("/admin");
  if (isDashboardRoute) return <>{children}</>;

  return <div className="product-workspace min-h-screen bg-background text-foreground">
    <aside className="product-rail fixed inset-y-0 start-0 z-40 hidden w-56 border-e border-[color:var(--stray-hairline)] px-3 py-4 shadow-[18px_0_40px_rgba(0,0,0,.2)] backdrop-blur-xl lg:flex lg:flex-col">
      <div className="product-rail-brand px-2"><StrayBrandMark /></div>
      <nav aria-label="Navegação do aplicativo" className="product-rail-navigation mt-8 flex-1 space-y-6 overflow-y-auto">
        <NavigationGroup label={copy.workspace} items={workspace} location={location} />
        <NavigationGroup label={copy.system} items={system} location={location} />
        <ExpandableNavigationGroup label={copy.tools} items={advancedTools} location={location} open={advancedOpen || advancedRouteActive} onToggle={() => setAdvancedOpen((value) => !value)} />
        <NavigationGroup label={copy.personal} items={personal} location={location} />
      </nav>
      <div className="product-rail-status mt-4 px-2 pt-4"><p className="inline-flex items-center gap-2 font-tech text-[10px] uppercase tracking-[0.12em] text-emerald-300"><span className="product-rail-status-dot h-1.5 w-1.5 rounded-full bg-emerald-300" />{copy.status}</p><OfflineStatus /><p className="mt-2 font-tech text-[10px] text-white/35">{copy.version}</p><a href="https://linuxtoys-ckuyvpj5.manus.space/support" target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs text-white/45 transition-colors hover:text-cyan-100">Apoio ao projeto<ExternalLink className="h-3 w-3" /></a><a href="https://linuxtoys-ckuyvpj5.manus.space/uninstall" target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-xs text-white/45 transition-colors hover:text-cyan-100">Guia de desinstalação<ExternalLink className="h-3 w-3" /></a></div>
    </aside>
    <div className="min-h-screen pb-16 lg:ps-56 lg:pb-0">{children}</div>
    <nav aria-label="Navegação rápida" className="fixed inset-x-0 bottom-0 z-50 flex h-16 border-t border-white/10 bg-[color:var(--stray-surface)] px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">{bottomNavigation.map((item) => <RailLink key={item.href} item={item} location={location} compact />)}</nav>
  </div>;
}

function NavigationGroup({ label, items, location }: { label: string; items: NavigationItem[]; location: string }) {
  return <section><p className="mb-2 px-3 font-tech text-[10px] font-bold tracking-[0.16em] text-white/35">{label}</p><div className="space-y-1">{items.map((item) => <RailLink key={item.href} item={item} location={location} />)}</div></section>;
}

function ExpandableNavigationGroup({ label, items, location, open, onToggle }: { label: string; items: NavigationItem[]; location: string; open: boolean; onToggle: () => void }) {
  return <section><button type="button" aria-expanded={open} onClick={onToggle} className="flex w-full items-center justify-between px-3 py-1.5 text-left font-tech text-[10px] font-bold tracking-[0.16em] text-white/35 transition-colors hover:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><span>{label}</span><ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} /></button>{open ? <div className="mt-1 space-y-1">{items.map((item) => <RailLink key={item.href} item={item} location={location} />)}</div> : null}</section>;
}

function RailLink({ item, location, compact = false }: { item: NavigationItem; location: string; compact?: boolean }) {
  const Icon = item.icon;
  const active = item.href === "/" ? location === "/" : location === item.href || location.startsWith(`${item.href}/`);
  return <Link href={item.href} aria-current={active ? "page" : undefined} className={`product-rail-link group flex min-w-0 items-center gap-3 rounded-xl text-sm font-medium outline-none transition-[background-color,color,transform] duration-200 focus-visible:ring-2 focus-visible:ring-ring ${compact ? "flex-1 flex-col justify-center gap-1 px-1 py-2 text-[10px]" : "px-3 py-2.5"} ${active ? "product-rail-link-active text-primary" : "text-white/58 hover:text-white"}`}><Icon className={`${compact ? "h-4 w-4" : "h-[18px] w-[18px]"} shrink-0 ${active ? "text-primary" : "text-white/50 group-hover:text-white"}`} /><span className={compact ? "max-w-full truncate" : "truncate"}>{item.label}</span></Link>;
}

function OfflineStatus() {
  const [online, setOnline] = useState(() => navigator.onLine);
  useEffect(() => {
    const setOnlineState = () => setOnline(true);
    const setOfflineState = () => setOnline(false);
    window.addEventListener("online", setOnlineState);
    window.addEventListener("offline", setOfflineState);
    return () => { window.removeEventListener("online", setOnlineState); window.removeEventListener("offline", setOfflineState); };
  }, []);
  if (online) return null;
  return <p className="mt-2 font-tech text-[9px] uppercase tracking-[0.12em] text-amber-200">Offline · dados locais ativos</p>;
}
