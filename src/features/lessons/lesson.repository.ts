import { and, asc, eq, getTableColumns } from "drizzle-orm";
import { DataBase } from "../../db";
import { courses, lessons, lessonsCompleted } from "../../db/schema";
import { ICreateLessonInput, IUpdateLessonInput } from "./interface/lesson.interface";
import { lessonNav, lessonsUserProgress } from "../../db/schema/views.schema";

export class LessonRepository {
  constructor(private readonly db: DataBase) {}

  async createLesson(lessonData: ICreateLessonInput) {
    try {
      return this.db.connection
        .insert(lessons)
        .values(lessonData)
        .onConflictDoNothing()
        .returning({
          title: lessons.title,
        })
        .get();
    } catch (error) {
      console.error("Error ao criar nova aula", error);
      throw error;
    }
  }

  async updateLesson(lessonId: string, lessonData: IUpdateLessonInput) {
    try {
      return this.db.connection
        .update(lessons)
        .set(lessonData)
        .where(eq(lessons.id, lessonId))
        .returning()
        .get();
    } catch (error) {
      console.error("Error ao criar nova aula", error);
      throw error;
    }
  }

  async deleteLesson(courseId: string, lessonId: string) {
    try {
      return await this.db.connection
        .delete(lessons)
        .where(and(eq(lessons.id, lessonId), eq(lessons.courseId, courseId)))
        .execute();
    } catch (error) {
      console.error("Error ao criar nova aula", error);
      throw error;
    }
  }

  async findManyByCourseSlug(courseSlug: string) {
    try {
      const courseIdSubquery = this.db.connection
        .select({ id: courses.id })
        .from(courses)
        .where(eq(courses.slug, courseSlug));
      return this.db.connection
        .select()
        .from(lessons)
        .where(eq(lessons.courseId, courseIdSubquery))
        .orderBy(asc(lessons.order))
        .all();
    } catch (error) {
      console.error("Error ao buscar aulas por curso", error);
      throw error;
    }
  }

  async findManyByCourseSlugWithProgress(userId: string, courseSlug: string) {
    try {
      const courseIdSubquery = this.db.connection
        .select({ id: courses.id })
        .from(courses)
        .where(eq(courses.slug, courseSlug));
      return this.db.connection
        .select()
        .from(lessonsUserProgress)
        .where(
          and(
            eq(lessonsUserProgress.courseId, courseIdSubquery),
            eq(lessonsUserProgress.userId, userId)
          )
        )
        .orderBy(asc(lessonsUserProgress.order))
        .all();
    } catch (error) {
      console.error("Error ao buscar aulas por curso", error);
      throw error;
    }
  }

  async findBySlug(courseSlug: string, lessonSlug: string) {
    try {
      return this.db.connection
        .select({ ...getTableColumns(lessons) })
        .from(lessons)
        .innerJoin(courses, eq(lessons.courseId, courses.id))
        .where(and(eq(lessons.slug, lessonSlug), eq(courses.slug, courseSlug)))
        .get();
    } catch (error) {
      console.error("Error ao buscar aula por slug", error);
      throw error;
    }
  }

  async findWhenLessonCompleted(userId: string, courseId: string, lessonId: string) {
    try {
      const result = this.db.connection
        .select({ completed: lessonsCompleted.completed })
        .from(lessonsCompleted)
        .where(
          and(
            eq(lessonsCompleted.userId, userId),
            eq(lessonsCompleted.courseId, courseId),
            eq(lessonsCompleted.lessonId, lessonId)
          )
        )
        .get();
      return result?.completed;
    } catch (error) {
      console.error("Error ao buscar aulas completadas", error);
      throw error;
    }
  }

  async completeLesson(userId: string, courseId: string, lessonId: string) {
    try {
      return this.db.connection
        .insert(lessonsCompleted)
        .values({ userId, courseId, lessonId })
        .onConflictDoNothing()
        .returning()
        .get();
    } catch (error) {
      console.error("Error ao completar aula", error);
      throw error;
    }
  }

  async lessonNav(courseSlug: string, lessonSlug: string) {
    try {
      const courseIdSubquery = this.db.connection
        .select({ id: courses.id })
        .from(courses)
        .where(eq(courses.slug, courseSlug));

      const result = this.db.connection
        .select({ slug: lessonNav.slug })
        .from(lessonNav)
        .where(and(eq(lessonNav.currentSlug, lessonSlug), eq(lessonNav.courseId, courseIdSubquery)))
        .all();
      return result;
    } catch (error) {
      console.error("Error ao buscar aula por slug", error);
      throw error;
    }
  }

  async lessonsProgress(userId: string, courseId: string) {
    try {
      const result = this.db.connection
        .select({ id: lessons.id, completed: lessonsCompleted.completed })
        .from(lessons)
        .leftJoin(
          lessonsCompleted,
          and(eq(lessons.id, lessonsCompleted.lessonId), eq(lessonsCompleted.userId, userId))
        )
        .where(eq(lessons.courseId, courseId))
        .orderBy(asc(lessons.order))
        .all();
      return result;
    } catch (error) {
      console.error("Error ao buscar progresso de aulas", error);
      throw error;
    }
  }

  async resetCourseCompleted(userId: string, courseId: string) {
    try {
      return this.db.connection
        .delete(lessonsCompleted)
        .where(and(eq(lessonsCompleted.userId, userId), eq(lessonsCompleted.courseId, courseId)))
        .returning()
        .get();
    } catch (error) {
      console.error("Error ao resetar curso", error);
      throw error;
    }
  }
}
