import { ErrorBase } from "./base.error";

export class UnprocessableEntityError extends ErrorBase {
  constructor(message = "Dados válidos, mas não processáveis") {
    super(message, 422);
  }
}
