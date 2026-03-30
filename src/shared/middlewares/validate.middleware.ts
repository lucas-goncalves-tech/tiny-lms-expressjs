import { NextFunction, Request, Response } from "express";
import z, { ZodError } from "zod";
import { BadRequestError } from "../errors/bad-request.error";

type SchemaObject = {
  body?: z.ZodObject;
  query?: z.ZodObject;
  params?: z.ZodObject;
};

export function validateMiddleware(schema: SchemaObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const errors: { [key: string]: string }[] = [];
    try {
      if (schema.body) req.body = await schema.body.parseAsync(req.body);
      if (schema.query) await schema.query.parseAsync(req.query);
      if (schema.params)
        req.params = (await schema.params.parseAsync(req.params)) as Request["params"];
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        err.issues.map((issue) => {
          errors.push({
            [issue.path.join(".")]: issue.message,
          });
        });
        throw new BadRequestError("Dados inválidos", errors);
      }
      next(err);
    }
  };
}
