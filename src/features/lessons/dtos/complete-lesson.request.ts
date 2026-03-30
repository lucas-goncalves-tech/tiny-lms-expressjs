import { z } from "zod";
import { zodSlugValidator } from "../../../backend/src/shared/validators/common-fields.validator";

export const completeLessonParamsRequest = z.object({
  courseSlug: zodSlugValidator("courseSlug"),
  lessonSlug: zodSlugValidator("lessonSlug"),
});
