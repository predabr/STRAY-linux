import { Link } from "wouter";

const logoUrl = "/manus-storage/stray-linux-logo-v2_0835fafe.png";

export function StrayBrandMark({ compact = false }: { compact?: boolean }) {
  return <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label="Stray Linux, início"><span className="grid h-10 w-10 overflow-hidden rounded-xl border border-primary/30 bg-[#06070d] shadow-[0_0_26px_-9px_hsl(var(--primary))] transition-transform duration-200 group-hover:scale-105"><img src={logoUrl} alt="Nova logo Stray Linux" className="h-full w-full object-contain" /></span>{!compact ? <span className="hidden leading-none sm:block"><span className="block font-semibold tracking-tight">Stray <span className="text-primary">Linux</span></span><span className="mt-1 block font-mono text-[8px] font-medium tracking-[0.18em] text-muted-foreground">EXPLORE / CONFIGURE / JOGUE</span></span> : null}</Link>;
}
