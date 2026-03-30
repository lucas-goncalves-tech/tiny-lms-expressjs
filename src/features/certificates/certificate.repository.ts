import { and, eq } from "drizzle-orm";
import { DataBase } from "../../db";
import { certificates } from "../../db/schema";
import { certificatesFull } from "../../db/schema/views.schema";

export class CertificateRepository {
  constructor(private readonly db: DataBase) {}

  async create(userId: string, courseId: string) {
    try {
      return this.db.connection
        .insert(certificates)
        .values({ userId, courseId })
        .onConflictDoNothing()
        .returning({ id: certificates.id })
        .get();
    } catch (error) {
      console.error("Error ao criar certificado", error);
      throw error;
    }
  }

  async findManyCertificatesByUserId(userId: string) {
    try {
      return this.db.connection
        .select()
        .from(certificatesFull)
        .where(eq(certificatesFull.userId, userId))
        .all();
    } catch (error) {
      console.error("Error ao buscar certificados", error);
      throw error;
    }
  }

  async findCertificateById(certificateId: string) {
    try {
      return this.db.connection
        .select()
        .from(certificatesFull)
        .where(eq(certificatesFull.id, certificateId))
        .get();
    } catch (error) {
      console.error("Error ao buscar certificado", error);
      throw error;
    }
  }

  async deleteByUserIdAndCourseId(userId: string, courseId: string) {
    try {
      return this.db.connection
        .delete(certificates)
        .where(and(eq(certificates.userId, userId), eq(certificates.courseId, courseId)))
        .returning({ id: certificates.id })
        .get();
    } catch (error) {
      console.error("Error ao deletar certificado", error);
      throw error;
    }
  }
}
