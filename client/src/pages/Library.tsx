import { SiteHeader } from "@/components/platform/SiteHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageBreadcrumbs } from "@/components/platform/PageBreadcrumbs";
import { Gamepad2, HardDrive, Play, RefreshCw, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";

type InstalledGame = { appId: number; name: string; installDir: string | null; libraryPath: string };

export default function Library() {
  const [games, setGames] = useState<InstalledGame[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [launching, setLaunching] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const desktop = window.strayDesktop;
  const visibleGames = useMemo(() => games.filter((game) => game.name.toLowerCase().includes(query.trim().toLowerCase())), [games, query]);

  async function scan() {
    if (!desktop?.library) return;
    setLoading(true); setError(null);
    try { setGames((await desktop.library.scan()).games); }
    catch { setError("Não foi possível ler a biblioteca Steam local. Nenhum dado foi enviado."); }
    finally { setLoading(false); }
  }
  async function launch(appId: number) {
    if (!desktop?.library) return;
    setLaunching(appId); setError(null);
    try { await desktop.library.launch(appId); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível solicitar a execução pelo Steam."); }
    finally { setLaunching(null); }
  }

  return <div className="min-h-screen bg-background"><SiteHeader /><main className="container py-8 md:py-12"><div className="mx-auto max-w-6xl space-y-6"><PageBreadcrumbs items={[{ label: "Stray Linux", href: "/" }, { label: "Minha biblioteca" }]} />
    <section className="flex flex-col justify-between gap-5 rounded-2xl border border-primary/20 bg-primary/[0.025] p-6 md:flex-row md:items-end"><div><Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary">BIBLIOTECA LOCAL / STEAM</Badge><h1 className="mt-3 text-3xl font-semibold tracking-tight">Meus jogos instalados.</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">O Stray Linux lê apenas manifestos locais da Steam sob sua solicitação. Não acessa conta, token, tempo jogado ou dados de nuvem.</p></div>{desktop?.library ? <Button onClick={scan} disabled={loading}><RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />{loading ? "Lendo biblioteca…" : "Atualizar biblioteca"}</Button> : null}</section>
    {!desktop?.library ? <Card><CardContent className="flex flex-col items-center gap-3 p-10 text-center"><HardDrive className="h-8 w-8 text-primary" /><p className="font-medium">Disponível no aplicativo Stray Linux para desktop</p><p className="max-w-xl text-sm leading-6 text-muted-foreground">Abra esta página pelo executável Electron no Linux para detectar instalações locais da Steam e iniciar somente os jogos encontrados.</p></CardContent></Card> : <><section className="grid gap-4 md:grid-cols-[1fr_auto]"><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filtrar jogos instalados" aria-label="Filtrar jogos instalados" /><Card className="flex items-center"><CardContent className="flex items-center gap-2 p-3 text-sm"><Gamepad2 className="h-4 w-4 text-primary" /><strong>{games.length}</strong> instalações detectadas</CardContent></Card></section>{error ? <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</p> : null}<section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{visibleGames.map((game) => <Card key={game.appId} className="group transition-transform duration-200 hover:-translate-y-0.5"><CardHeader className="pb-3"><CardTitle className="line-clamp-1 text-base">{game.name}</CardTitle><CardDescription>Steam App ID {game.appId}</CardDescription></CardHeader><CardContent><p className="line-clamp-1 text-xs text-muted-foreground">{game.installDir ? `Instalação: ${game.installDir}` : "Pasta de instalação não informada"}</p><Button className="mt-4 w-full" size="sm" onClick={() => launch(game.appId)} disabled={launching === game.appId}><Play className="mr-2 h-4 w-4" />{launching === game.appId ? "Abrindo…" : "Jogar pelo Steam"}</Button></CardContent></Card>)}</section>{games.length === 0 && !loading ? <Card className="border-dashed"><CardContent className="flex flex-col items-center gap-3 p-10 text-center"><ShieldCheck className="h-8 w-8 text-primary" /><p className="font-medium">Nenhuma biblioteca lida ainda</p><p className="max-w-xl text-sm leading-6 text-muted-foreground">Use “Atualizar biblioteca” para ler os manifestos de jogos instalados. Esta ação não envia informações para a rede.</p></CardContent></Card> : null}</>}</div></main></div>;
}
