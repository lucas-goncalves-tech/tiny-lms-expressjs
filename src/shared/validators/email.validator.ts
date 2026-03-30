import { z } from "zod";

export const zodSafeEmail = (typeMessage = "Campo deve ser um email válido") =>
  z
    .email(typeMessage)
    .toLowerCase()
    .trim()
    .refine((val) => /\S/.test(val), {
      message: "Campo não pode conter apenas espaços",
    })
    .refine((val) => !/[\u200B-\u200D\uFEFF]/.test(val), {
      message: "Caracteres invisíveis não são permitidos",
    });
