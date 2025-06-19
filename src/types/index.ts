/**
 * Type exports
 *
 * This file re-exports types from schema.ts (schema-derived types)
 * as well as other necessary types from the application.
 *
 * IMPORTANT: Prefer using schema-derived types from schema.ts
 * instead of manually defined types whenever possible.
 */

export * from "./schema";

// Utility types
export type Nullable<T> = T | null;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredKeys<T> = { [K in keyof T]-?: NonNullable<T[K]> };
