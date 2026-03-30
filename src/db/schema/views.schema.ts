import { sqliteView, text, integer } from "drizzle-orm/sqlite-core";

export const lessonsCompletedFull = sqliteView("lessons_completed_full", {
  id: text("id"),
  email: text("email"),
  course: text("course"),
  lesson: text("lesson"),
  completed: text("completed"),
}).existing();

export const coursesStats = sqliteView("courses_stats", {
  id: text("id"),
  slug: text("slug"),
  title: text("title"),
  description: text("description"),
  created: text("created"),
  totalSeconds: integer("total_seconds"),
  totalLessons: integer("total_lessons"),
}).existing();

export const coursesUserProgress = sqliteView("courses_user_progress", {
  id: text("id"),
  slug: text("slug"),
  title: text("title"),
  description: text("description"),
  created: text("created"),
  totalSeconds: integer("total_seconds"),
  totalLessons: integer("total_lessons"),
  userId: text("user_id"),
  completedLessons: integer("completed_lessons"),
}).existing();

export const certificatesFull = sqliteView("certificates_full", {
  id: text("id"),
  userId: text("user_id"),
  name: text("name"),
  courseId: text("course_id"),
  title: text("title"),
  totalSeconds: integer("total_seconds"),
  totalLessons: integer("total_lessons"),
  completed: text("completed"),
}).existing();

export const lessonNav = sqliteView("lesson_nav", {
  currentSlug: text("current_slug"),
  id: text("id"),
  courseId: text("course_id"),
  slug: text("slug"),
  title: text("title"),
  seconds: integer("seconds"),
  video: text("video"),
  description: text("description"),
  order: integer("order"),
  created: text("created"),
}).existing();

export const lessonsUserProgress = sqliteView("lessons_user_progress", {
  id: text("id"),
  courseId: text("course_id"),
  slug: text("slug"),
  title: text("title"),
  seconds: integer("seconds"),
  video: text("video"),
  description: text("description"),
  order: integer("order"),
  created: text("created"),
  userId: text("user_id"),
  completed: text("completed"),
}).existing();
