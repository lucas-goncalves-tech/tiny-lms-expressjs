import z from "zod";

export const certificate = z.object({
  totalSeconds: z.number(),
  id: z.string().nullable(),
  name: z.string().nullable(),
  courseId: z.string().nullable(),
  title: z.string().nullable(),
  totalLessons: z.number().nullable(),
  completed: z.string().nullable(),
});

export const findManyCertificatesResponse = z.array(certificate);
