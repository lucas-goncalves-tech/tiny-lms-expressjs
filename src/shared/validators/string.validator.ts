import { z } from "zod";

export const zodSafeString = (typeMessage = "Campo deve ser uma string") =>
  z
    .string(typeMessage)
    .trim()
    .normalize("NFC")
    .refine((val) => /\S/.test(val), {
      message: "Campo não pode conter apenas espaços",
    })
    .refine((val) => !/[\u200B-\u200D\uFEFF]/.test(val), {
      message: "Caracteres invisíveis não são permitidos",
    });
