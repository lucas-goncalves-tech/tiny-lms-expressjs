import { ErrorBase } from "./base.error";

export class ForbiddenError extends ErrorBase {
  constructor(message = "Acesso negado") {
    super(message, 403);
  }
}
