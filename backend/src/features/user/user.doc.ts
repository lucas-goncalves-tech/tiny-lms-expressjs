import { updateEmailRequest, updatePasswordRequest } from "@lms/dtos";
import {
  badRequestResponse,
  conflictResponse,
  unauthorizedResponse,
} from "../../doc/errors/errors";
import { registry } from "../../doc/openapi.registry";

registry.registerPath({
  path: "/user/password/update",
  method: "put",
  security: [{ cookieAuth: [] }],
  summary: "Atualiza a senha do usuário",
  tags: ["User"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: updatePasswordRequest,
          example: {
            currentPassword: "password123",
            newPassword: "newPassword123",
            confirmPassword: "newPassword123",
          },
        },
      },
    },
  },
  responses: {
    204: {
      description: "Senha atualizada com sucesso",
    },
    ...badRequestResponse,
    ...unauthorizedResponse,
    422: {
      description: "Senha atual inválida",
    },
  },
});

registry.registerPath({
  path: "/user/email/update",
  method: "put",
  security: [{ cookieAuth: [] }],
  summary: "Atualiza o email do usuário",
  tags: ["User"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: updateEmailRequest,
          example: {
            email: "john.doe2@example.com",
          },
        },
      },
    },
  },
  responses: {
    204: {
      description: "Email atualizado com sucesso",
    },
    ...badRequestResponse,
    ...unauthorizedResponse,
    ...conflictResponse,
  },
});
