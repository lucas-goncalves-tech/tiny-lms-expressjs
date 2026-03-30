import z from "zod";

export const completeLessonResponse = z.object({
  completed: z.string().optional(),
  hasCertificate: z.string().optional(),
});

export type CompleteLessonResponse = z.infer<typeof completeLessonResponse>;
