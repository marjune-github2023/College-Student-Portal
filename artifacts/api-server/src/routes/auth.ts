import { Router, type IRouter, type Request } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { hashPassword, verifyPassword } from "@workspace/db/password";
import { createSession, destroySession, purgeExpiredSessions, SESSION_COOKIE, SESSION_TTL_MS } from "../lib/auth";
import { requireAuth } from "../middlewares/auth";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const MAX_ATTEMPTS = 10;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const attempts = new Map<string, { count: number; resetAt: number }>();

function attemptKey(req: Request, email: string) {
  return `${req.ip ?? "unknown"}:${email}`;
}

function isRateLimited(key: string) {
  const entry = attempts.get(key);
  if (!entry) return false;
  if (entry.resetAt < Date.now()) {
    attempts.delete(key);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

function recordFailure(key: string) {
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < Date.now()) {
    attempts.set(key, { count: 1, resetAt: Date.now() + ATTEMPT_WINDOW_MS });
    return;
  }
  entry.count += 1;
}

function cookieOptions(req: Request) {
  const forwardedProto = req.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const secure = req.secure || forwardedProto === "https" || process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
    path: "/",
    maxAge: SESSION_TTL_MS,
  };
}

let dummyHashPromise: Promise<string> | null = null;
function dummyHash() {
  dummyHashPromise ??= hashPassword("not-a-real-user-timing-placeholder");
  return dummyHashPromise;
}

router.post("/auth/login", async (req, res) => {
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const password = String(req.body?.password ?? "");

  if (!email || !password) {
    res.status(400).json({ error: "invalid_request", message: "Email and password are required." });
    return;
  }

  const key = attemptKey(req, email);
  if (isRateLimited(key)) {
    res.status(429).json({ error: "rate_limited", message: "Too many attempts. Try again in 15 minutes." });
    return;
  }

  const rows = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  const account = rows[0];

  if (!account) {
    // Spend comparable time on unknown emails so the response does not reveal them.
    await verifyPassword(password, await dummyHash());
    recordFailure(key);
    res.status(401).json({ error: "invalid_credentials", message: "Email or password is incorrect." });
    return;
  }

  const valid = await verifyPassword(password, account.passwordHash);
  if (!valid) {
    recordFailure(key);
    res.status(401).json({ error: "invalid_credentials", message: "Email or password is incorrect." });
    return;
  }

  if (!account.isActive) {
    recordFailure(key);
    res.status(403).json({ error: "account_disabled", message: "This account is disabled. Contact an administrator." });
    return;
  }

  attempts.delete(key);
  const { token } = await createSession(account.id);
  res.cookie(SESSION_COOKIE, token, cookieOptions(req));
  await purgeExpiredSessions().catch((error: unknown) => logger.warn({ err: error }, "Failed to purge expired sessions"));

  logger.info({ userId: account.id, role: account.role }, "User signed in");
  res.json({ user: { id: account.id, email: account.email, name: account.name, role: account.role } });
});

router.post("/auth/logout", async (req, res) => {
  const token = typeof req.cookies?.[SESSION_COOKIE] === "string" ? req.cookies[SESSION_COOKIE] : undefined;
  await destroySession(token);
  res.clearCookie(SESSION_COOKIE, { path: "/", httpOnly: true, sameSite: "lax" });
  res.json({ ok: true });
});

router.get("/auth/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
