import { asc, eq } from "drizzle-orm";
import { DataBase } from "../../db";
import { courses } from "../../db/schema";
import { coursesStats, coursesUserProgress } from "../../db/schema/views.schema";
import { ICreateCourseInput, IUpdateCourseInput } from "./interface/course.interface";

export class CourseRepository {
  constructor(private readonly db: DataBase) {}

  async findMany() {
    try {
      return this.db.connection
        .select({
          slug: courses.slug,
          title: courses.title,
          description: courses.description,
        })
        .from(courses)
        .all();
    } catch (error) {
      console.error("Error ao encontrar cursos", error);
      throw error;
    }
  }

  async findManyWithProgress(userId: string) {
    try {
      return this.db.connection
        .select()
        .from(coursesUserProgress)
        .where(eq(coursesUserProgress.userId, userId))
        .limit(100)
        .orderBy(asc(coursesUserProgress.created))
        .all();
    } catch (error) {
      console.error("Error ao encontrar cursos", error);
      throw error;
    }
  }

  async findOneBySlug(courseSlug: string) {
    try {
      return this.db.connection
        .select()
        .from(coursesStats)
        .where(eq(coursesStats.slug, courseSlug))
        .get();
    } catch (error) {
      console.error("Error ao encontrar curso pelo slug", error);
      throw error;
    }
  }

  async findBySlug(courseSlug: string) {
    try {
      return this.db.connection.select().from(courses).where(eq(courses.slug, courseSlug)).get();
    } catch (error) {
      console.error("Error ao encontrar curso pelo slug", error);
      throw error;
    }
  }

  async createCourse(courseData: ICreateCourseInput) {
    try {
      return this.db.connection.insert(courses).values(courseData).onConflictDoNothing().run();
    } catch (error) {
      console.error("Não foi possivel inserir um novo curso", error);
      throw error;
    }
  }

  async updateCourse(courseSlug: string, courseData: IUpdateCourseInput) {
    try {
      this.db.connection.update(courses).set(courseData).where(eq(courses.slug, courseSlug)).run();
    } catch (error) {
      console.error("Não foi possivel atualizar o curso", error);
      throw error;
    }
  }

  async deleteCourse(courseSlug: string) {
    try {
      this.db.connection.delete(courses).where(eq(courses.slug, courseSlug)).run();
    } catch (error) {
      console.error("Não foi possivel deletar o curso", error);
      throw error;
    }
  }
}
