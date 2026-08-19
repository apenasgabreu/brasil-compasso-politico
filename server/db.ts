import { eq, lt } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { encryptedResultVaults, InsertUser, resultVaultRateLimits, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createEncryptedResultVault(input: { id: string; ciphertext: string; iv: string; version: string; expiresAt: Date }) {
  const db = await getDb();
  if (!db) throw new Error("O armazenamento de resultados não está disponível agora.");
  await db.delete(encryptedResultVaults).where(lt(encryptedResultVaults.expiresAt, new Date()));
  await db.insert(encryptedResultVaults).values(input);
  return { id: input.id, expiresAt: input.expiresAt };
}

export async function getEncryptedResultVault(id: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select({ ciphertext: encryptedResultVaults.ciphertext, iv: encryptedResultVaults.iv, version: encryptedResultVaults.version, expiresAt: encryptedResultVaults.expiresAt })
    .from(encryptedResultVaults)
    .where(eq(encryptedResultVaults.id, id))
    .limit(1);

  const vault = result[0];
  if (!vault) return undefined;
  if (vault.expiresAt <= new Date()) {
    await db.delete(encryptedResultVaults).where(eq(encryptedResultVaults.id, id));
    return undefined;
  }
  return vault;
}

export const VAULT_RATE_WINDOW_MS = 60 * 60 * 1000;
export const VAULT_SAVE_LIMIT_PER_WINDOW = 5;
export const VAULT_LOAD_LIMIT_PER_WINDOW = 30;
export const VAULT_GLOBAL_SAVE_LIMIT_PER_WINDOW = 500;
export const VAULT_GLOBAL_LOAD_LIMIT_PER_WINDOW = 3_000;

export async function consumeEncryptedVaultQuota(keyHash: string, operation: "save" | "load", customLimit?: number) {
  const db = await getDb();
  if (!db) throw new Error("O armazenamento de resultados não está disponível agora.");
  const now = new Date();
  const windowStartedAt = new Date(Math.floor(now.getTime() / VAULT_RATE_WINDOW_MS) * VAULT_RATE_WINDOW_MS);
  const expiresAt = new Date(windowStartedAt.getTime() + VAULT_RATE_WINDOW_MS);
  const limit = customLimit ?? (operation === "save" ? VAULT_SAVE_LIMIT_PER_WINDOW : VAULT_LOAD_LIMIT_PER_WINDOW);
  const countColumn = operation === "save" ? "saveCount" : "loadCount";

  await db.delete(resultVaultRateLimits).where(lt(resultVaultRateLimits.expiresAt, now));
  const current = (await db.select().from(resultVaultRateLimits).where(eq(resultVaultRateLimits.keyHash, keyHash)).limit(1))[0];
  if (!current || current.windowStartedAt.getTime() !== windowStartedAt.getTime()) {
    await db.insert(resultVaultRateLimits).values({
      keyHash,
      windowStartedAt,
      saveCount: operation === "save" ? 1 : 0,
      loadCount: operation === "load" ? 1 : 0,
      expiresAt,
    }).onDuplicateKeyUpdate({
      set: { windowStartedAt, saveCount: operation === "save" ? 1 : 0, loadCount: operation === "load" ? 1 : 0, expiresAt },
    });
    return { limit, remaining: limit - 1, resetsAt: expiresAt };
  }

  const count = current[countColumn];
  if (count >= limit) return { limit, remaining: 0, resetsAt: current.expiresAt, exceeded: true as const };
  await db.update(resultVaultRateLimits).set({ [countColumn]: count + 1 }).where(eq(resultVaultRateLimits.keyHash, keyHash));
  return { limit, remaining: limit - count - 1, resetsAt: current.expiresAt };
}
