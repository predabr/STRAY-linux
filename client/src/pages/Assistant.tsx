import { useAuth } from "@/_core/hooks/useAuth";
import { AIChatBox, type Message } from "@/components/AIChatBox";
import { SiteHeader } from "@/components/platform/SiteHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { BotMessageSquare, CheckCircle2, ExternalLink, MonitorCog, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

type Citation = { type: "wiki" | "guide" | "linuxfix"; title: string; slug: string; sourceUrl: string | null };

export default function AssistantPage() {
  const { isAuthenticated, loading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [sessionId, setSessionId] = useState<number | undefined>();
  const ask = trpc.chat.ask.useMutation();
  const profiles = trpc.user.profiles.list.useQuery(undefined, { enabled: isAuthenticated });
  const activeProfile = profiles.data?.find((profile) => profile.isActive);

  const send = async (question: string) => {
    const nextMessages: Message[] = [...messages, { role: "user", content: question }];
    setMessages(nextMessages);
    try {
      const result = await ask.mutateAsync({ question, sessionId });
      setSessionId(result.sessionId);
      setMessages((current) => [...current, { role: "assistant", content: result.answer }]);
      setCitations(result.citations);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível concluir a resposta.";
      setMessages((current) => [...current, { role: "assistant", content: `**Não foi possível responder agora.**\n\n${message}` }]);
    }
  };

  if (loading) return <div className="min-h-screen bg-background"><SiteHeader /><main className="container py-20 text-center text-muted-foreground">Carregando sessão…</main></div>;
  if (!isAuthenticated) return <div className="min-h-screen bg-background"><SiteHeader /><main className="container max-w-2xl py-20"><Card><CardContent className="p-8 text-center"><BotMessageSquare className="mx-auto h-9 w-9 text-primary" /><h1 className="mt-5 text-2xl font-semibold">Entre para usar o Stray AI.</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">O assistente guarda histórico privado e usa o perfil técnico e conteúdos publicados do aplicativo apenas quando disponíveis.</p><Button className="mt-6" onClick={() => startLogin()}>Entrar</Button></CardContent></Card></main></div>;
  return <div className="min-h-screen bg-background"><SiteHeader /><main className="container max-w-[1440px] technical-grid py-5 md:py-7"><div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]"><section><div className="border-b border-white/8 pb-5"><Badge variant="outline" className="border-cyan-300/25 bg-cyan-300/5 font-tech text-[10px] text-cyan-200">STRAY AI / DIAGNÓSTICO FUNDAMENTADO</Badge><h1 className="mt-3 text-3xl font-semibold tracking-tight">Pergunte ao Stray AI.</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">O assistente cruza o perfil técnico disponível com artigos, guias e LinuxFix publicados. Quando faltam evidências, ele declara a lacuna em vez de inventar uma causa.</p><div className="mt-4 flex flex-wrap gap-2 text-xs text-white/55"><span className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/[.025] px-3 py-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />Evidência antes de hipótese</span><span className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/[.025] px-3 py-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />Ações que não alteram o sistema</span><span className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/[.025] px-3 py-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />Limites declarados</span></div></div><div className="mt-5"><AIChatBox messages={messages} onSendMessage={send} isLoading={ask.isPending} height="560px" placeholder="Ex.: Meu Cyberpunk apresenta stutter. O que o meu ambiente e o Hub indicam?" emptyStateMessage="Pergunte sobre seu ambiente Linux, Proton, Vulkan, guias e correções revisadas." suggestedPrompts={["Meu jogo apresenta stutter. O que o meu perfil e o Hub indicam?", "Quais verificações seguras posso fazer para Vulkan indisponível?", "O que a biblioteca local e os guias publicados ajudam a confirmar?"]} /></div>{citations.length ? <Card className="mt-5 border-white/8 bg-card/80 shadow-none"><CardHeader className="pb-3"><CardTitle className="text-base">Fontes internas recuperadas</CardTitle><CardDescription>Use os links para consultar o conteúdo original e a fonte registrada.</CardDescription></CardHeader><CardContent className="space-y-2">{citations.map((citation) => <Link key={`${citation.type}-${citation.slug}`} href={`/${citation.type === "wiki" ? "wiki" : citation.type === "guide" ? "setup" : "linuxfix"}/${citation.slug}`} className="flex items-center justify-between rounded-lg border border-white/8 p-3 text-sm transition-colors hover:bg-accent"><span>{citation.title}</span><ExternalLink className="h-4 w-4 text-primary" /></Link>)}</CardContent></Card> : null}</section><aside className="space-y-4"><Card className="border-cyan-300/15 bg-card/80 shadow-none"><CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><MonitorCog className="h-4 w-4 text-cyan-200" />Contexto ativo</CardTitle><CardDescription>Campos conhecidos que podem orientar a resposta atual.</CardDescription></CardHeader><CardContent>{profiles.isLoading ? <p className="text-sm text-muted-foreground">Carregando perfil…</p> : activeProfile ? <div className="space-y-2 text-xs"><ContextRow label="Perfil" value={activeProfile.name} /><ContextRow label="Kernel" value={activeProfile.kernelVersion || "não informado"} /><ContextRow label="Driver" value={activeProfile.driverVersion || "não informado"} /><ContextRow label="Proton" value={activeProfile.protonVersion || "não informado"} /></div> : <div className="rounded-xl border border-dashed border-white/10 p-3"><p className="text-sm font-medium">Nenhum perfil ativo</p><p className="mt-1 text-xs leading-5 text-muted-foreground">O Stray AI poderá declarar conteúdo publicado, mas não comparar com seu ambiente até existir um perfil.</p><Link href="/dashboard/pc" className="mt-3 inline-block text-xs font-medium text-cyan-200 hover:underline">Configurar Meu PC</Link></div>}</CardContent></Card><Card className="border-white/8 bg-card/80 shadow-none"><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Sparkles className="h-4 w-4 text-primary" />Contrato de resposta</CardTitle><CardDescription>Uma única experiência integrada ao aplicativo.</CardDescription></CardHeader><CardContent className="space-y-3 text-sm leading-6 text-muted-foreground"><div className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><p>Responde apenas sobre o Stray Linux, jogos no Linux, seu ambiente, GameHub, LinuxFix, Scanner e conteúdos publicados.</p></div><p>Quando aplicável, a resposta separa leitura do caso, evidência disponível, ações seguras e limites. Sem informação verificada, a lacuna aparece como lacuna.</p><p>Pedidos fora desse escopo, como criação de código ou jogos, recebem recusa objetiva antes de qualquer processamento de contexto.</p></CardContent></Card></aside></div></main></div>;
}

function ContextRow({ label, value }: { label: string; value: string }) { return <div className="flex items-center justify-between gap-3 rounded-lg border border-white/8 bg-black/15 px-3 py-2"><span className="font-tech text-[10px] uppercase tracking-[0.1em] text-white/40">{label}</span><span className="truncate text-right text-muted-foreground" title={value}>{value}</span></div>; }
