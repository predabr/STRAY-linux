import { and, asc, desc, eq, isNull, like, or } from "drizzle-orm";
import { z } from "zod";
import { chatMessages, chatSessions, linuxFixes, setupGuides, userHardwareProfiles, wikiArticles } from "../../drizzle/schema";
import { invokeLLM } from "../_core/llm";
import { isStrayAiDomainQuestion, STRAY_AI_OUT_OF_SCOPE_RESPONSE } from "../lib/strayAiScope";
import { publicProcedure, router } from "../_core/trpc";
import { activeUserProcedure, requireDatabase } from "./_guards";

type Citation = { type: "wiki" | "guide" | "linuxfix"; title: string; slug: string; sourceUrl: string | null };
type AiExplanation = { facts: string[]; inferences: string[]; estimates: string[]; unknowns: string[]; why: { internalSources: number; profileUsed: boolean; memoryUsed: boolean; confidence: "medium" | "low" | "unavailable" } };

const CONTEXT_STOPWORDS = new Set([
  "a", "ao", "aos", "as", "com", "como", "da", "das", "de", "do", "dos", "e", "em", "eu", "isso", "na", "nas", "no", "nos", "o", "os", "ou", "para", "por", "pra", "que", "sobre", "um", "uma", "ver", "qual", "quais",
]);

export function extractContextTerms(question: string): string[] {
  const normalized = question.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const words = normalized.split(/[^a-z0-9+._-]+/).filter(Boolean);
  const terms: string[] = [];
  for (const word of words) {
    if (word.length >= 3 && !CONTEXT_STOPWORDS.has(word) && terms.indexOf(word) === -1) terms.push(word);
    if (terms.length === 6) break;
  }
  return terms;
}

export function buildStrayAiSystemPrompt(contextText: string): string {
  return `Você é o Stray AI, o assistente técnico do aplicativo Stray Linux. Responda em português brasileiro SOMENTE sobre Stray Linux, gaming no Linux, perfil técnico do usuário, GameHub, LinuxFix, Scanner, bibliotecas locais e conteúdos publicados do aplicativo. Recuse pedidos de programação, criação de jogos, trabalhos escolares, entretenimento genérico ou qualquer tema externo usando exatamente esta frase: "${STRAY_AI_OUT_OF_SCOPE_RESPONSE}". Use SOMENTE o contexto interno e o perfil técnico fornecidos abaixo. Para diagnósticos, organize a resposta nestas seções quando forem aplicáveis: "Leitura do caso", "Evidência disponível", "Lacunas e pré-requisitos", "Ações seguras", "Risco e reversão" e "Limites". Em "Evidência disponível", diferencie fatos publicados, orientação comunitária e lacunas. Em "Lacunas e pré-requisitos", diga o que não foi observado e o que a pessoa deve confirmar antes de seguir uma fonte; não invente pré-requisitos. Em "Risco e reversão", apresente somente risco e reversão registrados pela fonte; se não houver reversão documentada, declare que a ação não deve ser tratada como reversível. Quando houver um guia da distribuição ativa, priorize-o; um guia de família não prova suporte idêntico em uma derivada. Se o contexto indicar MODO DE SESSÃO: visitante, nunca diga que existe conta, histórico, perfil salvo ou sincronização; informe somente que esta conversa não recebeu um perfil local. Declare confiança como alta, média, baixa ou indisponível apenas quando o contexto permitir. Se o contexto não bastar, diga claramente que não há informação verificada no Hub; não invente comandos, compatibilidade, FPS, versões, mídia, causa ou resultado. O assistente não executa comandos nem altera o sistema. Ao final, cite os títulos internos utilizados sob o cabeçalho "Fontes internas".\n\nCONTEXTO INTERNO:\n${contextText || "Nenhum conteúdo interno relacionado foi recuperado."}`;
}

function llmText(content: string | Array<{ type: "text"; text: string } | { type: "image_url" } | { type: "file_url" }>) {
  if (typeof content === "string") return content;
  return content.filter((part): part is { type: "text"; text: string } => part.type === "text").map((part) => part.text).join("\n");
}

function evidenceFallback(context: { citations: Citation[]; profileAvailable: boolean }) {
  const sourceList = context.citations.length ? context.citations.map((citation) => `- ${citation.title}`).join("\n") : "- Nenhuma fonte interna diretamente relacionada foi recuperada.";
  return `### Leitura do caso\nO provedor do Stray AI não respondeu neste momento. Para não criar uma resposta especulativa, esta sessão permanece limitada ao conteúdo publicado disponível.\n\n### Evidência disponível\n${sourceList}\n\n### Lacunas e pré-requisitos\nConfirme a versão da distribuição, o runtime e o erro exibido antes de seguir qualquer orientação publicada. A conversa não confirma condições que não estejam no contexto.\n\n### Ações seguras\nConsulte as fontes internas listadas e execute uma nova leitura local após qualquer alteração.\n\n### Risco e reversão\nNão há uma ação específica selecionada nesta resposta. Não há risco ou reversão a inferir; siga somente o que estiver documentado na fonte aplicável.\n\n### Limites\nNão foi possível gerar uma síntese pelo modelo agora. Nenhum comando, causa, compatibilidade ou resultado foi inferido sem evidência.`;
}

export function contextUnavailableFallback() {
  return "### Leitura do caso\nA base de conteúdo do Stray AI não está disponível neste momento. Para não transformar uma falha técnica em orientação especulativa, a conversa foi mantida em modo seguro.\n\n### Evidência disponível\nNenhuma fonte interna pôde ser consultada agora.\n\n### Lacunas e pré-requisitos\nNão há contexto suficiente para confirmar distribuição, runtime, sintoma ou pré-requisito técnico.\n\n### Ações seguras\nVerifique a conexão do aplicativo, reinicie o Stray Linux e execute o Scanner novamente no desktop antes de tentar outra pergunta.\n\n### Risco e reversão\nNenhuma ação foi recomendada; portanto, não há risco ou reversão a declarar.\n\n### Limites\nNenhum comando, causa, compatibilidade, FPS ou resultado foi produzido sem contexto verificável.";
}

function buildExplanation(context: { citations: Citation[]; profileAvailable: boolean }, memoryUsed = false): AiExplanation {
  return {
    facts: [context.profileAvailable ? "Um perfil técnico ativo foi incluído no contexto." : "Nenhum perfil técnico ativo foi usado.", context.citations.length ? `${context.citations.length} fonte(s) interna(s) relacionada(s) foram recuperadas.` : "Nenhuma fonte interna diretamente relacionada foi recuperada."],
    inferences: context.citations.length ? ["A priorização considera a relação textual entre a pergunta e as fontes internas recuperadas; isso não confirma que a orientação resolverá o caso."] : [],
    estimates: [],
    unknowns: ["Não há conclusão automática sobre FPS, desempenho, compatibilidade, causa raiz ou resultado sem evidência específica."],
    why: { internalSources: context.citations.length, profileUsed: context.profileAvailable, memoryUsed, confidence: context.citations.length ? "medium" : "unavailable" },
  };
}

async function answerFromModel(question: string, context: { citations: Citation[]; text: string; profileAvailable: boolean; contextUnavailable?: boolean }) {
  if (context.contextUnavailable) return contextUnavailableFallback();
  try {
    const response = await invokeLLM({ model: "claude-haiku-4-5", messages: [{ role: "system", content: buildStrayAiSystemPrompt(context.text) }, { role: "user", content: question }], maxTokens: 900 });
    return llmText(response.choices[0]?.message.content ?? "") || evidenceFallback(context);
  } catch (error) {
    console.error("[Stray AI] Provedor indisponível; usando resposta baseada em evidência.", error);
    return evidenceFallback(context);
  }
}

async function retrieveContextUnsafe(question: string, userId?: number) {
  const db = await requireDatabase();
  const terms = extractContextTerms(question);
  const searchTerms = terms.length ? terms : [question.trim().slice(0, 120).toLowerCase()];
  const wikiConditions = searchTerms.flatMap((term) => [like(wikiArticles.title, `%${term}%`), like(wikiArticles.excerpt, `%${term}%`), like(wikiArticles.body, `%${term}%`)]);
  const guideConditions = searchTerms.flatMap((term) => [like(setupGuides.title, `%${term}%`), like(setupGuides.description, `%${term}%`)]);
  const fixConditions = searchTerms.flatMap((term) => [like(linuxFixes.title, `%${term}%`), like(linuxFixes.symptoms, `%${term}%`), like(linuxFixes.possibleCauses, `%${term}%`)]);
  const profile = userId ? await db.select().from(userHardwareProfiles).where(and(eq(userHardwareProfiles.userId, userId), eq(userHardwareProfiles.isActive, true))).limit(1) : [];
  const activeProfile = profile[0];
  const guideMatch = activeProfile?.distributionId ? or(eq(setupGuides.distributionId, activeProfile.distributionId), or(...guideConditions)!) : or(...guideConditions)!;
  const [wiki, guides, fixes] = await Promise.all([
    db.select({ title: wikiArticles.title, slug: wikiArticles.slug, body: wikiArticles.body, sourceUrl: wikiArticles.sourceUrl }).from(wikiArticles).where(and(eq(wikiArticles.status, "published"), isNull(wikiArticles.deletedAt), or(...wikiConditions)!)).orderBy(desc(wikiArticles.updatedAt)).limit(3),
    db.select({ title: setupGuides.title, slug: setupGuides.slug, description: setupGuides.description, sourceUrl: setupGuides.sourceUrl }).from(setupGuides).where(and(eq(setupGuides.status, "published"), isNull(setupGuides.deletedAt), guideMatch)).orderBy(desc(setupGuides.updatedAt)).limit(3),
    db.select({ title: linuxFixes.title, slug: linuxFixes.slug, symptoms: linuxFixes.symptoms, possibleCauses: linuxFixes.possibleCauses, sourceUrl: linuxFixes.sourceUrl }).from(linuxFixes).where(and(eq(linuxFixes.status, "published"), isNull(linuxFixes.deletedAt), or(...fixConditions)!)).orderBy(desc(linuxFixes.updatedAt)).limit(3),
  ]);
  const citations: Citation[] = [
    ...wiki.map((item) => ({ type: "wiki" as const, title: item.title, slug: item.slug, sourceUrl: item.sourceUrl })),
    ...guides.map((item) => ({ type: "guide" as const, title: item.title, slug: item.slug, sourceUrl: item.sourceUrl })),
    ...fixes.map((item) => ({ type: "linuxfix" as const, title: item.title, slug: item.slug, sourceUrl: item.sourceUrl })),
  ];
  const profileText = activeProfile ? `PERFIL TÉCNICO ATIVO: CPU=${activeProfile.detectedCpu ?? "não informado"}; GPU=${activeProfile.detectedGpu ?? "não informado"}; RAM=${activeProfile.detectedRamGb ? `${activeProfile.detectedRamGb} GB` : "não informada"}; distribuição=${activeProfile.detectedDistribution ?? "não informada"}; kernel=${activeProfile.kernelVersion ?? "não informado"}; driver=${activeProfile.driverVersion ?? "não informado"}; Proton=${activeProfile.protonVersion ?? "não informado"}; Wine=${activeProfile.wineVersion ?? "não informado"}.` : "PERFIL TÉCNICO ATIVO: indisponível.";
  const text = [
    profileText,
    ...wiki.map((item) => `WIKI: ${item.title}\n${item.body.slice(0, 3500)}`),
    ...guides.map((item) => `GUIA: ${item.title}\n${item.description ?? ""}`),
    ...fixes.map((item) => `LINUXFIX: ${item.title}\nSintomas: ${item.symptoms}\nCausas: ${item.possibleCauses}`),
  ].join("\n\n---\n\n");
  return { citations, text, profileAvailable: Boolean(activeProfile) };
}

async function retrieveContext(question: string, userId?: number) {
  try {
    return await retrieveContextUnsafe(question, userId);
  } catch (error) {
    console.error("[Stray AI] Contexto interno indisponível; resposta segura será usada.", error);
    return { citations: [] as Citation[], text: "CONTEXTO INTERNO: indisponível por falha temporária de leitura.", profileAvailable: false, contextUnavailable: true };
  }
}

const questionInput = z.object({ sessionId: z.number().int().positive().optional(), question: z.string().trim().min(2).max(2500) });
const visitorQuestionInput = z.object({ question: z.string().trim().min(2).max(2500) });

export const chatRouter = router({
  sessions: activeUserProcedure.query(async ({ ctx }) => {
    const db = await requireDatabase();
    return db.select().from(chatSessions).where(eq(chatSessions.userId, ctx.user.id)).orderBy(desc(chatSessions.updatedAt)).limit(40);
  }),

  history: activeUserProcedure.input(z.object({ sessionId: z.number().int().positive() })).query(async ({ ctx, input }) => {
    const db = await requireDatabase();
    const session = (await db.select({ id: chatSessions.id }).from(chatSessions).where(and(eq(chatSessions.id, input.sessionId), eq(chatSessions.userId, ctx.user.id))).limit(1))[0];
    if (!session) return [];
    return db.select().from(chatMessages).where(eq(chatMessages.sessionId, session.id)).orderBy(asc(chatMessages.createdAt));
  }),

  askPublic: publicProcedure.input(visitorQuestionInput).mutation(async ({ input }) => {
    if (!isStrayAiDomainQuestion(input.question)) {
      return { answer: STRAY_AI_OUT_OF_SCOPE_RESPONSE, citations: [], explanation: buildExplanation({ citations: [], profileAvailable: false }), context: { inScope: false, profileAvailable: false, internalSources: 0, visitor: true, memoryUsed: false } };
    }
    const context = await retrieveContext(input.question);
    const visitorContext = { ...context, text: `MODO DE SESSÃO: visitante. Não existe conta, histórico ou perfil local disponível nesta conversa.\n${context.text}` };
    const answer = await answerFromModel(input.question, visitorContext);
    return { answer, citations: context.citations, explanation: buildExplanation(context), context: { inScope: true, profileAvailable: false, internalSources: context.citations.length, visitor: true, memoryUsed: false } };
  }),

  ask: activeUserProcedure.input(questionInput).mutation(async ({ ctx, input }) => {
    const db = await requireDatabase();
    let sessionId = input.sessionId;
    if (sessionId) {
      const session = (await db.select({ id: chatSessions.id }).from(chatSessions).where(and(eq(chatSessions.id, sessionId), eq(chatSessions.userId, ctx.user.id))).limit(1))[0];
      if (!session) throw new Error("Sessão de chat não encontrada.");
    } else {
      const created = await db.insert(chatSessions).values({ userId: ctx.user.id, title: input.question.slice(0, 120), provider: "stray-ai" });
      sessionId = Number(created[0].insertId);
    }
    await db.insert(chatMessages).values({ sessionId, role: "user", content: input.question });
    if (!isStrayAiDomainQuestion(input.question)) {
      await db.insert(chatMessages).values({ sessionId, role: "assistant", content: STRAY_AI_OUT_OF_SCOPE_RESPONSE, citations: [] });
      await db.update(chatSessions).set({ updatedAt: new Date() }).where(eq(chatSessions.id, sessionId));
      return { sessionId, answer: STRAY_AI_OUT_OF_SCOPE_RESPONSE, citations: [], explanation: buildExplanation({ citations: [], profileAvailable: false }), context: { inScope: false, profileAvailable: false, internalSources: 0, memoryUsed: false } };
    }
    const context = await retrieveContext(input.question, ctx.user.id);
    const answer = await answerFromModel(input.question, context);
    await db.insert(chatMessages).values({ sessionId, role: "assistant", content: answer, citations: context.citations });
    await db.update(chatSessions).set({ updatedAt: new Date() }).where(eq(chatSessions.id, sessionId));
    return { sessionId, answer, citations: context.citations, explanation: buildExplanation(context), context: { inScope: true, profileAvailable: context.profileAvailable, internalSources: context.citations.length, memoryUsed: false } };
  }),
});
