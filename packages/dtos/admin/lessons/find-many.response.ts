import z from "zod";

export const findManylessonsResponse = z.array(
  z.object({
    id: z.string(),
    courseId: z.string(),
    slug: z.string(),
    title: z.string(),
    seconds: z.number(),
    video: z.string(),
    description: z.string(),
    order: z.number(),
    created: z.string(),
  })
);
