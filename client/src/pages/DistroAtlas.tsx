import { SiteHeader } from "@/components/platform/SiteHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { atlasNavigationCopy } from "@/i18n/atlasNavigationCopy";
import { distroRegistry, type DistroRegistryEntry } from "@shared/distro-registry";
import { ArrowRight, Boxes, ChevronRight, Compass, Info, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";

type AtlasView = "start" | "families" | "catalog";
type Copy = typeof atlasNavigationCopy["pt-BR"];
type PackageFamily = { id: string; label: string; entries: DistroRegistryEntry[] };

const packageFamilyLabels: Record<string, string> = {
  pacman: "Pacman (Arch)",
  apt: "APT (Debian/Ubuntu)",
  dnf: "DNF (Fedora/RHEL)",
  zypper: "Zypper (openSUSE)",
  "flatpak-or-appimage": "AppImage",
  apk: "APK (Alpine)",
};

const packageFamilyReferences: Record<string, string> = {
  pacman: "Arch Linux",
  apt: "Ubuntu",
  dnf: "Fedora Workstation",
  zypper: "openSUSE Tumbleweed",
  "flatpak-or-appimage": "Bazzite",
  apk: "Alpine Linux",
};

const supportLabel: Record<DistroRegistryEntry["support"], string> = {
  "package-family": "Pacote por família",
  historical: "Histórica/descontinuada",
  "reference-only": "Referência não Linux",
  "research-required": "Avaliação necessária",
};

const supportClass: Record<DistroRegistryEntry["support"], string> = {
  "package-family": "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  historical: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  "reference-only": "border-slate-500/30 bg-slate-500/10 text-slate-300",
  "research-required": "border-sky-500/30 bg-sky-500/10 text-sky-300",
};

const featuredNames = [
  "Bazzite", "CachyOS", "Nobara", "Arch Linux", "EndeavourOS", "Fedora Linux", "Ubuntu", "Linux Mint", "Pop!_OS", "Zorin OS", "Debian", "openSUSE", "Manjaro", "Gentoo", "KDE neon",
];

function normalise(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
}

export default function DistroAtlas() {
  const { locale } = useLanguage();
  const copy = atlasNavigationCopy[locale];
  const [view, setView] = useState<AtlasView>("start");
  const [query, setQuery] = useState("");
  const [support, setSupport] = useState<"all" | DistroRegistryEntry["support"]>("all");
  const [limit, setLimit] = useState(24);

  const entries = useMemo(() => distroRegistry.entries.filter((entry) => {
    const matchesQuery = !query.trim() || `${entry.name} ${entry.section} ${entry.family}`.toLocaleLowerCase("pt-BR").includes(query.trim().toLocaleLowerCase("pt-BR"));
    return matchesQuery && (support === "all" || entry.support === support);
  }), [query, support]);

  const featured = useMemo(() => {
    const supported = distroRegistry.entries.filter((entry) => entry.support === "package-family") as readonly DistroRegistryEntry[];
    const ordered: DistroRegistryEntry[] = [];
    featuredNames.forEach((name) => {
      const match = supported.find((entry) => normalise(entry.name) === normalise(name));
      if (match) ordered.push(match);
    });
    return ordered.slice(0, 12);
  }, []);

  const families = useMemo<PackageFamily[]>(() => {
    const grouped = new Map<string, DistroRegistryEntry[]>();
    distroRegistry.entries.filter((entry) => entry.support === "package-family" && entry.installer !== null).forEach((entry) => {
      const installer = entry.installer!;
      const current = grouped.get(installer) ?? [];
      current.push(entry);
      grouped.set(installer, current);
    });
    return Object.keys(packageFamilyLabels).flatMap((id) => {
      const entries = grouped.get(id);
      return entries ? [{ id, label: packageFamilyLabels[id]!, entries }] : [];
    }).sort((left, right) => left.label.localeCompare(right.label, "pt-BR"));
  }, []);

  const sections = new Set(distroRegistry.entries.map((entry) => entry.section)).size;
  const chooseView = (next: AtlasView) => {
    setView(next);
    if (next !== "catalog") {
      setQuery("");
      setSupport("all");
    }
    window.setTimeout(() => document.getElementById("atlas-content")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  };

  return <div className="min-h-screen bg-background"><SiteHeader /><main className="container technical-grid py-8 md:py-12">
    <header className="diagnostic-panel rounded-2xl border border-primary/15 p-5 md:p-8">
      <div className="relative z-10 max-w-4xl"><span className="evidence-label inline-flex rounded border border-primary/25 bg-primary/5 px-2 py-1 text-primary">STRAY LINUX / DISTRO ATLAS</span><h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">{copy.heroTitle}</h1><p className="mt-4 max-w-3xl leading-7 text-muted-foreground">{copy.heroDescription}</p></div>
    </header>

    <section aria-label="Caminhos do Atlas" className="mt-6 grid gap-3 md:grid-cols-3">
      <AtlasPath active={view === "start"} icon={<Compass className="h-5 w-5" />} label={copy.start} description={copy.startDescription} action={copy.openPath} onClick={() => chooseView("start")} />
      <AtlasPath active={view === "families"} icon={<Boxes className="h-5 w-5" />} label={copy.family} description={copy.familyDescription} action={copy.openPath} onClick={() => chooseView("families")} />
      <AtlasPath active={view === "catalog"} icon={<Search className="h-5 w-5" />} label={copy.catalog} description={copy.catalogDescription} action={copy.openPath} onClick={() => chooseView("catalog")} />
    </section>

    <section id="atlas-content" className="mt-8 scroll-mt-24">
      {view === "start" ? <StartView copy={copy} entries={featured} onCatalog={() => chooseView("catalog")} /> : null}
      {view === "families" ? <FamilyView copy={copy} families={families} /> : null}
      {view === "catalog" ? <CatalogView copy={copy} entries={entries} query={query} support={support} limit={limit} sections={sections} onQueryChange={(value) => { setQuery(value); setLimit(24); }} onSupportChange={(value) => { setSupport(value); setLimit(24); }} onLoadMore={() => setLimit((value) => value + 24)} /> : null}
    </section>
  </main></div>;
}

function AtlasPath({ active, icon, label, description, action, onClick }: { active: boolean; icon: React.ReactNode; label: string; description: string; action: string; onClick: () => void }) {
  return <button type="button" aria-pressed={active} onClick={onClick} className={`group rounded-2xl border p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${active ? "border-primary/50 bg-primary/10 shadow-[0_0_0_1px_hsl(var(--primary)/0.12)]" : "border-border bg-card/70 hover:border-primary/35 hover:bg-primary/5"}`}><span className={`flex h-9 w-9 items-center justify-center rounded-xl ${active ? "bg-primary text-primary-foreground" : "bg-muted text-primary"}`}>{icon}</span><p className="mt-4 font-semibold">{label}</p><p className="mt-1 text-sm leading-5 text-muted-foreground">{description}</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">{action} <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" /></span></button>;
}

function StartView({ copy, entries, onCatalog }: { copy: Copy; entries: DistroRegistryEntry[]; onCatalog: () => void }) {
  return <div><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="evidence-label text-primary">{copy.startEyebrow}</p><h2 className="mt-2 text-2xl font-semibold">{copy.startHeading}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{copy.startHelp}</p></div><Button variant="outline" onClick={onCatalog}>{copy.catalogCta} <ArrowRight className="ml-2 h-4 w-4" /></Button></div><div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{entries.map((entry) => <CompactDistroCard key={entry.id} copy={copy} entry={entry} />)}</div></div>;
}

function FamilyView({ copy, families }: { copy: Copy; families: PackageFamily[] }) {
  return <div><div><p className="evidence-label text-primary">{copy.familyEyebrow}</p><h2 className="mt-2 text-2xl font-semibold">{copy.familyHeading}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{copy.familyHelp}</p></div><div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{families.map((family) => <FamilyCard key={family.id} copy={copy} family={family} />)}</div></div>;
}

function CatalogView({ copy, entries, query, support, limit, sections, onQueryChange, onSupportChange, onLoadMore }: { copy: Copy; entries: DistroRegistryEntry[]; query: string; support: "all" | DistroRegistryEntry["support"]; limit: number; sections: number; onQueryChange: (value: string) => void; onSupportChange: (value: "all" | DistroRegistryEntry["support"]) => void; onLoadMore: () => void }) {
  return <div><div className="rounded-2xl border border-primary/15 bg-card/80 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="evidence-label text-primary">{copy.catalogEyebrow}</p><p className="mt-1 text-sm text-muted-foreground">{copy.catalogHelp}</p></div><span className="text-xs text-muted-foreground">{distroRegistry.uniqueEntries.toLocaleString("pt-BR")} entradas · {sections} grupos</span></div><div className="mt-4 flex flex-col gap-3 lg:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input className="pl-9" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Pesquise Arch, Void, Bazzite, Debian, uma variante..." /></div><select aria-label="Filtrar status de suporte" className="h-10 rounded-md border bg-background px-3 text-sm" value={support} onChange={(event) => onSupportChange(event.target.value as typeof support)}><option value="all">Todos os status</option><option value="package-family">Pacote por família</option><option value="research-required">Avaliação necessária</option><option value="historical">Histórica/descontinuada</option><option value="reference-only">Referência não Linux</option></select></div></div><div className="mt-7 flex flex-wrap items-end justify-between gap-3"><div><p className="evidence-label text-primary">RESULTADOS CLASSIFICADOS</p><h2 className="mt-1 text-xl font-semibold">{entries.length.toLocaleString("pt-BR")} entradas encontradas</h2></div><p className="max-w-xl text-right text-xs leading-5 text-muted-foreground">{copy.catalogResultHelp}</p></div><div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{entries.slice(0, limit).map((entry) => <CompactDistroCard key={entry.id} copy={copy} entry={entry} />)}</div>{entries.length === 0 ? <div className="mt-6 rounded-2xl border border-dashed p-10 text-center"><Info className="mx-auto h-6 w-6 text-primary" /><p className="mt-3 font-semibold">Nenhuma entrada encontrada.</p><p className="mt-2 text-sm text-muted-foreground">Tente outro nome, família ou status de suporte.</p></div> : entries.length > limit ? <div className="mt-7 text-center"><Button variant="outline" onClick={onLoadMore}>Mostrar mais 24 distribuições</Button></div> : null}</div>;
}

function CompactDistroCard({ copy, entry }: { copy: Copy; entry: DistroRegistryEntry }) {
  return <article className="rounded-2xl border bg-card/80 p-4 transition-transform duration-200 hover:-translate-y-0.5"><div className="flex items-start justify-between gap-3"><div><p className="evidence-label text-primary">{entry.family}</p><h3 className="mt-2 text-lg font-semibold leading-tight">{entry.name}</h3></div><Badge variant="outline" className={supportClass[entry.support]}>{supportLabel[entry.support]}</Badge></div><p className="mt-3 line-clamp-1 text-sm text-muted-foreground">{entry.section}</p><Link href={`/distros/${entry.id}`} className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">{copy.profileLink} <ArrowRight className="h-4 w-4" /></Link></article>;
}

function FamilyCard({ copy, family }: { copy: Copy; family: PackageFamily }) {
  const reference = family.entries.find((entry) => entry.name === packageFamilyReferences[family.id]) ?? family.entries[0]!;
  return <article className="rounded-2xl border bg-card/80 p-5"><p className="evidence-label text-primary">{copy.mappedFamily(family.entries.length)}</p><h3 className="mt-2 text-lg font-semibold">{family.label}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{reference.name}</p><Link href={`/distros/${reference.id}`} className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">{copy.referenceLink} <ArrowRight className="h-4 w-4" /></Link></article>;
}
