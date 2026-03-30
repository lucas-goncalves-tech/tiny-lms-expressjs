import { sessions } from "../../../db/schema";

export type ISession = typeof sessions.$inferSelect;
export type ISessionInput = Omit<ISession, "created" | "expires" | "revoked"> & {
  expires_ms: number;
};
export type ISessionData = Pick<ISession, "userId" | "userAgent" | "ip">;
