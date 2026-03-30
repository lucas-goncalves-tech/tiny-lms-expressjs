import { z } from "zod";
import { zodSafeEmail } from "../../../shared/validators/email.validator";
import { zodPasswordValidator } from "../../../shared/validators/common-fields.validator";
import { zodNameValdiator } from "../../../shared/validators/common-fields.validator";

export const createUserRequest = z
  .strictObject({
    name: zodNameValdiator(),
    email: zodSafeEmail(),
    password: zodPasswordValidator("Senha"),
    confirmPassword: zodPasswordValidator("Confirmação de senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type CreateUserRequest = z.infer<typeof createUserRequest>;
