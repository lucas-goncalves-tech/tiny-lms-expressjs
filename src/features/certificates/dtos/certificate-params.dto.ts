import { z } from "zod";

export const certificateIdParamsRequest = z.object({
  certificateId: z.uuid("Formato invalido de ID").trim(),
});

export type CertificateIdParamsRequest = z.infer<
  typeof certificateIdParamsRequest
>;
