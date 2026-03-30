import z from "zod";
import {
  zodDescriptionValidator,
  zodTitleValidator,
} from "../../../../shared/validators/common-fields.validator";

export const updateCourseRequest = z.strictObject({
  title: zodTitleValidator(),
  description: zodDescriptionValidator(),
});

export type UpdateCourseRequest = z.infer<typeof updateCourseRequest>;
