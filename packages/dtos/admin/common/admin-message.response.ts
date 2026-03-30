import z from "zod";

export const adminMessageResponse = z.object({
  message: z.string(),
});
