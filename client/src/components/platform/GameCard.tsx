import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gamepad2, Layers3, Plus, ScanLine, ShieldAlert } from "lucide-react";
import { Link } from "wouter";

type GameCardProps = { game: { slug: string; title: string; steamAppId: number | null; shortDescription: string | null; platforms: { platform: string; antiCheat: string | null }[]; tags: { slug: string; name: string; kind: string }[] } };

export function GameCard({ game }: GameCardProps) {
  const genres = game.tags.filter((tag) => tag.kind === "genre").slice(0, 2);
  const hasAntiCheat = game.platforms.some((platform) => platform.antiCheat);
  const imageUrl = game.steamAppId ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.steamAppId}/header.jpg` : null;
  return <article className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
    <div className="relative aspect-[16/8] overflow-hidden bg-gradient-to-br from-primary/30 via-slate-900 to-cyan-500/20">
      {imageUrl ? <img src={imageUrl} alt="" className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105" loading="lazy" onError={(event) => { event.currentTarget.style.display = "none"; }} /> : null}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <span className="evidence-label absolute left-3 top-3 flex items-center gap-1 rounded bg-black/45 px-2 py-1 text-[8px] text-white/90 backdrop-blur"><ScanLine className="h-3 w-3 text-primary" />CATALOG / STEAM</span>
      <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5"><Badge className="border-0 bg-black/45 text-white backdrop-blur"><Gamepad2 className="mr-1 h-3 w-3" />Metadados</Badge>{hasAntiCheat ? <Badge className="border-0 bg-amber-500/85 text-amber-950"><ShieldAlert className="mr-1 h-3 w-3" />Anti-cheat listado</Badge> : null}</div>
    </div>
    <div className="space-y-3 p-4"><div className="min-w-0"><p className="evidence-label text-primary/80">registro indexado</p><h3 className="mt-1 truncate font-semibold tracking-tight">{game.title}</h3><p className="mt-1 line-clamp-2 min-h-10 text-xs leading-5 text-muted-foreground">{game.shortDescription || "Metadados de catálogo disponíveis; informações adicionais dependem de fonte e revisão."}</p></div><div className="flex items-center justify-between gap-2 border-t pt-3"><div className="flex min-w-0 gap-1.5">{genres.length ? genres.map((genre) => <Badge key={genre.slug} variant="secondary" className="max-w-24 truncate text-[10px]">{genre.name}</Badge>) : <span className="text-xs text-muted-foreground"><Layers3 className="mr-1 inline h-3.5 w-3.5" />Sem gênero indexado</span>}</div><Link href={`/games/${game.slug}`}><Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Abrir ${game.title}`}><Plus className="h-4 w-4" /></Button></Link></div></div>
  </article>;
}
