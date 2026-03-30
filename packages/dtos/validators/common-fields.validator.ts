import z from "zod";
import { zodSafeString } from "./string.validator copy";

export const zodSlugValidator = (slugName = "Slug") =>
  zodSafeString()
    .min(3, `${slugName} deve ter no mínimo 3 caracteres`)
    .max(30, `${slugName} deve ter no máximo 30 caracteres`)
    .regex(/^[a-z0-9-]+$/, `${slugName} deve conter apenas letras minúsculas, números e hífens`);

export const zodTitleValidator = () =>
  zodSafeString()
    .min(3, "Título deve ter no mínimo 3 caracteres")
    .max(30, "Título deve ter no máximo 30 caracteres");

export const zodDescriptionValidator = () =>
  zodSafeString()
    .min(10, "Descrição deve ter no mínimo 10 caracteres")
    .max(300, "Descrição deve ter no máximo 300 caracteres");

export const zodPasswordValidator = (lengthMessage = "Senha") =>
  z
    .string()
    .min(8, `${lengthMessage} deve ter no mínimo 8 caracteres`)
    .max(72, `${lengthMessage} deve ter no máximo 72 caracteres`);

export const zodIntegerValidator = (numberMessage = "Número") =>
  z.coerce
    .number(`${numberMessage} deve ser um número`)
    .int(`${numberMessage} deve ser um número inteiro`)
    .nonnegative(`${numberMessage} não pode ser negativa`);

export const zodRoleValidator = () => z.enum(["ADMIN", "USER"]);
export const zodNameValdiator = () =>
  zodSafeString()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(30, "Nome deve ter no máximo 30 caracteres");
