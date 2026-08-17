import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function SignalEmptyState({ icon: Icon, eyebrow, title, body, action }: { icon: LucideIcon; eyebrow: string; title: string; body: string; action?: { href: string; label: string } }) {
  return <div className="rounded-2xl border border-dashed bg-muted/20 p-8 text-center"><Icon className="mx-auto h-7 w-7 text-muted-foreground" /><p className="evidence-label mt-4 text-primary">{eyebrow}</p><h2 className="mt-2 text-xl font-semibold">{title}</h2><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">{body}</p>{action ? <Link href={action.href}><Button className="mt-5" variant="outline">{action.label}</Button></Link> : null}</div>;
}
