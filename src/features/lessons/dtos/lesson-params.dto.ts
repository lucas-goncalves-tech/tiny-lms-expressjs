import z from "zod";
import { zodSlugValidator } from "../../../shared/validators/common-fields.validator";

export const findLessonParamsRequest = z.object({
  courseSlug: zodSlugValidator("courseSlug"),
  lessonSlug: zodSlugValidator("lessonSlug"),
});

export type FindLessonParamsRequest = z.infer<typeof findLessonParamsRequest>;