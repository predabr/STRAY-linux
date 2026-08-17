import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { gameCardCopy } from "@/i18n/gameCardCopy";
import { ArrowUpRight, BookOpenText, Layers3, ScanLine, ShieldAlert } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

type GameCardProps = { game: { slug: string; title: string; steamAppId: number | null; shortDescription: string | null; coverImageUrl?: string | null; platforms: { platform: string; antiCheat: string | null }[]; tags: { slug: string; name: string; kind: string }[] } };

export function GameCard({ game }: GameCardProps) {
  const [coverFailed, setCoverFailed] = useState(false);
  const { locale } = useLanguage();
  const copy = gameCardCopy[locale];
  const safeTags = Array.isArray(game.tags) ? game.tags : [];
  const safePlatforms = Array.isArray(game.platforms) ? game.platforms : [];
  const genres = safeTags.filter((tag) => tag.kind === "genre").slice(0, 2);
  const platforms = safePlatforms.slice(0, 2);
  const hasAntiCheat = safePlatforms.some((platform) => platform.antiCheat);
  const identifier = game.steamAppId ? `APP ${game.steamAppId}` : "INDEX";
  const glyph = game.title.trim().slice(0, 1).toUpperCase() || "?";
  const plateTone = (game.steamAppId || game.slug.length) % 3;
  const fallbackPalette = ["from-cyan-300/12 via-slate-950 to-blue-950/65", "from-violet-300/12 via-slate-950 to-indigo-950/65", "from-emerald-300/10 via-slate-950 to-cyan-950/60"][plateTone];

  const hasCover = Boolean(game.coverImageUrl) && !coverFailed;
  return <article className="stray-game-card stray-surface group overflow-hidden rounded-2xl"><div className={`relative aspect-[3/4] overflow-hidden border-b border-white/8 bg-gradient-to-br ${fallbackPalette}`}>{hasCover ? <img src={game.coverImageUrl!} alt={`Capa de ${game.title}`} className="h-full w-full object-contain bg-black/55 p-2 transition-transform duration-300 group-hover:scale-[1.02]" loading="lazy" onError={() => setCoverFailed(true)} /> : <><div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" /><div aria-hidden="true" className="absolute -right-7 -top-10 h-40 w-40 rounded-full border border-white/10" /><div aria-hidden="true" className="absolute -bottom-14 left-[28%] h-36 w-72 rounded-[100%] border border-white/10" /><div className="absolute inset-0 grid place-items-center"><span aria-hidden="true" className="font-tech text-5xl font-bold tracking-tighter text-white/[0.07] transition-transform duration-300 group-hover:scale-110">{glyph}</span><span className="absolute bottom-5 font-tech text-[8px] tracking-[.23em] text-white/28">STRAY / CATALOG OBJECT</span></div></>}<div className="absolute start-3 top-3 flex items-center gap-1.5 font-tech text-[9px] tracking-[0.12em] text-white/70"><ScanLine className="h-3 w-3 text-cyan-200" />{hasCover ? "MÍDIA REGISTRADA" : "FALLBACK DE CATÁLOGO"}</div><div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2"><span className="rounded-md border border-white/10 bg-black/45 px-2 py-1 font-tech text-[9px] text-white/80 backdrop-blur">{identifier}</span><div className="flex flex-wrap justify-end gap-1">{platforms.map((platform) => <Badge key={platform.platform} className="border-0 bg-black/45 px-1.5 py-0.5 text-[9px] text-white/90 backdrop-blur">{platform.platform.replace("_", " ")}</Badge>)}</div></div></div><div className="space-y-3 p-4"><div className="min-w-0"><p className="stray-kicker">{copy.indexedMetadata}</p><h3 className="mt-1 truncate font-semibold tracking-tight">{game.title}</h3><p className="mt-1 line-clamp-2 min-h-10 text-xs leading-5 text-muted-foreground">{game.shortDescription || copy.catalogFallback}</p></div><div className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><BookOpenText className="h-3.5 w-3.5 text-cyan-200" />{game.shortDescription ? "descrição indexada" : "sem descrição publicada"}</div><div className="flex items-center justify-between gap-2 border-t border-white/8 pt-3"><div className="flex min-w-0 gap-1.5">{genres.length ? genres.map((genre) => <Badge key={genre.slug} variant="secondary" className="max-w-24 truncate text-[10px]">{genre.name}</Badge>) : <span className="text-xs text-muted-foreground"><Layers3 className="mr-1 inline h-3.5 w-3.5" />{copy.noGenre}</span>}{hasAntiCheat ? <Badge className="border-0 bg-amber-500/15 text-[10px] text-amber-300"><ShieldAlert className="mr-1 h-3 w-3" />{copy.antiCheatListed}</Badge> : null}</div><Link href={`/games/${game.slug}`} className="stray-card-action inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={copy.openGame(game.title)}><span>{copy.openDetails}</span><ArrowUpRight className="h-3.5 w-3.5" /></Link></div></div></article>;
}
