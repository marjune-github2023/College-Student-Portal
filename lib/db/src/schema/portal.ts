import {
  boolean,
  date,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { usersTable } from "./auth";

/**
 * Campus portal domain data.
 *
 * Everything the portal renders is stored here rather than in frontend
 * constants: academic structure (programs, terms, courses), the student record
 * (enrollments, grades, degree requirements, documents, service requests) and
 * the per-role workspace content that each dashboard reads.
 */

export const programsTable = pgTable("programs", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  curriculumVersion: text("curriculum_version").notNull(),
  totalUnits: integer("total_units").notNull(),
});

export const termsTable = pgTable("terms", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  label: text("label").notNull(),
  academicYear: text("academic_year").notNull(),
  semester: text("semester").notNull(),
  currentWeek: integer("current_week"),
  totalWeeks: integer("total_weeks"),
  isCurrent: boolean("is_current").notNull().default(false),
});

export const studentsTable = pgTable(
  "students",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    studentNumber: text("student_number").notNull().unique(),
    programId: uuid("program_id")
      .notNull()
      .references(() => programsTable.id),
    currentTermId: uuid("current_term_id").references(() => termsTable.id),
    yearLevel: text("year_level").notNull(),
    standing: text("standing").notNull(),
    completedUnits: integer("completed_units").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("students_program_id_idx").on(table.programId)],
);

export const coursesTable = pgTable("courses", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  title: text("title").notNull(),
  units: integer("units").notNull(),
  instructor: text("instructor").notNull(),
  schedule: text("schedule").notNull(),
  room: text("room").notNull(),
  /** "Enrolled", "Open · 12 seats", "Waitlist · 2 seats" — the catalog status shown to students. */
  status: text("status").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const enrollmentsTable = pgTable(
  "enrollments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => studentsTable.id, { onDelete: "cascade" }),
    courseId: uuid("course_id")
      .notNull()
      .references(() => coursesTable.id, { onDelete: "cascade" }),
    termId: uuid("term_id")
      .notNull()
      .references(() => termsTable.id),
    status: text("status").notNull().default("Enrolled"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("enrollments_student_course_term_key").on(table.studentId, table.courseId, table.termId),
  ],
);

export const gradesTable = pgTable(
  "grades",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => studentsTable.id, { onDelete: "cascade" }),
    courseCode: text("course_code").notNull(),
    courseTitle: text("course_title").notNull(),
    termLabel: text("term_label").notNull(),
    value: text("value").notNull(),
    status: text("status").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [index("grades_student_id_idx").on(table.studentId)],
);

export const degreeRequirementsTable = pgTable(
  "degree_requirements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    programId: uuid("program_id")
      .notNull()
      .references(() => programsTable.id, { onDelete: "cascade" }),
    category: text("category").notNull(),
    title: text("title").notNull(),
    units: integer("units").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [
    unique("degree_requirements_program_title_key").on(table.programId, table.title),
  ],
);

export const studentRequirementsTable = pgTable(
  "student_requirements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => studentsTable.id, { onDelete: "cascade" }),
    requirementId: uuid("requirement_id")
      .notNull()
      .references(() => degreeRequirementsTable.id, { onDelete: "cascade" }),
    status: text("status").notNull(),
  },
  (table) => [
    unique("student_requirements_student_requirement_key").on(
      table.studentId,
      table.requirementId,
    ),
  ],
);

export const studentDocumentsTable = pgTable(
  "student_documents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => studentsTable.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    note: text("note").notNull(),
    status: text("status").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [index("student_documents_student_id_idx").on(table.studentId)],
);

export const serviceRequestsTable = pgTable("service_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  reference: text("reference").notNull().unique(),
  studentName: text("student_name").notNull(),
  type: text("type").notNull(),
  submittedOn: date("submitted_on").notNull(),
  status: text("status").notNull(),
  priority: text("priority").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const workspacesTable = pgTable("workspaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  unit: text("unit").notNull(),
  heading: text("heading").notNull(),
  intro: text("intro").notNull(),
  queueTitle: text("queue_title").notNull(),
  queueNote: text("queue_note").notNull(),
  widgetTitle: text("widget_title").notNull(),
  widgetNote: text("widget_note").notNull(),
  boundary: text("boundary").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const workspaceMetricsTable = pgTable(
  "workspace_metrics",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspacesTable.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    value: text("value").notNull(),
    note: text("note").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [index("workspace_metrics_workspace_id_idx").on(table.workspaceId)],
);

export const workspaceItemsTable = pgTable(
  "workspace_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspacesTable.id, { onDelete: "cascade" }),
    reference: text("reference").notNull(),
    title: text("title").notNull(),
    detail: text("detail").notNull(),
    status: text("status").notNull(),
    priority: text("priority").notNull(),
    action: text("action").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [index("workspace_items_workspace_id_idx").on(table.workspaceId)],
);

export const workspaceWidgetRowsTable = pgTable(
  "workspace_widget_rows",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspacesTable.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    value: text("value").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [index("workspace_widget_rows_workspace_id_idx").on(table.workspaceId)],
);

export type ProgramRecord = typeof programsTable.$inferSelect;
export type TermRecord = typeof termsTable.$inferSelect;
export type StudentRecord = typeof studentsTable.$inferSelect;
export type CourseRecord = typeof coursesTable.$inferSelect;
export type GradeRecord = typeof gradesTable.$inferSelect;
export type ServiceRequestRecord = typeof serviceRequestsTable.$inferSelect;
export type WorkspaceRecord = typeof workspacesTable.$inferSelect;
