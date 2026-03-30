import { z } from "zod";
import { zodPasswordValidator } from "../../../shared/validators/common-fields.validator";

export const updatePasswordRequest = z
  .strictObject({
    currentPassword: zodPasswordValidator("Senha atual"),
    newPassword: zodPasswordValidator("Nova senha"),
    confirmPassword: zodPasswordValidator("Confirmação de nova senha"),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "A nova senha deve ser diferente da senha atual",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type UpdatePasswordRequest = z.infer<typeof updatePasswordRequest>;
