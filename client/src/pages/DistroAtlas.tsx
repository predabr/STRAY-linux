import { SiteHeader } from "@/components/platform/SiteHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { distroRegistry, type DistroRegistryEntry } from "@shared/distro-registry";
import { Check, Copy, Info, Search, ShieldAlert, Terminal } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";

const commandFor = (entry: DistroRegistryEntry) => {
  const packageFile = "Stray-Linux-1.0.0";
  switch (entry.installer) {
    case "pacman": return { label: "Pacman / Arch", command: `sudo pacman -U ./${packageFile}-x86_64.pkg.tar.zst`, note: "Atualize o sistema inteiro com sudo pacman -Syu antes; não use atualização parcial." };
    case "apt": return { label: "APT / Debian e Ubuntu", command: `sudo apt install ./${packageFile}_amd64.deb`, note: "O APT resolve dependências locais do pacote .deb." };
    case "dnf": return { label: "DNF / Fedora e RHEL", command: `sudo dnf install ./${packageFile}-x86_64.rpm`, note: "Use o RPM da release e arquitetura corretas." };
    case "zypper": return { label: "Zypper / openSUSE", command: `sudo zypper install ./${packageFile}-x86_64.rpm`, note: "Não misture RPMs de Leap, Tumbleweed ou outras releases." };
    case "flatpak-or-appimage": return { label: "Sistema transacional", command: `chmod +x ./${packageFile}-x86_64.AppImage && ./${packageFile}-x86_64.AppImage`, note: "Em sistemas imutáveis, prefira AppImage ou Flatpak em vez de sobrepor a base do sistema." };
    case "apk": return { label: "Alpine / APK", command: `sudo apk add --allow-untrusted ./${packageFile}-x86_64.apk`, note: "O pacote APK requer build específico para Alpine; use apenas um artefato publicado para sua arquitetura." };
    default: return { label: "Rota universal", command: `chmod +x ./${packageFile}-x86_64.AppImage && ./${packageFile}-x86_64.AppImage`, note: "Não há pacote nativo seguro publicado para esta família. A rota universal exige verificação de compatibilidade da distribuição." };
  }
};

const statusLabel: Record<DistroRegistryEntry["support"], string> = { "package-family": "Pacote por família", historical: "Histórica/descontinuada", "reference-only": "Referência não Linux", "research-required": "Avaliação necessária" };
const statusClass: Record<DistroRegistryEntry["support"], string> = { "package-family": "border-emerald-500/30 bg-emerald-500/10 text-emerald-300", historical: "border-amber-500/30 bg-amber-500/10 text-amber-300", "reference-only": "border-slate-500/30 bg-slate-500/10 text-slate-300", "research-required": "border-sky-500/30 bg-sky-500/10 text-sky-300" };

export default function DistroAtlas() {
  const [query, setQuery] = useState("");
  const [support, setSupport] = useState<"all" | DistroRegistryEntry["support"]>("all");
  const [limit, setLimit] = useState(36);
  const [copied, setCopied] = useState<string>();
  const entries = useMemo(() => distroRegistry.entries.filter((entry) => {
    const matchesQuery = !query.trim() || `${entry.name} ${entry.section} ${entry.family}`.toLocaleLowerCase("pt-BR").includes(query.trim().toLocaleLowerCase("pt-BR"));
    return matchesQuery && (support === "all" || entry.support === support);
  }), [query, support]);
  const sections = new Set(distroRegistry.entries.map((entry) => entry.section)).size;
  const copy = async (id: string, command: string) => { await navigator.clipboard?.writeText(command); setCopied(id); window.setTimeout(() => setCopied(undefined), 1600); };

  return <div className="min-h-screen bg-background"><SiteHeader /><main className="container technical-grid py-8 md:py-12"><header className="diagnostic-panel rounded-2xl border border-primary/15 p-5 md:p-8"><div className="relative z-10 max-w-4xl"><span className="evidence-label inline-flex rounded border border-primary/25 bg-primary/5 px-2 py-1 text-primary">STRAY LINUX / DISTRO ATLAS</span><h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">Mapa de distribuições, sem comandos inventados.</h1><p className="mt-4 max-w-3xl leading-7 text-muted-foreground">A lista fornecida reúne {distroRegistry.uniqueEntries.toLocaleString("pt-BR")} entradas únicas em {sections} grupos. O Atlas separa distribuições atuais, variantes, projetos históricos e sistemas que não são Linux. Um comando aparece somente quando a família de pacote é conhecida e o formato publicado é compatível.</p></div></header>
  <section className="mt-6 rounded-2xl border border-primary/15 bg-card/80 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><p className="evidence-label text-primary">CATÁLOGO AUDITÁVEL</p><span className="text-xs text-muted-foreground">Fonte: lista enviada pelo criador · {distroRegistry.totalListed} menções</span></div><div className="mt-4 flex flex-col gap-3 lg:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input className="pl-9" value={query} onChange={(event) => { setQuery(event.target.value); setLimit(36); }} placeholder="Pesquise Arch, Void, Bazzite, Debian, uma variante..." /></div><select className="h-10 rounded-md border bg-background px-3 text-sm" value={support} onChange={(event) => { setSupport(event.target.value as typeof support); setLimit(36); }}><option value="all">Todos os status</option><option value="package-family">Pacote por família</option><option value="research-required">Avaliação necessária</option><option value="historical">Histórica/descontinuada</option><option value="reference-only">Referência não Linux</option></select></div></section>
  <section className="mt-7"><div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><p className="evidence-label text-primary">RESULTADOS CLASSIFICADOS</p><h2 className="mt-1 text-xl font-semibold">{entries.length.toLocaleString("pt-BR")} entradas encontradas</h2></div><p className="max-w-xl text-right text-xs leading-5 text-muted-foreground">Pacotes nativos devem ser usados somente em distribuições suportadas pela família correspondente. Variantes imutáveis e itens sem pacote têm rota própria ou exigem avaliação.</p></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{entries.slice(0, limit).map((entry) => <DistroCard key={entry.id} entry={entry} copied={copied === entry.id} onCopy={copy} />)}</div>{entries.length === 0 ? <div className="mt-6 rounded-2xl border border-dashed p-10 text-center"><Info className="mx-auto h-6 w-6 text-primary" /><p className="mt-3 font-semibold">Nenhuma entrada encontrada.</p><p className="mt-2 text-sm text-muted-foreground">Tente outro nome, família ou status de suporte.</p></div> : entries.length > limit ? <div className="mt-7 text-center"><Button variant="outline" onClick={() => setLimit((value) => value + 36)}>Mostrar mais 36 distribuições</Button></div> : null}</section></main></div>;
}

function DistroCard({ entry, copied, onCopy }: { entry: DistroRegistryEntry; copied: boolean; onCopy: (id: string, command: string) => void }) {
  const route = commandFor(entry);
  const canInstall = entry.support === "package-family" || entry.support === "research-required";
  return <article className="group relative overflow-hidden rounded-2xl border bg-card/80 p-5 transition-transform duration-200 hover:-translate-y-0.5"><div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" /><div className="flex items-start justify-between gap-3"><div><p className="evidence-label text-primary">{entry.family}</p><h3 className="mt-2 text-lg font-semibold leading-tight">{entry.name}</h3></div><Badge variant="outline" className={statusClass[entry.support]}>{statusLabel[entry.support]}</Badge></div><p className="mt-3 text-sm text-muted-foreground">{entry.section}</p>{canInstall ? <div className="mt-5 rounded-xl border border-border/80 bg-background/60 p-3"><div className="flex items-center justify-between gap-2"><p className="text-xs font-medium text-foreground">{route.label}</p><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onCopy(entry.id, route.command)} aria-label="Copiar comando">{copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}</Button></div><code className="mt-2 block break-all rounded-md bg-muted/50 p-2 font-mono text-[11px] text-foreground">{route.command}</code><p className="mt-2 text-xs leading-5 text-muted-foreground">{route.note}</p></div> : <div className="mt-5 flex gap-2 rounded-xl border border-dashed p-3 text-xs leading-5 text-muted-foreground"><ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />{entry.support === "reference-only" ? "Este item não é uma distribuição Linux compatível com o aplicativo desktop. É mantido apenas como referência de catálogo." : "Não há comando de instalação seguro fornecido para esta entrada. Verifique o status do projeto, a arquitetura e a documentação oficial antes de usar um artefato."}</div>}<div className="mt-4 flex items-center justify-between gap-3 text-xs text-muted-foreground"><span className="flex items-center gap-2"><Terminal className="h-3.5 w-3.5 text-primary" />Política de instalação explícita</span><Link href={`/distros/${entry.id}`} className="font-medium text-primary hover:underline">Abrir perfil</Link></div></article>;
}
