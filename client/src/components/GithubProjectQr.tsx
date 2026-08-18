import { trpc } from "@/lib/trpc";
import { Github, Loader2, QrCode } from "lucide-react";

type GithubProjectQrProps = { className?: string; tone?: "dark" | "light" };

export function GithubProjectQr({ className = "", tone = "dark" }: GithubProjectQrProps) {
  const githubQr = trpc.support.githubQr.useQuery();
  const dark = tone === "dark";
  const cardClass = dark ? "border-white/[.10] bg-black/20 text-white" : "border-border bg-card text-foreground";
  const mutedClass = dark ? "text-white/58" : "text-muted-foreground";
  const iconClass = dark ? "text-blue-200" : "text-primary";
  return <section className={`rounded-xl border p-4 ${cardClass} ${className}`} aria-label="QR Code do GitHub oficial"><div className="flex items-start gap-3"><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border ${dark ? "border-blue-300/20 bg-blue-400/[.08]" : "border-primary/20 bg-primary/10"}`}><QrCode className={`h-4 w-4 ${iconClass}`} /></span><div><p className="font-tech text-[9px] tracking-[.14em] opacity-70">GITHUB OFICIAL</p><p className="mt-1 text-sm font-medium">Aponte a câmera para abrir o repositório.</p><p className={`mt-1 text-xs leading-5 ${mutedClass}`}>Código institucional para código-fonte, releases e documentação. Não é um QR de pagamento.</p></div></div><div className="mt-4 flex flex-wrap items-center gap-4"><div className={`grid h-28 w-28 place-items-center overflow-hidden rounded-lg border bg-white p-1 ${dark ? "border-white/10" : "border-border"}`}>{githubQr.isLoading ? <Loader2 className="h-5 w-5 animate-spin text-slate-700" /> : githubQr.data?.qrCodeSvg ? <div className="h-full w-full [&>svg]:h-full [&>svg]:w-full" role="img" aria-label="QR Code do GitHub oficial" dangerouslySetInnerHTML={{ __html: githubQr.data.qrCodeSvg }} /> : <Github className="h-5 w-5 text-slate-700" />}</div><a className={`inline-flex items-center gap-2 text-sm font-medium hover:underline ${dark ? "text-blue-200" : "text-primary"}`} href={githubQr.data?.githubUrl ?? "https://github.com/predabr/STRAY-linux"} target="_blank" rel="noreferrer"><Github className="h-4 w-4" />Abrir GitHub oficial</a></div>{githubQr.isError ? <p className={`mt-3 text-xs ${mutedClass}`}>O link oficial continua disponível mesmo que o QR não carregue agora.</p> : null}</section>;
}
