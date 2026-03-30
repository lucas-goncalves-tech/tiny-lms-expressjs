import { lt, sql } from "drizzle-orm";
import { DataBase } from "../db";
import { sessions } from "../db/schema";

export class CleanUpSessionsExpiresJob {
  constructor(private readonly db: DataBase) {}

  private async cleanExpiredSessions() {
    try {
      await this.db.connection
        .delete(sessions)
        .where(lt(sessions.expires, sql`UNIXEPOCH('now')`))
        .execute();
      console.log(`[SessionCleanup] Removed expired sessions`);
    } catch (error) {
      console.error("[SessionCleanup] Error:", error);
    }
  }

  async start(expiresHour: number = 6) {
    this.cleanExpiredSessions();
    const expiresMs = 1000 * 60 * 60 * expiresHour;
    setInterval(() => {
      this.cleanExpiredSessions();
    }, expiresMs).unref();
  }
}
