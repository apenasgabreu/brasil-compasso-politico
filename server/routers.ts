import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createEncryptedResultVault, getEncryptedResultVault } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  resultVault: router({
    save: publicProcedure.input(z.object({
      id: z.string().regex(/^[A-Za-z0-9_-]{20,32}$/),
      ciphertext: z.string().min(24).max(65000).regex(/^[A-Za-z0-9_-]+$/),
      iv: z.string().length(16).regex(/^[A-Za-z0-9_-]+$/),
      version: z.literal("brcp-v1"),
    })).mutation(async ({ input }) => {
      const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
      try {
        return await createEncryptedResultVault({ ...input, expiresAt });
      } catch {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Não foi possível guardar o resultado agora." });
      }
    }),
    load: publicProcedure.input(z.object({ id: z.string().regex(/^[A-Za-z0-9_-]{20,32}$/) })).mutation(async ({ input }) => {
      const vault = await getEncryptedResultVault(input.id);
      if (!vault) throw new TRPCError({ code: "NOT_FOUND", message: "Não foi possível abrir esse resultado." });
      return vault;
    }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
