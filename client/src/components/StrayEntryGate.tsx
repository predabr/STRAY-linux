import { useAuth } from "@/_core/hooks/useAuth";
import { StrayBrandMark } from "@/components/platform/StrayBrandMark";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { ArrowRight, CheckCircle2, ChevronRight, CircleDotDashed, Cpu, Gamepad2, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "wouter";

const scenes = [
  { eyebrow: "STRAY LINUX / 01", title: "Seu PC não é genérico.", body: "Distribuição, driver, kernel e runtime mudam a experiência. O Stray Linux começa pelo seu ambiente real.", icon: Cpu },
  { eyebrow: "STRAY LINUX / 02", title: "Cada comando tem um lugar.", body: "A central separa famílias, variantes imutáveis e projetos históricos antes de sugerir uma rota de configuração.", icon: ShieldCheck },
  { eyebrow: "STRAY LINUX / 03", title: "Pronto para explorar.", body: "Catálogo de jogos, Atlas de distribuições, guias e evidências técnicas reunidos em um só caminho.", icon: Gamepad2 },
];

export function StrayEntryGate({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const [location] = useLocation();
  const [stage, setStage] = useState<"intro" | "access">(() => sessionStorage.getItem("stray-intro-complete") === "1" ? "access" : "intro");
  const [scene, setScene] = useState(0);
  const desktopMode = typeof window !== "undefined" && ["127.0.0.1", "localhost"].includes(window.location.hostname);
  const [localEntry, setLocalEntry] = useState(() => sessionStorage.getItem("stray-local-entry") === "1");
  const requiresAccount = ["/dashboard", "/admin", "/assistant", "/scanner"].some((path) => location === path || location.startsWith(`${path}/`));

  useEffect(() => {
    if (stage !== "intro") return;
    const timer = window.setTimeout(() => {
      if (scene < scenes.length - 1) setScene((current) => current + 1);
      else { sessionStorage.setItem("stray-intro-complete", "1"); setStage("access"); }
    }, 3400);
    return () => window.clearTimeout(timer);
  }, [scene, stage]);

  if (!requiresAccount && location !== "/") return <>{children}</>;
  if (loading) return <div className="grid min-h-screen place-items-center bg-background"><CircleDotDashed className="h-7 w-7 animate-spin text-primary" /></div>;
  if (isAuthenticated || (desktopMode && localEntry)) return <>{children}</>;
  if (stage === "intro") return <Intro scene={scene} onNext={() => { if (scene < scenes.length - 1) setScene(scene + 1); else { sessionStorage.setItem("stray-intro-complete", "1"); setStage("access"); } }} onSkip={() => { sessionStorage.setItem("stray-intro-complete", "1"); setStage("access"); }} />;
  return <Access desktopMode={desktopMode} onLocalContinue={() => { sessionStorage.setItem("stray-local-entry", "1"); setLocalEntry(true); }} />;
}

function Intro({ scene, onNext, onSkip }: { scene: number; onNext: () => void; onSkip: () => void }) {
  const current = scenes[scene];
  const Icon = current.icon;
  return <main className="relative grid min-h-screen overflow-hidden bg-[#05070c] text-foreground"><div className="absolute inset-0 opacity-70 [background-image:linear-gradient(hsl(var(--primary)/0.08)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--primary)/0.08)_1px,transparent_1px)] [background-size:48px_48px]" /><div className="absolute -left-24 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[130px]" /><div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-cyan-400/10 blur-[130px]" /><div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col px-6 py-7 md:px-10"><div className="flex items-center justify-between"><StrayBrandMark /><Button variant="ghost" size="sm" onClick={onSkip}>Pular introdução</Button></div><div className="my-auto grid flex-1 items-center gap-10 py-14 md:grid-cols-[1.1fr_.9fr]"><div className="max-w-3xl"><p className="font-mono text-xs font-medium tracking-[0.22em] text-primary">{current.eyebrow}</p><h1 className="mt-5 text-5xl font-semibold tracking-[-0.05em] md:text-7xl">{current.title}</h1><p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">{current.body}</p><div className="mt-10 flex items-center gap-3"><Button size="lg" onClick={onNext}>{scene === scenes.length - 1 ? "Entrar no Stray Linux" : "Próxima cena"}<ChevronRight className="ml-2 h-4 w-4" /></Button><div className="flex gap-2">{scenes.map((item, index) => <span key={item.eyebrow} className={`h-1.5 rounded-full transition-all ${index === scene ? "w-9 bg-primary" : "w-2 bg-muted-foreground/35"}`} />)}</div></div></div><div className="relative mx-auto grid aspect-square w-full max-w-md place-items-center"><div className="absolute inset-0 rounded-[2.5rem] border border-primary/20 bg-card/30 backdrop-blur-sm" /><div className="absolute inset-7 rounded-[2rem] border border-primary/30 bg-[radial-gradient(circle_at_35%_30%,hsl(var(--primary)/0.35),transparent_35%),linear-gradient(135deg,hsl(var(--primary)/0.12),transparent_55%)]" /><div className="relative grid h-28 w-28 place-items-center rounded-3xl border border-primary/30 bg-background/80 shadow-[0_0_80px_-20px_hsl(var(--primary))]"><Icon className="h-12 w-12 text-primary" /></div><span className="absolute left-8 top-9 rounded border border-primary/20 bg-background/70 px-2 py-1 font-mono text-[10px] text-primary">VERIFY</span><span className="absolute bottom-10 right-7 rounded border border-cyan-400/20 bg-background/70 px-2 py-1 font-mono text-[10px] text-cyan-300">READY</span></div></div><footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-5 text-xs text-muted-foreground"><span>Stray Linux · criado no Brasil</span><span className="font-mono">INTRO / {String(scene + 1).padStart(2, "0")}</span></footer></div></main>;
}

function Access({ desktopMode, onLocalContinue }: { desktopMode: boolean; onLocalContinue: () => void }) {
  return <main className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-5"><div className="absolute inset-0 technical-grid opacity-70" /><section className="relative z-10 w-full max-w-lg rounded-3xl border border-primary/20 bg-card/90 p-7 shadow-2xl shadow-primary/10 backdrop-blur-xl md:p-9"><StrayBrandMark /><p className="evidence-label mt-10 text-primary">ACESSO PROTEGIDO</p><h1 className="mt-3 text-3xl font-semibold tracking-tight">Entre para abrir sua central.</h1><p className="mt-3 leading-7 text-muted-foreground">Seu dashboard sincroniza perfis, favoritos, guias salvos, histórico de correções e reports. A autenticação do site usa o provedor seguro já configurado.</p>{desktopMode ? <div className="mt-7 rounded-2xl border border-primary/20 bg-primary/5 p-4"><p className="font-medium">Modo local detectado</p><p className="mt-1 text-sm leading-6 text-muted-foreground">A versão desktop funciona com SQLite local e não exige banco remoto. Continue para abrir seu catálogo offline.</p><Button className="mt-4 w-full" size="lg" onClick={onLocalContinue}>Abrir modo local <ArrowRight className="ml-2 h-4 w-4" /></Button></div> : <div className="mt-7"><Button className="w-full" size="lg" onClick={() => startLogin()}>Continuar com sua conta <ArrowRight className="ml-2 h-4 w-4" /></Button><p className="mt-3 flex gap-2 text-xs leading-5 text-muted-foreground"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />Se o provedor de autenticação conectado oferecer Google, a escolha aparecerá na etapa segura de entrada. Não é criado um login Google paralelo ou sem credenciais.</p></div>}<div className="mt-7 flex items-center gap-2 border-t pt-5 text-xs text-muted-foreground"><Sparkles className="h-3.5 w-3.5 text-primary" />Stray Linux · criado por Pedro Henrique Gouveia Araújo de Souza · Brasil</div></section></main>;
}
