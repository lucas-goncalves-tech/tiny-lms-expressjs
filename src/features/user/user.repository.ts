import { desc, eq, like, or, sql } from "drizzle-orm";
import { DataBase } from "../../db";
import { users } from "../../db/schema";
import {
  IAdminCreateUserInput,
  ICreateUserInput,
  IUpdateUserByAdminInput,
  IUpdateUserInput,
} from "./interface/user.interface";

export class UserRepository {
  constructor(private readonly db: DataBase) {}

  async findMany(search = "", limit = 10, page = 1) {
    const offset = (+page - 1) * +limit;
    const safeLimit = +limit > 100 ? 100 : +limit;
    const s = `%${search.trim()}%`;
    try {
      return this.db.connection
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          isActive: users.isActive,
          total: sql<number>`COUNT(*) OVER ()`,
        })
        .from(users)
        .where(or(like(users.name, s), like(users.email, s)))
        .limit(safeLimit)
        .offset(offset)
        .orderBy(desc(users.created))
        .all();
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
      throw err;
    }
  }

  async findByKey(key: "email" | "id", value: string) {
    try {
      const result = this.db.connection.select().from(users).where(eq(users[key], value)).get();
      return result ?? null;
    } catch (err) {
      console.error(`Erro ao buscar usuário por ${key}:`, err);
      throw err;
    }
  }

  async findSessionInfo(userId: string) {
    try {
      const result = this.db.connection
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          isActive: users.isActive,
        })
        .from(users)
        .where(eq(users.id, userId))
        .get();
      return result ?? null;
    } catch (err) {
      console.error(`Erro ao buscar informações de sessão do usuário:`, err);
      throw err;
    }
  }

  async create(user: ICreateUserInput | IAdminCreateUserInput) {
    try {
      const result = this.db.connection
        .insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning({
          name: users.name,
          email: users.email,
          role: users.role,
        })
        .get();
      return result ?? null;
    } catch (err) {
      console.error("Erro ao criar usuário:", err);
      throw err;
    }
  }

  async update(userId: string, userData: Partial<IUpdateUserInput>) {
    try {
      await this.db.connection.update(users).set(userData).where(eq(users.id, userId)).execute();
    } catch (err) {
      console.error(`Erro ao atualizar usuário:`, err);
      throw err;
    }
  }

  async updateByAdmin(userId: string, userData: Partial<IUpdateUserByAdminInput>) {
    try {
      await this.db.connection.update(users).set(userData).where(eq(users.id, userId)).execute();
    } catch (err) {
      console.error(`Erro ao atualizar usuário:`, err);
      throw err;
    }
  }

  async toggleStatus(userId: string) {
    try {
      return this.db.connection
        .update(users)
        .set({ isActive: sql`NOT ${users.isActive}` })
        .where(eq(users.id, userId))
        .returning({
          name: users.name,
          isActive: users.isActive,
        })
        .get();
    } catch (err) {
      console.error(`Erro ao alterar status do usuário:`, err);
      throw err;
    }
  }

  async delete(userId: string) {
    try {
      await this.db.connection.delete(users).where(eq(users.id, userId)).execute();
    } catch (err) {
      console.error(`Erro ao deletar usuário:`, err);
      throw err;
    }
  }
}
