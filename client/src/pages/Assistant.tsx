import { useAuth } from "@/_core/hooks/useAuth";
import { AIChatBox, type Message } from "@/components/AIChatBox";
import { SiteHeader } from "@/components/platform/SiteHeader";
import { trpc } from "@/lib/trpc";
import { Bot, SendHorizontal } from "lucide-react";
import { useState } from "react";

export default function AssistantPage() {
  const { isAuthenticated, loading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<number | undefined>();
  const ask = trpc.chat.ask.useMutation();
  const askPublic = trpc.chat.askPublic.useMutation();
  const isPending = ask.isPending || askPublic.isPending;

  const send = async (question: string) => {
    if (isPending) return;
    setMessages((current) => [...current, { role: "user", content: question }]);
    try {
      const result = isAuthenticated ? await ask.mutateAsync({ question, sessionId }) : await askPublic.mutateAsync({ question });
      if ("sessionId" in result && typeof result.sessionId === "number") setSessionId(result.sessionId);
      setMessages((current) => [...current, { role: "assistant", content: result.answer }]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível concluir a resposta.";
      setMessages((current) => [...current, { role: "assistant", content: `Não consegui responder agora.\n\n${message}\n\nTente novamente depois de executar o Scanner ou verificar se o aplicativo está atualizado.` }]);
    }
  };

  if (loading) return <div className="min-h-screen bg-background"><SiteHeader /><main className="container py-20 text-center text-muted-foreground">Carregando sessão…</main></div>;

  return <div className="min-h-screen bg-background"><SiteHeader /><main className="container max-w-4xl py-6 md:py-10"><section className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0b0c10] p-5 text-white shadow-2xl md:p-7"><div className="flex items-center gap-3 border-b border-white/10 pb-5"><span className="grid h-10 w-10 place-items-center rounded-full bg-white text-black"><Bot className="h-5 w-5" /></span><div><p className="font-tech text-[10px] tracking-[.16em] text-white/55">STRAY AI</p><h1 className="mt-1 text-2xl font-semibold tracking-tight">Conversa do aplicativo</h1></div></div><div className="pt-5"><AIChatBox className="stray-ai-console border-white/10 bg-white/[.03]" messages={messages} onSendMessage={send} isLoading={isPending} height="min(68vh, 640px)" placeholder="Escreva sua dúvida sobre Linux gaming ou o Stray Linux" emptyStateMessage="Escreva uma dúvida. O Stray AI responde apenas sobre Linux gaming e os recursos do aplicativo." /></div><p className="mt-4 flex items-center gap-2 text-xs leading-5 text-white/48"><SendHorizontal className="h-3.5 w-3.5" />O chat não executa comandos nem altera configurações. Quando uma resposta não puder ser produzida, ele informará isso no próprio histórico.</p></section></main></div>;
}
