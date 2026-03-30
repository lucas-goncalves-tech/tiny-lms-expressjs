import z from "zod";

export const createUserResponse = z.object({
  message: z.string(),
});
