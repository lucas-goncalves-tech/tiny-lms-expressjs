import { UpdatePasswordRequest, UpdateEmailRequest } from "@lms/dtos";
import { Request, Response } from "express";

import { UserService } from "./user.service";
import { SessionsService } from "../sessions/sessions.service";

export class UserController {
  private readonly ttl: number;
  constructor(
    private readonly userService: UserService,
    private readonly sessionsService: SessionsService
  ) {
    this.ttl = 60 * 60 * 24 * 15 * 1000;
  }

  updatePassword = async (req: Request, res: Response) => {
    const updatePasswordData = req.body as UpdatePasswordRequest;
    const { userId } = req.session!;
    await this.userService.updatePassword(userId, updatePasswordData);
    await this.sessionsService.revokeAllUserSessions(userId);
    const sid = await this.sessionsService.createSession({
      userId,
      userAgent: req.headers["user-agent"] || "",
      ip: req.ip || "127.0.0.1",
    });

    res.status(200).json({ token: sid });
  };

  updateEmail = async (req: Request, res: Response) => {
    const { email } = req.body as UpdateEmailRequest;
    const { userId } = req.session!;
    await this.userService.updateEmail(userId, email);
    res.status(204).end();
  };
}
