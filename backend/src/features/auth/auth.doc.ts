import { createUserResponse, createUserRequest, loginRequest } from "@lms/dtos";
import {
  badRequestResponse,
  conflictResponse,
  forbiddenResponse,
  unauthorizedResponse,
} from "../../doc/errors/errors";
import { registry } from "../../doc/openapi.registry";

registry.registerPath({
  path: "/auth/register",
  method: "post",
  tags: ["Auth"],
  summary: "Cria um novo usuário",
  request: {
    body: {
      content: {
        "application/json": {
          schema: createUserRequest,
          example: {
            name: "John Doe",
            email: "john.doe@example.com",
            password: "password123",
            confirmPassword: "password123",
          },
        },
      },
    },
  },
  responses: {
    201: {
      description: "Usuário criado com sucesso!",
      content: {
        "application/json": {
          schema: createUserResponse,
        },
      },
    },
    ...badRequestResponse,
    ...forbiddenResponse,
    ...conflictResponse,
  },
});

registry.registerPath({
  path: "/auth/login",
  method: "post",
  tags: ["Auth"],
  summary: "Realiza login de um usuário",
  request: {
    body: {
      content: {
        "application/json": {
          schema: loginRequest,
          example: {
            email: "john.doe@example.com",
            password: "password123",
          },
        },
      },
    },
  },
  responses: {
    204: {
      description: "Login realizado com sucesso!",
    },
    ...badRequestResponse,
    ...unauthorizedResponse,
  },
});

registry.registerPath({
  path: "/auth/me",
  security: [{ cookieAuth: [] }],
  method: "get",
  tags: ["Auth"],
  summary: "Retorna as informações do usuário autenticado",
  responses: {
    200: {
      description: "Usuário autenticado!",
      content: {
        "application/json": {
          schema: createUserResponse,
        },
      },
    },
    ...unauthorizedResponse,
  },
});

registry.registerPath({
  path: "/auth/logout",
  security: [{ cookieAuth: [] }],
  method: "delete",
  tags: ["Auth"],
  summary: "Realiza logout de um usuário",
  responses: {
    204: {
      description: "Logout realizado com sucesso!",
    },
    ...unauthorizedResponse,
  },
});
