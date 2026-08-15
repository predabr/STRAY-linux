import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { trpc } from "@/lib/trpc";
import { BookOpen, FileSearch, Gamepad2, Gauge, GitCompareArrows, LayoutDashboard, MonitorCog, Network, Search, Server, Settings2, ShieldCheck, Wrench } from "lucide-react";
import { windowsActions, windowsApps } from "@/data/windowsCatalog";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";

const quickLinks = [
  { label: "Abrir GameHub", hint: "Catálogo e compatibilidade", href: "/games", icon: Gamepad2 },
  { label: "Consultar benchmark", hint: "Evidência por ambiente", href: "/benchmark", icon: Gauge },
  { label: "Comparar benchmarks", hint: "GPUs e ambientes verificados", href: "/compare", icon: GitCompareArrows },
  { label: "Abrir área Windows", hint: "Manutenção e aplicativos", href: "/windows", icon: MonitorCog },
  { label: "Abrir Atlas de distros", hint: "753 entradas classificadas", href: "/distros", icon: Server },
  { label: "Ver Linux Setup", hint: "Guias e comandos", href: "/setup", icon: Settings2 },
  { label: "Diagnosticar no LinuxFix", hint: "Soluções rastreáveis", href: "/linuxfix", icon: Wrench },
  { label: "Abrir painel", hint: "Perfil e histórico", href: "/dashboard", icon: LayoutDashboard },
  { label: "Abrir System Graph", hint: "Relações do snapshot local", href: "/system-graph", icon: Network },
  { label: "Abrir pré-voo", hint: "Checagens antes de abrir jogo", href: "/preflight", icon: ShieldCheck },
  { label: "Abrir Recuperação", hint: "Backup e modo seguro locais", href: "/recovery", icon: ShieldCheck },
  { label: "Abrir Logs", hint: "Registros técnicos locais", href: "/logs", icon: FileSearch },
  { label: "Abrir Alertas", hint: "Eventos locais relevantes", href: "/notifications", icon: ShieldCheck },
];
const recentKey = "stray-command-recent-v1";
function readRecent() { try { const value = JSON.parse(localStorage.getItem(recentKey) || "[]"); return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string").slice(0, 6) : []; } catch { return []; } }

type PaletteProps = { open?: boolean; onOpenChange?: (open: boolean) => void };

export function GlobalCommandPalette({ open: controlledOpen, onOpenChange }: PaletteProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [recent, setRecent] = useState<string[]>(readRecent);
  const [, setLocation] = useLocation();
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = (value: boolean) => {
    setUncontrolledOpen(value);
    onOpenChange?.(value);
  };
  const searchInput = useMemo(() => ({ q: term.trim().length >= 2 ? term.trim() : "xx", limit: 6 }), [term]);
  const results = trpc.search.query.useQuery(searchInput, { enabled: open && term.trim().length >= 2 });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(!open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const go = (href: string) => {
    const nextRecent = [href, ...recent.filter((item) => item !== href)].slice(0, 6);
    setRecent(nextRecent);
    localStorage.setItem(recentKey, JSON.stringify(nextRecent));
    setOpen(false);
    setTerm("");
    setLocation(href);
  };
  const searchedGroups = results.data
    ? [
        { label: "Jogos", icon: Gamepad2, items: results.data.games, href: (item: { slug: string }) => `/games/${item.slug}` },
        { label: "Distribuições", icon: Server, items: results.data.distributions, href: (item: { slug: string }) => `/wiki/${item.slug}` },
        { label: "Guias", icon: BookOpen, items: results.data.guides, href: (item: { slug: string }) => `/setup/${item.slug}` },
      ]
    : [];
  const windowsMatches = term.trim().length >= 2 ? [...windowsActions.map((item) => ({ id: `action-${item.id}`, title: item.title, description: item.description })), ...windowsApps.map((item) => ({ id: `app-${item.id}`, title: item.name, description: `${item.category}: ${item.description}` }))].filter((item) => `${item.title} ${item.description}`.toLocaleLowerCase("pt-BR").includes(term.trim().toLocaleLowerCase("pt-BR"))).slice(0, 6) : [];

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Paleta Stray Linux" description="Navegue e pesquise na plataforma" className="max-w-2xl">
      <CommandInput value={term} onValueChange={setTerm} placeholder="Pesquisar jogos, distros, guias ou abrir uma área…" />
      <CommandList>
        <CommandEmpty>{results.isLoading ? "Pesquisando dados indexados…" : "Nenhuma ação ou resultado encontrado."}</CommandEmpty>
        {term.trim().length < 2 ? (
          <><CommandGroup heading="Acesso rápido">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return <CommandItem key={item.href} value={`${item.label} ${item.hint}`} onSelect={() => go(item.href)}><Icon /><span>{item.label}</span><span className="ml-auto truncate text-xs text-muted-foreground">{item.hint}</span></CommandItem>;
            })}
          </CommandGroup>{recent.length ? <CommandGroup heading="Recentes">{recent.map((href) => { const item = quickLinks.find((entry) => entry.href === href); if (!item) return null; const Icon = item.icon; return <CommandItem key={`recent-${href}`} value={`Recente ${item.label}`} onSelect={() => go(href)}><Icon /><span>{item.label}</span><span className="ml-auto text-xs text-muted-foreground">recente</span></CommandItem>; })}</CommandGroup> : null}</>
        ) : null}
        {searchedGroups.length ? <CommandSeparator /> : null}
        {searchedGroups.map((group) => {
          const Icon = group.icon;
          return group.items.length ? <CommandGroup key={group.label} heading={group.label}>{group.items.map((item: { id: number; slug: string; title: string; description?: string | null }) => <CommandItem key={`${group.label}-${item.id}`} value={`${item.title} ${item.description ?? ""}`} onSelect={() => go(group.href(item))}><Icon /><span className="min-w-0"><span className="block truncate">{item.title}</span>{item.description ? <span className="block truncate text-xs text-muted-foreground">{item.description}</span> : null}</span></CommandItem>)}</CommandGroup> : null;
        })}
        {windowsMatches.length ? <CommandGroup heading="Windows">{windowsMatches.map((item) => <CommandItem key={item.id} value={`${item.title} ${item.description}`} onSelect={() => go("/windows")}><MonitorCog /><span className="min-w-0"><span className="block truncate">{item.title}</span><span className="block truncate text-xs text-muted-foreground">{item.description}</span></span></CommandItem>)}</CommandGroup> : null}
        <CommandSeparator />
        <CommandGroup heading="Atalhos"><CommandItem onSelect={() => go("/search")}><Search /><span>Abrir pesquisa avançada</span><CommandShortcut>↵</CommandShortcut></CommandItem></CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
