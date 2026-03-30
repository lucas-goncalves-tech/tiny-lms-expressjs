import { DataBase } from "../../db";
import { validateMiddleware } from "../../shared/middlewares/validate.middleware";
import { CertificateRepository } from "./certificate.repository";
import { CertificatesController } from "./certificate.controller";
import { CertificatesService } from "./certificate.service";
import { Router } from "express";

import { ValidateSessionMiddleware } from "../../shared/middlewares/validate-session.middleware";
import { SessionsService } from "../sessions/sessions.service";
import { UserRepository } from "../user/user.repository";
import { CryptoService } from "../../shared/security/crypto-service.security";
import { SessionsRepository } from "../sessions/sessions.repository";
import { certificateIdParamsRequest } from "./dtos/certificate-params.dto";

export class CertificatesRoutes {
  private readonly router = Router();
  private readonly controller: CertificatesController;
  private readonly validateSessionMiddleware: ValidateSessionMiddleware;

  constructor(private readonly db: DataBase) {
    const cryptoService = new CryptoService();
    const repository = new CertificateRepository(this.db);
    const userRepository = new UserRepository(this.db);
    const sessionRepository = new SessionsRepository(this.db);
    const sessionService = new SessionsService(sessionRepository, userRepository, cryptoService);
    const service = new CertificatesService(repository);
    this.controller = new CertificatesController(service);
    this.validateSessionMiddleware = new ValidateSessionMiddleware(sessionService);
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get(
      "/",
      this.validateSessionMiddleware.validateSession,
      this.controller.findManyCertificatesByUserId
    );
    this.router.get(
      "/:certificateId",
      validateMiddleware({ params: certificateIdParamsRequest }),
      this.controller.findCertificateById
    );
  }

  get getRouter() {
    return this.router;
  }
}
