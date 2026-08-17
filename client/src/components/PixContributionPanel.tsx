import { LockKeyhole, QrCode, ShieldCheck } from "lucide-react";
import { trpc } from "@/lib/trpc";

export function PixContributionPanel({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const { data, isLoading } = trpc.support.pixStatus.useQuery();
  const dark = tone === "dark";
  const shell = dark ? "border-white/[.08] bg-black/20 text-white" : "border-border bg-background text-foreground";
  const muted = dark ? "text-white/55" : "text-muted-foreground";

  if (isLoading) return <div className={`rounded-xl border p-5 ${shell}`}><p className={`font-tech text-[9px] tracking-[.14em] ${muted}`}>VERIFICANDO CANAL PIX</p></div>;
  if (data?.mode !== "static") return <div className={`rounded-xl border p-5 ${shell}`}><div className="flex gap-3"><LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><div><p className="font-tech text-[9px] tracking-[.14em]">PIX MANUAL INDISPONÍVEL</p><p className={`mt-2 text-sm leading-6 ${muted}`}>Nenhum QR é exibido até que a chave e os metadados do recebedor sejam configurados somente no servidor.</p></div></div></div>;
  return <section className={`rounded-xl border p-5 ${shell}`} aria-label="Contribuição manual por Pix"><div className="flex items-start gap-3"><span className={`grid h-9 w-9 place-items-center rounded-lg ${dark ? "bg-white/10" : "bg-primary/10"}`}><QrCode className="h-4 w-4 text-primary" /></span><div><p className="font-tech text-[9px] tracking-[.14em]">PIX MANUAL</p><p className={`mt-1 text-sm leading-6 ${muted}`}>Escaneie no aplicativo do seu banco e confirme o destinatário e o valor antes de autorizar.</p></div></div><div className="mt-5 grid gap-4 sm:grid-cols-[148px_1fr] sm:items-center"><div className="w-fit rounded-lg bg-white p-3" role="img" aria-label="QR Code Pix para contribuição manual" dangerouslySetInnerHTML={{ __html: data.qrCodeSvg }} /><div><p className="text-sm font-medium">Contribuição voluntária</p><p className={`mt-2 text-xs leading-5 ${muted}`}>Este QR não confirma pagamento no Stray Linux e não desbloqueia recursos. A confirmação ocorre somente no seu banco.</p></div></div><p className={`mt-4 flex gap-2 text-xs leading-5 ${muted}`}><ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />O QR é gerado de um BR Code validado no servidor; a chave não é embutida no código do site.</p></section>;
}
