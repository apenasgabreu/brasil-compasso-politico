import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Immutable encrypted result vault. The server receives no recovery secret,
 * responses, weights, ranking, or candidate information in readable form.
 */
export const encryptedResultVaults = mysqlTable("encrypted_result_vaults", {
  id: varchar("id", { length: 64 }).primaryKey(),
  ciphertext: text("ciphertext").notNull(),
  iv: varchar("iv", { length: 64 }).notNull(),
  version: varchar("version", { length: 32 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
});

export type EncryptedResultVault = typeof encryptedResultVaults.$inferSelect;

/**
 * Hourly quotas keyed by HMAC(IP), never by the network identifier in clear text.
 * These records carry no result payload, recovery secret or user responses.
 */
export const resultVaultRateLimits = mysqlTable("result_vault_rate_limits", {
  keyHash: varchar("keyHash", { length: 64 }).primaryKey(),
  windowStartedAt: timestamp("windowStartedAt").notNull(),
  saveCount: int("saveCount").notNull().default(0),
  loadCount: int("loadCount").notNull().default(0),
  expiresAt: timestamp("expiresAt").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ResultVaultRateLimit = typeof resultVaultRateLimits.$inferSelect;
