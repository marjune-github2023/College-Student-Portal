import type { RequestHandler } from "express";
import { getUserForSession, SESSION_COOKIE, type SessionUser } from "../lib/auth";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: SessionUser;
    }
  }
}

/** Attaches the signed-in user (if any) to the request. Never blocks. */
export const loadUser: RequestHandler = async (req, _res, next) => {
  try {
    const token = typeof req.cookies?.[SESSION_COOKIE] === "string" ? req.cookies[SESSION_COOKIE] : undefined;
    req.user = (await getUserForSession(token)) ?? undefined;
    next();
  } catch (error) {
    next(error);
  }
};

export const requireAuth: RequestHandler = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ error: "unauthenticated", message: "Sign in to continue." });
    return;
  }
  next();
};

/** Server-side role gate. The browser's opinion about roles is never trusted. */
export function requireRole(...roles: string[]): RequestHandler {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ error: "unauthenticated", message: "Sign in to continue." });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: "forbidden", message: "Your role cannot access this resource." });
      return;
    }
    next();
  };
}
