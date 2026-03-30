import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./openapi.registry";
import { envCheck } from "../shared/helper/env-check.helper";

export function generateOpenAPISpec() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "LMS API",
      description: "API LMS documentada com Zod e Scalar",
    },
    servers: [
      {
        url: envCheck().OPENAPI_URL || "http://api:3333/api/v1",
        description: "Hospedagem",
      },
      {
        url: "http://localhost:3333/api/v1",
        description: "Desenvolvimento Local",
      },
    ],
  });
}
