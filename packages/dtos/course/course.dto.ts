import z from "zod";

export const findCourseResponse = z.object({
  id: z.string().nullable(),
  slug: z.string().nullable(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  created: z.string().nullable(),
  totalSeconds: z.number().nullable(),
  totalLessons: z.number().nullable(),
});

export const findManyWithProgressResponse = z.array(
  findCourseResponse.extend({
    completedLessons: z.number().nullable(),
  })
);

export type FindCourseResponse = z.infer<typeof findCourseResponse>;
