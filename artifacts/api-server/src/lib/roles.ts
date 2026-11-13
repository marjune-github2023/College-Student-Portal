/** Every role the portal supports. Kept in sync with the frontend role map. */
export const PORTAL_ROLES = [
  "applicant",
  "student",
  "instructor",
  "academic-adviser",
  "program-head",
  "academic-administrator",
  "admissions-officer",
  "registrar",
  "records-officer",
  "finance-officer",
  "scholarship-officer",
  "ojt-coordinator",
  "research-coordinator",
  "system-administrator",
  "auditor-compliance",
  "super-administrator",
] as const;

export type PortalRole = (typeof PORTAL_ROLES)[number];

/** Roles allowed to provision and manage portal accounts. */
export const ADMIN_ROLES: PortalRole[] = ["system-administrator", "super-administrator"];

export function isPortalRole(value: unknown): value is PortalRole {
  return typeof value === "string" && (PORTAL_ROLES as readonly string[]).includes(value);
}

export function isAdminRole(role: string): boolean {
  return (ADMIN_ROLES as string[]).includes(role);
}
