import { NextFunction, Request, Response } from "express";
import { ForbiddenError } from "../errors/forbidden.error";

export function adminGuardMiddleware(req: Request, res: Response, next: NextFunction) {
  const userRole = req.session?.role;
  if (!userRole || userRole !== "ADMIN") {
    throw new ForbiddenError();
  }
  next();
}
