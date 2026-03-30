import z from "zod";
import { zodSlugValidator } from "../validators/common-fields.validator";

export const findLessonParamsRequest = z.object({
  courseSlug: zodSlugValidator("courseSlug"),
  lessonSlug: zodSlugValidator("lessonSlug"),
});
