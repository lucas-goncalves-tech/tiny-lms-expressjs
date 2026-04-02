import z from "zod";

export const loginResponse = z.object({
  token: z.string(),
});
