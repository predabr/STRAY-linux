import { useAuth } from "@/_core/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { linuxFixModerationCopy } from "@/i18n/linuxFixCopy";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, ExternalLink, FileWarning, ShieldAlert, XCircle } from "lucide-react";
import { useState } from "react";

export default function Moderation() {
  const { user, loading } = useAuth();
  const { locale, t } = useLanguage();
  const copy = linuxFixModerationCopy[locale];
  const canModerate = user?.role === "moderator" || user?.role === "admin";
  const utils = trpc.useUtils();
  const proposals = trpc.linuxFixCommunity.moderation.list.useQuery(undefined, { enabled: canModerate });
  const review = trpc.linuxFixCommunity.moderation.review.useMutation({ onSuccess: () => utils.linuxFixCommunity.moderation.list.invalidate() });
  const [notes, setNotes] = useState<Record<number, string>>({});

  if (loading) return <main className="container py-12"><div className="h-40 animate-pulse rounded-2xl bg-muted" /></main>;
  if (!canModerate) return <main className="container py-12"><Card className="mx-auto max-w-2xl border-amber-500/25"><CardContent className="p-7 text-center"><ShieldAlert className="mx-auto h-7 w-7 text-amber-500" /><h1 className="mt-4 text-xl font-semibold">{t("requiredLogin")}</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">{t("loginToContinue")}</p></CardContent></Card></main>;

  const decide = (id: number, status: "in_review" | "accepted" | "rejected") => review.mutate({ id, status, reviewNote: notes[id] ?? "" });
  return <main className="container technical-grid py-8 md:py-12"><header className="diagnostic-panel rounded-2xl border border-primary/15 p-5 md:p-7"><div className="relative z-10"><p className="evidence-label text-primary">MODERATION / LINUXFIX</p><h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{copy.title}</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{copy.description}</p></div></header><section className="mt-7 space-y-4">{proposals.isLoading ? <div className="h-48 animate-pulse rounded-2xl bg-muted" /> : proposals.data?.length ? proposals.data.map((item) => { const proposal = item.proposal; const context = proposal.contextSnapshot as Record<string, string | null> | null; const note = notes[proposal.id] ?? ""; return <Card key={proposal.id} className="border-violet-400/20 bg-card/85"><CardContent className="p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><div className="flex flex-wrap items-center gap-2"><Badge variant="outline" className="font-tech text-[10px] tracking-[0.08em]">RUNBOOK #{proposal.fixId}</Badge><Badge variant="secondary">{proposal.status.replaceAll("_", " ")}</Badge></div><h2 className="mt-3 text-lg font-semibold">{proposal.title}</h2><p className="mt-1 text-xs text-muted-foreground">{item.fixTitle} · {item.authorName || "Conta sem nome público"} · {new Date(proposal.createdAt).toLocaleString(locale)}</p></div></div><div className="mt-5 grid gap-4 lg:grid-cols-3"><ProposalField label="OBSERVAÇÃO" value={proposal.observation} /><ProposalField label="REPRODUÇÃO" value={proposal.reproduction} /><ProposalField label="PROCEDIMENTO SUGERIDO" value={proposal.suggestedSteps} /></div>{context ? <div className="mt-4 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.04] p-4"><p className="font-tech text-[10px] font-bold tracking-[0.1em] text-cyan-300">{copy.context.toUpperCase()}</p><p className="mt-2 text-sm text-muted-foreground">{Object.entries(context).filter(([, value]) => value).map(([key, value]) => `${key}: ${value}`).join(" · ") || "—"}</p></div> : null}{proposal.sourceUrl ? <a className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline" href={proposal.sourceUrl} target="_blank" rel="noreferrer">{copy.source}<ExternalLink className="h-4 w-4" /></a> : null}<div className="mt-5 border-t border-white/8 pt-5"><Textarea value={note} onChange={(event) => setNotes((current) => ({ ...current, [proposal.id]: event.target.value }))} placeholder={copy.review} aria-label={copy.review} /><div className="mt-3 flex flex-wrap gap-2"><Button size="sm" variant="outline" disabled={note.trim().length < 8 || review.isPending} onClick={() => decide(proposal.id, "in_review")}>{copy.review}</Button><Button size="sm" disabled={note.trim().length < 8 || review.isPending} onClick={() => decide(proposal.id, "accepted")}><CheckCircle2 className="mr-1.5 h-4 w-4" />{copy.accept}</Button><Button size="sm" variant="destructive" disabled={note.trim().length < 8 || review.isPending} onClick={() => decide(proposal.id, "rejected")}><XCircle className="mr-1.5 h-4 w-4" />{copy.reject}</Button></div>{review.isError ? <p className="mt-3 text-xs text-destructive">Não foi possível registrar a decisão agora.</p> : null}</div></CardContent></Card>; }) : <Card><CardContent className="p-10 text-center"><FileWarning className="mx-auto h-6 w-6 text-muted-foreground" /><p className="mt-3 text-sm text-muted-foreground">{copy.empty}</p></CardContent></Card>}</section></main>;
}

function ProposalField({ label, value }: { label: string; value: string }) { return <div className="rounded-xl border bg-background/40 p-4"><p className="font-tech text-[10px] font-bold tracking-[0.1em] text-primary">{label}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{value}</p></div>; }
