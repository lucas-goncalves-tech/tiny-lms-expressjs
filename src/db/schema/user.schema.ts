import { sqliteTable, text, check } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import crypto from "crypto";
import { textCaseInsensitive } from "../custom-types";
import { integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    email: textCaseInsensitive("email").notNull().unique(),
    password_hash: text("password_hash").notNull(),
    role: text("role", { enum: ["USER", "ADMIN"] })
      .default("USER")
      .notNull(),
    isActive: integer("is_active").default(1).notNull(),
    created: text("created")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    check("role_check", sql`${table.role} IN ('USER', 'ADMIN')`),
    check("is_active_check", sql`${table.isActive} IN (0, 1)`),
  ]
);
