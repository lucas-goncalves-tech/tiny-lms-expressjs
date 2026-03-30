import z from "zod";
import { zodIntegerValidator } from "../../validators/common-fields.validator";
import { zodSafeString } from "../../validators/string.validator copy";

export const userQueryRequest = z.strictObject({
  search: zodSafeString().optional(),
  limit: zodIntegerValidator().optional(),
  page: zodIntegerValidator().optional(),
});

export type UserQueryRequest = z.infer<typeof userQueryRequest>;
