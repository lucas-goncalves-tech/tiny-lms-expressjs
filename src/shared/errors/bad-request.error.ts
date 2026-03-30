import { ErrorBase } from "./base.error";

export class BadRequestError extends ErrorBase {
  constructor(message: string, details?: unknown) {
    super(message, 400, details);
  }
}
