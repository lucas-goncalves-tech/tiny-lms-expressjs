import { customType } from "drizzle-orm/sqlite-core";

/**
 * Cria uma coluna TEXT com COLLATE NOCASE (case-insensitive)
 * Útil para emails, slugs, usernames, etc.
 */
export const textCaseInsensitive = customType<{ data: string }>({
  dataType() {
    return "TEXT COLLATE NOCASE";
  },
});
