/** Shapes returned by the portal API (`/api/portal/*`). */

export type Student = {
  studentId: string;
  name: string;
  program: string;
  curriculumVersion: string;
  yearLevel: string;
  term: string;
  standing: string;
  completedUnits: number;
  totalUnits: number;
  currentWeek: number | null;
  totalWeeks: number | null;
};

export type Course = {
  code: string;
  title: string;
  units: number;
  instructor: string;
  schedule: string;
  room: string;
  status: string;
};

export type Grade = {
  courseCode: string;
  term: string;
  value: string;
  status: "Official" | "Provisional";
};

export type Requirement = {
  category: string;
  title: string;
  status: "Satisfied" | "In progress" | "Remaining";
  units: number;
};

export type Request = {
  reference: string;
  studentName: string;
  type: string;
  submittedAt: string;
  status: string;
  priority: string;
};

export type WorkspaceItem = {
  reference: string;
  title: string;
  detail: string;
  status: string;
  priority: string;
  action: string;
};

export type WorkspacePreview = {
  slug: string;
  heading: string;
  intro: string;
  unit: string;
  metrics: { label: string; value: string; note: string }[];
  queueTitle: string;
  queueNote: string;
  items: WorkspaceItem[];
  widgetTitle: string;
  widgetNote: string;
  widgetRows: { label: string; value: string }[];
  boundary: string;
};

export type StudentOverview = {
  student: Student;
  courses: Course[];
  courseOptions: Course[];
  grades: Grade[];
  requirements: Requirement[];
  documents: { name: string; note: string; status: string }[];
};
