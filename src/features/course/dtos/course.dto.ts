import z from "zod";

export const findCourseResponse = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  created: z.string(),
  totalSeconds: z.number(),
  totalLessons: z.number(),
});

export const findManyWithProgressResponse = z.array(
  findCourseResponse.extend({
    completedLessons: z.number().nullable(),
  })
);

export type FindCourseResponse = z.infer<typeof findCourseResponse>;
