import { useAuth } from "@/_core/hooks/useAuth";
import { AIChatBox, type Message } from "@/components/AIChatBox";
import { SiteHeader } from "@/components/platform/SiteHeader";
import { trpc } from "@/lib/trpc";
import { Bot, CircleAlert, SendHorizontal, ShieldCheck } from "lucide-react";
import { useState } from "react";

const starterPrompts = [
  "Meu jogo não abre pelo Proton. Por onde começo?",
  "Como verifico se o Vulkan está pronto para jogos?",
  "O que o Scanner consegue ler no meu PC?",
];

function chatFailureMessage() {
  return "Não consegui responder agora. Nenhuma configuração foi alterada. Verifique sua conexão, execute o Scanner no aplicativo desktop e tente novamente.";
}

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
    } catch {
      setMessages((current) => [...current, { role: "assistant", content: chatFailureMessage() }]);
    }
  };

  if (loading) return <div className="min-h-screen bg-background"><SiteHeader /><main className="container py-20 text-center text-muted-foreground">Carregando sessão…</main></div>;

  return <div className="min-h-screen bg-background"><SiteHeader /><main className="container max-w-5xl py-6 md:py-10"><section className="stray-ai-workbench overflow-hidden rounded-2xl border border-white/[.09] bg-[#0a0b0e] text-white shadow-[0_24px_70px_rgba(0,0,0,.22)]"><header className="flex flex-col gap-5 border-b border-white/[.09] px-5 py-5 md:flex-row md:items-end md:justify-between md:px-7"><div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[.035]"><Bot className="h-5 w-5 text-[#b6c8ff]" /></span><div><p className="font-tech text-[10px] tracking-[.16em] text-[#aebfff]">STRAY AI / CONTEXTO LOCAL</p><h1 className="mt-1 text-2xl font-semibold tracking-tight">Conversa do aplicativo, sem atalhos ocultos.</h1><p className="mt-1 max-w-2xl text-sm leading-6 text-white/55">Pergunte sobre Linux gaming, o ambiente lido pelo aplicativo e conteúdo do Stray Linux. A IA não executa comandos nem inventa resultados.</p></div></div><div className="flex items-center gap-2 rounded-lg border border-white/[.08] bg-white/[.025] px-3 py-2 text-xs text-white/55"><ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />Escopo técnico controlado</div></header><div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_15.5rem]"><div className="p-4 md:p-5"><AIChatBox className="stray-ai-console border-white/[.09] bg-[#07080a] shadow-none" messages={messages} onSendMessage={send} isLoading={isPending} height="min(65vh, 620px)" placeholder="Ex.: meu jogo fecha ao iniciar pelo Proton" emptyStateMessage="Escolha uma dúvida inicial ou escreva seu próprio caso técnico." suggestedPrompts={starterPrompts} /></div><aside className="border-t border-white/[.09] bg-white/[.018] p-5 lg:border-s lg:border-t-0"><p className="font-tech text-[9px] tracking-[.15em] text-white/42">COMO RESPONDE</p><div className="mt-4 space-y-4 text-sm leading-6 text-white/60"><p><strong className="block text-white/88">Lê contexto disponível</strong>Perfil, Scanner e fontes internas entram somente quando existem.</p><p><strong className="block text-white/88">Expõe limites</strong>Ausência de evidência continua sendo ausência — não vira compatibilidade ou FPS.</p><p><strong className="block text-white/88">Recusa o que foge do app</strong>Pedidos de código, jogos e temas externos ficam fora do escopo.</p></div><div className="mt-6 flex gap-2 border-t border-white/[.08] pt-4 text-xs leading-5 text-white/44"><CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#aebfff]" />Se o provedor estiver indisponível, o chat informa sem expor detalhes internos do servidor.</div></aside></div><footer className="flex items-center gap-2 border-t border-white/[.08] px-5 py-3 text-xs text-white/42"><SendHorizontal className="h-3.5 w-3.5" />A resposta é orientação técnica; verifique a evidência antes de mudar o sistema.</footer></section></main></div>;
}
