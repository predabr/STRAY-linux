import { Check, Copy, ExternalLink, Github, HeartHandshake, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const GITHUB_URL = "https://github.com/predabr/STRAY-linux";
const PIX_KEY = "53205895819";

export default function ProjectSupport() {
  const [copied, setCopied] = useState(false);
  async function copyPix() {
    try {
      await navigator.clipboard.writeText(PIX_KEY);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }
  return <main className="desktop-editorial-page min-h-screen bg-background px-4 py-8 text-foreground sm:px-8 lg:px-12"><div className="mx-auto max-w-5xl"><div className="flex items-center gap-3 text-muted-foreground"><span className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card"><HeartHandshake className="h-5 w-5 text-primary" /></span><div><p className="font-tech text-[10px] tracking-[.18em] text-primary">STRAY LINUX / APOIO</p><p className="text-xs">Contribuição voluntária e transparente</p></div></div><section className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_.8fr]"><div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-9"><p className="font-tech text-[10px] tracking-[.18em] text-muted-foreground">APOIE O DESENVOLVIMENTO</p><h1 className="mt-4 max-w-2xl font-serif text-5xl leading-[.9] tracking-[-.07em] sm:text-7xl">Ajude a manter<br /><em className="font-normal text-primary">o caminho aberto.</em></h1><p className="mt-6 max-w-xl text-sm leading-7 text-muted-foreground">O apoio é opcional e não desbloqueia recursos. Ele ajuda a manter pesquisa, documentação, testes e distribuição do Stray Linux. Nenhum pagamento é processado dentro do app ou do site.</p><div className="mt-8 flex flex-wrap gap-3"><Button asChild className="h-11"><a href={GITHUB_URL} target="_blank" rel="noreferrer"><Github className="mr-2 h-4 w-4" />Abrir GitHub oficial <ExternalLink className="ml-2 h-3.5 w-3.5" /></a></Button><Button asChild variant="outline" className="h-11"><a href="https://linuxtoys-ckuyvpj5.manus.space/" target="_blank" rel="noreferrer">Voltar ao site</a></Button></div></div><aside className="rounded-3xl border border-primary/25 bg-primary/[.06] p-6 sm:p-8"><p className="font-tech text-[10px] tracking-[.18em] text-primary">PIX / CHAVE CPF</p><h2 className="mt-3 text-2xl font-semibold tracking-[-.04em]">Apoio direto</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">Confira o destinatário no seu banco antes de confirmar qualquer transferência. O Stray Linux não confirma, executa ou intermedeia o pagamento.</p><div className="mt-6 rounded-2xl border border-border bg-background/80 p-4"><p className="font-tech text-[9px] tracking-[.14em] text-muted-foreground">CHAVE PIX</p><code className="mt-2 block break-all text-xl font-semibold tracking-[.12em]">{PIX_KEY}</code><Button type="button" onClick={copyPix} variant="outline" className="mt-4 w-full">{copied ? <Check className="mr-2 h-4 w-4 text-emerald-400" /> : <Copy className="mr-2 h-4 w-4" />}{copied ? "Chave copiada" : "Copiar chave Pix"}</Button></div><div className="mt-4 flex gap-2 rounded-xl border border-amber-400/20 bg-amber-400/[.06] p-3 text-xs leading-5 text-muted-foreground"><ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />Chave vinculada a CPF é dado sensível. Confirme nome e CPF do destinatário no seu banco antes de enviar.</div></aside></section></div></main>;
}
