import { createHmac } from "node:crypto";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { consumeEncryptedVaultQuota, createEncryptedResultVault, getEncryptedResultVault, VAULT_GLOBAL_LOAD_LIMIT_PER_WINDOW, VAULT_GLOBAL_SAVE_LIMIT_PER_WINDOW } from "./db";
import { ENV } from "./_core/env";
import { publicProcedure, router } from "./_core/trpc";

const vaultRateSecret = ENV.cookieSecret || "development-only-vault-rate-secret";
const getHeader = (headers: Record<string, unknown> | undefined, name: string) => headers?.[name] ?? headers?.[name.toLowerCase()];
function vaultClientKey(req: { headers?: Record<string, unknown>; ip?: string; socket?: { remoteAddress?: string } } | undefined) {
  const forwarded = getHeader(req?.headers, "x-forwarded-for");
  const network = typeof forwarded === "string" ? forwarded.split(",")[0].trim() : req?.ip ?? req?.socket?.remoteAddress ?? "unknown";
  return createHmac("sha256", vaultRateSecret).update(network).digest("hex");
}
async function enforceVaultQuota(req: { headers?: Record<string, unknown>; ip?: string; socket?: { remoteAddress?: string } } | undefined, operation: "save" | "load") {
  const globalQuota = await consumeEncryptedVaultQuota("global-result-vault-quota", operation, operation === "save" ? VAULT_GLOBAL_SAVE_LIMIT_PER_WINDOW : VAULT_GLOBAL_LOAD_LIMIT_PER_WINDOW);
  const clientQuota = await consumeEncryptedVaultQuota(vaultClientKey(req), operation);
  if (globalQuota.exceeded || clientQuota.exceeded) throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Muitas tentativas para o cofre. Aguarde antes de tentar novamente." });
}

export const appRouter = router({
  resultVault: router({
    save: publicProcedure.input(z.object({
      id: z.string().regex(/^[A-Za-z0-9_-]{20,32}$/),
      ciphertext: z.string().min(24).max(65000).regex(/^[A-Za-z0-9_-]+$/),
      iv: z.string().length(16).regex(/^[A-Za-z0-9_-]+$/),
      version: z.literal("brcp-v1"),
    })).mutation(async ({ input, ctx }) => {
      const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
      try {
        await enforceVaultQuota(ctx.req, "save");
        return await createEncryptedResultVault({ ...input, expiresAt });
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Não foi possível guardar o resultado agora." });
      }
    }),
    load: publicProcedure.input(z.object({ id: z.string().regex(/^[A-Za-z0-9_-]{20,32}$/) })).mutation(async ({ input, ctx }) => {
      await enforceVaultQuota(ctx.req, "load");
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
