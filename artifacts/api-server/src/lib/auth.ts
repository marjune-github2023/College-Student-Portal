import { and, eq, gt, lt } from "drizzle-orm";
import { db, sessionsTable, usersTable } from "@workspace/db";
import { createSessionToken, hashSessionToken } from "@workspace/db/password";

export const SESSION_COOKIE = "campus_session";

const ttlHours = Number(process.env.SESSION_TTL_HOURS ?? 8);
export const SESSION_TTL_MS = (Number.isFinite(ttlHours) && ttlHours > 0 ? ttlHours : 8) * 60 * 60 * 1000;

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export async function createSession(userId: string) {
  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db.insert(sessionsTable).values({ id: hashSessionToken(token), userId, expiresAt });
  return { token, expiresAt };
}

/** Resolve a cookie token to its active user, or null. Expired sessions never resolve. */
export async function getUserForSession(token: string | undefined): Promise<SessionUser | null> {
  if (!token) return null;
  const rows = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      name: usersTable.name,
      role: usersTable.role,
      isActive: usersTable.isActive,
    })
    .from(sessionsTable)
    .innerJoin(usersTable, eq(sessionsTable.userId, usersTable.id))
    .where(and(eq(sessionsTable.id, hashSessionToken(token)), gt(sessionsTable.expiresAt, new Date())))
    .limit(1);

  const row = rows[0];
  if (!row || !row.isActive) return null;
  return { id: row.id, email: row.email, name: row.name, role: row.role };
}

export async function destroySession(token: string | undefined) {
  if (!token) return;
  await db.delete(sessionsTable).where(eq(sessionsTable.id, hashSessionToken(token)));
}

export async function destroyAllSessionsForUser(userId: string) {
  await db.delete(sessionsTable).where(eq(sessionsTable.userId, userId));
}

export async function purgeExpiredSessions() {
  await db.delete(sessionsTable).where(lt(sessionsTable.expiresAt, new Date()));
}
