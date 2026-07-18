import z from "zod";

export const userIdParamsSchema = z.strictObject({
  userId: z.uuid(),
});

export type UserIdParamsSchema = z.infer<typeof userIdParamsSchema>;

