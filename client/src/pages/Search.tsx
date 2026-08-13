import { SiteHeader } from "@/components/platform/SiteHeader";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { BookOpen, Cpu, Gamepad2, Search as SearchIcon, Server } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";

export default function SearchPage() {
  const [term, setTerm] = useState("");
  const input = useMemo(() => ({ q: term.trim().length >= 2 ? term.trim() : "xx", limit: 8 }), [term]);
  const results = trpc.search.query.useQuery(input, { enabled: term.trim().length >= 2 });
  const groups = results.data ? [
    { title: "Jogos", icon: Gamepad2, hrefFor: (item: { slug: string }) => `/games/${item.slug}`, items: results.data.games },
    { title: "Distribuições", icon: Server, hrefFor: (item: { slug: string }) => `/wiki/${item.slug}`, items: results.data.distributions },
    { title: "Hardware", icon: Cpu, hrefFor: () => "/benchmark", items: results.data.hardware },
    { title: "Guias", icon: BookOpen, hrefFor: (item: { slug: string }) => `/setup/${item.slug}`, items: results.data.guides },
  ] : [];
  return <div className="min-h-screen bg-background"><SiteHeader /><main className="container max-w-5xl py-10"><Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary">PESQUISA GLOBAL</Badge><h1 className="mt-3 text-4xl font-semibold tracking-tight">Encontre dados, não atalhos.</h1><div className="relative mt-7"><SearchIcon className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" /><Input autoFocus className="h-14 pl-11 text-base" value={term} onChange={(event) => setTerm(event.target.value)} placeholder="Pesquisar jogos, distribuições, hardware e guias" /></div>{term.trim().length < 2 ? <p className="mt-5 text-sm text-muted-foreground">Digite pelo menos dois caracteres para pesquisar em resultados categorizados.</p> : results.isLoading ? <div className="mt-8 space-y-4">{Array.from({ length: 4 }).map((_, index) => <Skeleton className="h-28 rounded-2xl" key={index} />)}</div> : results.isError ? <p className="mt-8 rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-muted-foreground">Não foi possível pesquisar agora. Tente novamente em alguns instantes.</p> : <div className="mt-8 grid gap-5 md:grid-cols-2">{groups.map((group) => <section key={group.title} className="rounded-2xl border bg-card p-5"><div className="flex items-center gap-2"><group.icon className="h-5 w-5 text-primary" /><h2 className="font-semibold">{group.title}</h2><span className="text-xs text-muted-foreground">{group.items.length}</span></div><div className="mt-4 space-y-2">{group.items.length ? group.items.map((item) => <Link key={item.id} href={group.hrefFor(item)} className="block rounded-xl border p-3 transition-colors hover:bg-accent"><p className="font-medium">{item.title}</p>{item.description ? <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{item.description}</p> : null}</Link>) : <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">Nenhum resultado nesta categoria.</p>}</div></section>)}</div>}</main></div>;
}
