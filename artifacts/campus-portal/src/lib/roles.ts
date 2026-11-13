/** Portal roles, their display names, and the dashboard each one owns. */

export const ROLE_LABELS: Record<string, string> = {
  applicant: "Applicant",
  student: "Student",
  instructor: "Instructor",
  "academic-adviser": "Academic Adviser",
  "program-head": "Program Head / Department",
  "academic-administrator": "Academic Administrator",
  "admissions-officer": "Admissions Officer",
  registrar: "Registrar",
  "records-officer": "Records Officer",
  "finance-officer": "Finance Officer",
  "scholarship-officer": "Scholarship Officer",
  "ojt-coordinator": "OJT Coordinator",
  "research-coordinator": "Research Coordinator",
  "system-administrator": "System Administrator",
  "auditor-compliance": "Auditor / Compliance",
  "super-administrator": "Super Administrator",
};

export const ROLE_HOME: Record<string, string> = {
  applicant: "/workspace/applicant",
  student: "/student/dashboard",
  instructor: "/workspace/instructor",
  "academic-adviser": "/workspace/academic-adviser",
  "program-head": "/workspace/program-head",
  "academic-administrator": "/workspace/academic-administrator",
  "admissions-officer": "/workspace/admissions-officer",
  registrar: "/registrar/dashboard",
  "records-officer": "/workspace/records-officer",
  "finance-officer": "/workspace/finance-officer",
  "scholarship-officer": "/workspace/scholarship-officer",
  "ojt-coordinator": "/workspace/ojt-coordinator",
  "research-coordinator": "/workspace/research-coordinator",
  "system-administrator": "/workspace/system-administrator",
  "auditor-compliance": "/workspace/auditor-compliance",
  "super-administrator": "/workspace/super-administrator",
};

export const PORTAL_ROLES = Object.keys(ROLE_LABELS);

/** Roles allowed to provision and manage accounts. */
export const ADMIN_ROLES = ["system-administrator", "super-administrator"];

export function roleLabel(role: string): string {
  return ROLE_LABELS[role] ?? role;
}

export function homeForRole(role: string): string {
  return ROLE_HOME[role] ?? "/login";
}
