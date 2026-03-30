import { courseSlugParamsRequest } from "@lms/dtos";
import { Router } from "express";
import { DataBase } from "../../db";
import { CourseController } from "./course.controller";
import { CourseRepository } from "./course.repository";
import { CourseService } from "./course.service";
import { validateMiddleware } from "../../shared/middlewares/validate.middleware";

export class CourseRoutes {
  private readonly controller: CourseController;
  private readonly router: Router;

  constructor(private readonly db: DataBase) {
    const repository = new CourseRepository(this.db);
    const service = new CourseService(repository);
    this.controller = new CourseController(service);
    this.router = Router();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get("/", this.controller.findManyWithProgress);
    this.router.get(
      "/:courseSlug",
      validateMiddleware({ params: courseSlugParamsRequest }),
      this.controller.findOneBySlug
    );
  }

  get getRouter() {
    return this.router;
  }
}
