import fs from "node:fs";
import pg from "pg";

/**
 * Seeds the campus portal domain tables from `data/portal-seed.json`.
 *
 * These tables hold the demo institution's academic records and the per-role
 * workspace content, so every dashboard reads real rows instead of frontend
 * constants. Re-running replaces the seeded rows; user accounts are untouched.
 */
const seed = JSON.parse(
  fs.readFileSync(new URL("./data/portal-seed.json", import.meta.url), "utf8"),
);

function isoDate(value) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) throw new Error(`Unparseable date: ${value}`);
  return parsed.toISOString().slice(0, 10);
}

function splitCourse(label) {
  const [code, ...rest] = label.split(" · ");
  return { code, title: rest.join(" · ") || code };
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("[seed-portal] DATABASE_URL is required.");

  const client = new pg.Client({ connectionString });
  await client.connect();

  try {
    await client.query("BEGIN");

    // Content tables are rebuilt from the seed file on every run.
    await client.query(
      "TRUNCATE workspace_widget_rows, workspace_items, workspace_metrics, workspaces, student_requirements, student_documents, grades, enrollments, students, degree_requirements, courses, service_requests, terms, programs RESTART IDENTITY CASCADE",
    );

    // ── Academic structure ──────────────────────────────────────────────────
    const program = await client.query(
      `INSERT INTO programs (code, name, curriculum_version, total_units)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      ["BS-ENPL", seed.student.program, seed.student.curriculumVersion, 120],
    );
    const programId = program.rows[0].id;

    const [semester, academicYear] = seed.student.term.split(" · ");
    const term = await client.query(
      `INSERT INTO terms (code, label, academic_year, semester, current_week, total_weeks, is_current)
       VALUES ($1, $2, $3, $4, $5, $6, true) RETURNING id`,
      ["2025-2", seed.student.term, academicYear, semester, 8, 16],
    );
    const termId = term.rows[0].id;

    const courseIds = new Map();
    for (const [index, course] of seed.courseOptions.entries()) {
      const inserted = await client.query(
        `INSERT INTO courses (code, title, units, instructor, schedule, room, status, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        [
          course.code,
          course.title,
          course.units,
          course.instructor,
          course.schedule,
          course.room,
          course.status,
          index,
        ],
      );
      courseIds.set(course.code, inserted.rows[0].id);
    }

    // ── Portal account linked to the student record ────────────────────────
    const account = await client.query(
      `SELECT id FROM users WHERE email = 'student@northfield.edu' OR role = 'student'
       ORDER BY (email = 'student@northfield.edu') DESC, created_at LIMIT 1`,
    );
    if (!account.rows[0]) {
      throw new Error("[seed-portal] No student account found; run the demo user seed first.");
    }

    const student = await client.query(
      `INSERT INTO students (user_id, student_number, program_id, current_term_id, year_level, standing, completed_units)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [
        account.rows[0].id,
        seed.student.studentId,
        programId,
        termId,
        seed.student.yearLevel,
        seed.student.standing,
        82,
      ],
    );
    const studentId = student.rows[0].id;

    for (const course of seed.courses) {
      await client.query(
        `INSERT INTO enrollments (student_id, course_id, term_id, status)
         VALUES ($1, $2, $3, $4)`,
        [studentId, courseIds.get(course.code), termId, course.status],
      );
    }

    for (const [index, grade] of seed.grades.entries()) {
      const { code, title } = splitCourse(grade.courseCode);
      await client.query(
        `INSERT INTO grades (student_id, course_code, course_title, term_label, value, status, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [studentId, code, title, grade.term, grade.value, grade.status, index],
      );
    }

    const requirementIds = [];
    for (const [index, requirement] of seed.requirements.entries()) {
      const inserted = await client.query(
        `INSERT INTO degree_requirements (program_id, category, title, units, sort_order)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [programId, requirement.category, requirement.title, requirement.units, index],
      );
      requirementIds.push({ id: inserted.rows[0].id, status: requirement.status });
    }
    for (const requirement of requirementIds) {
      await client.query(
        `INSERT INTO student_requirements (student_id, requirement_id, status) VALUES ($1, $2, $3)`,
        [studentId, requirement.id, requirement.status],
      );
    }

    for (const [index, document] of seed.documents.entries()) {
      await client.query(
        `INSERT INTO student_documents (student_id, name, note, status, sort_order)
         VALUES ($1, $2, $3, $4, $5)`,
        [studentId, document.name, document.note, document.status, index],
      );
    }

    for (const [index, request] of seed.requests.entries()) {
      await client.query(
        `INSERT INTO service_requests (reference, student_name, type, submitted_on, status, priority, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          request.reference,
          request.studentName,
          request.type,
          isoDate(request.submittedAt),
          request.status,
          request.priority,
          index,
        ],
      );
    }

    // ── Per-role dashboard content ─────────────────────────────────────────
    for (const [index, workspace] of seed.workspaces.entries()) {
      const inserted = await client.query(
        `INSERT INTO workspaces (slug, unit, heading, intro, queue_title, queue_note, widget_title, widget_note, boundary, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
        [
          workspace.slug,
          workspace.unit,
          workspace.heading,
          workspace.intro,
          workspace.queueTitle,
          workspace.queueNote,
          workspace.widgetTitle,
          workspace.widgetNote,
          workspace.boundary,
          index,
        ],
      );
      const workspaceId = inserted.rows[0].id;

      for (const [metricIndex, metric] of workspace.metrics.entries()) {
        await client.query(
          `INSERT INTO workspace_metrics (workspace_id, label, value, note, sort_order)
           VALUES ($1, $2, $3, $4, $5)`,
          [workspaceId, metric.label, metric.value, metric.note, metricIndex],
        );
      }

      for (const [itemIndex, item] of workspace.items.entries()) {
        await client.query(
          `INSERT INTO workspace_items (workspace_id, reference, title, detail, status, priority, action, sort_order)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            workspaceId,
            item.reference,
            item.title,
            item.detail,
            item.status,
            item.priority,
            item.action,
            itemIndex,
          ],
        );
      }

      for (const [rowIndex, row] of workspace.widgetRows.entries()) {
        await client.query(
          `INSERT INTO workspace_widget_rows (workspace_id, label, value, sort_order)
           VALUES ($1, $2, $3, $4)`,
          [workspaceId, row.label, row.value, rowIndex],
        );
      }
    }

    await client.query("COMMIT");
    console.log(
      `[seed-portal] seeded ${seed.courseOptions.length} courses, ${seed.requirements.length} requirements, ` +
        `${seed.requests.length} service requests and ${seed.workspaces.length} role workspaces.`,
    );
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error("[seed-portal] failed:", error.message);
  process.exit(1);
});
