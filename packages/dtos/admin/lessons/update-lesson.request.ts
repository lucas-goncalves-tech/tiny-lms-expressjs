import { z } from "zod";
import {
  zodSlugValidator,
  zodTitleValidator,
  zodDescriptionValidator,
  zodIntegerValidator,
} from "../../validators/common-fields.validator";
import { zodSafeString } from "../../validators/string.validator copy";

export const updateLessonRequest = z.strictObject({
  slug: zodSlugValidator().optional(),
  title: zodTitleValidator().optional(),
  description: zodDescriptionValidator().optional(),
  video: zodSafeString().optional(),
  seconds: zodIntegerValidator("Duração").optional(),
  order: zodIntegerValidator("Ordem").optional(),
});

export type UpdateLessonRequest = z.infer<typeof updateLessonRequest>;
