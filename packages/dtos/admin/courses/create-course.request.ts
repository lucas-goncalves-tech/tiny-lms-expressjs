import { z } from "zod";
import {
  zodSlugValidator,
  zodTitleValidator,
  zodDescriptionValidator,
} from "../../validators/common-fields.validator";

export const createCourseRequest = z.strictObject({
  slug: zodSlugValidator(),
  title: zodTitleValidator(),
  description: zodDescriptionValidator(),
});

export type CreateCourseRequest = z.infer<typeof createCourseRequest>;
