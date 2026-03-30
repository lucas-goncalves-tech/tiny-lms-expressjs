import z from "zod";

export const uploadVideoResponse = z.object({
  path: z.string(),
  seconds: z.number(),
});

export const uploadVideoHeaders = z.object({
  "x-filename": z.string(),
});
