import { Badge } from "@/components/ui/badge";
import { CheckCircle2, CircleHelp, UsersRound, WandSparkles } from "lucide-react";

const config = {
  verified: { label: "Verified", className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300", icon: CheckCircle2 },
  community: { label: "Community", className: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300", icon: UsersRound },
  estimated: { label: "Estimated", className: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300", icon: WandSparkles },
  unknown: { label: "No data", className: "border-muted-foreground/20 bg-muted text-muted-foreground", icon: CircleHelp },
} as const;

export function ProvenanceBadge({ provenance }: { provenance: string | null | undefined }) {
  const item = config[(provenance ?? "unknown") as keyof typeof config] ?? config.unknown;
  const Icon = item.icon;
  return <Badge variant="outline" className={`gap-1.5 font-medium ${item.className}`}><Icon className="h-3.5 w-3.5" />{item.label}</Badge>;
}
