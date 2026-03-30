import { NotfoundError } from "../../shared/errors/not-found.error";
import { CourseRepository } from "./course.repository";

export class CourseService {
  constructor(private readonly courseRepository: CourseRepository) {}

  async findManyWithProgress(userId: string) {
    const courses = await this.courseRepository.findManyWithProgress(userId);
    //eslint-disable-next-line
    return courses.map(({ userId, ...course }) => course);
  }

  async findOneBySlug(courseSlug: string) {
    const course = await this.courseRepository.findOneBySlug(courseSlug);
    if (!course) {
      throw new NotfoundError("Curso não encontrado");
    }
    return course;
  }
}
