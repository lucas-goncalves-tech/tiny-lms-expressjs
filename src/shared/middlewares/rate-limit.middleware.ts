import { NextFunction, Request, Response } from "express";
import { TooManyRequestsError } from "../errors/too-many-requests.error";

type Requests = {
  hits: number;
  reset: number;
};

export function rateLimitMiddleware(expires: number, max: number, perEndpoint = true) {
  const requests = new Map<string, Requests>();
  setInterval(
    () => {
      const now = Date.now();
      for (const [key, item] of requests) {
        if (now >= item.reset) {
          requests.delete(key);
        }
      }
    },
    30 * 60 * 1000
  ).unref();
  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const ip = req.ip || req.socket.remoteAddress || "";
    let key = ip;
    if (perEndpoint) {
      const url = req.url;
      key = `${ip}-${url}`;
    }
    let request = requests.get(key);

    if (request === undefined || now >= request.reset) {
      request = { hits: 1, reset: now + expires };
      requests.set(key, request);
      return next();
    }

    request.hits++;
    const rLeft = Math.ceil((request.reset - now) / 1000);
    const sLeft = Math.max(0, max - request.hits);
    const sTime = Math.ceil(expires / 1000);
    res.setHeader("RateLimit", `"default";r=${rLeft};t=${sLeft}`);
    res.setHeader("RateLimit-Policy", `"default";q=${max};w=${sTime}`);

    if (request.hits > max) {
      res.setHeader("Retry-After", `${sLeft}`);
      throw new TooManyRequestsError();
    }

    next();
  };
}
