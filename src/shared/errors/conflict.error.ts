import { ErrorBase } from "./base.error";

export class ConflictError extends ErrorBase {
  constructor(message = "Este recurso já existe!") {
    super(message, 409);
  }
}
