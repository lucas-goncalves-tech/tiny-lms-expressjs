import { ErrorBase } from "./base.error";

export class NotfoundError extends ErrorBase {
  constructor(message = "Recurso não encontrado!") {
    super(message, 404);
  }
}
