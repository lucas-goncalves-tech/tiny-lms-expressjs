import z from "zod";

export const findManyUsersResponse = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    role: z.string(),
    isActive: z.number(),
    total: z.number(),
  })
);
