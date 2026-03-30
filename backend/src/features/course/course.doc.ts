import { findCourseResponse, findManyWithProgressResponse } from "@lms/dtos";
import { notFoundResponse, unauthorizedResponse } from "../../doc/errors/errors";
import { registry } from "../../doc/openapi.registry";

registry.registerPath({
  path: "/courses",
  security: [{ cookieAuth: [] }],
  method: "get",
  summary: "Lista de cursos com progresso",
  tags: ["Courses"],
  responses: {
    200: {
      description: "Lista de cursos",
      content: {
        "application/json": {
          schema: findManyWithProgressResponse,
        },
      },
    },
    ...unauthorizedResponse,
  },
});

registry.registerPath({
  path: "/courses/{courseSlug}",
  security: [{ cookieAuth: [] }],
  method: "get",
  summary: "Detalhes de um curso pelo slug",
  tags: ["Courses"],
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
      description: "Lista de cursos",
      content: {
        "application/json": {
          schema: findCourseResponse,
        },
      },
    },
    ...unauthorizedResponse,
    ...notFoundResponse,
  },
});
