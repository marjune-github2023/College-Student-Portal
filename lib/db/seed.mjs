import pg from "pg";
import { hashPassword, MIN_PASSWORD_LENGTH } from "./password.mjs";

/**
 * Development-only account seed.
 *
 * Runs only when SEED_DEMO_USERS=1. Production deployments must leave that flag
 * unset: the accounts below are local fixtures with a shared development
 * password, never real institutional credentials.
 */
const DEMO_ACCOUNTS = [
  { name: "Avery Reyes", email: "applicant@northfield.edu", role: "applicant" },
  { name: "Mara Villanueva", email: "student@northfield.edu", role: "student" },
  { name: "Prof. Liza Sarmiento", email: "instructor@northfield.edu", role: "instructor" },
  { name: "Dr. Nena Castillo", email: "adviser@northfield.edu", role: "academic-adviser" },
  { name: "Dr. Paolo Manalo", email: "programhead@northfield.edu", role: "program-head" },
  { name: "Rina Delos Santos", email: "academicadmin@northfield.edu", role: "academic-administrator" },
  { name: "Joel Bautista", email: "admissions@northfield.edu", role: "admissions-officer" },
  { name: "Cora Domingo", email: "registrar@northfield.edu", role: "registrar" },
  { name: "Edwin Ramos", email: "records@northfield.edu", role: "records-officer" },
  { name: "Lorna Padilla", email: "finance@northfield.edu", role: "finance-officer" },
  { name: "Tess Aquino", email: "scholarship@northfield.edu", role: "scholarship-officer" },
  { name: "Rico Navarro", email: "ojt@northfield.edu", role: "ojt-coordinator" },
  { name: "Dr. Ines Mercado", email: "research@northfield.edu", role: "research-coordinator" },
  { name: "System Administrator", email: "sysadmin@northfield.edu", role: "system-administrator" },
  { name: "Audit Office", email: "auditor@northfield.edu", role: "auditor-compliance" },
  { name: "Super Administrator", email: "superadmin@northfield.edu", role: "super-administrator" },
];

async function main() {
  if (process.env.SEED_DEMO_USERS !== "1") {
    console.log("[seed] SEED_DEMO_USERS is not 1 - skipping demo accounts.");
    return;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("[seed] DATABASE_URL is required.");

  const password = process.env.DEMO_USER_PASSWORD;
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`[seed] DEMO_USER_PASSWORD must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }

  const client = new pg.Client({ connectionString });
  await client.connect();
  try {
    let created = 0;
    for (const account of DEMO_ACCOUNTS) {
      const passwordHash = await hashPassword(password);
      const result = await client.query(
        `INSERT INTO users (email, name, role, password_hash)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (email) DO NOTHING`,
        [account.email, account.name, account.role, passwordHash],
      );
      created += result.rowCount ?? 0;
    }
    console.log(`[seed] ${created} demo account(s) created, ${DEMO_ACCOUNTS.length - created} already present.`);
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error("[seed] failed:", error.message);
  process.exit(1);
});
