import { updatePasswordRequest, updateEmailRequest } from "@lms/dtos";
import { Router } from "express";
import { UserController } from "./user.controller";
import { DataBase } from "../../db";
import { SessionsRepository } from "../sessions/sessions.repository";
import { UserRepository } from "./user.repository";
import { CryptoService } from "../../shared/security/crypto-service.security";
import { SessionsService } from "../sessions/sessions.service";
import { UserService } from "./user.service";
import { noCacheMiddleware } from "../../shared/middlewares/no-cache.middleware";
import { validateMiddleware } from "../../shared/middlewares/validate.middleware";

import { rateLimitMiddleware } from "../../shared/middlewares/rate-limit.middleware";

export class UserRoutes {
  private readonly controller: UserController;
  private readonly router: Router;
  private readonly ttl: number;

  constructor(private readonly db: DataBase) {
    const userRepository = new UserRepository(this.db);
    const cryptoService = new CryptoService();
    const sessionsRepository = new SessionsRepository(this.db);
    const sessionsService = new SessionsService(sessionsRepository, userRepository, cryptoService);
    const service = new UserService(userRepository, cryptoService);
    this.controller = new UserController(service, sessionsService);
    this.router = Router();
    this.initRoutes();
    this.ttl = 10 * 60 * 1000;
  }

  private initRoutes() {
    this.router.use(rateLimitMiddleware(this.ttl, 10));
    this.router.use(noCacheMiddleware);
    this.router.put(
      "/password/update",
      validateMiddleware({ body: updatePasswordRequest }),
      this.controller.updatePassword
    );
    this.router.put(
      "/email/update",
      validateMiddleware({ body: updateEmailRequest }),
      this.controller.updateEmail
    );
  }

  get getRouter() {
    return this.router;
  }
}
