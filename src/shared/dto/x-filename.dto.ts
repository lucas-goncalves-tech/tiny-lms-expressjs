// x-filename.dto.ts
import z from "zod";
import path from "path";

export const xFilenameSchema = z
  .string()
  .min(1, "Nome do arquivo é obrigatório")
  .max(255, "Nome do arquivo muito longo")

  .refine((name) => !name.includes(".."), "Nome do arquivo inválido: path traversal não permitido")

  .refine(
    (name) => !name.includes("/") && !name.includes("\\"),
    "Nome do arquivo inválido: não pode conter barras"
  )
  .refine(
    // eslint-disable-next-line no-control-regex
    (name) => !/[<>:"|?*\u0000-\u001f]/.test(name),
    "Nome do arquivo contém caracteres inválidos"
  )
  .transform((name) => path.basename(name));

export type XFilename = z.infer<typeof xFilenameSchema>;
