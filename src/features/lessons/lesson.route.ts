import { DataBase } from "../../db";
import { LessonRepository } from "./lesson.repository";
import { LessonService } from "./lesson.service";
import { LessonController } from "./lesson.controller";
import { CourseRepository } from "../course/course.repository";
import { CertificateRepository } from "../certificates/certificate.repository";
import { Router } from "express";
import { validateMiddleware } from "../../shared/middlewares/validate.middleware";

import { UploadService } from "../upload/upload.service";
import { courseSlugParamsRequest } from "../course/dtos/course-params";
import { completeLessonParamsRequest } from "./dtos/complete-lesson.request";
import { findLessonParamsRequest } from "./dtos/lesson-params.dto";

export class LessonRoutes {
  private readonly controller: LessonController;
  private readonly router: Router;

  constructor(private readonly db: DataBase) {
    const repository = new LessonRepository(this.db);
    const courseRepository = new CourseRepository(this.db);
    const certificateRepository = new CertificateRepository(this.db);
    const uploadService = new UploadService();
    const service = new LessonService(repository, courseRepository, certificateRepository);
    this.controller = new LessonController(service, uploadService);
    this.router = Router({ mergeParams: true });
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get(
      "/",
      validateMiddleware({ params: courseSlugParamsRequest }),
      this.controller.findManyByCourseSlug
    );

    this.router.get(
      "/:lessonSlug/complete",
      validateMiddleware({ params: completeLessonParamsRequest }),
      this.controller.completeLesson
    );

    this.router.get(
      "/:lessonSlug",
      validateMiddleware({ params: findLessonParamsRequest }),
      this.controller.findBySlug
    );

    this.router.get(
      "/:lessonSlug/video",
      validateMiddleware({ params: findLessonParamsRequest }),
      this.controller.videoStreaming
    );
    this.router.delete(
      "/reset",
      validateMiddleware({ params: courseSlugParamsRequest }),
      this.controller.resetCourseCompleted
    );
  }

  get getRouter() {
    return this.router;
  }
}
