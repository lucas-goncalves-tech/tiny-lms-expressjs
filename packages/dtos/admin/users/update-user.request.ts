import z from "zod";
import {
  zodNameValdiator,
  zodRoleValidator,
} from "../../validators/common-fields.validator";

export const updateUserRequest = z
  .strictObject({
    name: zodNameValdiator().optional(),
    role: zodRoleValidator().optional(),
  })
  .refine((data) => Object.entries(data).length > 0, {
    message: "Pelo menos um campo deve ser informado",
  });

export type UpdateUserRequest = z.infer<typeof updateUserRequest>;
