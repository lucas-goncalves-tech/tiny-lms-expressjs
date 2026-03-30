import { eq } from "drizzle-orm";
import { type DataBase } from "../../db";
import { sessions } from "../../db/schema";
import { type ISessionInput } from "./interface/sessions.interface";

export class SessionsRepository {
  constructor(private readonly db: DataBase) {}

  async createSession(sessionData: ISessionInput) {
    const expires = Math.floor(sessionData.expires_ms / 1000);
    try {
      const result = this.db.connection
        .insert(sessions)
        .values({ ...sessionData, expires })
        .onConflictDoNothing()
        .returning()
        .get();

      return result ?? null;
    } catch (error) {
      console.error("Error ao criar sessão ", error);
      throw error;
    }
  }

  async findSessionBySidHash(sidHash: Buffer) {
    try {
      const result = this.db.connection
        .select()
        .from(sessions)
        .where(eq(sessions.sidHash, sidHash))
        .get();

      return result ? { ...result, expires_ms: result.expires * 1000 } : null;
    } catch (error) {
      console.error("Error ao buscar sessão ", error);
      throw error;
    }
  }

  async revokeSessionByKey(key: "sidHash" | "userId", value: string | Buffer) {
    try {
      await this.db.connection
        .update(sessions)
        .set({ revoked: 1 })
        .where(eq(sessions[key], value))
        .execute();
    } catch (error) {
      console.error("Error ao revogar sessão ", error);
      throw error;
    }
  }

  async updateExpiresBySidHash(sidHash: Buffer, expires_ms: number) {
    try {
      await this.db.connection
        .update(sessions)
        .set({ expires: Math.floor(expires_ms / 1000) })
        .where(eq(sessions.sidHash, sidHash))
        .execute();
    } catch (error) {
      console.error("Error ao atualizar sessão ", error);
      throw error;
    }
  }
}
