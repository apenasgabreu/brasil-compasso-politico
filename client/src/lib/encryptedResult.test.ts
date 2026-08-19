import { webcrypto } from "node:crypto";
import { describe, expect, it } from "vitest";
import { createVaultId, decryptResultPayload, encryptResultPayload, formatRecoveryCode, parseRecoveryCode, VAULT_VERSION } from "./encryptedResult";

Object.defineProperty(globalThis, "crypto", { value: webcrypto, configurable: true });

const payload = {
  version: VAULT_VERSION,
  matrixVersion: "2026-08-17",
  savedAt: 1787000000000,
  answers: { "ECO-01": 2 },
  weights: { "Economia e orçamento": 1 } as never,
  ranking: [{ program: "programa-a", score: 0.75, coverage: 0.5, economic: 0.25, social: -0.25, axes: [{ axis: "Economia e orçamento", score: 0.75, coverage: 0.5 }], }],
};

describe("encrypted result vault", () => {
  it("cifra e recupera o resultado somente com o segredo", async () => {
    const vaultId = createVaultId();
    const { secret, envelope } = await encryptResultPayload(payload, vaultId);
    await expect(decryptResultPayload(envelope, vaultId, secret)).resolves.toEqual(payload);
    expect(envelope.ciphertext).not.toContain("ECO-01");
  });

  it("rejeita alteração do conteúdo e códigos inválidos", async () => {
    const vaultId = createVaultId();
    const { secret, envelope } = await encryptResultPayload(payload, vaultId);
    const alteredBytes = Buffer.from(envelope.ciphertext, "base64url");
    alteredBytes[0] ^= 1;
    const alteredCiphertext = alteredBytes.toString("base64url");
    expect(alteredCiphertext).not.toBe(envelope.ciphertext);
    await expect(decryptResultPayload({ ...envelope, ciphertext: alteredCiphertext }, vaultId, secret)).rejects.toThrow("Não foi possível abrir");
    await expect(decryptResultPayload(envelope, createVaultId(), secret)).rejects.toThrow("Não foi possível abrir");
    expect(() => parseRecoveryCode("BRCP-inválido")).toThrow("Código de recuperação inválido");
  });

  it("formata e separa o identificador público do segredo", async () => {
    const vaultId = createVaultId();
    const { secret } = await encryptResultPayload(payload, vaultId);
    const code = formatRecoveryCode(vaultId, secret);
    expect(parseRecoveryCode(code)).toEqual({ id: vaultId, secret });
  });
});
