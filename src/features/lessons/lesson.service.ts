import { BadRequestError } from "../../shared/errors/bad-request.error";
import { NotfoundError } from "../../shared/errors/not-found.error";
import { CourseRepository } from "../course/course.repository";
import { CertificateRepository } from "../certificates/certificate.repository";
import { LessonRepository } from "./lesson.repository";

export class LessonService {
  constructor(
    private readonly lessonRepository: LessonRepository,
    private readonly courseRepository: CourseRepository,
    private readonly certificateRepository: CertificateRepository
  ) {}

  async findManyByCourseSlug(userId: string, courseSlug: string) {
    const course = await this.courseRepository.findBySlug(courseSlug);
    if (!course) {
      throw new NotfoundError("Curso não encontrado");
    }
    const lessons = await this.lessonRepository.findManyByCourseSlugWithProgress(
      userId,
      courseSlug
    );
    //eslint-disable-next-line
    return lessons.map(({ userId, video, ...lesson }) => lesson);
  }

  async findBySlug(userId: string, courseSlug: string, lessonSlug: string) {
    const lesson = await this.lessonRepository.findBySlug(courseSlug, lessonSlug);
    if (!lesson) {
      throw new NotfoundError("Aula não encontrada");
    }
    const lessonNav = await this.lessonRepository.lessonNav(courseSlug, lessonSlug);
    const i = lessonNav.findIndex((l) => l.slug === lesson.slug);
    const prevLesson = lessonNav[i - 1]?.slug ?? null;
    const nextLesson = lessonNav[i + 1]?.slug ?? null;

    let completed = null;
    const whenComplete = await this.lessonRepository.findWhenLessonCompleted(
      userId,
      lesson.courseId,
      lesson.id
    );
    if (whenComplete) {
      completed = whenComplete;
    }

    //eslint-disable-next-line
    const { video: _, ...lessoData } = lesson;

    return {
      ...lessoData,
      videoUrl: `/lessons/${courseSlug}/${lessonSlug}/video`,
      prevLesson,
      nextLesson,
      completed,
    };
  }

  async completeLesson(userId: string, courseSlug: string, lessonSlug: string) {
    const lesson = await this.lessonRepository.findBySlug(courseSlug, lessonSlug);
    if (!lesson) {
      throw new NotfoundError("Curso ou aula não encontrada");
    }
    const result = await this.lessonRepository.completeLesson(userId, lesson.courseId, lesson.id);
    if (!result) {
      throw new BadRequestError("Aula já foi completada");
    }
    const progress = await this.lessonRepository.lessonsProgress(userId, lesson.courseId);
    const incompleteLessons = progress.filter((l) => !l.completed);
    let hasCertificate = "";
    if (progress.length > 0 && incompleteLessons.length === 0) {
      const certificate = await this.certificateRepository.create(userId, lesson.courseId);
      if (!certificate) {
        throw new BadRequestError("Não foi possível emitir o certificado");
      }
      hasCertificate = certificate.id;
    }
    return {
      completed: result.completed,
      hasCertificate,
    };
  }

  async resetCourseCompleted(userId: string, courseSlug: string) {
    const course = await this.courseRepository.findBySlug(courseSlug);
    if (!course) {
      throw new NotfoundError("Curso não encontrado");
    }
    const resetLessonResult = await this.lessonRepository.resetCourseCompleted(userId, course.id);
    if (!resetLessonResult) {
      throw new BadRequestError("Aulas do curso já foram resetadas");
    }

    const deleteCertificateResult = await this.certificateRepository.deleteByUserIdAndCourseId(
      userId,
      course.id
    );
    if (!deleteCertificateResult) {
      throw new NotfoundError("Certificado do curso não encontrado");
    }
  }

  async findVideoPath(courseSlug: string, lessonSlug: string) {
    const lesson = await this.lessonRepository.findBySlug(courseSlug, lessonSlug);

    if (!lesson) {
      throw new NotfoundError("Aula não encontrada");
    }
    return lesson.video;
  }
}
