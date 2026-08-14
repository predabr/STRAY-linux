import { useAuth } from "@/_core/hooks/useAuth";
import { GameCard } from "@/components/platform/GameCard";
import { SiteHeader } from "@/components/platform/SiteHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { overviewCopy } from "@/i18n/overviewCopy";
import { trpc } from "@/lib/trpc";
import { ArrowRight, BookOpenCheck, CircleDotDashed, Database, Gamepad2, MonitorCog, ScanLine, ShieldCheck, Wrench } from "lucide-react";
import { useMemo } from "react";
import { Link, useLocation } from "wouter";

export default function Home() {
  const [, setLocation] = useLocation();
  const { locale, t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const copy = overviewCopy[locale];
  const featuredInput = useMemo(() => ({ page: 1, pageSize: 4, sort: "featured" as const }), []);
  const gamesQuery = trpc.games.list.useQuery(featuredInput);
  const distributionsQuery = trpc.distributions.list.useQuery();
  const contextQuery = trpc.user.recommendations.useQuery(undefined, { enabled: isAuthenticated });
  const activeProfile = contextQuery.data?.profile;
  const gameCount = gamesQuery.data?.meta.total;
  const distroCount = distributionsQuery.data?.length;

  return <div className="min-h-screen bg-background text-foreground"><SiteHeader /><main className="technical-grid min-h-[calc(100vh-3.5rem)]"><div className="container max-w-[1440px] py-5 md:py-7">
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-white/8 pb-5"><div><Badge variant="outline" className="border-cyan-300/25 bg-cyan-300/5 font-tech text-[10px] text-cyan-200">{copy.eyebrow}</Badge><h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-[2.35rem]">{copy.title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{copy.description}</p></div><div className="flex gap-2"><Button size="sm" onClick={() => setLocation("/games")}><Gamepad2 className="mr-2 h-4 w-4" />{copy.viewCatalog}</Button><Button size="sm" variant="outline" className="border-violet-300/35 bg-violet-300/5 text-violet-200 hover:bg-violet-300/10 hover:text-violet-100" onClick={() => setLocation("/scanner")}><ScanLine className="mr-2 h-4 w-4" />{copy.scannerAction}</Button></div></header>
    <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(20rem,.8fr)]"><section className="space-y-5"><div className="grid gap-3 sm:grid-cols-3"><OverviewMetric icon={Database} label={copy.catalog} value={gameCount ? gameCount.toLocaleString(locale) : "—"} note={copy.catalogDescription} /><OverviewMetric icon={BookOpenCheck} label={t("distros")} value={distroCount ? String(distroCount) : "—"} note={copy.evidence} /><OverviewMetric icon={ShieldCheck} label="LinuxFix" value="—" note={copy.evidence} /></div><Card className="border-white/8 bg-card/75 shadow-none"><CardHeader className="flex-row items-start justify-between gap-3 border-b border-white/8 pb-4"><div><p className="font-tech text-[10px] uppercase tracking-[0.14em] text-cyan-200">{copy.catalog}</p><CardTitle className="mt-1 text-xl">{t("gameHub")}</CardTitle><CardDescription className="mt-1">{copy.catalogDescription}</CardDescription></div><Link href="/games"><Button size="sm" variant="ghost">{copy.viewCatalog}<ArrowRight className="ml-2 h-4 w-4" /></Button></Link></CardHeader><CardContent className="p-4">{gamesQuery.isLoading ? <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-64 rounded-xl" />)}</div> : gamesQuery.data?.data.length ? <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{gamesQuery.data.data.map((game) => <GameCard key={game.id} game={game} />)}</div> : <EmptyCatalog text={copy.evidence} />}</CardContent></Card></section>
      <aside className="space-y-5"><SystemContext copy={copy} activeProfile={activeProfile} onScanner={() => setLocation("/scanner")} onProfile={() => setLocation("/dashboard/pc")} /><Card className="border-white/8 bg-card/75 shadow-none"><CardHeader className="pb-3"><p className="font-tech text-[10px] uppercase tracking-[0.14em] text-cyan-200">{copy.evidence}</p><CardTitle className="mt-1 text-base">LinuxFix</CardTitle></CardHeader><CardContent><div className="rounded-xl border border-dashed border-white/10 bg-black/15 p-4"><Wrench className="h-5 w-5 text-muted-foreground" /><p className="mt-3 text-sm font-medium">{copy.evidence}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{copy.systemDescription}</p><Button className="mt-4 w-full" size="sm" variant="outline" onClick={() => setLocation("/linuxfix")}>LinuxFix<ArrowRight className="ml-2 h-4 w-4" /></Button></div></CardContent></Card></aside>
    </div>
  </div></main></div>;
}

function OverviewMetric({ icon: Icon, label, value, note }: { icon: typeof Database; label: string; value: string; note: string }) {
  return <Card className="border-white/8 bg-card/70 shadow-none"><CardContent className="p-4"><div className="flex items-center justify-between"><span className="font-tech text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{label}</span><Icon className="h-4 w-4 text-cyan-300" /></div><p className="mt-3 text-2xl font-semibold tabular-nums">{value}</p><p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{note}</p></CardContent></Card>;
}

function SystemContext({ copy, activeProfile, onScanner, onProfile }: { copy: typeof overviewCopy["pt-BR"]; activeProfile: any; onScanner: () => void; onProfile: () => void }) {
  return <Card className="overflow-hidden border-cyan-300/15 bg-[#10141a] shadow-none"><CardHeader className="border-b border-white/8 pb-4"><div className="flex items-center justify-between gap-3"><div><p className="font-tech text-[10px] uppercase tracking-[0.14em] text-cyan-200">{copy.system}</p><CardTitle className="mt-1 text-xl">{activeProfile?.name || copy.noProfile}</CardTitle></div><span className="rounded-full border border-white/10 bg-white/5 p-2"><MonitorCog className="h-4 w-4 text-cyan-200" /></span></div><CardDescription className="mt-2 leading-6">{copy.systemDescription}</CardDescription></CardHeader><CardContent className="p-5">{activeProfile ? <div className="grid grid-cols-2 gap-2 text-xs"><SystemDatum label="CPU" value={activeProfile.cpuName || "—"} /><SystemDatum label="GPU" value={activeProfile.gpuName || "—"} /><SystemDatum label={copy.system} value={activeProfile.distributionName || "—"} /><SystemDatum label="Kernel" value={activeProfile.kernelVersion || "—"} /></div> : <div className="rounded-xl border border-dashed border-white/10 bg-black/15 p-4"><CircleDotDashed className="h-5 w-5 text-cyan-200" /><p className="mt-3 text-sm font-medium">{copy.noProfile}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{copy.evidence}</p></div>}<div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-1"><Button size="sm" className="justify-start" onClick={onScanner}><ScanLine className="mr-2 h-4 w-4" />{copy.scannerAction}</Button><Button size="sm" variant="outline" className="justify-start" onClick={onProfile}><MonitorCog className="mr-2 h-4 w-4" />{copy.profileAction}</Button></div></CardContent></Card>;
}

function SystemDatum({ label, value }: { label: string; value: string }) { return <div className="rounded-lg border border-white/8 bg-black/20 p-3"><p className="font-tech text-[10px] text-white/40">{label}</p><p className="mt-1 truncate text-xs text-white/80" title={value}>{value}</p></div>; }
function EmptyCatalog({ text }: { text: string }) { return <div className="rounded-xl border border-dashed p-5 text-sm text-muted-foreground">{text}</div>; }
