import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTrustCopy } from "@/i18n/trustCopy";
import { CheckCircle2, CircleHelp, Landmark, UsersRound, WandSparkles } from "lucide-react";

const config = {
  verified: { className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300", icon: CheckCircle2 },
  community: { className: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300", icon: UsersRound },
  estimated: { className: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300", icon: WandSparkles },
  unknown: { className: "border-muted-foreground/20 bg-muted text-muted-foreground", icon: CircleHelp },
} as const;

type TrustDetails = { sourceName?: string | null; sourceUrl?: string | null; updatedAt?: Date | string | number | null; confidence?: string | null; method?: string | null; evidenceCount?: number | null };

export function ProvenanceBadge({ provenance, official = false, details }: { provenance: string | null | undefined; official?: boolean; details?: TrustDetails }) {
  const { locale, formatDate } = useLanguage();
  const copy = getTrustCopy(locale);
  const item = config[(provenance ?? "unknown") as keyof typeof config] ?? config.unknown;
  const Icon = official ? Landmark : item.icon;
  const label = official ? copy.official : provenance === "verified" ? copy.verified : provenance === "community" ? copy.community : provenance === "estimated" ? copy.estimated : copy.unverified;
  const badge = <Badge variant="outline" className={`gap-1.5 font-medium ${official ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300" : item.className}`}><Icon className="h-3.5 w-3.5" />{label}</Badge>;
  if (!details) return badge;
  return <Popover><PopoverTrigger asChild><button type="button" className="rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={copy.details}>{badge}</button></PopoverTrigger><PopoverContent align="start" className="w-72 space-y-2 text-sm"><p className="font-semibold">{copy.details}</p><TrustRow label={copy.status} value={label} /><TrustRow label={copy.source} value={details.sourceName || copy.noSource} href={details.sourceUrl} />{details.updatedAt ? <TrustRow label={copy.date} value={formatDate(details.updatedAt, { dateStyle: "medium" })} /> : null}{details.confidence ? <TrustRow label={copy.confidence} value={details.confidence} /> : null}{details.method ? <TrustRow label={copy.method} value={details.method} /> : null}{typeof details.evidenceCount === "number" ? <TrustRow label={copy.evidence} value={String(details.evidenceCount)} /> : null}</PopoverContent></Popover>;
}

function TrustRow({ label, value, href }: { label: string; value: string; href?: string | null }) { return <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-2 text-xs"><span className="font-tech uppercase tracking-wide text-muted-foreground">{label}</span>{href ? <a className="truncate text-primary underline-offset-4 hover:underline" href={href} target="_blank" rel="noreferrer">{value}</a> : <span className="break-words text-foreground">{value}</span>}</div>; }
