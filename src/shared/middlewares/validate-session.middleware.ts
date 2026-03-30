import { NextFunction, Request, Response } from "express";
import { SessionsService } from "../../features/sessions/sessions.service";
import { UnauthorizedError } from "../errors/unauthorized.error";

export class ValidateSessionMiddleware {
  constructor(private readonly sessionsService: SessionsService) {}

  validateSession = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const sid = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!sid) throw new UnauthorizedError("Sessão inválida");
    try {
      const session = await this.sessionsService.validateSession(sid);
      req.session = {
        userId: session.user.id,
        role: session.user.role,
        name: session.user.name,
        email: session.user.email,
      };

      if (session.renewed) {
        res.setHeader("Authorization", `Bearer ${sid}`);
        res.setHeader("Access-Control-Expose-Headers", "Authorization");
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}
