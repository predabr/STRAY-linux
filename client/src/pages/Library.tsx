import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageBreadcrumbs } from "@/components/platform/PageBreadcrumbs";
import { SiteHeader } from "@/components/platform/SiteHeader";
import { trpc } from "@/lib/trpc";
import { Clock3, ExternalLink, FolderOpen, FolderPlus, Gamepad2, HardDrive, LibraryBig, Play, RefreshCw, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "wouter";

type InstalledGame = { id: string; appId: number | null; externalId: string; name: string; installDir: string | null; libraryPath: string; installationType: "native" | "flatpak" | "external"; launcher: "steam" | "heroic" | "external"; store: "steam" | "epic" | "external"; coverUrl: string | null; coverSource: "heroic-local-metadata" | "steam-public-cdn" | null };
type CatalogGame = { id: number; slug: string; title: string; shortDescription?: string | null; coverImageUrl?: string | null; steamAppId?: number | null };
type EnrichedGame = InstalledGame & { catalog?: CatalogGame };

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
  const catalogInput = useMemo(() => ({ steamAppIds: allGames.flatMap((game) => game.appId ? [game.appId] : []), titles: allGames.map((game) => game.name) }), [allGames]);
  const catalog = trpc.games.resolveInstalled.useQuery(catalogInput, { enabled: Boolean(desktop?.library) && allGames.length > 0 });
  const catalogBySteamId = useMemo(() => new Map<number, CatalogGame>((catalog.data ?? []).filter((game: CatalogGame) => game.steamAppId).map((game: CatalogGame) => [game.steamAppId!, game])), [catalog.data]);
  const catalogByTitle = useMemo(() => new Map<string, CatalogGame>((catalog.data ?? []).map((game: CatalogGame) => [game.title.toLocaleLowerCase("pt-BR"), game])), [catalog.data]);
  const enrichedGames = useMemo<EnrichedGame[]>(() => allGames.map((game) => ({ ...game, catalog: game.appId ? catalogBySteamId.get(game.appId) : catalogByTitle.get(game.name.toLocaleLowerCase("pt-BR")) })), [allGames, catalogBySteamId, catalogByTitle]);
  const visibleGames = useMemo(() => enrichedGames.filter((game) => (sourceFilter === "all" || game.launcher === sourceFilter) && game.name.toLowerCase().includes(query.trim().toLowerCase())), [enrichedGames, query, sourceFilter]);
  const sourceCounts = useMemo(() => ({ steam: allGames.filter((game) => game.launcher === "steam").length, heroic: allGames.filter((game) => game.launcher === "heroic").length, external: allGames.filter((game) => game.launcher === "external").length }), [allGames]);
  const lastReadLabel = lastLocalRead ? new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(lastLocalRead) : "aguardando leitura";

  const scan = useCallback(async () => {
    if (!desktop?.library) return;
    setLoading(true); setError(null);
    try { setGames((await desktop.library.scan()).games); setLastLocalRead(Date.now()); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível ler Steam e Heroic locais. Nenhum dado foi enviado."); }
    finally { setLoading(false); }
  }, [desktop?.library]);

  useEffect(() => { void scan(); }, [scan]);

  async function launch(gameId: string) {
    if (!desktop?.library) return;
    setLaunching(gameId); setError(null);
    try { await desktop.library.launch(gameId); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível solicitar a execução pelo Steam."); }
    finally { setLaunching(null); }
  }

  async function reveal(gameId: string) {
    if (!desktop?.library) return;
    setError(null);
    try { await desktop.library.reveal(gameId); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível abrir a pasta de instalação."); }
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
    <section className="stray-library-hero stray-product-section flex flex-col justify-between gap-5 rounded-2xl p-6 md:flex-row md:items-end"><div><p className="stray-kicker">BIBLIOTECA LOCAL / LEITURA AUTOMÁTICA</p><h1 className="mt-3 text-3xl font-semibold tracking-tight">Meus jogos instalados.</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Ao abrir esta tela, o Stray Linux lê manifestos Steam e instalações Heroic locais. Nenhum catálogo, conta, token ou lista de jogos é enviado para fora do dispositivo.</p></div>{desktop?.library ? <div className="flex flex-wrap gap-2"><Button variant="outline" onClick={addExternal}><FolderPlus className="mr-2 h-4 w-4" />Adicionar pasta</Button><Button onClick={() => void scan()} disabled={loading}><RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />{loading ? "Lendo biblioteca…" : "Atualizar biblioteca"}</Button></div> : null}</section>
    {desktop?.library ? <section className="stray-library-readout grid gap-3 rounded-2xl p-4 sm:grid-cols-4"><Readout label="LEITURA ATUAL" value={lastReadLabel} icon={<Clock3 className="h-4 w-4" />} /><Readout label="STEAM" value={String(sourceCounts.steam)} icon={<Gamepad2 className="h-4 w-4" />} /><Readout label="HEROIC" value={String(sourceCounts.heroic)} icon={<LibraryBig className="h-4 w-4" />} /><Readout label="PASTAS" value={String(sourceCounts.external)} icon={<FolderPlus className="h-4 w-4" />} /></section> : null}
    {!desktop?.library ? <Card className="stray-empty-state"><CardContent className="flex flex-col items-center gap-3 p-10 text-center"><HardDrive className="h-8 w-8 text-primary" /><p className="stray-kicker">DESKTOP / LEITURA LOCAL</p><p className="font-medium">Disponível no aplicativo Stray Linux para desktop</p><p className="max-w-xl text-sm leading-6 text-muted-foreground">Abra esta página pelo Electron para detectar Steam, Heroic e pastas escolhidas conscientemente.</p><Button asChild variant="outline"><Link href="/games"><LibraryBig className="mr-2 h-4 w-4" />Explorar GameHub</Link></Button></CardContent></Card> : <><section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]"><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filtrar jogos instalados" aria-label="Filtrar jogos instalados" /><Card className="stray-surface flex items-center"><CardContent className="flex items-center gap-2 p-3 text-sm"><Gamepad2 className="h-4 w-4 text-primary" /><strong>{allGames.length}</strong> instalações detectadas</CardContent></Card></section><section className="stray-library-filter flex flex-col gap-3 rounded-2xl p-4 md:flex-row md:items-center md:justify-between"><div><p className="stray-kicker">ORIGEM LOCAL / CATÁLOGO EMPACOTADO</p><p className="mt-1 text-sm text-muted-foreground">Capa e descrição aparecem quando há correspondência por Steam App ID ou título no catálogo local.</p></div><div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar origem da biblioteca">{([ ["all", "Todas", allGames.length], ["steam", "Steam", sourceCounts.steam], ["heroic", "Heroic", sourceCounts.heroic], ["external", "Pastas", sourceCounts.external] ] as const).map(([source, label, count]) => <Button key={source} size="sm" variant={sourceFilter === source ? "default" : "outline"} onClick={() => setSourceFilter(source)}>{label} <span className="ms-1 font-tech text-[10px] opacity-70">{count}</span></Button>)}</div></section>{error ? <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</p> : null}<section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{visibleGames.map((game) => <InstalledGameCard key={game.id} game={game} launching={launching === game.id} onLaunch={() => void launch(game.id)} onReveal={() => void reveal(game.id)} />)}</section>{allGames.length === 0 && !loading ? <Card className="stray-empty-state"><CardContent className="flex flex-col items-center gap-3 p-10 text-center"><ShieldCheck className="h-8 w-8 text-primary" /><p className="stray-kicker">NENHUMA INSTALAÇÃO DETECTADA</p><p className="font-medium">Steam e Heroic não expuseram jogos instalados nesta leitura</p><p className="max-w-xl text-sm leading-6 text-muted-foreground">Confira se o launcher está instalado neste usuário ou adicione uma pasta de jogo conhecida. A leitura não percorre o disco indiscriminadamente.</p></CardContent></Card> : null}{allGames.length > 0 && visibleGames.length === 0 ? <Card className="stray-empty-state"><CardContent className="flex flex-col items-center gap-3 p-10 text-center"><Gamepad2 className="h-8 w-8 text-primary" /><p className="stray-kicker">SEM RESULTADO NESTA LEITURA</p><p className="font-medium">Nenhuma instalação corresponde ao filtro atual</p><Button variant="outline" onClick={() => { setQuery(""); setSourceFilter("all"); }}>Limpar filtros</Button></CardContent></Card> : null}</>}</div></main></div>;
}

function Readout({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) { return <div className="stray-library-readout-item rounded-xl px-3 py-3"><div className="flex items-center gap-2 text-primary">{icon}<p className="stray-kicker">{label}</p></div><p className="mt-2 truncate text-sm font-medium" title={value}>{value}</p></div>; }

function InstalledGameCard({ game, launching, onLaunch, onReveal }: { game: EnrichedGame; launching: boolean; onLaunch: () => void; onReveal: () => void }) {
  const fallbackClass = game.launcher === "heroic" ? "from-zinc-700/45 via-zinc-900 to-black" : game.launcher === "external" ? "from-zinc-600/30 via-zinc-900 to-black" : "from-zinc-500/30 via-zinc-900 to-black";
  const cover = game.coverUrl || game.catalog?.coverImageUrl;
  return <Card className="stray-library-card group overflow-hidden">{cover ? <img src={cover} alt={`Capa de ${game.name}`} className="h-40 w-full object-cover" loading="lazy" onError={(event) => { event.currentTarget.style.display = "none"; }} /> : <div className={`relative flex h-24 items-end overflow-hidden bg-gradient-to-br ${fallbackClass} p-4`}><span className="relative font-tech text-[10px] uppercase tracking-[.16em] text-white/65">{game.launcher === "heroic" ? "Heroic local" : game.launcher === "external" ? "Pasta externa" : "Steam local"}</span></div>}<CardHeader className="pb-3"><div className="flex items-start justify-between gap-2"><CardTitle className="line-clamp-1 text-base">{game.name}</CardTitle><Badge variant="outline" className="shrink-0 text-[10px]">{game.installationType === "flatpak" ? "Flatpak" : game.installationType === "external" ? "Manual" : "Nativa"}</Badge></div><CardDescription className="line-clamp-2">{game.catalog?.shortDescription || (game.launcher === "steam" ? `Steam App ID ${game.appId}` : game.launcher === "heroic" ? "Epic detectado pelo Heroic" : "Pasta adicionada manualmente")}</CardDescription></CardHeader><CardContent className="space-y-2"><p className="line-clamp-1 text-xs text-muted-foreground">{game.installDir ? `Instalação: ${game.installDir}` : "Pasta de instalação não informada"}</p>{game.launcher === "steam" ? <Button className="w-full" size="sm" onClick={onLaunch} disabled={launching}><Play className="mr-2 h-4 w-4" />{launching ? "Abrindo…" : "Jogar pelo Steam"}</Button> : null}<Button className="w-full" size="sm" variant="outline" onClick={onReveal}><FolderOpen className="mr-2 h-4 w-4" />Abrir instalação</Button>{game.catalog?.slug ? <Button asChild className="w-full" size="sm" variant="ghost"><Link href={`/games/${game.catalog.slug}`}><ExternalLink className="mr-2 h-4 w-4" />Ver detalhes no GameHub</Link></Button> : null}</CardContent></Card>;
}
