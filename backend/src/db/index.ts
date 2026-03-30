import { BetterSQLite3Database, drizzle } from "drizzle-orm/better-sqlite3";
import DatabaseDriver, { type Database } from "better-sqlite3";
import * as schema from "./schema";
import { envCheck } from "../shared/helper/env-check.helper";

export class DataBase {
  public connection: BetterSQLite3Database<typeof schema>;
  private readonly sqlite: Database;
  constructor(dbPath?: string) {
    this.sqlite = new DatabaseDriver(dbPath ?? envCheck().DB_FILE_NAME);
    // Enable foreign key constraints (disabled by default in SQLite)
    this.sqlite.pragma("foreign_keys = ON");
    this.connection = drizzle(this.sqlite, { schema });
  }

  public close() {
    this.sqlite.close();
  }
}
