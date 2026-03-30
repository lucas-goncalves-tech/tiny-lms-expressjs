import {
  badRequestResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "../../doc/errors/errors";
import { registry } from "../../doc/openapi.registry";
import { completeLessonResponse } from "./dtos/complete-lesson.response";
import { findLessonBySlugResponse } from "./dtos/find-lesson-by-slug.response";
import { findManyByCourseSlugResponse } from "./dtos/find-many-by-course-slug.response";

registry.registerPath({
  path: "/lessons/{courseSlug}",
  method: "get",
  security: [{ cookieAuth: [] }],
  tags: ["Lessons"],
  summary: "Buscar lições por slug de curso",
  parameters: [
    {
      name: "courseSlug",
      in: "path",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  responses: {
    200: {
      description: "Lições encontradas",
      content: {
        "application/json": {
          schema: findManyByCourseSlugResponse,
        },
      },
    },
    ...unauthorizedResponse,
    ...notFoundResponse,
  },
});

registry.registerPath({
  path: "/lessons/{courseSlug}/{lessonSlug}/complete",
  method: "get",
  security: [{ cookieAuth: [] }],
  tags: ["Lessons"],
  summary: "Marcar lição como concluída",
  parameters: [
    {
      name: "courseSlug",
      in: "path",
      required: true,
      schema: {
        type: "string",
      },
    },
    {
      name: "lessonSlug",
      in: "path",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  responses: {
    200: {
      description: "Lição concluída",
      content: {
        "application/json": {
          schema: completeLessonResponse,
        },
      },
    },
    ...unauthorizedResponse,
    ...notFoundResponse,
  },
});

registry.registerPath({
  path: "/lessons/{courseSlug}/{lessonSlug}",
  method: "get",
  security: [{ cookieAuth: [] }],
  tags: ["Lessons"],
  summary: "Buscar lição por slug",
  parameters: [
    {
      name: "courseSlug",
      in: "path",
      required: true,
      schema: {
        type: "string",
      },
    },
    {
      name: "lessonSlug",
      in: "path",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  responses: {
    200: {
      description: "lição encontrada",
      content: {
        "application/json": {
          schema: findLessonBySlugResponse,
        },
      },
    },
    ...unauthorizedResponse,
    ...notFoundResponse,
  },
});

registry.registerPath({
  path: "/lessons/{courseSlug}/{lessonSlug}/video",
  method: "get",
  security: [{ cookieAuth: [] }],
  tags: ["Lessons"],
  summary: "Streaming de vídeo da lição (suporta range requests)",
  parameters: [
    {
      name: "courseSlug",
      in: "path",
      required: true,
      schema: {
        type: "string",
      },
    },
    {
      name: "lessonSlug",
      in: "path",
      required: true,
      schema: {
        type: "string",
      },
    },
    {
      name: "Range",
      in: "header",
      required: false,
      description: "Header de range para streaming parcial (ex: bytes=0-1023)",
      schema: {
        type: "string",
      },
    },
  ],
  responses: {
    200: {
      description: "Vídeo completo (quando não há header Range)",
      content: {
        "video/mp4": {
          schema: {
            type: "string",
            format: "binary",
          },
        },
      },
    },
    206: {
      description: "Conteúdo parcial do vídeo (quando há header Range)",
      content: {
        "video/mp4": {
          schema: {
            type: "string",
            format: "binary",
          },
        },
      },
    },
    ...unauthorizedResponse,
    ...notFoundResponse,
  },
});

registry.registerPath({
  path: "/lessons/{courseSlug}/reset",
  method: "delete",
  security: [{ cookieAuth: [] }],
  tags: ["Lessons"],
  summary: "Resetar curso",
  parameters: [
    {
      name: "courseSlug",
      in: "path",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  responses: {
    204: {
      description: "Curso resetado",
    },
    ...unauthorizedResponse,
    ...badRequestResponse,
    ...notFoundResponse,
  },
});
