import z from "zod";

export const findManyCoursesReponse = z.array(
  z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string(),
  })
);
