import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

const registry = new OpenAPIRegistry();

registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
  description: "JWT access token enviado via header Authorization",
});

export { registry };
