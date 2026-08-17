import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function OperationalMetric({ icon: Icon, label, value, note }: { icon: LucideIcon; label: string; value: string | number; note: string }) {
  return <Card className="stray-surface"><CardContent className="flex items-center gap-4 p-5"><span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span><div><p className="text-2xl font-semibold">{value}</p><p className="text-sm font-medium">{label}</p><p className="text-xs text-muted-foreground">{note}</p></div></CardContent></Card>;
}
