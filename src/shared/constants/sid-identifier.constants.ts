import { CookieOptions } from "express";
import { envCheck } from "../helper/env-check.helper";

export const SID_IDENTIFIER = envCheck().NODE_ENV === "production" ? "__Secure-sid" : "sid";

export function sidCookieOptions(maxAge = 0): CookieOptions {
  return {
    httpOnly: true,
    secure: envCheck().NODE_ENV === "production",
    sameSite: envCheck().NODE_ENV === "production" ? "none" : "lax",
    maxAge: maxAge,
  };
}
