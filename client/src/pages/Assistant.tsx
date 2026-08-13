import { useAuth } from "@/_core/hooks/useAuth";
import { AIChatBox, type Message } from "@/components/AIChatBox";
import { SiteHeader } from "@/components/platform/SiteHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { BotMessageSquare, CircleAlert, ExternalLink, HardDrive, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

type Citation = { type: "wiki" | "guide" | "linuxfix"; title: string; slug: string; sourceUrl: string | null };

export default function AssistantPage() {
  const { isAuthenticated, loading } = useAuth();
  const [provider, setProvider] = useState<"platform" | "local">("platform");
  const [endpoint, setEndpoint] = useState("http://127.0.0.1:11434");
  const [model, setModel] = useState("llama3.2");
  const [messages, setMessages] = useState<Message[]>([]);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [sessionId, setSessionId] = useState<number | undefined>();
  const ask = trpc.chat.ask.useMutation();
  const contextForLocal = trpc.chat.contextForLocal.useMutation();
  const saveLocal = trpc.chat.saveLocalTurn.useMutation();

  const send = async (question: string) => {
    const nextMessages: Message[] = [...messages, { role: "user", content: question }];
    setMessages(nextMessages);
    try {
      if (provider === "platform") {
        const result = await ask.mutateAsync({ question, sessionId });
        setSessionId(result.sessionId);
        setMessages((current) => [...current, { role: "assistant", content: result.answer }]);
        setCitations(result.citations);
        return;
      }
      const context = await contextForLocal.mutateAsync({ question });
      const response = await fetch(`${endpoint.replace(/\/$/, "")}/api/chat`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ model, stream: false, messages: [{ role: "system", content: `Você é o assistente do Stray Linux. Responda em português brasileiro SOMENTE usando o contexto interno fornecido. Se não houver suporte no contexto, declare explicitamente que não há dado verificado. Não invente FPS, compatibilidade ou comandos.\n\n${context?.text || "Sem contexto correspondente."}` }, { role: "user", content: question }] }) });
      if (!response.ok) throw new Error(`Ollama local respondeu ${response.status}.`);
      const payload = await response.json() as { message?: { content?: string } };
      const answer = payload.message?.content?.trim();
      if (!answer) throw new Error("O modelo local não retornou uma resposta.");
      setMessages((current) => [...current, { role: "assistant", content: answer }]);
      const localCitations = context?.citations ?? [];
      setCitations(localCitations);
      const saved = await saveLocal.mutateAsync({ sessionId, question, answer, citations: localCitations });
      setSessionId(saved.sessionId);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível concluir a resposta.";
      setMessages((current) => [...current, { role: "assistant", content: `**Não foi possível responder agora.**\n\n${message}` }]);
    }
  };

  if (loading) return <div className="min-h-screen bg-background"><SiteHeader /><main className="container py-20 text-center text-muted-foreground">Carregando sessão…</main></div>;
  if (!isAuthenticated) return <div className="min-h-screen bg-background"><SiteHeader /><main className="container max-w-2xl py-20"><Card><CardContent className="p-8 text-center"><BotMessageSquare className="mx-auto h-9 w-9 text-primary" /><h1 className="mt-5 text-2xl font-semibold">Entre para usar o assistente.</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">O chat persiste o histórico privado e recupera contexto de conteúdos internos publicados do Hub.</p><Button className="mt-6" onClick={() => startLogin()}>Entrar</Button></CardContent></Card></main></div>;
  return <div className="min-h-screen bg-background"><SiteHeader /><main className="container py-8 md:py-12"><div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"><section><Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary">ASSISTENTE STRAY LINUX</Badge><h1 className="mt-3 text-4xl font-semibold tracking-tight">Pergunte com o contexto do Hub.</h1><p className="mt-3 max-w-3xl leading-7 text-muted-foreground">O assistente recupera artigos, guias e LinuxFix publicados. Quando não existe evidência interna, a resposta deve declarar a lacuna.</p><div className="mt-6"><AIChatBox messages={messages} onSendMessage={send} isLoading={ask.isPending || contextForLocal.isPending || saveLocal.isPending} height="560px" placeholder="Ex.: Como instalar Steam pelo Flatpak e dar acesso à outra unidade?" emptyStateMessage="Pergunte sobre Linux gaming, guias e correções revisadas." suggestedPrompts={["Como instalar Steam pelo Flatpak?", "Meu Steam Flatpak não vê outra unidade. O que verifico?", "O que a wiki diz sobre Arch Linux para gaming?"]} /></div>{citations.length ? <Card className="mt-5"><CardHeader className="pb-3"><CardTitle className="text-base">Fontes internas recuperadas</CardTitle><CardDescription>Use os links para consultar o conteúdo original e a fonte registrada.</CardDescription></CardHeader><CardContent className="space-y-2">{citations.map((citation) => <Link key={`${citation.type}-${citation.slug}`} href={`/${citation.type === "wiki" ? "wiki" : citation.type === "guide" ? "setup" : "linuxfix"}/${citation.slug}`} className="flex items-center justify-between rounded-lg border p-3 text-sm transition-colors hover:bg-accent"><span>{citation.title}</span><ExternalLink className="h-4 w-4 text-primary" /></Link>)}</CardContent></Card> : null}</section><aside className="space-y-4"><Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Sparkles className="h-4 w-4 text-primary" />Provedor</CardTitle><CardDescription>Escolha onde a geração será executada.</CardDescription></CardHeader><CardContent className="space-y-3"><button onClick={() => setProvider("platform")} className={`w-full rounded-xl border p-3 text-left transition-colors ${provider === "platform" ? "border-primary bg-primary/5" : "hover:bg-accent"}`}><div className="flex items-center gap-2 font-medium"><Sparkles className="h-4 w-4 text-primary" />Plataforma</div><p className="mt-1 text-xs leading-5 text-muted-foreground">Processamento server-side com chave protegida; o conteúdo interno é enviado como contexto.</p></button><button onClick={() => setProvider("local")} className={`w-full rounded-xl border p-3 text-left transition-colors ${provider === "local" ? "border-primary bg-primary/5" : "hover:bg-accent"}`}><div className="flex items-center gap-2 font-medium"><HardDrive className="h-4 w-4 text-primary" />Ollama local</div><p className="mt-1 text-xs leading-5 text-muted-foreground">Sem token remoto. Funciona no PC do usuário quando Ollama e um modelo estão em execução.</p></button></CardContent></Card>{provider === "local" ? <Card><CardHeader><CardTitle className="text-base">Configuração local</CardTitle><CardDescription>Usada pelo navegador/Electron para alcançar sua instância Ollama.</CardDescription></CardHeader><CardContent className="space-y-3"><div><label className="mb-1.5 block text-xs font-medium">Endpoint</label><Input value={endpoint} onChange={(event) => setEndpoint(event.target.value)} /></div><div><label className="mb-1.5 block text-xs font-medium">Modelo</label><Input value={model} onChange={(event) => setModel(event.target.value)} /></div><div className="flex gap-2 rounded-lg border border-amber-500/25 bg-amber-500/5 p-3 text-xs leading-5 text-amber-800 dark:text-amber-200"><CircleAlert className="h-4 w-4 shrink-0" />O modelo precisa estar instalado localmente. A versão web só consegue conectar se o navegador puder alcançar o endpoint local; no executável Electron este é o caminho recomendado.</div></CardContent></Card> : <Card><CardContent className="p-5"><div className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><p className="text-sm leading-6 text-muted-foreground">A plataforma não deve transformar lacunas em recomendações. O chat recebe apenas trechos dos conteúdos internos encontrados pela busca.</p></div></CardContent></Card>}</aside></div></main></div>;
}
