import { publicProcedure, router } from "../_core/trpc";

export const brandRouter = router({
  get: publicProcedure.query(() => ({ title: process.env.VITE_APP_TITLE || "Stray Linux" })),
});
