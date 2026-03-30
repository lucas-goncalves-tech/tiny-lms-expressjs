import { ErrorBase } from "./base.error";

export class SessionError extends ErrorBase {
  constructor(message = "Sessão Inválida") {
    super(message, 401);
  }
}
