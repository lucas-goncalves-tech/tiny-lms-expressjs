import { ErrorBase } from "./base.error";

export class UnauthorizedError extends ErrorBase {
  constructor(message: string) {
    super(message, 401);
  }
}
