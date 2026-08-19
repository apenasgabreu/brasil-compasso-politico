import { beforeEach, describe, expect, it, vi } from "vitest";

const { createEncryptedResultVault, getEncryptedResultVault } = vi.hoisted(() => ({
  createEncryptedResultVault: vi.fn(),
  getEncryptedResultVault: vi.fn(),
}));

vi.mock("./db", () => ({ createEncryptedResultVault, getEncryptedResultVault }));

import { appRouter } from "./routers";

const vaultId = "abcdefghijklmno_pqrstuv";
const ciphertext = "ciphertext-content-that-is-not-plaintext";
const iv = "abcdefghijklmnop";

describe("resultVault router", () => {
  beforeEach(() => vi.clearAllMocks());

  it("aceita somente envelope cifrado e nunca recebe segredo de recuperação", async () => {
    createEncryptedResultVault.mockResolvedValue({ id: vaultId, expiresAt: new Date("2027-08-19T00:00:00.000Z") });
    const caller = appRouter.createCaller({} as never);

    const saved = await caller.resultVault.save({ id: vaultId, ciphertext, iv, version: "brcp-v1" });

    expect(saved.id).toBe(vaultId);
    expect(createEncryptedResultVault).toHaveBeenCalledTimes(1);
    const request = createEncryptedResultVault.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(request).toMatchObject({ id: vaultId, ciphertext, iv, version: "brcp-v1" });
    expect(Object.keys(request)).not.toContain("secret");
    expect(Object.keys(request)).not.toContain("answers");
  });

  it("recupera somente o envelope existente e usa erro genérico em cofre ausente", async () => {
    getEncryptedResultVault.mockResolvedValueOnce({ ciphertext, iv, version: "brcp-v1", expiresAt: new Date("2027-08-19T00:00:00.000Z") });
    const caller = appRouter.createCaller({} as never);
    await expect(caller.resultVault.load({ id: vaultId })).resolves.toMatchObject({ ciphertext, iv, version: "brcp-v1" });

    getEncryptedResultVault.mockResolvedValueOnce(undefined);
    await expect(caller.resultVault.load({ id: vaultId })).rejects.toMatchObject({ code: "NOT_FOUND", message: "Não foi possível abrir esse resultado." });
  });

  it("rejeita envelope malformado antes de chamar o armazenamento", async () => {
    const caller = appRouter.createCaller({} as never);

    await expect(caller.resultVault.save({ id: vaultId, ciphertext: "conteudo+invalido", iv, version: "brcp-v1" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    expect(createEncryptedResultVault).not.toHaveBeenCalled();
  });
});
