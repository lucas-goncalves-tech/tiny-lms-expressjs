import {
  CreateCourseRequest,
  CreateLessonRequest,
  UpdateCourseRequest,
  UpdateUserRequest,
  AdminCreateUserDTO,
  UpdateLessonRequest,
  UserQueryRequest,
} from "@lms/dtos";
import { Request, Response } from "express";
import { AdminService } from "./admin.service";

import { UploadService } from "../upload/upload.service";

export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly uploadService: UploadService
  ) {}

  // Courses
  findManyCourses = async (_req: Request, res: Response) => {
    const result = await this.adminService.findManyCourses();
    res.status(200).json(result);
  };

  createCourse = async (req: Request, res: Response) => {
    const courseData = req.body as CreateCourseRequest;
    await this.adminService.createCourse(courseData);

    res.status(201).json({
      message: "Curso criado com sucesso!",
    });
  };

  updateCourse = async (req: Request, res: Response) => {
    const { courseSlug } = req.params;
    const courseData = req.body as UpdateCourseRequest;
    await this.adminService.updateCourse(courseSlug, courseData);

    res.status(200).json({
      message: "Curso atualizado com sucesso!",
    });
  };

  deleteCourse = async (req: Request, res: Response) => {
    const { courseSlug } = req.params;
    await this.adminService.deleteCourse(courseSlug);

    res.status(204).json();
  };

  // Lessons
  findManyLessons = async (req: Request, res: Response) => {
    const { courseSlug } = req.params;
    const result = await this.adminService.findManyLessons(courseSlug);
    res.status(200).json(result);
  };

  createLesson = async (req: Request, res: Response) => {
    const lessonData = req.body as CreateLessonRequest;
    const { courseSlug } = req.params;
    const { title } = await this.adminService.createLesson(courseSlug, lessonData);

    res.status(201).json({
      message: `Aula ${title} criada com sucesso!`,
    });
  };

  uploadVideo = async (req: Request, res: Response) => {
    const fileName = req.headers["x-filename"] as string;
    const path = await this.uploadService.save(req, fileName);
    res.status(200).json(path);
  };

  updateLesson = async (req: Request, res: Response) => {
    const lessonData = req.body as UpdateLessonRequest;
    const { courseSlug, lessonSlug } = req.params;
    const { title } = await this.adminService.updateLesson(courseSlug, lessonSlug, lessonData);

    res.status(201).json({
      message: `Aula ${title} atualizada com sucesso!`,
    });
  };

  deleteLesson = async (req: Request, res: Response) => {
    const { courseSlug, lessonSlug } = req.params;
    await this.adminService.deleteLesson(courseSlug, lessonSlug);

    res.status(204).json();
  };

  // Users
  findManyUsers = async (req: Request, res: Response) => {
    const { search, limit, page } = req.query as UserQueryRequest;
    const result = await this.adminService.findManyUsers({ search, limit, page });
    res.status(200).json(result);
  };

  updateUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const adminId = req.session!.userId;
    const userData = req.body as UpdateUserRequest;
    await this.adminService.updateUser(adminId, userId, userData);

    res.status(200).json({
      message: "Usuário atualizado com sucesso!",
    });
  };

  createUser = async (req: Request, res: Response) => {
    const userData = req.body as AdminCreateUserDTO;
    await this.adminService.createUser(userData);

    res.status(201).json({
      message: "Usuário criado com sucesso!",
    });
  };

  toggleUserStatus = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const adminId = req.session!.userId;

    const result = await this.adminService.toggleUserStatus(adminId, userId);

    res.status(200).json({
      message: result.isActive
        ? `Usuário ${result.name} ativado com sucesso!`
        : `Usuário ${result.name} desativado com sucesso!`,
    });
  };

  deleteUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const adminId = req.session!.userId;
    await this.adminService.deleteUser(adminId, userId);

    res.status(204).json();
  };
}
