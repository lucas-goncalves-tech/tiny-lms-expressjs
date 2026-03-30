import z from "zod";

export const findLessonBySlugResponse = z.object({
  id: z.string().optional(),
  courseId: z.string().optional(),
  slug: z.string().optional(),
  title: z.string().optional(),
  seconds: z.number().optional(),
  description: z.string().optional(),
  order: z.number().optional(),
  created: z.string().optional(),
  videoUrl: z.string().optional(),
  prevLesson: z.string().nullable(),
  nextLesson: z.string().nullable(),
  completed: z.string().nullable(),
});

export type FindLessonBySlugResponse = z.infer<typeof findLessonBySlugResponse>;
