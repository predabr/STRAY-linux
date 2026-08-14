import { StrayBrandMark } from "@/components/platform/StrayBrandMark";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { productShellCopy } from "@/i18n/productShellCopy";
import { BarChart3, BookOpenCheck, BotMessageSquare, Gamepad2, Gauge, Heart, LayoutDashboard, Library, MonitorCog, Settings, ShieldCheck, Wrench } from "lucide-react";
import type { ReactNode } from "react";
import { Link, useLocation } from "wouter";

type NavigationItem = { href: string; label: string; icon: typeof LayoutDashboard };

export function ProductWorkspace({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { locale, t } = useLanguage();
  const { user } = useAuth();
  const copy = productShellCopy[locale];
  const workspace: NavigationItem[] = [
    { href: "/", label: t("overview"), icon: LayoutDashboard },
    { href: "/games", label: t("gameHub"), icon: Gamepad2 },
    { href: "/library", label: t("installedGames"), icon: Library },
    { href: "/compare", label: copy.compare, icon: BarChart3 },
    { href: "/benchmark", label: t("benchmark"), icon: Gauge },
    { href: "/linuxfix", label: t("linuxFix"), icon: Wrench },
    { href: "/setup", label: t("setup"), icon: BookOpenCheck },
  ];
  const system: NavigationItem[] = [
    { href: "/dashboard/pc", label: t("myPc"), icon: MonitorCog },
    { href: "/scanner", label: t("scanner"), icon: ShieldCheck },
    { href: "/assistant", label: "Stray AI", icon: BotMessageSquare },
  ];
  const personal: NavigationItem[] = [
    { href: "/dashboard/favorites", label: t("favorites"), icon: Heart },
    { href: "/dashboard/reports", label: t("reports"), icon: ShieldCheck },
    { href: "/dashboard/settings", label: t("settings"), icon: Settings },
  ];
  if (user?.role === "moderator" || user?.role === "admin") personal.unshift({ href: "/moderation", label: t("reports"), icon: ShieldCheck });
  const bottomNavigation = [workspace[0]!, workspace[1]!, workspace[2]!, system[1]!];
  const isDashboardRoute = location.startsWith("/admin");
  if (isDashboardRoute) return <>{children}</>;

  return <div className="product-workspace min-h-screen bg-background">
    <aside className="product-rail fixed inset-y-0 start-0 z-40 hidden w-56 border-e border-white/8 bg-[#0d1016]/95 px-3 py-4 shadow-[18px_0_40px_rgba(0,0,0,.14)] backdrop-blur-xl lg:flex lg:flex-col">
      <div className="px-2"><StrayBrandMark /></div>
      <nav aria-label="Navegação do aplicativo" className="mt-8 flex-1 space-y-6 overflow-y-auto">
        <NavigationGroup label={copy.workspace} items={workspace} location={location} />
        <NavigationGroup label={copy.system} items={system} location={location} />
        <NavigationGroup label={copy.personal} items={personal} location={location} />
      </nav>
      <div className="mt-4 border-t border-white/8 px-2 pt-4"><p className="inline-flex items-center gap-2 font-tech text-[10px] uppercase tracking-[0.12em] text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />{copy.status}</p><p className="mt-2 font-tech text-[10px] text-white/35">{copy.version}</p></div>
    </aside>
    <div className="min-h-screen pb-16 lg:ps-56 lg:pb-0">{children}</div>
    <nav aria-label="Navegação rápida" className="fixed inset-x-0 bottom-0 z-50 flex h-16 border-t border-white/10 bg-[#111318]/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">{bottomNavigation.map((item) => <RailLink key={item.href} item={item} location={location} compact />)}</nav>
  </div>;
}

function NavigationGroup({ label, items, location }: { label: string; items: NavigationItem[]; location: string }) {
  return <section><p className="mb-2 px-3 font-tech text-[10px] font-bold tracking-[0.16em] text-white/35">{label}</p><div className="space-y-1">{items.map((item) => <RailLink key={item.href} item={item} location={location} />)}</div></section>;
}

function RailLink({ item, location, compact = false }: { item: NavigationItem; location: string; compact?: boolean }) {
  const Icon = item.icon;
  const active = item.href === "/" ? location === "/" : location === item.href || location.startsWith(`${item.href}/`);
  return <Link href={item.href} aria-current={active ? "page" : undefined} className={`group flex min-w-0 items-center gap-3 rounded-xl text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring ${compact ? "flex-1 flex-col justify-center gap-1 px-1 py-2 text-[10px]" : "px-3 py-2.5"} ${active ? "bg-primary/13 text-primary" : "text-white/58 hover:bg-white/6 hover:text-white"}`}><Icon className={`${compact ? "h-4 w-4" : "h-[18px] w-[18px]"} shrink-0 ${active ? "text-primary" : "text-white/50 group-hover:text-white"}`} /><span className={compact ? "max-w-full truncate" : "truncate"}>{item.label}</span></Link>;
}
