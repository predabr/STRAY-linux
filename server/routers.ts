import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { benchmarksRouter } from "./routers/benchmarks";
import { adminRouter } from "./routers/admin";
import { chatRouter } from "./routers/chat";
import { compatibilityRouter } from "./routers/compatibility";
import { distributionsRouter, gamesRouter, hardwareRouter, searchRouter } from "./routers/games";
import { knowledgeRouter } from "./routers/knowledge";
import { userRouter } from "./routers/user";

export const appRouter = router({
  system: systemRouter,
  admin: adminRouter,
  auth: router({
    me: publicProcedure.query(({ ctx }) => ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  games: gamesRouter,
  distributions: distributionsRouter,
  hardware: hardwareRouter,
  search: searchRouter,
  benchmarks: benchmarksRouter,
  compatibility: compatibilityRouter,
  chat: chatRouter,
  knowledge: knowledgeRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
