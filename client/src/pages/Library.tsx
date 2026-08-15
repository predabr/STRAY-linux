import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageBreadcrumbs } from "@/components/platform/PageBreadcrumbs";
import { SiteHeader } from "@/components/platform/SiteHeader";
import { Clock3, FolderPlus, Gamepad2, HardDrive, LibraryBig, Play, RefreshCw, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";

type InstalledGame = { id: string; appId: number | null; externalId: string; name: string; installDir: string | null; libraryPath: string; installationType: "native" | "flatpak" | "external"; launcher: "steam" | "heroic" | "external"; store: "steam" | "epic" | "external"; coverUrl: string | null; coverSource: "heroic-local-metadata" | null };

export default function Library() {
  const [games, setGames] = useState<InstalledGame[]>([]);
  const [externalGames, setExternalGames] = useState<InstalledGame[]>([]);
  const [query, setQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<"all" | InstalledGame["launcher"]>("all");
  const [loading, setLoading] = useState(false);
  const [launching, setLaunching] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastLocalRead, setLastLocalRead] = useState<number | null>(null);
  const desktop = window.strayDesktop;
  const allGames = useMemo(() => [...games, ...externalGames].sort((left, right) => left.name.localeCompare(right.name, "pt-BR")), [externalGames, games]);
  const visibleGames = useMemo(() => allGames.filter((game) => (sourceFilter === "all" || game.launcher === sourceFilter) && game.name.toLowerCase().includes(query.trim().toLowerCase())), [allGames, query, sourceFilter]);
  const sourceCounts = useMemo(() => ({ steam: allGames.filter((game) => game.launcher === "steam").length, heroic: allGames.filter((game) => game.launcher === "heroic").length, external: allGames.filter((game) => game.launcher === "external").length }), [allGames]);
  const lastReadLabel = lastLocalRead ? new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(lastLocalRead) : "aguardando leitura";

  async function scan() {
    if (!desktop?.library) return;
    setLoading(true); setError(null);
    try { setGames((await desktop.library.scan()).games); setLastLocalRead(Date.now()); }
    catch { setError("Não foi possível ler as bibliotecas Steam e Heroic locais. Nenhum dado foi enviado."); }
    finally { setLoading(false); }
  }

  async function launch(gameId: string) {
    if (!desktop?.library) return;
    setLaunching(gameId); setError(null);
    try { await desktop.library.launch(gameId); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível solicitar a execução pelo Steam."); }
    finally { setLaunching(null); }
  }

  async function addExternal() {
    if (!desktop?.library) return;
    setError(null);
    try {
      const result = await desktop.library.pickExternal();
      if (!result.game) return;
      setExternalGames((current) => current.some((game) => game.id === result.game!.id) ? current : [...current, result.game!]);
      setLastLocalRead(Date.now());
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível ler a pasta selecionada."); }
  }

  return <div className="min-h-screen bg-background"><SiteHeader /><main className="container py-8 md:py-12"><div className="mx-auto max-w-6xl space-y-6"><PageBreadcrumbs items={[{ label: "Stray Linux", href: "/" }, { label: "Minha biblioteca" }]} />
    <section className="stray-library-hero stray-product-section flex flex-col justify-between gap-5 rounded-2xl p-6 md:flex-row md:items-end"><div><p className="stray-kicker">BIBLIOTECA LOCAL / LEITURA CONSENTIDA</p><h1 className="mt-3 text-3xl font-semibold tracking-tight">Meus jogos instalados.</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">O Stray Linux lê manifestos Steam, instalações Heroic e pastas escolhidas por você. A pasta externa é apenas organizada localmente: não acessamos conta, token, origem, licença, nuvem ou configurações de execução.</p></div>{desktop?.library ? <div className="flex flex-wrap gap-2"><Button variant="outline" onClick={addExternal}><FolderPlus className="mr-2 h-4 w-4" />Adicionar pasta</Button><Button onClick={scan} disabled={loading}><RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />{loading ? "Lendo biblioteca…" : "Atualizar biblioteca"}</Button></div> : null}</section>
    {desktop?.library ? <section className="stray-library-readout grid gap-3 rounded-2xl p-4 sm:grid-cols-4"><Readout label="LEITURA ATUAL" value={lastReadLabel} icon={<Clock3 className="h-4 w-4" />} /><Readout label="STEAM" value={String(sourceCounts.steam)} icon={<Gamepad2 className="h-4 w-4" />} /><Readout label="HEROIC" value={String(sourceCounts.heroic)} icon={<LibraryBig className="h-4 w-4" />} /><Readout label="PASTAS" value={String(sourceCounts.external)} icon={<FolderPlus className="h-4 w-4" />} /></section> : null}
    {!desktop?.library ? <Card className="stray-empty-state"><CardContent className="flex flex-col items-center gap-3 p-10 text-center"><HardDrive className="h-8 w-8 text-primary" /><p className="stray-kicker">DESKTOP / LEITURA LOCAL</p><p className="font-medium">Disponível no aplicativo Stray Linux para desktop</p><p className="max-w-xl text-sm leading-6 text-muted-foreground">Abra esta página pelo executável Electron no Linux para detectar Steam, Heroic e adicionar uma pasta externa escolhida por você, sem enviar a biblioteca a nenhum serviço.</p><Button asChild variant="outline"><Link href="/games"><LibraryBig className="mr-2 h-4 w-4" />Explorar GameHub publicado</Link></Button></CardContent></Card> : <><section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]"><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filtrar jogos instalados" aria-label="Filtrar jogos instalados" /><Card className="stray-surface flex items-center"><CardContent className="flex items-center gap-2 p-3 text-sm"><Gamepad2 className="h-4 w-4 text-primary" /><strong>{allGames.length}</strong> instalações detectadas ou adicionadas</CardContent></Card></section><section className="stray-library-filter flex flex-col gap-3 rounded-2xl p-4 md:flex-row md:items-center md:justify-between"><div><p className="stray-kicker">ORIGEM LOCAL / LEITURA ATUAL</p><p className="mt-1 text-sm text-muted-foreground">Filtre apenas o que foi encontrado em manifestos locais ou adicionado conscientemente.</p></div><div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar origem da biblioteca">{([ ["all", "Todas", allGames.length], ["steam", "Steam", sourceCounts.steam], ["heroic", "Heroic", sourceCounts.heroic], ["external", "Pastas", sourceCounts.external] ] as const).map(([source, label, count]) => <Button key={source} size="sm" variant={sourceFilter === source ? "default" : "outline"} onClick={() => setSourceFilter(source)}>{label} <span className="ms-1 font-tech text-[10px] opacity-70">{count}</span></Button>)}</div></section>{error ? <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</p> : null}<section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{visibleGames.map((game) => <InstalledGameCard key={game.id} game={game} launching={launching === game.id} onLaunch={() => launch(game.id)} />)}</section>{allGames.length === 0 && !loading ? <Card className="stray-empty-state"><CardContent className="flex flex-col items-center gap-3 p-10 text-center"><ShieldCheck className="h-8 w-8 text-primary" /><p className="stray-kicker">NENHUMA LEITURA EXECUTADA</p><p className="font-medium">Nenhuma biblioteca lida ainda</p><p className="max-w-xl text-sm leading-6 text-muted-foreground">Use “Atualizar biblioteca” para ler Steam/ Heroic ou “Adicionar pasta” para selecionar um diretório. Nenhuma informação é enviada à rede.</p></CardContent></Card> : null}{allGames.length > 0 && visibleGames.length === 0 ? <Card className="stray-empty-state"><CardContent className="flex flex-col items-center gap-3 p-10 text-center"><Gamepad2 className="h-8 w-8 text-primary" /><p className="stray-kicker">SEM RESULTADO NESTA LEITURA</p><p className="font-medium">Nenhuma instalação corresponde ao filtro atual</p><Button variant="outline" onClick={() => { setQuery(""); setSourceFilter("all"); }}>Limpar filtros</Button></CardContent></Card> : null}</>}</div></main></div>;
}

function Readout({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) { return <div className="stray-library-readout-item rounded-xl px-3 py-3"><div className="flex items-center gap-2 text-primary">{icon}<p className="stray-kicker">{label}</p></div><p className="mt-2 truncate text-sm font-medium" title={value}>{value}</p></div>; }

function InstalledGameCard({ game, launching, onLaunch }: { game: InstalledGame; launching: boolean; onLaunch: () => void }) {
  const fallbackClass = game.launcher === "heroic" ? "from-amber-500/16 via-orange-500/8 to-slate-950" : game.launcher === "external" ? "from-fuchsia-500/14 via-violet-500/8 to-slate-950" : "from-cyan-500/16 via-blue-500/8 to-slate-950";
  return <Card className="stray-library-card group overflow-hidden">{game.coverUrl ? <img src={game.coverUrl} alt={`Capa local de ${game.name}`} className="h-36 w-full object-cover" loading="lazy" /> : <div className={`relative flex h-24 items-end overflow-hidden bg-gradient-to-br ${fallbackClass} p-4`}><div aria-hidden="true" className="absolute -right-7 -top-10 h-28 w-28 rounded-full border border-cyan-100/10" /><div aria-hidden="true" className="absolute -bottom-16 left-1/3 h-24 w-24 rounded-full border border-white/8" /><span className="relative font-tech text-[10px] uppercase tracking-[.16em] text-white/65">{game.launcher === "heroic" ? "Heroic local" : game.launcher === "external" ? "Pasta externa" : "Steam local"}</span></div>}<CardHeader className="pb-3"><div className="flex items-start justify-between gap-2"><CardTitle className="line-clamp-1 text-base">{game.name}</CardTitle><Badge variant="outline" className="shrink-0 text-[10px]">{game.installationType === "flatpak" ? "Flatpak" : game.installationType === "external" ? "Manual" : "Nativa"}</Badge></div><CardDescription>{game.launcher === "steam" ? `Steam App ID ${game.appId}` : game.launcher === "heroic" ? "Epic detectado pelo Heroic" : "Pasta adicionada manualmente · origem não inferida"}{game.coverSource ? " · capa dos metadados locais" : ""}</CardDescription></CardHeader><CardContent><p className="line-clamp-1 text-xs text-muted-foreground">{game.installDir ? `Instalação: ${game.installDir}` : "Pasta de instalação não informada"}</p>{game.launcher === "steam" ? <Button className="mt-4 w-full" size="sm" onClick={onLaunch} disabled={launching}><Play className="mr-2 h-4 w-4" />{launching ? "Abrindo…" : "Jogar pelo Steam"}</Button> : <Button className="mt-4 w-full" size="sm" variant="outline" disabled><Play className="mr-2 h-4 w-4" />{game.launcher === "heroic" ? "Abra pelo Heroic" : "Organização local"}</Button>}</CardContent></Card>;
}
