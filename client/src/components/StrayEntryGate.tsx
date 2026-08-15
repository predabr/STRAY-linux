import { useAuth } from "@/_core/hooks/useAuth";
import { StrayBrandMark } from "@/components/platform/StrayBrandMark";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { introCopy } from "@/i18n/introCopy";
import { normalizeRoute, routeRequiresAccount } from "@/lib/routeAccess";
import { startLogin } from "@/const";
import { ArrowRight, CheckCircle2, CircleDotDashed, Sparkles, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation } from "wouter";

const introAudioUrl = "/manus-storage/intro-ambient_54206208.mp3";
const introStorageKey = "stray-intro-complete";

export function StrayEntryGate({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const { locale } = useLanguage();
  const [location] = useLocation();
  const [introComplete, setIntroComplete] = useState(() => sessionStorage.getItem(introStorageKey) === "1");
  const [localEntry, setLocalEntry] = useState(() => sessionStorage.getItem("stray-local-entry") === "1");
  const desktopMode = typeof window !== "undefined" && ["127.0.0.1", "localhost"].includes(window.location.hostname);
  const pathOnly = normalizeRoute(location);
  const introPreviewRequested = new URLSearchParams(location.split("?")[1] ?? "").get("intro") === "1";
  const requiresAccount = routeRequiresAccount(location);

  if (pathOnly === "/" && introPreviewRequested && !introComplete) return <Intro locale={locale} onComplete={() => { sessionStorage.setItem(introStorageKey, "1"); setIntroComplete(true); }} />;
  if (!requiresAccount) return <>{children}</>;
  if (loading) return <ProductLoader />;
  if (isAuthenticated || (desktopMode && localEntry)) return <>{children}</>;
  return <Access locale={locale} desktopMode={desktopMode} onLocalContinue={() => { sessionStorage.setItem("stray-local-entry", "1"); setLocalEntry(true); }} />;
}

function ProductLoader() {
  return <main className="stray-loader-shell relative grid min-h-screen place-items-center overflow-hidden bg-[#0a0d13] px-6 text-white" aria-busy="true" aria-live="polite"><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_28%_15%,rgba(59,130,246,.16),transparent_36%),radial-gradient(ellipse_at_78%_86%,rgba(34,211,238,.09),transparent_34%)]" /><section className="stray-loader-core relative z-10 flex w-full max-w-sm flex-col items-center text-center"><div className="relative grid h-20 w-20 place-items-center overflow-hidden rounded-[1.5rem] border border-cyan-200/20 bg-white/[.045] shadow-[0_18px_60px_rgba(0,0,0,.3)]"><StrayBrandMark compact /><span aria-hidden="true" className="stray-loader-sweep absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-cyan-100/70 to-transparent blur-md" /></div><p className="mt-7 font-tech text-[10px] uppercase tracking-[.2em] text-cyan-200">STRAY LINUX / INICIANDO</p><h1 className="mt-3 text-2xl font-semibold tracking-tight">Preparando seu ambiente.</h1><p className="mt-3 text-sm leading-6 text-white/52">Verificando sessão e carregando a interface local.</p><div className="mt-7 h-1.5 w-full overflow-hidden rounded-full bg-white/8"><div className="stray-loader-sweep h-full w-[45%] rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400" /></div><div className="mt-4 flex items-center justify-center gap-1.5" aria-label="Carregando"><span className="stray-loader-dot h-1.5 w-1.5 rounded-full bg-cyan-200" /><span className="stray-loader-dot h-1.5 w-1.5 rounded-full bg-cyan-200" /><span className="stray-loader-dot h-1.5 w-1.5 rounded-full bg-cyan-200" /></div></section></main>;
}

function Intro({ locale, onComplete }: { locale: keyof typeof introCopy; onComplete: () => void }) {
  const copy = introCopy[locale];
  const [leaving, setLeaving] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const finish = () => {
    if (leaving) return;
    setLeaving(true);
    window.setTimeout(onComplete, 720);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target instanceof HTMLElement ? event.target : null;
      if (target?.closest("button, a, input, select, textarea")) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        finish();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audioEnabled) { audio.pause(); return; }
    void audio.play().catch(() => setAudioEnabled(false));
  }, [audioEnabled]);

  return <main className="intro-stage relative grid min-h-screen overflow-hidden bg-[#16171a] text-foreground"><audio ref={audioRef} src={introAudioUrl} loop preload="metadata" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(255,255,255,0.1),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.035),transparent_44%)]" />
    <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.028)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.028)_1px,transparent_1px)] [background-size:48px_48px]" />
    <div className="relative z-10 flex min-h-screen flex-col px-6 py-6 md:px-10"><header className="flex items-center justify-between gap-2"><span className="max-w-28 font-mono text-[10px] font-medium tracking-[0.18em] text-white/50">{copy.eyebrow}</span><div className="flex shrink-0 items-center gap-1"><Button variant="ghost" size="sm" className="px-2 text-white/70 hover:bg-white/10 hover:text-white sm:px-3" onClick={() => setAudioEnabled((current) => !current)} aria-pressed={audioEnabled} aria-label={audioEnabled ? copy.muteSound : copy.enableSound}>{audioEnabled ? <Volume2 className="mr-2 h-4 w-4" /> : <VolumeX className="mr-2 h-4 w-4" />}{audioEnabled ? copy.muteSound : copy.enableSound}</Button><Button variant="ghost" size="icon" className="text-white/70 hover:bg-white/10 hover:text-white sm:hidden" onClick={finish} aria-label={copy.skip} title={copy.skip}><ArrowRight className="h-4 w-4" /></Button><Button variant="ghost" size="sm" className="hidden text-white/70 hover:bg-white/10 hover:text-white sm:inline-flex" onClick={finish}>{copy.skip}</Button></div></header>
      <section className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center text-center"><div className="intro-logo-reveal relative isolate mt-[-4vh] rounded-[2rem] border border-white/10 bg-white/[0.055] px-9 py-8 shadow-[0_18px_80px_rgba(0,0,0,0.26)] backdrop-blur"><div className="intro-logo-pop scale-[1.36] sm:scale-[1.55]"><StrayBrandMark /></div><div aria-hidden="true" className="intro-light-scan pointer-events-none absolute inset-y-0 left-[-36%] w-[28%] -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent blur-md" /></div>
        <p className="mt-7 text-[10px] font-medium uppercase tracking-[0.24em] text-white/45">{copy.soundHint}</p><h1 aria-label={copy.title} className="mt-7 max-w-4xl text-3xl font-semibold tracking-[-0.035em] text-white sm:text-5xl md:text-6xl">{Array.from(copy.title).map((character, index) => <span aria-hidden="true" key={`${character}-${index}`} className="intro-type-char" style={{ animationDelay: `${420 + index * 42}ms` }}>{character === " " ? "\u00a0" : character}</span>)}</h1><p className="intro-subtitle mt-5 max-w-2xl text-base leading-7 text-white/65 md:text-lg">{copy.subtitle}</p><div className="intro-controls mt-9 flex flex-col items-center gap-3"><Button size="lg" className="min-w-52 bg-white text-slate-950 hover:bg-white/90" onClick={finish}>{copy.continue}<ArrowRight className="ml-2 h-4 w-4" /></Button><p className="text-xs text-white/45">{copy.keyboardHint}</p></div>
      </section><footer className="relative z-10 flex items-center justify-between border-t border-white/10 pt-5 text-xs text-white/45"><span>Stray Linux · Brasil</span><span className="inline-flex items-center gap-2"><Sparkles className="h-3.5 w-3.5" />EXPLORE / CONFIGURE / JOGUE</span></footer>
    </div><div aria-hidden="true" className={`intro-curtain ${leaving ? "intro-curtain-open" : ""}`} />
  </main>;
}

function Access({ locale, desktopMode, onLocalContinue }: { locale: keyof typeof introCopy; desktopMode: boolean; onLocalContinue: () => void }) {
  const copy = introCopy[locale];
  return <main className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-5"><div className="absolute inset-0 technical-grid opacity-70" /><section className="relative z-10 w-full max-w-lg rounded-3xl border border-primary/20 bg-card/90 p-7 shadow-2xl shadow-primary/10 backdrop-blur-xl md:p-9"><StrayBrandMark /><p className="evidence-label mt-10 text-primary">{copy.accessEyebrow}</p><h1 className="mt-3 text-3xl font-semibold tracking-tight">{copy.accessTitle}</h1><p className="mt-3 leading-7 text-muted-foreground">{copy.accessBody}</p>{desktopMode ? <div className="mt-7 rounded-2xl border border-primary/20 bg-primary/5 p-4"><p className="font-medium">{copy.localMode}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{copy.localModeBody}</p><Button className="mt-4 w-full" size="lg" onClick={onLocalContinue}>{copy.localContinue}<ArrowRight className="ml-2 h-4 w-4" /></Button></div> : <div className="mt-7"><Button className="w-full" size="lg" onClick={() => startLogin()}>{copy.signIn}<ArrowRight className="ml-2 h-4 w-4" /></Button><p className="mt-3 flex gap-2 text-xs leading-5 text-muted-foreground"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />{copy.providerHint}</p></div>}<div className="mt-7 flex items-center gap-2 border-t pt-5 text-xs text-muted-foreground"><Sparkles className="h-3.5 w-3.5 text-primary" />Stray Linux · Brasil</div></section></main>;
}
