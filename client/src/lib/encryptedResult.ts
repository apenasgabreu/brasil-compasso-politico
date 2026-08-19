import type { Answer, Axis } from "@/data/compassData";

export const VAULT_VERSION = "brcp-v1";
export const RECOVERY_PREFIX = "BRCP";

export type ResultSnapshot = {
  program: string;
  score: number | null;
  coverage: number;
  economic: number | null;
  social: number | null;
  axes: { axis: string; score: number | null; coverage: number }[];
};

export type PersistedResultPayload = {
  version: typeof VAULT_VERSION;
  matrixVersion: string;
  savedAt: number;
  answers: Record<string, Answer>;
  weights: Record<Axis, number>;
  ranking: ResultSnapshot[];
};

export type EncryptedResultEnvelope = {
  version: typeof VAULT_VERSION;
  iv: string;
  ciphertext: string;
};

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - value.length % 4) % 4);
  const binary = atob(normalized);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function randomBytes(length: number) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

async function importRecoveryKey(secret: string) {
  const bytes = base64UrlToBytes(secret);
  if (bytes.length !== 32) throw new Error("Código de recuperação inválido.");
  return crypto.subtle.importKey("raw", bytes, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}

function additionalData(version: string, vaultId: string) {
  return new TextEncoder().encode(`brasil-compasso-politico:${version}:${vaultId}`);
}

export function createRecoverySecret() {
  return bytesToBase64Url(randomBytes(32));
}

export function createVaultId() {
  return bytesToBase64Url(randomBytes(16));
}

export function formatRecoveryCode(id: string, secret: string) {
  return `${RECOVERY_PREFIX}-${id}.${secret}`;
}

export function parseRecoveryCode(code: string) {
  const normalized = code.trim().replace(/\s+/g, "");
  const match = normalized.match(/^BRCP-([A-Za-z0-9_-]{20,32})\.([A-Za-z0-9_-]{43})$/);
  if (!match) throw new Error("Código de recuperação inválido.");
  return { id: match[1], secret: match[2] };
}

export async function encryptResultPayload(payload: PersistedResultPayload, vaultId: string, secret = createRecoverySecret()) {
  const iv = randomBytes(12);
  const key = await importRecoveryKey(secret);
  const plaintext = new TextEncoder().encode(JSON.stringify(payload));
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: additionalData(payload.version, vaultId), tagLength: 128 }, key, plaintext);
  return { secret, envelope: { version: payload.version, iv: bytesToBase64Url(iv), ciphertext: bytesToBase64Url(new Uint8Array(ciphertext)) } satisfies EncryptedResultEnvelope };
}

export async function decryptResultPayload(envelope: EncryptedResultEnvelope, vaultId: string, secret: string): Promise<PersistedResultPayload> {
  if (envelope.version !== VAULT_VERSION) throw new Error("Este resultado usa uma versão não suportada.");
  try {
    const key = await importRecoveryKey(secret);
    const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv: base64UrlToBytes(envelope.iv), additionalData: additionalData(envelope.version, vaultId), tagLength: 128 }, key, base64UrlToBytes(envelope.ciphertext));
    const payload = JSON.parse(new TextDecoder().decode(plaintext)) as PersistedResultPayload;
    if (payload.version !== VAULT_VERSION || !payload.answers || !payload.weights || !Array.isArray(payload.ranking)) throw new Error("Formato inválido.");
    return payload;
  } catch {
    throw new Error("Não foi possível abrir esse resultado. Verifique o código de recuperação.");
  }
}
