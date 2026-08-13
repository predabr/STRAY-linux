import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../_core/trpc";
import { hasAdministrationAccess, hasModerationAccess } from "./policies";

export const activeUserProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.isBanned) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Esta conta está bloqueada." });
  }

  return next({ ctx });
});

export const moderatorProcedure = activeUserProcedure.use(({ ctx, next }) => {
  if (!hasModerationAccess(ctx.user.role)) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Ação restrita à moderação." });
  }

  return next({ ctx });
});

export const administratorProcedure = activeUserProcedure.use(({ ctx, next }) => {
  if (!hasAdministrationAccess(ctx.user.role)) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Ação restrita à administração." });
  }

  return next({ ctx });
});

export const requireDatabase = async () => {
  const { getDb } = await import("../db");
  const db = await getDb();
  if (!db) {
    throw new TRPCError({ code: "SERVICE_UNAVAILABLE", message: "O banco de dados não está disponível." });
  }
  return db;
};
