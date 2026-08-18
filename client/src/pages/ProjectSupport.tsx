import { ExternalLink, Github, HeartHandshake, LockKeyhole, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PixContributionPanel } from "@/components/PixContributionPanel";
import { GithubProjectQr } from "@/components/GithubProjectQr";

const GITHUB_URL = "https://github.com/predabr/STRAY-linux";

export default function ProjectSupport() {
  return (
    <main className="desktop-editorial-page min-h-screen bg-background px-4 py-8 text-foreground sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center gap-3 text-muted-foreground">
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card"><HeartHandshake className="h-5 w-5 text-primary" /></span>
          <div><p className="font-tech text-[10px] tracking-[.18em] text-primary">STRAY LINUX / APOIO</p><p className="text-xs">Contribuição voluntária e transparente</p></div>
        </div>
        <section className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-9">
            <p className="font-tech text-[10px] tracking-[.18em] text-muted-foreground">APOIE O DESENVOLVIMENTO</p>
            <h1 className="mt-4 max-w-2xl font-serif text-5xl leading-[.9] tracking-[-.07em] sm:text-7xl">Ajude a manter<br /><em className="font-normal text-primary">o caminho aberto.</em></h1>
            <p className="mt-6 max-w-xl text-sm leading-7 text-muted-foreground">O apoio é opcional e não desbloqueia recursos. Um QR manual só aparece quando o servidor possui uma configuração Pix completa; checkout dinâmico e confirmação automática exigem um provedor autorizado. O aplicativo não exibe chaves Pix, CPF, dados bancários nem processa pagamentos diretamente.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button disabled className="h-11"><LockKeyhole className="mr-2 h-4 w-4" />Checkout seguro em configuração</Button>
              <Button asChild variant="outline" className="h-11"><a href={GITHUB_URL} target="_blank" rel="noreferrer"><Github className="mr-2 h-4 w-4" />Abrir GitHub oficial <ExternalLink className="ml-2 h-3.5 w-3.5" /></a></Button>
            </div>
            <div className="mt-6 max-w-xl"><PixContributionPanel tone="light" /></div>
            <GithubProjectQr className="mt-4 max-w-xl" tone="light" />
          </div>
          <aside className="rounded-3xl border border-primary/25 bg-primary/[.06] p-6 sm:p-8">
            <p className="font-tech text-[10px] tracking-[.18em] text-primary">PAGAMENTO / PROTEÇÃO</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-.04em]">Checkout dinâmico indisponível</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">A confirmação automática depende de uma conta recebedora verificada e de credenciais do provedor. Até isso ocorrer, não há link de pagamento, cobrança individual, coleta de dados financeiros ou redirecionamento.</p>
            <div className="mt-6 space-y-3 rounded-2xl border border-border bg-background/80 p-4 text-sm">
              <div className="flex gap-3"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /><span>Confirmações futuras serão aceitas apenas por webhook autenticado no servidor.</span></div>
              <div className="flex gap-3"><LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>Nenhuma chave Pix, CPF, token ou dado bancário é publicado nesta tela.</span></div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
