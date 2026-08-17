import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, CheckCircle2, Gauge, Info, MessagesSquare, ShieldCheck, Wrench } from "lucide-react";

export function GameIdentityMeta({ game }: { game: any }) {
  const fields = [
    ["Desenvolvedor", game.developer || "Não informado"],
    ["Publicadora", game.publisher || "Não informada"],
    ["Lançamento", game.releaseDate || "Não informado"],
  ];
  return <Card className="mt-5 border-white/8 bg-card/75"><CardContent className="grid gap-4 p-5 md:grid-cols-[1fr_auto]"><div><p className="font-tech text-[10px] uppercase tracking-[0.14em] text-cyan-200">GAME PROFILE / REGISTRO DE CATÁLOGO</p><div className="mt-3 grid gap-3 sm:grid-cols-3">{fields.map(([label, value]) => <div key={label}><p className="font-tech text-[9px] uppercase tracking-[0.12em] text-muted-foreground">{label}</p><p className="mt-1 text-sm font-medium">{value}</p></div>)}</div></div><div className="flex items-start gap-2"><Badge variant="outline" className="border-white/10 bg-black/15 text-muted-foreground"><Info className="mr-1 h-3.5 w-3.5" />Metadados publicados</Badge>{game.sourceUrl ? <a href={game.sourceUrl} target="_blank" rel="noreferrer" className="text-xs text-primary underline-offset-4 hover:underline">Abrir fonte</a> : null}</div></CardContent></Card>;
}

export function GameProfileSummary({ game }: { game: any }) {
  const compatibility = Array.isArray(game.compatibility) ? game.compatibility : [];
  const fixes = Array.isArray(game.fixes) ? game.fixes : [];
  const guides = Array.isArray(game.guides) ? game.guides : [];
  const areas = [
    { label: "Overview", value: "Registro de catálogo", icon: ShieldCheck, ready: true },
    { label: "Compatibility", value: `${compatibility.length} registro(s)`, icon: CheckCircle2, ready: compatibility.length > 0 },
    { label: "Performance", value: "Benchmark Lab", icon: Gauge, ready: false },
    { label: "LinuxFix", value: `${fixes.length} relacionado(s)`, icon: Wrench, ready: fixes.length > 0 },
    { label: "Guides", value: `${guides.length} relacionado(s)`, icon: BookOpen, ready: guides.length > 0 },
    { label: "Community", value: "Reports moderados", icon: MessagesSquare, ready: false },
  ];
  return <section className="mt-5"><div className="mb-3 flex items-center justify-between gap-3"><div><p className="font-tech text-[10px] uppercase tracking-[0.14em] text-cyan-200">ÁREAS DO PERFIL</p><p className="mt-1 text-sm text-muted-foreground">A disponibilidade representa registros vinculados; não é uma avaliação do jogo.</p></div></div><div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">{areas.map((area) => { const Icon = area.icon; return <div key={area.label} className="flex items-center gap-3 rounded-xl border border-white/8 bg-card/60 p-3"><div className={`grid h-8 w-8 place-items-center rounded-lg ${area.ready ? "bg-emerald-400/10 text-emerald-300" : "bg-muted text-muted-foreground"}`}><Icon className="h-4 w-4" /></div><div className="min-w-0"><p className="font-tech text-[9px] uppercase tracking-[0.12em] text-muted-foreground">{area.label}</p><p className="mt-0.5 truncate text-sm font-medium">{area.value}</p></div></div>; })}</div></section>;
}
