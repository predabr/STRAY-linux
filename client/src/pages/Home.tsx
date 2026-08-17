import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Check, Clipboard, ClipboardCheck, Download, ExternalLink, Gamepad2, ShieldCheck, Sparkles, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { landingCopy } from "@/i18n/landingCopy";
import { distributionAssets as assets, linuxInstallers } from "@/lib/distribution";

type Installer = (typeof linuxInstallers)[number];

const orbitWords = ["LOCAL FIRST", "FONTES EXPLÍCITAS", "GUIAS POR DISTRO", "SEM FPS FALSO", "DIAGNÓSTICO REAL"];
export default function Home() {
  const { locale } = useLanguage();
  const copy = landingCopy[locale];
  const [selected, setSelected] = useState<Installer["id"] | null>(null);
  const [copied, setCopied] = useState(false);
  const installer = useMemo(() => selected ? linuxInstallers.find((item) => item.id === selected) : undefined, [selected]);
  const copyTerminal = async () => { if (!installer) return; await navigator.clipboard?.writeText(installer.command); setCopied(true); window.setTimeout(() => setCopied(false), 1800); };

  return <div id="top" className="min-h-screen overflow-x-hidden bg-[#f0f0ec] text-[#0b0c10] selection:bg-[#0b0c10] selection:text-white">
    <SiteNav />
    <main>
      <section className="relative border-b border-black/15 px-4 pb-6 pt-4 sm:px-6 lg:px-8">
        <div className="editorial-hero relative overflow-hidden rounded-[1.75rem] bg-[#0b0c10] text-[#f5f5f0]">
          <div className="editorial-grid absolute inset-0 opacity-35" aria-hidden="true" />
          <div className="editorial-sparkles" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>

          <div className="relative mx-auto grid min-h-[650px] max-w-[1536px] grid-rows-[auto_1fr_auto] p-6 sm:p-9 lg:min-h-[760px] lg:p-12">
            <div className="flex items-start justify-between gap-5 text-[10px] font-semibold tracking-[.18em] text-white/55">
              <span>STRAY LINUX — 01/01</span>
              <span className="hidden sm:block">{copy.station}</span>
            </div>
            <div className="relative z-10 grid items-end gap-10 py-12 lg:grid-cols-[1fr_330px] lg:py-16">
              <div className="max-w-5xl editorial-reveal">
                <p className="mb-7 font-tech text-[10px] font-bold tracking-[.22em] text-[#8fafff]">{copy.eyebrow}</p>
                <h1 className="font-serif text-[clamp(4rem,11vw,10.5rem)] font-medium leading-[.75] tracking-[-.08em] text-white"><LetterReveal text={copy.heroMain} /><br /><em className="font-normal text-[#b7d3ff]"><LetterReveal text={copy.heroAccent} delay={360} /></em></h1>
                <div className="mt-10 grid max-w-2xl gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
                  <p className="max-w-md text-base leading-7 text-white/66 sm:text-lg">{copy.heroBody}</p>
                  <a href="#downloads" className="group inline-flex items-center gap-3 border-b border-white/45 pb-2 text-sm font-medium text-white transition-colors hover:border-[#8fafff] hover:text-[#8fafff]">{copy.chooseFormat} <ArrowDownRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-1" /></a>
                </div>
              </div>
              <div className="editorial-console editorial-reveal-delay border border-white/15 bg-white/[.055] p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between font-tech text-[9px] tracking-[.16em] text-white/45"><span>{copy.statusLocal}</span><span className="h-2 w-2 rounded-full bg-[#a9c7ff] shadow-[0_0_18px_#8fafff]" /></div>
                <div className="mt-8 space-y-5">
                  <ConsoleLine label="Scanner" value={copy.scannerValue} />
                  <ConsoleLine label="Biblioteca" value={copy.libraryValue} />
                  <ConsoleLine label="Evidência" value={copy.evidenceValue} />
                </div>
                <a href="#como-funciona" className="mt-10 flex items-center justify-between border-t border-white/12 pt-4 text-xs text-white/72 transition-colors hover:text-white"><span>{copy.viewPrinciples}</span><ArrowUpRight className="h-4 w-4" /></a>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/12 pt-5 font-tech text-[9px] tracking-[.16em] text-white/45">{orbitWords.map((word) => <span key={word} className="inline-flex items-center gap-2"><i className="h-1 w-1 rounded-full bg-[#8fafff]" />{word}</span>)}</div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="border-b border-black/15 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-[1536px]">
          <div className="grid gap-10 border-b border-black/15 pb-10 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
            <div><p className="font-tech text-[10px] font-bold tracking-[.2em] text-black/46">{copy.methodEyebrow}</p><p className="mt-5 max-w-xs text-sm leading-6 text-black/58">{copy.methodLead}</p></div>
            <h2 className="max-w-4xl font-serif text-5xl leading-[.9] tracking-[-.07em] sm:text-7xl">{copy.methodMain}<br /><em className="font-normal">{copy.methodAccent}</em></h2>
          </div>
          <div className="mt-1 grid lg:grid-cols-3">{copy.cards.map((card, index) => <article key={card.number} className={`editorial-card group relative min-h-[330px] border-b border-black/15 px-1 py-10 lg:border-b-0 lg:px-8 ${index > 0 ? "lg:border-l" : "lg:pl-0"}`}>
            <div className={`editorial-card-accent editorial-card-${card.tone}`} aria-hidden="true" />
            <div className="relative"><div className="flex items-start justify-between"><span className="font-tech text-[10px] tracking-[.18em] text-black/46">{card.number} / {card.tag}</span><ArrowUpRight className="h-4 w-4 text-black/45 transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1" /></div><h3 className="mt-14 max-w-sm text-3xl font-medium leading-[.96] tracking-[-.055em]">{card.title}</h3><p className="mt-5 max-w-sm text-sm leading-7 text-black/60">{card.copy}</p></div>
          </article>)}</div>
        </div>
      </section>

      <section className="bg-[#15161b] px-4 py-4 sm:px-6 lg:px-8">
        <div className="editorial-marquee overflow-hidden py-3 text-[clamp(1.9rem,4vw,4.4rem)] font-semibold leading-none tracking-[-.06em] text-[#f0f0ec]" aria-label={copy.marquee}><div className="editorial-marquee-track">{copy.marquee} <span>{copy.marquee}</span></div></div>
      </section>

      <section id="downloads" className="bg-[#d9e4ff] px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-[1536px]">
          <div className="grid gap-8 border-b border-black/15 pb-10 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
            <div><p className="font-tech text-[10px] font-bold tracking-[.2em] text-black/50">{copy.downloadsEyebrow}</p><p className="mt-5 max-w-xs text-sm leading-6 text-black/60">{copy.downloadsLead}</p></div>
            <h2 className="font-serif text-5xl leading-[.9] tracking-[-.07em] sm:text-7xl">{copy.downloadsMain}<br /><em className="font-normal">{copy.downloadsAccent}</em></h2>
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-[.73fr_1.27fr]"><WindowsDownload /><TerminalInstaller selected={selected} setSelected={setSelected} installer={installer} copied={copied} copyTerminal={copyTerminal} /></div>
          <p className="mt-6 text-sm text-black/62">{copy.uninstallLead}</p>
        </div>
      </section>
      <EvidenceSection copy={copy} />
    </main>
    <SiteFooter />
  </div>;
}

export function DownloadPage() {
  const { locale } = useLanguage();
  const copy = landingCopy[locale];
  const [selected, setSelected] = useState<Installer["id"] | null>(null);
  const [copied, setCopied] = useState(false);
  const installer = useMemo(() => selected ? linuxInstallers.find((item) => item.id === selected) : undefined, [selected]);
  const copyTerminal = async () => { if (!installer) return; await navigator.clipboard?.writeText(installer.command); setCopied(true); window.setTimeout(() => setCopied(false), 1800); };
  return <div className="min-h-screen bg-[#d9e4ff] text-[#0b0c10]"><SiteNav inverse /><main className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8"><div className="mx-auto max-w-[1536px]"><p className="font-tech text-[10px] font-bold tracking-[.2em] text-black/50">{copy.downloadsEyebrow}</p><h1 className="mt-5 max-w-4xl font-serif text-6xl leading-[.82] tracking-[-.08em] sm:text-8xl">{copy.downloadsMain}<br /><em className="font-normal">{copy.downloadsAccent}</em></h1><p className="mt-8 max-w-2xl text-base leading-8 text-black/62">{copy.downloadsLead}</p><div className="mt-12 grid gap-4 lg:grid-cols-[.73fr_1.27fr]"><WindowsDownload /><TerminalInstaller selected={selected} setSelected={setSelected} installer={installer} copied={copied} copyTerminal={copyTerminal} /></div></div></main><SiteFooter inverse /></div>;
}

function ConsoleLine({ label, value }: { label: string; value: string }) { return <div className="flex items-center justify-between gap-4 text-sm"><span className="text-white/52">{label}</span><span className="font-tech text-[10px] tracking-[.12em] text-white">{value}</span></div>; }

function WindowsDownload() { const { locale } = useLanguage(); const copy = landingCopy[locale]; return <article className="group relative overflow-hidden rounded-[1.25rem] bg-[#0b0c10] p-6 text-[#f5f5f0] sm:p-8"><div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#91b7ff]/20 blur-3xl transition-transform duration-500 group-hover:scale-125" aria-hidden="true" /><div className="relative"><p className="font-tech text-[10px] tracking-[.16em] text-white/48">{copy.windowsEyebrow}</p><h3 className="mt-10 text-4xl font-medium leading-none tracking-[-.06em]">{copy.windowsMain}<br />{copy.windowsAccent}</h3><p className="mt-5 max-w-xs text-sm leading-6 text-white/61">{copy.windowsBody}</p><a href={assets.exe} download="Stray-Linux-1.1.11-Setup.exe" className="mt-10 flex"><Button className="h-12 w-full rounded-full bg-[#f5f5f0] text-[#0b0c10] hover:bg-[#b7d3ff]"><Download className="mr-2 h-4 w-4" />{copy.downloadExe}</Button></a><p className="mt-5 text-xs leading-5 text-white/42">{copy.windowsFootnote}</p></div></article>; }

function SiteNav({ inverse = false }: { inverse?: boolean }) { const dark = inverse ? "border-black/12 bg-[#d9e4ff]/90 text-black" : "border-black/10 bg-[#f0f0ec]/90 text-black"; return <header className={`sticky top-0 z-50 border-b backdrop-blur-xl ${dark}`}><div className="mx-auto flex h-[72px] max-w-[1536px] items-center justify-between px-4 sm:px-6 lg:px-8"><a href="/" className="group flex items-center gap-3"><span className="grid h-11 w-11 place-items-center overflow-hidden rounded-full border border-black/15 bg-[#0b0c10]"><img className="h-full w-full object-contain p-0.5" src="/manus-storage/stray-linux-logo-2026_a7444aa6.png" alt="Nova logo Stray Linux" /></span><span className="text-xs font-bold leading-[.85] tracking-[-.03em]">STRAY<br />LINUX</span></a><div className="flex items-center gap-2 sm:gap-5"><a href="#como-funciona" className="hidden text-xs font-medium text-black/58 transition-colors hover:text-black sm:block">Método</a><a href="/uninstall" className="hidden text-xs font-medium text-black/58 transition-colors hover:text-black md:block">Desinstalar</a><a href="#downloads" className="inline-flex items-center gap-2 rounded-full bg-[#0b0c10] px-4 py-2.5 text-xs font-medium text-white transition-transform duration-200 hover:-translate-y-0.5 active:scale-[.97]">Downloads <ArrowDownRight className="h-3.5 w-3.5" /></a></div></div></header>; }

function SiteFooter({ inverse = false }: { inverse?: boolean }) { const { locale } = useLanguage(); const copy = landingCopy[locale]; return <footer className={inverse ? "border-t border-black/12 bg-[#d9e4ff] text-black/58" : "border-t border-white/12 bg-[#0b0c10] text-white/55"}><div className="mx-auto flex max-w-[1536px] flex-col gap-3 px-4 py-8 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"><span>© 2026 Stray Linux.</span><span>{copy.footerCreator}</span><a href="/uninstall" className="inline-flex items-center gap-1 hover:text-current">{copy.footerUninstall} <ExternalLink className="h-3 w-3" /></a></div></footer>; }

function LetterReveal({ text, delay = 0 }: { text: string; delay?: number }) { return <span aria-label={text}>{Array.from(text).map((character, index) => <span key={`${character}-${index}`} aria-hidden="true" className="editorial-letter" style={{ animationDelay: `${delay + index * 24}ms` }}>{character === " " ? "\u00a0" : character}</span>)}</span>; }

function EvidenceSection({ copy }: { copy: (typeof landingCopy)[keyof typeof landingCopy] }) { return <section className="bg-[#f0f0ec] px-4 py-20 sm:px-6 sm:py-28 lg:px-8"><div className="mx-auto max-w-[1536px]"><div className="grid gap-10 border-b border-black/15 pb-10 lg:grid-cols-[.72fr_1.28fr] lg:items-end"><div><p className="font-tech text-[10px] font-bold tracking-[.2em] text-black/46">{copy.evidenceEyebrow}</p><p className="mt-5 max-w-xs text-sm leading-6 text-black/58">{copy.evidenceBody}</p></div><h2 className="max-w-4xl font-serif text-5xl leading-[.9] tracking-[-.07em] sm:text-7xl">{copy.evidenceMain}<br /><em className="font-normal">{copy.evidenceAccent}</em></h2></div><div className="mt-1 grid lg:grid-cols-3">{copy.evidenceCards.map((item, index) => <article key={item.title} className={`editorial-evidence-card min-h-[220px] px-1 py-9 lg:px-8 ${index > 0 ? "lg:border-l lg:border-black/15" : "lg:pl-0"}`}><p className="font-tech text-[10px] tracking-[.18em] text-black/45">0{index + 1} / EVIDÊNCIA</p><h3 className="mt-10 text-2xl font-medium tracking-[-.04em]">{item.title}</h3><p className="mt-4 max-w-sm text-sm leading-7 text-black/60">{item.copy}</p></article>)}</div></div></section>; }

function TerminalInstaller({ selected, setSelected, installer, copied, copyTerminal }: { selected: Installer["id"] | null; setSelected: (value: Installer["id"]) => void; installer?: Installer; copied: boolean; copyTerminal: () => Promise<void> }) { return <article className="overflow-hidden rounded-[1.25rem] border border-black/15 bg-[#f8f8f5] shadow-[0_16px_40px_rgba(20,25,40,.10)]"><div className="flex items-center justify-between border-b border-black/10 px-5 py-5"><div className="flex items-center gap-2"><Terminal className="h-4 w-4" /><span className="font-tech text-[10px] tracking-[.14em]">INSTALAÇÃO LINUX</span></div><span className="font-tech text-[9px] text-black/45">ESCOLHA A FAMÍLIA</span></div><div className="flex overflow-x-auto border-b border-black/10 px-2">{linuxInstallers.map((item) => <button type="button" key={item.id} onClick={() => setSelected(item.id)} aria-pressed={selected === item.id} className={`shrink-0 border-b-2 px-3 py-4 text-xs transition-colors ${selected === item.id ? "border-black text-black" : "border-transparent text-black/45 hover:text-black"}`}>{item.signal}</button>)}</div>{installer ? <div className="p-5 sm:p-6"><div className="flex flex-col justify-between gap-3 border-b border-black/10 pb-5 sm:flex-row"><div><p className="font-tech text-[9px] tracking-[.14em] text-black/47">FORMATO SELECIONADO</p><p className="mt-1 text-sm font-medium">{installer.name} · pacote {installer.signal}</p></div><span className="inline-flex h-fit items-center gap-1.5 text-xs text-black/55"><ShieldCheck className="h-3.5 w-3.5" />SHA-256 incluso</span></div><pre className="mt-5 overflow-x-auto rounded-xl bg-[#0b0c10] p-5 font-tech text-[11px] leading-6 text-white/76"><code><span className="text-[#b7d3ff]">$</span> {installer.command}</code></pre><Button onClick={() => void copyTerminal()} className="mt-5 h-11 w-full rounded-full bg-[#0b0c10] text-white hover:bg-[#252936]">{copied ? <ClipboardCheck className="mr-2 h-4 w-4" /> : <Clipboard className="mr-2 h-4 w-4" />}{copied ? "Comando copiado" : "Copiar comando"}</Button><p className="mt-4 flex gap-2 text-xs leading-5 text-black/52"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0" />O bloco usa `bash -c`; pode ser colado em fish, zsh ou Bash.</p>{installer.id === "arch" ? <div className="mt-5 rounded-xl border border-[#4f65a0]/20 bg-[#eaf0ff] p-4 text-xs leading-6 text-black/66"><p className="font-tech text-[9px] tracking-[.14em] text-black/55">ARCH / PRIMEIRA ABERTURA</p><p className="mt-2">Depois do `sudo pacman -U`, confirme com <code>pacman -Q stray-linux</code> e abra pelo menu ou executando <code>stray-linux</code>. Se precisar diagnosticar o comando, confirme com <code>which stray-linux</code>.</p></div> : null}</div> : <div className="p-5 sm:p-6"><div className="rounded-xl border border-black/14 bg-black/[.025] p-5"><Gamepad2 className="h-5 w-5" /><p className="mt-5 font-tech text-[10px] tracking-[.14em] text-black/55">SELEÇÃO OBRIGATÓRIA</p><p className="mt-2 text-lg font-medium tracking-[-.03em]">Comece pela sua distribuição.</p><p className="mt-2 max-w-md text-sm leading-6 text-black/58">Use `cat /etc/os-release` para confirmar a família. Arch, CachyOS, EndeavourOS e Garuda usam exclusivamente a aba <strong>pacman</strong>.</p></div></div>}</article>; }
