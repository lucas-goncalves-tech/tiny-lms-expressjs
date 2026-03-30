import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../errors/bad-request.error";
import { xFilenameSchema } from "../dto/x-filename.dto";

export function validateFileHeadersMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.headers["content-type"] !== "application/octet-stream") {
    throw new BadRequestError("Content-type deve ser application/octet-stream");
  }

  const fileName = xFilenameSchema.safeParse(req.headers["x-filename"]);

  if (!fileName.success) {
    throw new BadRequestError("headers x-filename inválido ou ausente");
  }

  next();
}
