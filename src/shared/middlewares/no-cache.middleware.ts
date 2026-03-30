import { NextFunction, Request, Response } from "express";

export function noCacheMiddleware(_req: Request, res: Response, next: NextFunction) {
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("Vary", "Cookie");
  next();
}
