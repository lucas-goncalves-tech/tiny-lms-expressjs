import { Request, Response } from "express";
import { LessonService } from "./lesson.service";
import { UploadService } from "../upload/upload.service";
import { FindLessonParamsRequest } from "./dtos/lesson-params.dto";

export class LessonController {
  constructor(
    private readonly lessonService: LessonService,
    private readonly uploadService: UploadService
  ) {}

  findManyByCourseSlug = async (req: Request, res: Response) => {
    const userId = req.session!.userId;
    const { courseSlug } = req.params as FindLessonParamsRequest;
    const result = await this.lessonService.findManyByCourseSlug(userId, courseSlug);

    res.json(result);
  };

  findBySlug = async (req: Request, res: Response) => {
    const userId = req.session!.userId;
    const { courseSlug, lessonSlug } = req.params as FindLessonParamsRequest;
    const result = await this.lessonService.findBySlug(userId, courseSlug, lessonSlug);

    res.json(result);
  };

  completeLesson = async (req: Request, res: Response) => {
    const userId = req.session!.userId;
    const { courseSlug, lessonSlug } = req.params as FindLessonParamsRequest;
    const result = await this.lessonService.completeLesson(userId, courseSlug, lessonSlug);

    res.json(result);
  };

  resetCourseCompleted = async (req: Request, res: Response) => {
    const userId = req.session!.userId;
    const { courseSlug } = req.params as FindLessonParamsRequest;
    await this.lessonService.resetCourseCompleted(userId, courseSlug);

    res.status(204).end();
  };

  videoStreaming = async (req: Request, res: Response) => {
    const { courseSlug, lessonSlug } = req.params as FindLessonParamsRequest;
    const videoPath = await this.lessonService.findVideoPath(courseSlug, lessonSlug);
    await this.uploadService.streamingVideo(videoPath, req, res);
  };
}
