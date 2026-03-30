import {
  badRequestResponse,
  conflictResponse,
  forbiddenResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "../../doc/errors/errors";
import { registry } from "../../doc/openapi.registry";
import { adminMessageResponse } from "./dtos/common/admin-message.response";
import { createCourseRequest } from "./dtos/courses/create-course.request";
import { findManyCoursesReponse } from "./dtos/courses/find-many.response";
import { updateCourseRequest } from "./dtos/courses/update-course.request";
import { createLessonRequest } from "./dtos/lessons/create-lesson.request";
import { findManylessonsResponse } from "./dtos/lessons/find-many.response";
import { updateLessonRequest } from "./dtos/lessons/update-lesson.request";
import { uploadVideoHeaders, uploadVideoResponse } from "./dtos/upload/upload-video.response";
import { adminCreateUserRequest } from "./dtos/users/create-user.request";
import { findManyUsersResponse } from "./dtos/users/find-many.response";
import { updateUserRequest } from "./dtos/users/update-user.request";

registry.registerPath({
  path: "/admin/courses",
  method: "get",
  security: [{ cookieAuth: [] }],
  tags: ["Admin - Courses"],
  summary: "Lista todos os cursos",
  responses: {
    200: {
      description: "Lista de cursos",
      content: {
        "application/json": {
          schema: findManyCoursesReponse,
        },
      },
    },
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

registry.registerPath({
  path: "/admin/courses/new",
  method: "post",
  security: [{ cookieAuth: [] }],
  tags: ["Admin - Courses"],
  summary: "Cria um novo curso",
  request: {
    body: {
      content: {
        "application/json": {
          schema: createCourseRequest,
          example: {
            slug: "curso-de-typescript",
            title: "Curso de TypeScript",
            description: "Curso de TypeScript",
          },
        },
      },
    },
  },
  responses: {
    201: {
      description: "Curso criado com sucesso",
      content: {
        "application/json": {
          schema: adminMessageResponse,
        },
      },
    },
    ...badRequestResponse,
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

registry.registerPath({
  path: "/admin/courses/{courseSlug}/update",
  method: "put",
  security: [{ cookieAuth: [] }],
  tags: ["Admin - Courses"],
  summary: "Atualiza um curso",
  request: {
    body: {
      content: {
        "application/json": {
          schema: updateCourseRequest,
          example: {
            title: "Curso de TS",
            description: "Curso de TS avançado",
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "Curso atualizado com sucesso",
      content: {
        "application/json": {
          schema: adminMessageResponse,
        },
      },
    },
    ...badRequestResponse,
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

registry.registerPath({
  path: "/admin/courses/{courseSlug}/delete",
  method: "delete",
  security: [{ cookieAuth: [] }],
  tags: ["Admin - Courses"],
  summary: "Deleta um curso",
  responses: {
    204: {
      description: "Curso deletado com sucesso",
    },
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

registry.registerPath({
  path: "/admin/lessons/{courseSlug}",
  method: "get",
  security: [{ cookieAuth: [] }],
  tags: ["Admin - Lessons"],
  summary: "Lista todas as aulas de um curso",
  responses: {
    200: {
      description: "Lista de aulas",
      content: {
        "application/json": {
          schema: findManylessonsResponse,
        },
      },
    },
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

registry.registerPath({
  path: "/admin/lessons/upload-video",
  method: "post",
  security: [{ cookieAuth: [] }],
  tags: ["Admin - Lessons"],
  summary: "Faz upload de um vídeo",
  description: "Devido a limitações de binary file no scalar, não é possivel fazer upload",
  request: {
    headers: uploadVideoHeaders,
    body: {
      content: {
        "application/octet-stream": {
          schema: {
            type: "string",
            format: "binary",
          },
        },
      },
    },
  },
  responses: {
    201: {
      description: "Vídeo enviado com sucesso",
      content: {
        "application/json": {
          schema: uploadVideoResponse,
        },
      },
    },
    ...badRequestResponse,
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

registry.registerPath({
  path: "/admin/lessons/{courseSlug}/new",
  method: "post",
  security: [{ cookieAuth: [] }],
  tags: ["Admin - Lessons"],
  summary: "Cria uma nova aula",
  description:
    "Devido a limitações de binary file no scalar, não é possivel criar a aula com path falso",
  request: {
    body: {
      content: {
        "application/json": {
          schema: createLessonRequest,
          example: {
            title: "Aula 1",
            slug: "aula-1",
            description: "Descrição da aula 1",
            video: "video.mp4",
            seconds: 100,
            order: 1,
          },
        },
      },
    },
  },
  responses: {
    201: {
      description: "Aula criada com sucesso",
      content: {
        "application/json": {
          schema: adminMessageResponse,
        },
      },
    },
    ...badRequestResponse,
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

registry.registerPath({
  path: "/admin/lessons/{courseSlug}/{lessonSlug}/update",
  method: "put",
  security: [{ cookieAuth: [] }],
  tags: ["Admin - Lessons"],
  summary: "Atualiza uma aula",
  request: {
    body: {
      content: {
        "application/json": {
          schema: updateLessonRequest,
          example: {
            title: "Aula 1",
            slug: "aula-1",
            description: "Descrição da aula 1",
            video: "video.mp4",
            seconds: 100,
            order: 1,
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "Aula atualizada com sucesso",
      content: {
        "application/json": {
          schema: adminMessageResponse,
        },
      },
    },
    ...badRequestResponse,
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

registry.registerPath({
  path: "/admin/lessons/{courseSlug}/{lessonSlug}/delete",
  method: "delete",
  security: [{ cookieAuth: [] }],
  tags: ["Admin - Lessons"],
  summary: "Deleta uma aula",
  responses: {
    200: {
      description: "Aula deletada com sucesso",
      content: {
        "application/json": {
          schema: adminMessageResponse,
        },
      },
    },
    ...badRequestResponse,
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

registry.registerPath({
  path: "/admin/users",
  method: "get",
  security: [{ cookieAuth: [] }],
  tags: ["Admin - Users"],
  summary: "Lista todos os usuários",
  responses: {
    200: {
      description: "Usuários listados com sucesso",
      content: {
        "application/json": {
          schema: findManyUsersResponse,
        },
      },
    },
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

registry.registerPath({
  path: "/admin/users/{userId}/update",
  method: "put",
  security: [{ cookieAuth: [] }],
  tags: ["Admin - Users"],
  summary: "Atualiza um usuário",
  request: {
    body: {
      content: {
        "application/json": {
          schema: updateUserRequest,
          example: {
            name: "Usuario 1",
            role: "USER",
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "Usuário atualizado com sucesso",
      content: {
        "application/json": {
          schema: adminMessageResponse,
        },
      },
    },
    ...badRequestResponse,
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

registry.registerPath({
  path: "/admin/users/new",
  method: "post",
  security: [{ cookieAuth: [] }],
  tags: ["Admin - Users"],
  summary: "Cria um novo usuário",
  request: {
    body: {
      content: {
        "application/json": {
          schema: adminCreateUserRequest,
          example: {
            name: "Usuario 10",
            email: "usuario10@gmail.com",
            password: "senha123456",
            confirmPassword: "senha123456",
            role: "USER",
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "Usuário criado com sucesso",
      content: {
        "application/json": {
          schema: adminMessageResponse,
        },
      },
    },
    ...badRequestResponse,
    ...unauthorizedResponse,
    ...forbiddenResponse,
    ...conflictResponse,
  },
});

registry.registerPath({
  path: "/admin/users/{userId}/toggle-active",
  method: "patch",
  security: [{ cookieAuth: [] }],
  tags: ["Admin - Users"],
  summary: "Ativa ou desativa um usuário",
  responses: {
    200: {
      description: "Usuário ativado/desativado com sucesso",
      content: {
        "application/json": {
          schema: adminMessageResponse,
        },
      },
    },
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

registry.registerPath({
  path: "/admin/users/{userId}/delete",
  method: "delete",
  security: [{ cookieAuth: [] }],
  tags: ["Admin - Users"],
  summary: "Deleta um usuário",
  responses: {
    200: {
      description: "Usuário deletado com sucesso",
      content: {
        "application/json": {
          schema: adminMessageResponse,
        },
      },
    },
    ...unauthorizedResponse,
    ...forbiddenResponse,
    ...notFoundResponse,
  },
});
