import { z } from "zod";
import {
  zodSlugValidator,
  zodTitleValidator,
  zodDescriptionValidator,
  zodIntegerValidator,
} from "../../validators/common-fields.validator";

export const createLessonRequest = z.strictObject({
  slug: zodSlugValidator(),
  title: zodTitleValidator(),
  seconds: zodIntegerValidator("Duração"),
  video: z.url("URL do vídeo inválida").or(z.string().min(1).trim()),
  description: zodDescriptionValidator(),
  order: zodIntegerValidator("Ordem"),
});

export type CreateLessonRequest = z.infer<typeof createLessonRequest>;
