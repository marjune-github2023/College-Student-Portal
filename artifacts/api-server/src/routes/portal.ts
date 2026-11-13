import { Router, type IRouter } from "express";
import { asc, eq } from "drizzle-orm";
import {
  coursesTable,
  degreeRequirementsTable,
  enrollmentsTable,
  gradesTable,
  programsTable,
  serviceRequestsTable,
  studentDocumentsTable,
  studentRequirementsTable,
  studentsTable,
  termsTable,
  workspaceItemsTable,
  workspaceMetricsTable,
  workspacesTable,
  workspaceWidgetRowsTable,
  db,
} from "@workspace/db";
import { requireAuth, requireRole } from "../middlewares/auth";

const router: IRouter = Router();

const REQUEST_READER_ROLES = [
  "registrar",
  "records-officer",
  "admissions-officer",
  "system-administrator",
  "super-administrator",
  "auditor-compliance",
];

function courseShape(row: {
  code: string;
  title: string;
  units: number;
  instructor: string;
  schedule: string;
  room: string;
  status: string;
}) {
  return {
    code: row.code,
    title: row.title,
    units: row.units,
    instructor: row.instructor,
    schedule: row.schedule,
    room: row.room,
    status: row.status,
  };
}

function displayDate(value: string) {
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Every role's dashboard content, assembled from the workspace tables. */
router.get("/portal/workspaces", requireAuth, async (_req, res) => {
  const [workspaces, metrics, items, widgetRows] = await Promise.all([
    db.select().from(workspacesTable).orderBy(asc(workspacesTable.sortOrder)),
    db.select().from(workspaceMetricsTable).orderBy(asc(workspaceMetricsTable.sortOrder)),
    db.select().from(workspaceItemsTable).orderBy(asc(workspaceItemsTable.sortOrder)),
    db.select().from(workspaceWidgetRowsTable).orderBy(asc(workspaceWidgetRowsTable.sortOrder)),
  ]);

  res.json({
    workspaces: workspaces.map((workspace) => ({
      slug: workspace.slug,
      heading: workspace.heading,
      intro: workspace.intro,
      unit: workspace.unit,
      metrics: metrics
        .filter((metric) => metric.workspaceId === workspace.id)
        .map(({ label, value, note }) => ({ label, value, note })),
      queueTitle: workspace.queueTitle,
      queueNote: workspace.queueNote,
      items: items
        .filter((item) => item.workspaceId === workspace.id)
        .map(({ reference, title, detail, status, priority, action }) => ({
          reference,
          title,
          detail,
          status,
          priority,
          action,
        })),
      widgetTitle: workspace.widgetTitle,
      widgetNote: workspace.widgetNote,
      widgetRows: widgetRows
        .filter((row) => row.workspaceId === workspace.id)
        .map(({ label, value }) => ({ label, value })),
      boundary: workspace.boundary,
    })),
  });
});

/** The signed-in student's academic record. */
router.get("/portal/student/overview", requireAuth, async (req, res) => {
  const user = req.user!;

  const rows = await db
    .select({
      studentId: studentsTable.id,
      studentNumber: studentsTable.studentNumber,
      yearLevel: studentsTable.yearLevel,
      standing: studentsTable.standing,
      completedUnits: studentsTable.completedUnits,
      programName: programsTable.name,
      curriculumVersion: programsTable.curriculumVersion,
      totalUnits: programsTable.totalUnits,
      termLabel: termsTable.label,
      currentWeek: termsTable.currentWeek,
      totalWeeks: termsTable.totalWeeks,
    })
    .from(studentsTable)
    .innerJoin(programsTable, eq(studentsTable.programId, programsTable.id))
    .leftJoin(termsTable, eq(studentsTable.currentTermId, termsTable.id))
    .where(eq(studentsTable.userId, user.id))
    .limit(1);

  const record = rows[0];
  if (!record) {
    res.status(404).json({ error: "no_student_record", message: "No student record is linked to this account." });
    return;
  }

  const [enrolled, catalog, gradeRows, requirementRows, documentRows] = await Promise.all([
    db
      .select({
        code: coursesTable.code,
        title: coursesTable.title,
        units: coursesTable.units,
        instructor: coursesTable.instructor,
        schedule: coursesTable.schedule,
        room: coursesTable.room,
        status: enrollmentsTable.status,
      })
      .from(enrollmentsTable)
      .innerJoin(coursesTable, eq(enrollmentsTable.courseId, coursesTable.id))
      .where(eq(enrollmentsTable.studentId, record.studentId))
      .orderBy(asc(coursesTable.sortOrder)),
    db.select().from(coursesTable).orderBy(asc(coursesTable.sortOrder)),
    db.select().from(gradesTable).where(eq(gradesTable.studentId, record.studentId)).orderBy(asc(gradesTable.sortOrder)),
    db
      .select({
        category: degreeRequirementsTable.category,
        title: degreeRequirementsTable.title,
        units: degreeRequirementsTable.units,
        status: studentRequirementsTable.status,
      })
      .from(studentRequirementsTable)
      .innerJoin(
        degreeRequirementsTable,
        eq(studentRequirementsTable.requirementId, degreeRequirementsTable.id),
      )
      .where(eq(studentRequirementsTable.studentId, record.studentId))
      .orderBy(asc(degreeRequirementsTable.sortOrder)),
    db
      .select()
      .from(studentDocumentsTable)
      .where(eq(studentDocumentsTable.studentId, record.studentId))
      .orderBy(asc(studentDocumentsTable.sortOrder)),
  ]);

  res.json({
    student: {
      studentId: record.studentNumber,
      name: user.name,
      program: record.programName,
      curriculumVersion: record.curriculumVersion,
      yearLevel: record.yearLevel,
      term: record.termLabel ?? "",
      standing: record.standing,
      completedUnits: record.completedUnits,
      totalUnits: record.totalUnits,
      currentWeek: record.currentWeek,
      totalWeeks: record.totalWeeks,
    },
    courses: enrolled.map(courseShape),
    courseOptions: catalog.map(courseShape),
    grades: gradeRows.map((grade) => ({
      courseCode: `${grade.courseCode} · ${grade.courseTitle}`,
      term: grade.termLabel,
      value: grade.value,
      status: grade.status,
    })),
    requirements: requirementRows,
    documents: documentRows.map(({ name, note, status }) => ({ name, note, status })),
  });
});

/** Registrar-style review queue. */
router.get("/portal/service-requests", requireRole(...REQUEST_READER_ROLES), async (_req, res) => {
  const rows = await db
    .select()
    .from(serviceRequestsTable)
    .orderBy(asc(serviceRequestsTable.sortOrder));

  res.json({
    requests: rows.map((row) => ({
      reference: row.reference,
      studentName: row.studentName,
      type: row.type,
      submittedAt: displayDate(row.submittedOn),
      status: row.status,
      priority: row.priority,
    })),
  });
});

export default router;
