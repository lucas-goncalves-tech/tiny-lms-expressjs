import { sql } from "drizzle-orm";
import { blob, check } from "drizzle-orm/sqlite-core";
import { integer } from "drizzle-orm/sqlite-core";
import { text } from "drizzle-orm/sqlite-core";
import { sqliteTable } from "drizzle-orm/sqlite-core";
import { users } from "./user.schema";

export const sessions = sqliteTable(
  "sessions",
  {
    sidHash: blob("sid_hash").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: integer("expires").notNull(),
    ip: text("ip").notNull(),
    userAgent: text("user_agent").notNull(),
    revoked: integer("revoked").notNull().default(0),
    created: integer("created")
      .notNull()
      .default(sql`(STRFTIME('%s', 'NOW'))`),
  },
  (table) => [check("revoked_check", sql`${table.revoked} IN (0, 1)`)]
);
