import { Request, Response } from "express";
import { CourseService } from "./course.service";

export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  findManyWithProgress = async (_req: Request, res: Response) => {
    const userId = _req.session!.userId;
    const result = await this.courseService.findManyWithProgress(userId);
    res.json(result);
  };

  findOneBySlug = async (req: Request, res: Response) => {
    const { courseSlug } = req.params;
    const result = await this.courseService.findOneBySlug(courseSlug);
    res.json(result);
  };
}
