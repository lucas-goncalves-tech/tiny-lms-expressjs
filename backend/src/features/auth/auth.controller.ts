import { CreateUserRequest, LoginRequest } from "@lms/dtos";
import { AuthService } from "./auth.service";
import { Request, Response } from "express";

import { SessionsService } from "../sessions/sessions.service";

export class AuthController {
  private readonly ttl: number;
  constructor(
    private readonly authService: AuthService,
    private readonly sessionsService: SessionsService
  ) {
    this.ttl = 60 * 60 * 24 * 15 * 1000;
  }

  createUser = async (req: Request, res: Response) => {
    const userData = req.body as CreateUserRequest;
    await this.authService.createUser(userData);
    res.status(201).json({
      message: "usuário criado com sucesso!",
    });
  };

  loginUser = async (req: Request, res: Response) => {
    const userData = req.body as LoginRequest;
    const userId = await this.authService.loginUser(userData);
    const sid = await this.sessionsService.createSession({
      userId,
      userAgent: req.headers["user-agent"] || "",
      ip: req.ip || "127.0.0.1",
    });

    res.status(200).json({ token: sid });
  };

  logoutUser = async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    const sid = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (sid) {
      await this.sessionsService.revokeSession(sid);
    }

    res.status(204).end();
  };

  me = async (req: Request, res: Response) => {
    const { name, email, role } = req.session!;
    res.status(200).json({ name, email, role });
  };
}
