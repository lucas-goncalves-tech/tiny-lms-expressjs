import express from "express";
import helmet from "helmet";
import cors from "cors";
import { errorHandler } from "./shared/middlewares/error.middleware";
import { DataBase } from "./db";
import { MainRoutes } from "./route";
import { NotfoundError } from "./shared/errors/not-found.error";
import cookieParser from "cookie-parser";
import { rateLimitMiddleware } from "./shared/middlewares/rate-limit.middleware";
import { logMiddleware } from "./shared/middlewares/log.middleware";
import { apiReference } from "@scalar/express-api-reference";
import { generateOpenAPISpec } from "./doc/openapi.generator";
import { CleanUpSessionsExpiresJob } from "./jobs/cleanup-sessions-expires.job";

class App {
  public readonly app: express.Express;
  private readonly mainRoutes: MainRoutes;
  public readonly db: DataBase;
  public readonly cleanupSessionsExpires: CleanUpSessionsExpiresJob;
  private readonly ttl: number;
  constructor(dbPath?: string) {
    this.app = express();
    this.db = new DataBase(dbPath);
    this.cleanupSessionsExpires = new CleanUpSessionsExpiresJob(this.db);
    this.mainRoutes = new MainRoutes(this.db);
    this.ttl = 15 * 60 * 1000;
    this.init();
  }

  private jobs() {
    this.cleanupSessionsExpires.start();
  }

  private docs() {
    this.app.use(
      "/api-docs",
      apiReference({
        theme: "deepSpace",
        content: generateOpenAPISpec(),
      })
    );
  }

  private middlewares() {
    this.app.use(
      cors({
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true,
      })
    );
    this.app.use(
      helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
      })
    );
    this.app.use(rateLimitMiddleware(this.ttl, 100, false));
    this.app.use(express.json({ limit: "1mb" }));
    this.app.use(cookieParser());
    this.app.use(logMiddleware);
  }

  private routes() {
    this.app.use("/api/v1", this.mainRoutes.getRouter);

    this.app.use((_req, _res, next) => {
      next(new NotfoundError("Endpoint não encontrado"));
    });
  }

  private handlers() {
    this.app.use(errorHandler);
  }

  private init() {
    this.jobs();
    this.docs();
    this.middlewares();
    this.routes();
    this.handlers();
  }
}

export { App };
