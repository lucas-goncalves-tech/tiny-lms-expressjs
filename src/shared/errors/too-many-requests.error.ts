import { ErrorBase } from "./base.error";

export class TooManyRequestsError extends ErrorBase {
  constructor() {
    super("Muitas requisições. Tente novamente mais tarde.", 429);
  }
}
