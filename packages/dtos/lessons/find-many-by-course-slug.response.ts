import z from "zod";

export const lessonSchema = z.object({
  id: z.string().optional(),
  courseId: z.string().optional(),
  slug: z.string().optional(),
  title: z.string().optional(),
  seconds: z.number().optional(),
  description: z.string().optional(),
  order: z.number().optional(),
  created: z.string().optional(),
  completed: z.string().nullable(),
});

export const findManyByCourseSlugResponse = z.array(lessonSchema);

export type LessonResponse = z.infer<typeof lessonSchema>;
export type FindManyByCourseSlugResponse = z.infer<typeof findManyByCourseSlugResponse>;
