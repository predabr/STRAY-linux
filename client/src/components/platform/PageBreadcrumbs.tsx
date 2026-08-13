import { ChevronRight, Home } from "lucide-react";
import { Link } from "wouter";

export type BreadcrumbItem = { label: string; href?: string };

export function PageBreadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return <nav aria-label="Navegação estrutural" className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground"><Link href="/" className="inline-flex items-center gap-1 rounded px-1 py-1 hover:bg-accent hover:text-foreground"><Home className="h-3.5 w-3.5" />Início</Link>{items.map((item, index) => <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1.5"><ChevronRight className="h-3.5 w-3.5" />{item.href ? <Link href={item.href} className="rounded px-1 py-1 hover:bg-accent hover:text-foreground">{item.label}</Link> : <span className="px-1 py-1 text-foreground" aria-current="page">{item.label}</span>}</span>)}</nav>;
}
