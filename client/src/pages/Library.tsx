import { SiteHeader } from "@/components/platform/SiteHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageBreadcrumbs } from "@/components/platform/PageBreadcrumbs";
import { FolderPlus, Gamepad2, HardDrive, Play, RefreshCw, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";

type InstalledGame = { id: string; appId: number | null; externalId: string; name: string; installDir: string | null; libraryPath: string; installationType: "native" | "flatpak" | "external"; launcher: "steam" | "heroic" | "external"; store: "steam" | "epic" | "external"; coverUrl: string | null; coverSource: "heroic-local-metadata" | null };

export default function Library() {
  const [games, setGames] = useState<InstalledGame[]>([]);
  const [externalGames, setExternalGames] = useState<InstalledGame[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [launching, setLaunching] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const desktop = window.strayDesktop;
  const allGames = useMemo(() => [...games, ...externalGames].sort((left, right) => left.name.localeCompare(right.name, "pt-BR")), [externalGames, games]);
  const visibleGames = useMemo(() => allGames.filter((game) => game.name.toLowerCase().includes(query.trim().toLowerCase())), [allGames, query]);

  async function scan() {
    if (!desktop?.library) return;
    setLoading(true); setError(null);
    try { setGames((await desktop.library.scan()).games); }
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
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível ler a pasta selecionada."); }
  }

  return <div className="min-h-screen bg-background"><SiteHeader /><main className="container py-8 md:py-12"><div className="mx-auto max-w-6xl space-y-6"><PageBreadcrumbs items={[{ label: "Stray Linux", href: "/" }, { label: "Minha biblioteca" }]} />
    <section className="stray-surface flex flex-col justify-between gap-5 rounded-2xl p-6 md:flex-row md:items-end"><div><p className="stray-kicker">BIBLIOTECA LOCAL / LEITURA CONSENTIDA</p><h1 className="mt-3 text-3xl font-semibold tracking-tight">Meus jogos instalados.</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">O Stray Linux lê manifestos Steam, instalações Heroic e pastas escolhidas por você. A pasta externa é apenas organizada localmente: não acessamos conta, token, origem, licença, nuvem ou configurações de execução.</p></div>{desktop?.library ? <div className="flex flex-wrap gap-2"><Button variant="outline" onClick={addExternal}><FolderPlus className="mr-2 h-4 w-4" />Adicionar pasta</Button><Button onClick={scan} disabled={loading}><RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />{loading ? "Lendo biblioteca…" : "Atualizar biblioteca"}</Button></div> : null}</section>
    {!desktop?.library ? <Card className="stray-empty-state"><CardContent className="flex flex-col items-center gap-3 p-10 text-center"><HardDrive className="h-8 w-8 text-primary" /><p className="stray-kicker">DESKTOP / LEITURA LOCAL</p><p className="font-medium">Disponível no aplicativo Stray Linux para desktop</p><p className="max-w-xl text-sm leading-6 text-muted-foreground">Abra esta página pelo executável Electron no Linux para detectar Steam, Heroic e adicionar uma pasta externa escolhida por você, sem enviar a biblioteca a nenhum serviço.</p></CardContent></Card> : <><section className="grid gap-4 md:grid-cols-[1fr_auto]"><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filtrar jogos instalados" aria-label="Filtrar jogos instalados" /><Card className="stray-surface flex items-center"><CardContent className="flex items-center gap-2 p-3 text-sm"><Gamepad2 className="h-4 w-4 text-primary" /><strong>{allGames.length}</strong> instalações detectadas ou adicionadas</CardContent></Card></section>{error ? <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</p> : null}<section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{visibleGames.map((game) => <Card key={game.id} className="stray-surface group overflow-hidden transition-transform duration-200 hover:-translate-y-0.5">{game.coverUrl ? <img src={game.coverUrl} alt={`Capa local de ${game.name}`} className="h-36 w-full object-cover" loading="lazy" /> : <div className="relative flex h-24 items-end overflow-hidden bg-[linear-gradient(125deg,rgba(13,18,27,1),rgba(10,28,44,.9))] p-4"><div aria-hidden="true" className="absolute -right-7 -top-10 h-28 w-28 rounded-full border border-cyan-100/10" /><span className="relative font-tech text-[10px] uppercase tracking-[.16em] text-white/50">{game.launcher === "heroic" ? "Heroic local" : game.launcher === "external" ? "Pasta externa" : "Steam local"}</span></div>}<CardHeader className="pb-3"><div className="flex items-start justify-between gap-2"><CardTitle className="line-clamp-1 text-base">{game.name}</CardTitle><Badge variant="outline" className="shrink-0 text-[10px]">{game.installationType === "flatpak" ? "Flatpak" : game.installationType === "external" ? "Manual" : "Nativa"}</Badge></div><CardDescription>{game.launcher === "steam" ? `Steam App ID ${game.appId}` : game.launcher === "heroic" ? "Epic detectado pelo Heroic" : "Pasta adicionada manualmente · origem não inferida"}{game.coverSource ? " · capa dos metadados locais" : ""}</CardDescription></CardHeader><CardContent><p className="line-clamp-1 text-xs text-muted-foreground">{game.installDir ? `Instalação: ${game.installDir}` : "Pasta de instalação não informada"}</p>{game.launcher === "steam" ? <Button className="mt-4 w-full" size="sm" onClick={() => launch(game.id)} disabled={launching === game.id}><Play className="mr-2 h-4 w-4" />{launching === game.id ? "Abrindo…" : "Jogar pelo Steam"}</Button> : <Button className="mt-4 w-full" size="sm" variant="outline" disabled><Play className="mr-2 h-4 w-4" />{game.launcher === "heroic" ? "Abra pelo Heroic" : "Organização local"}</Button>}</CardContent></Card>)}</section>{allGames.length === 0 && !loading ? <Card className="stray-empty-state"><CardContent className="flex flex-col items-center gap-3 p-10 text-center"><ShieldCheck className="h-8 w-8 text-primary" /><p className="stray-kicker">NENHUMA LEITURA EXECUTADA</p><p className="font-medium">Nenhuma biblioteca lida ainda</p><p className="max-w-xl text-sm leading-6 text-muted-foreground">Use “Atualizar biblioteca” para ler Steam/ Heroic ou “Adicionar pasta” para selecionar um diretório. Nenhuma informação é enviada à rede.</p></CardContent></Card> : null}</>}</div></main></div>;
}
