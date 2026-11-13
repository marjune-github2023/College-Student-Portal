import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { hashPassword, MIN_PASSWORD_LENGTH } from "@workspace/db/password";
import { ADMIN_ROLES, isPortalRole, type PortalRole } from "../lib/roles";
import { destroyAllSessionsForUser } from "../lib/auth";
import { requireRole } from "../middlewares/auth";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const publicColumns = {
  id: usersTable.id,
  email: usersTable.email,
  name: usersTable.name,
  role: usersTable.role,
  isActive: usersTable.isActive,
  createdAt: usersTable.createdAt,
};

router.use("/admin", requireRole(...ADMIN_ROLES));

router.get("/admin/users", async (_req, res) => {
  const users = await db.select(publicColumns).from(usersTable).orderBy(desc(usersTable.createdAt));
  res.json({ users });
});

router.post("/admin/users", async (req, res) => {
  const actor = req.user!;
  const name = String(req.body?.name ?? "").trim();
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const role = String(req.body?.role ?? "");
  const password = String(req.body?.password ?? "");

  if (name.length < 2 || name.length > 120) {
    res.status(400).json({ error: "invalid_request", message: "Enter the account holder's full name." });
    return;
  }
  if (!EMAIL_PATTERN.test(email)) {
    res.status(400).json({ error: "invalid_request", message: "Enter a valid email address." });
    return;
  }
  if (!isPortalRole(role)) {
    res.status(400).json({ error: "invalid_request", message: "Choose a supported portal role." });
    return;
  }
  if (role === "super-administrator" && actor.role !== "super-administrator") {
    res.status(403).json({ error: "forbidden", message: "Only a super administrator can create super administrator accounts." });
    return;
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    res.status(400).json({ error: "invalid_request", message: `Temporary password must be at least ${MIN_PASSWORD_LENGTH} characters.` });
    return;
  }

  try {
    const passwordHash = await hashPassword(password);
    const created = await db
      .insert(usersTable)
      .values({ name, email, role, passwordHash })
      .returning(publicColumns);
    logger.info({ actorId: actor.id, role }, "Account provisioned");
    res.status(201).json({ user: created[0] });
  } catch (error) {
    if (isUniqueViolation(error)) {
      res.status(409).json({ error: "email_taken", message: "An account with that email already exists." });
      return;
    }
    throw error;
  }
});

router.patch("/admin/users/:id", async (req, res) => {
  const actor = req.user!;
  const id = String(req.params.id ?? "");

  const rows = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);
  const target = rows[0];
  if (!target) {
    res.status(404).json({ error: "not_found", message: "Account not found." });
    return;
  }

  if (target.id === actor.id) {
    res.status(400).json({ error: "invalid_request", message: "You cannot change your own role or status." });
    return;
  }
  if (target.role === "super-administrator" && actor.role !== "super-administrator") {
    res.status(403).json({ error: "forbidden", message: "Only a super administrator can manage that account." });
    return;
  }

  const updates: Partial<{ role: PortalRole; isActive: boolean; passwordHash: string; updatedAt: Date }> = { updatedAt: new Date() };

  if (req.body?.role !== undefined) {
    const role = String(req.body.role);
    if (!isPortalRole(role)) {
      res.status(400).json({ error: "invalid_request", message: "Choose a supported portal role." });
      return;
    }
    if (role === "super-administrator" && actor.role !== "super-administrator") {
      res.status(403).json({ error: "forbidden", message: "Only a super administrator can grant that role." });
      return;
    }
    updates.role = role;
  }

  if (req.body?.isActive !== undefined) {
    if (typeof req.body.isActive !== "boolean") {
      res.status(400).json({ error: "invalid_request", message: "isActive must be true or false." });
      return;
    }
    updates.isActive = req.body.isActive;
  }

  if (req.body?.password !== undefined) {
    const password = String(req.body.password);
    if (password.length < MIN_PASSWORD_LENGTH) {
      res.status(400).json({ error: "invalid_request", message: `Temporary password must be at least ${MIN_PASSWORD_LENGTH} characters.` });
      return;
    }
    updates.passwordHash = await hashPassword(password);
  }

  const updated = await db.update(usersTable).set(updates).where(eq(usersTable.id, id)).returning(publicColumns);

  // A password reset or a disabled account must not keep its existing sessions.
  if (updates.passwordHash || updates.isActive === false) {
    await destroyAllSessionsForUser(id);
  }

  logger.info({ actorId: actor.id, targetId: id }, "Account updated");
  res.json({ user: updated[0] });
});

function isUniqueViolation(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && (error as { code?: string }).code === "23505";
}

export default router;
