import { notFoundResponse, unauthorizedResponse } from "../../doc/errors/errors";
import { registry } from "../../doc/openapi.registry";
import { findManyCertificatesResponse } from "./dtos/certificate.response";

registry.registerPath({
  path: "/certificates",
  security: [{ cookieAuth: [] }],
  tags: ["Certificates"],
  method: "get",
  summary: "Pega todos os certificados do usuario",
  responses: {
    200: {
      description: "Certificados encontrados",
      content: {
        "application/json": {
          schema: findManyCertificatesResponse,
        },
      },
    },
    ...unauthorizedResponse,
  },
});

registry.registerPath({
  path: "/certificates/{certificateId}",
  security: [{ cookieAuth: [] }],
  tags: ["Certificates"],
  method: "get",
  summary: "Pega um certificado pelo id",
  parameters: [
    {
      name: "certificateId",
      in: "path",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  responses: {
    200: {
      description: "Certificado encontrado",
      content: {
        "application/pdf": {
          schema: {
            type: "string",
            format: "binary",
          },
        },
      },
    },
    ...notFoundResponse,
    ...unauthorizedResponse,
  },
});
