declare global {
  namespace Express {
    interface Request {
      session?: {
        userId: string;
        role: "ADMIN" | "USER";
        name: string;
        email: string;
      };
    }
  }
}

export {};
