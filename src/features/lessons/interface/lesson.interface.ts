import { lessons } from "../../../db/schema";

export type ILesson = typeof lessons.$inferInsert;
export type ICreateLessonInput = Omit<ILesson, "id" | "created">;
export type IUpdateLessonInput = Partial<Omit<ILesson, "id" | "created">>;
