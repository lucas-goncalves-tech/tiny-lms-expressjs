import z from "zod";
import { zodIntegerValidator } from "../../../../shared/validators/common-fields.validator";
import { zodSafeString } from "../../../../shared/validators/string.validator";

export const userQueryRequest = z.strictObject({
  search: zodSafeString().optional(),
  limit: zodIntegerValidator().optional(),
  page: zodIntegerValidator().optional(),
});

export type UserQueryRequest = z.infer<typeof userQueryRequest>;
