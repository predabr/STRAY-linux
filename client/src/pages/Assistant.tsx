import { useAuth } from "@/_core/hooks/useAuth";
import { AIChatBox, type Message } from "@/components/AIChatBox";
import { SiteHeader } from "@/components/platform/SiteHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, CircleHelp, ExternalLink, FileCheck2, MonitorCog, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

type Citation = { type: "wiki" | "guide" | "linuxfix"; title: string; slug: string; sourceUrl: string | null };
type ResponseContext = { inScope: boolean; profileAvailable: boolean; internalSources: number; memoryUsed?: boolean };
type Explanation = { facts: string[]; inferences: string[]; estimates: string[]; unknowns: string[]; why: { internalSources: number; profileUsed: boolean; memoryUsed: boolean; confidence: string } };

export default function AssistantPage() {
  const { isAuthenticated, loading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [responseContext, setResponseContext] = useState<ResponseContext | null>(null);
  const [explanation, setExplanation] = useState<Explanation | null>(null);
  const [sessionId, setSessionId] = useState<number | undefined>();
  const ask = trpc.chat.ask.useMutation();
  const askPublic = trpc.chat.askPublic.useMutation();
  const profiles = trpc.user.profiles.list.useQuery(undefined, { enabled: isAuthenticated });
  const activeProfile = profiles.data?.find((profile) => profile.isActive);
  const isPending = ask.isPending || askPublic.isPending;

  const send = async (question: string) => {
    if (isPending) return;
    setMessages((current) => [...current, { role: "user", content: question }]);
    try {
      const result = isAuthenticated ? await ask.mutateAsync({ question, sessionId }) : await askPublic.mutateAsync({ question });
      if ("sessionId" in result && typeof result.sessionId === "number") setSessionId(result.sessionId);
      setMessages((current) => [...current, { role: "assistant", content: result.answer }]);
      setCitations(result.citations);
      setResponseContext(result.context);
      setExplanation(result.explanation as Explanation);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível concluir a resposta.";
      setMessages((current) => [...current, { role: "assistant", content: `**Não foi possível responder agora.**\n\n${message}` }]);
      setResponseContext(null);
      setExplanation(null);
      setCitations([]);
    }
  };

  if (loading) return <div className="min-h-screen bg-background"><SiteHeader /><main className="container py-20 text-center text-muted-foreground">Carregando sessão…</main></div>;

  return <div className="min-h-screen bg-background"><SiteHeader /><main className="container max-w-[1440px] technical-grid py-5 md:py-7"><div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]"><section className="min-w-0"><div className="stray-ai-brief stray-product-section rounded-2xl p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><Badge variant="outline" className="border-cyan-300/25 bg-cyan-300/5 font-tech text-[10px] text-cyan-200">STRAY AI / DIAGNÓSTICO FUNDAMENTADO</Badge><h1 className="mt-3 text-3xl font-semibold tracking-tight">Pergunte. Verifique. Decida.</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">O Stray AI organiza artigos, guias e LinuxFix publicados. {isAuthenticated ? "O perfil técnico ativo é aplicado quando disponível." : "No modo visitante, não grava conversa nem acessa perfil pessoal."}</p></div><div className="stray-ai-status rounded-xl px-3 py-2 text-right"><p className="stray-kicker">SESSÃO</p><p className="mt-1 text-xs text-emerald-300">{isPending ? "analisando contexto" : isAuthenticated ? "privada e pronta" : "visitante e pronta"}</p></div></div><div className="mt-5 grid gap-2 text-xs sm:grid-cols-3"><Signal label="MÉTODO" text="evidência antes de hipótese" /><Signal label="SEGURANÇA" text="sem alterar o sistema" /><Signal label="ESCOPO" text="limites declarados" /></div></div><QuickActions disabled={isPending} onSelect={send} /><div className="mt-5"><AIChatBox className="stray-ai-console" messages={messages} onSendMessage={send} isLoading={isPending} height="560px" placeholder="Ex.: Meu jogo apresenta stutter. O que o Hub indica?" emptyStateMessage="Pergunte sobre Linux, Proton, Vulkan, guias e correções revisadas. No modo visitante, nada é salvo." /></div>{responseContext ? <EvidenceContext context={responseContext} /> : null}{explanation ? <ExplanationPanel explanation={explanation} /> : null}{citations.length ? <CitationList citations={citations} /> : null}</section><aside className="space-y-4"><ContextCard loading={profiles.isLoading} activeProfile={activeProfile} visitor={!isAuthenticated} /><ContractCard /></aside></div></main></div>;
}

function Signal({ label, text }: { label: string; text: string }) { return <div className="stray-ai-signal rounded-lg px-3 py-2.5"><p className="stray-kicker">{label}</p><p className="mt-1 text-white/68">{text}</p></div>; }

function QuickActions({ disabled, onSelect }: { disabled: boolean; onSelect: (question: string) => void }) { const actions = ["Verifique meu ambiente para Vulkan indisponível.", "Meu jogo apresenta stutter: quais ações seguras o Hub indica?", "Estou no Bazzite: o que devo confirmar antes de mudar a imagem?", "Uso Garuda ou CachyOS: qual guia publicado devo consultar primeiro?"]; return <Card className="stray-surface mt-5 shadow-none"><CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><CheckCircle2 className="h-4 w-4 text-cyan-200" />Atalhos de diagnóstico</CardTitle><CardDescription>Preenchem uma pergunta segura; a resposta continua limitada ao perfil e ao conteúdo publicado.</CardDescription></CardHeader><CardContent className="grid gap-2 sm:grid-cols-2">{actions.map((action) => <Button key={action} type="button" variant="outline" disabled={disabled} onClick={() => onSelect(action)} className="h-auto justify-start whitespace-normal border-white/10 bg-white/[.02] px-3 py-3 text-left text-xs leading-5 hover:bg-cyan-300/[.06]">{action}</Button>)}</CardContent></Card>; }

function EvidenceContext({ context }: { context: ResponseContext }) { return <Card className="stray-surface mt-5 shadow-none"><CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><FileCheck2 className="h-4 w-4 text-cyan-200" />Base da resposta atual</CardTitle><CardDescription>Transparência do contexto usado nesta conversa.</CardDescription></CardHeader><CardContent className="grid gap-2 sm:grid-cols-4"><ContextPill label="Escopo" value={context.inScope ? "Stray Linux" : "Recusado"} /><ContextPill label="Perfil" value={context.profileAvailable ? "Aplicado" : "Não disponível"} /><ContextPill label="Fontes internas" value={String(context.internalSources)} /><ContextPill label="Memória" value={context.memoryUsed ? "Consentida" : "Não usada"} /></CardContent></Card>; }

function ExplanationPanel({ explanation }: { explanation: Explanation }) { const sections = [["FACT", explanation.facts], ["INFERENCE", explanation.inferences], ["ESTIMATE", explanation.estimates], ["UNKNOWN", explanation.unknowns]] as const; return <Card className="stray-surface mt-5 shadow-none"><CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><CircleHelp className="h-4 w-4 text-cyan-200" />Por que esta resposta?</CardTitle><CardDescription>Classificação auditável do contexto; confiança {explanation.why.confidence}.</CardDescription></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2">{sections.map(([label, entries]) => <div key={label} className="rounded-xl border bg-black/10 p-3"><p className="stray-kicker">{label}</p>{entries.length ? <ul className="mt-2 space-y-1 text-xs leading-5 text-muted-foreground">{entries.map((entry) => <li key={entry}>• {entry}</li>)}</ul> : <p className="mt-2 text-xs text-muted-foreground">Nenhum item nesta categoria.</p>}</div>)}</CardContent></Card>; }

function CitationList({ citations }: { citations: Citation[] }) { return <Card className="stray-surface mt-5 shadow-none"><CardHeader className="pb-3"><CardTitle className="text-base">Fontes internas recuperadas</CardTitle><CardDescription>Consulte o conteúdo original e a fonte registrada antes de executar qualquer passo.</CardDescription></CardHeader><CardContent className="space-y-2">{citations.map((citation) => <Link key={`${citation.type}-${citation.slug}`} href={`/${citation.type === "wiki" ? "wiki" : citation.type === "guide" ? "setup" : "linuxfix"}/${citation.slug}`} className="stray-ai-citation flex items-center justify-between rounded-lg p-3 text-sm"><span>{citation.title}</span><ExternalLink className="h-4 w-4 text-primary" /></Link>)}</CardContent></Card>; }

function ContextCard({ loading, activeProfile, visitor }: { loading: boolean; activeProfile: { name: string; kernelVersion: string | null; driverVersion: string | null; protonVersion: string | null } | undefined; visitor: boolean }) { return <Card className="stray-surface shadow-none"><CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><MonitorCog className="h-4 w-4 text-cyan-200" />Contexto ativo</CardTitle><CardDescription>Campos conhecidos que podem orientar a resposta atual.</CardDescription></CardHeader><CardContent>{visitor ? <div className="stray-empty-state rounded-xl p-3"><p className="text-sm font-medium">Modo visitante</p><p className="mt-1 text-xs leading-5 text-muted-foreground">A resposta consulta apenas conteúdo publicado. Nenhum histórico ou perfil pessoal é salvo ou lido.</p></div> : loading ? <p className="text-sm text-muted-foreground">Carregando perfil…</p> : activeProfile ? <div className="space-y-2 text-xs"><ContextRow label="Perfil" value={activeProfile.name} /><ContextRow label="Kernel" value={activeProfile.kernelVersion || "não informado"} /><ContextRow label="Driver" value={activeProfile.driverVersion || "não informado"} /><ContextRow label="Proton" value={activeProfile.protonVersion || "não informado"} /></div> : <div className="stray-empty-state rounded-xl p-3"><p className="text-sm font-medium">Nenhum perfil ativo</p><p className="mt-1 text-xs leading-5 text-muted-foreground">O Stray AI poderá declarar conteúdo publicado, mas não comparar com seu ambiente até existir um perfil.</p><Link href="/dashboard/pc" className="mt-3 inline-block text-xs font-medium text-cyan-200 hover:underline">Configurar Meu PC</Link></div>}</CardContent></Card>; }

function ContractCard() { return <Card className="stray-surface shadow-none"><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Sparkles className="h-4 w-4 text-primary" />Contrato de resposta</CardTitle><CardDescription>Uma única experiência integrada ao aplicativo.</CardDescription></CardHeader><CardContent className="space-y-3 text-sm leading-6 text-muted-foreground"><div className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><p>Responde apenas sobre o Stray Linux, jogos no Linux, seu ambiente, GameHub, LinuxFix, Scanner e conteúdos publicados.</p></div><p>Quando aplicável, a resposta separa leitura do caso, evidência disponível, ações seguras, limites e a explicação do contexto usado.</p><p>Pedidos fora desse escopo, como criação de código ou jogos, recebem recusa objetiva antes de qualquer processamento de contexto.</p></CardContent></Card>; }

function ContextRow({ label, value }: { label: string; value: string }) { return <div className="flex items-center justify-between gap-3 rounded-lg border border-white/8 bg-black/15 px-3 py-2"><span className="font-tech text-[10px] uppercase tracking-[0.1em] text-white/40">{label}</span><span className="truncate text-right text-muted-foreground" title={value}>{value}</span></div>; }
function ContextPill({ label, value }: { label: string; value: string }) { return <div className="rounded-lg border border-white/8 bg-black/15 p-3"><p className="stray-kicker">{label}</p><p className="mt-1 text-sm font-medium">{value}</p></div>; }
