import { Router } from "express";
import { DataBase } from "../../db";
import { validateMiddleware } from "../../shared/middlewares/validate.middleware";
import { adminGuardMiddleware } from "../../shared/middlewares/guard-role.middleware";

import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { CourseRepository } from "../course/course.repository";

import { LessonRepository } from "../lessons/lesson.repository";

import { UserRepository } from "../user/user.repository";

import { CryptoService } from "../../shared/security/crypto-service.security";
import { noCacheMiddleware } from "../../shared/middlewares/no-cache.middleware";

import { validateFileHeadersMiddleware } from "../../shared/middlewares/validate-file-headers.middleware";
import { UploadService } from "../upload/upload.service";
import { createCourseRequest } from "./dtos/courses/create-course.request";
import { courseSlugParamsRequest } from "../course/dtos/course-params";
import { updateCourseRequest } from "./dtos/courses/update-course.request";
import { createLessonRequest } from "./dtos/lessons/create-lesson.request";
import { lessonSlugParamsRequest } from "../course/dtos/lesson-params";
import { updateLessonRequest } from "./dtos/lessons/update-lesson.request";
import { userQueryRequest } from "./dtos/users/users-query.request";
import { userIdParamsSchema } from "./dtos/common/admin.params";
import { updateUserRequest } from "./dtos/users/update-user.request";
import { adminCreateUserRequest } from "./dtos/users/create-user.request";

export class AdminRoutes {
  private readonly controller: AdminController;
  private readonly router: Router;

  constructor(private readonly db: DataBase) {
    const cryptoService = new CryptoService();
    const repository = new CourseRepository(this.db);
    const lessonRepository = new LessonRepository(this.db);
    const userRepository = new UserRepository(this.db);
    const uploadService = new UploadService();
    const service = new AdminService(
      repository,
      lessonRepository,
      userRepository,
      cryptoService,
      uploadService
    );
    this.controller = new AdminController(service, uploadService);
    this.router = Router();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.use(adminGuardMiddleware);
    this.router.use(noCacheMiddleware);

    // Courses
    this.router.get("/courses", this.controller.findManyCourses);
    this.router.post(
      "/courses/new",
      validateMiddleware({ body: createCourseRequest }),
      this.controller.createCourse
    );
    this.router.put(
      "/courses/:courseSlug/update",
      validateMiddleware({ params: courseSlugParamsRequest, body: updateCourseRequest }),
      this.controller.updateCourse
    );
    this.router.delete(
      "/courses/:courseSlug/delete",
      validateMiddleware({ params: courseSlugParamsRequest }),
      this.controller.deleteCourse
    );

    // Lessons
    this.router.get("/lessons/:courseSlug", this.controller.findManyLessons);
    this.router.post(
      "/lessons/:courseSlug/new",
      validateMiddleware({ params: courseSlugParamsRequest, body: createLessonRequest }),
      this.controller.createLesson
    );
    this.router.post(
      "/lessons/upload-video",
      validateFileHeadersMiddleware,
      this.controller.uploadVideo
    );
    this.router.put(
      "/lessons/:courseSlug/:lessonSlug/update",
      validateMiddleware({ params: lessonSlugParamsRequest, body: updateLessonRequest }),
      this.controller.updateLesson
    );
    this.router.delete(
      "/lessons/:courseSlug/:lessonSlug/delete",
      validateMiddleware({ params: lessonSlugParamsRequest }),
      this.controller.deleteLesson
    );

    // Users
    this.router.get(
      "/users",
      validateMiddleware({ query: userQueryRequest }),
      this.controller.findManyUsers
    );
    this.router.put(
      "/users/:userId/update",
      validateMiddleware({ params: userIdParamsSchema, body: updateUserRequest }),
      this.controller.updateUser
    );
    this.router.post(
      "/users/new",
      validateMiddleware({ body: adminCreateUserRequest }),
      this.controller.createUser
    );
    this.router.patch(
      "/users/:userId/toggle-active",
      validateMiddleware({ params: userIdParamsSchema }),
      this.controller.toggleUserStatus
    );
    this.router.delete(
      "/users/:userId/delete",
      validateMiddleware({ params: userIdParamsSchema }),
      this.controller.deleteUser
    );
  }

  get getRouter() {
    return this.router;
  }
}
