import { and, asc, desc, eq, isNull, like, or } from "drizzle-orm";
import { z } from "zod";
import { chatMessages, chatSessions, linuxFixes, setupGuides, userHardwareProfiles, wikiArticles } from "../../drizzle/schema";
import { invokeLLM } from "../_core/llm";
import { router } from "../_core/trpc";
import { activeUserProcedure, requireDatabase } from "./_guards";

type Citation = { type: "wiki" | "guide" | "linuxfix"; title: string; slug: string; sourceUrl: string | null };

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

function llmText(content: string | Array<{ type: "text"; text: string } | { type: "image_url" } | { type: "file_url" }>) {
  if (typeof content === "string") return content;
  return content.filter((part): part is { type: "text"; text: string } => part.type === "text").map((part) => part.text).join("\n");
}

async function retrieveContext(question: string, userId?: number) {
  const db = await requireDatabase();
  const terms = extractContextTerms(question);
  const searchTerms = terms.length ? terms : [question.trim().slice(0, 120).toLowerCase()];
  const wikiConditions = searchTerms.flatMap((term) => [like(wikiArticles.title, `%${term}%`), like(wikiArticles.excerpt, `%${term}%`), like(wikiArticles.body, `%${term}%`)]);
  const guideConditions = searchTerms.flatMap((term) => [like(setupGuides.title, `%${term}%`), like(setupGuides.description, `%${term}%`)]);
  const fixConditions = searchTerms.flatMap((term) => [like(linuxFixes.title, `%${term}%`), like(linuxFixes.symptoms, `%${term}%`), like(linuxFixes.possibleCauses, `%${term}%`)]);
  const [wiki, guides, fixes, profile] = await Promise.all([
    db.select({ title: wikiArticles.title, slug: wikiArticles.slug, body: wikiArticles.body, sourceUrl: wikiArticles.sourceUrl }).from(wikiArticles).where(and(eq(wikiArticles.status, "published"), isNull(wikiArticles.deletedAt), or(...wikiConditions)!)).orderBy(desc(wikiArticles.updatedAt)).limit(3),
    db.select({ title: setupGuides.title, slug: setupGuides.slug, description: setupGuides.description, sourceUrl: setupGuides.sourceUrl }).from(setupGuides).where(and(eq(setupGuides.status, "published"), isNull(setupGuides.deletedAt), or(...guideConditions)!)).orderBy(desc(setupGuides.updatedAt)).limit(3),
    db.select({ title: linuxFixes.title, slug: linuxFixes.slug, symptoms: linuxFixes.symptoms, possibleCauses: linuxFixes.possibleCauses, sourceUrl: linuxFixes.sourceUrl }).from(linuxFixes).where(and(eq(linuxFixes.status, "published"), isNull(linuxFixes.deletedAt), or(...fixConditions)!)).orderBy(desc(linuxFixes.updatedAt)).limit(3),
    userId ? db.select().from(userHardwareProfiles).where(and(eq(userHardwareProfiles.userId, userId), eq(userHardwareProfiles.isActive, true))).limit(1) : Promise.resolve([]),
  ]);
  const citations: Citation[] = [
    ...wiki.map((item) => ({ type: "wiki" as const, title: item.title, slug: item.slug, sourceUrl: item.sourceUrl })),
    ...guides.map((item) => ({ type: "guide" as const, title: item.title, slug: item.slug, sourceUrl: item.sourceUrl })),
    ...fixes.map((item) => ({ type: "linuxfix" as const, title: item.title, slug: item.slug, sourceUrl: item.sourceUrl })),
  ];
  const activeProfile = profile[0];
  const profileText = activeProfile ? `PERFIL TÉCNICO ATIVO: CPU=${activeProfile.detectedCpu ?? "não informado"}; GPU=${activeProfile.detectedGpu ?? "não informado"}; RAM=${activeProfile.detectedRamGb ? `${activeProfile.detectedRamGb} GB` : "não informada"}; distribuição=${activeProfile.detectedDistribution ?? "não informada"}; kernel=${activeProfile.kernelVersion ?? "não informado"}; driver=${activeProfile.driverVersion ?? "não informado"}; Proton=${activeProfile.protonVersion ?? "não informado"}; Wine=${activeProfile.wineVersion ?? "não informado"}.` : "PERFIL TÉCNICO ATIVO: indisponível.";
  const text = [
    profileText,
    ...wiki.map((item) => `WIKI: ${item.title}\n${item.body.slice(0, 3500)}`),
    ...guides.map((item) => `GUIA: ${item.title}\n${item.description ?? ""}`),
    ...fixes.map((item) => `LINUXFIX: ${item.title}\nSintomas: ${item.symptoms}\nCausas: ${item.possibleCauses}`),
  ].join("\n\n---\n\n");
  return { citations, text };
}

const questionInput = z.object({ sessionId: z.number().int().positive().optional(), question: z.string().trim().min(2).max(2500) });

export const chatRouter = router({
  contextForLocal: activeUserProcedure.input(z.object({ question: z.string().trim().min(2).max(2500) })).mutation(async ({ ctx, input }) => retrieveContext(input.question, ctx.user.id)),

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

  ask: activeUserProcedure.input(questionInput).mutation(async ({ ctx, input }) => {
    const db = await requireDatabase();
    const context = await retrieveContext(input.question, ctx.user.id);
    let sessionId = input.sessionId;
    if (sessionId) {
      const session = (await db.select({ id: chatSessions.id }).from(chatSessions).where(and(eq(chatSessions.id, sessionId), eq(chatSessions.userId, ctx.user.id))).limit(1))[0];
      if (!session) throw new Error("Sessão de chat não encontrada.");
    } else {
      const created = await db.insert(chatSessions).values({ userId: ctx.user.id, title: input.question.slice(0, 120), provider: "platform" });
      sessionId = Number(created[0].insertId);
    }
    await db.insert(chatMessages).values({ sessionId, role: "user", content: input.question });
    const system = `Você é o Stray AI, o assistente técnico do aplicativo Stray Linux. Responda em português brasileiro usando SOMENTE o contexto interno e o perfil técnico fornecidos abaixo. Para diagnósticos, apresente: hipótese provável somente se houver evidência, confiança (alta, média, baixa ou indisponível), motivo e ações seguras. Se o contexto não bastar, diga claramente que não há informação verificada no Hub; não invente comandos, compatibilidade, FPS, versões ou causa. Diferencie fatos, orientações comunitárias e incertezas. Ao final, cite os títulos internos utilizados sob o cabeçalho 'Fontes internas'.\n\nCONTEXTO INTERNO:\n${context.text || "Nenhum conteúdo interno relacionado foi recuperado."}`;
    const response = await invokeLLM({ messages: [{ role: "system", content: system }, { role: "user", content: input.question }], maxTokens: 900 });
    const answer = llmText(response.choices[0]?.message.content ?? "Não consegui gerar uma resposta agora.") || "Não consegui gerar uma resposta agora.";
    await db.insert(chatMessages).values({ sessionId, role: "assistant", content: answer, citations: context.citations });
    await db.update(chatSessions).set({ updatedAt: new Date() }).where(eq(chatSessions.id, sessionId));
    return { sessionId, answer, citations: context.citations };
  }),

  saveLocalTurn: activeUserProcedure.input(z.object({ sessionId: z.number().int().positive().optional(), question: z.string().trim().min(2).max(2500), answer: z.string().trim().min(1).max(15000), citations: z.array(z.object({ type: z.enum(["wiki", "guide", "linuxfix"]), title: z.string(), slug: z.string(), sourceUrl: z.string().nullable() })).max(12) })).mutation(async ({ ctx, input }) => {
    const db = await requireDatabase();
    let sessionId = input.sessionId;
    if (!sessionId) {
      const created = await db.insert(chatSessions).values({ userId: ctx.user.id, title: input.question.slice(0, 120), provider: "ollama-local" });
      sessionId = Number(created[0].insertId);
    } else {
      const session = (await db.select({ id: chatSessions.id }).from(chatSessions).where(and(eq(chatSessions.id, sessionId), eq(chatSessions.userId, ctx.user.id))).limit(1))[0];
      if (!session) throw new Error("Sessão de chat não encontrada.");
    }
    await db.insert(chatMessages).values([{ sessionId, role: "user", content: input.question }, { sessionId, role: "assistant", content: input.answer, citations: input.citations }]);
    await db.update(chatSessions).set({ updatedAt: new Date() }).where(eq(chatSessions.id, sessionId));
    return { sessionId };
  }),
});
