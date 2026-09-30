export type Student = {
  studentId: string;
  name: string;
  program: string;
  curriculumVersion: string;
  yearLevel: string;
  term: string;
  standing: string;
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
export type Grade = { courseCode: string; term: string; value: string; status: 'Official' | 'Provisional' };
export type Requirement = { category: string; title: string; status: 'Satisfied' | 'In progress' | 'Remaining'; units: number };
export type Request = { reference: string; studentName: string; type: string; submittedAt: string; status: string; priority: string };

export const student: Student = {
  studentId: '2023-04182',
  name: 'Mara Villanueva',
  program: 'B.S. Environmental Planning',
  curriculumVersion: '2023 curriculum',
  yearLevel: '3rd year',
  term: 'Second Semester · AY 2025–26',
  standing: 'Good standing',
};

export const courses: Course[] = [
  { code: 'ENPL 321', title: 'Urban Systems & Resilience', units: 3, instructor: 'Prof. L. Sarmiento', schedule: 'MW · 9:00–10:30 AM', room: 'North Hall 204', status: 'Enrolled' },
  { code: 'ENPL 314', title: 'Land Use Planning Studio', units: 4, instructor: 'Prof. A. Reyes', schedule: 'TTh · 1:00–3:00 PM', room: 'Planning Lab', status: 'Enrolled' },
  { code: 'GE 208', title: 'Ethics, Place & Community', units: 3, instructor: 'Dr. N. Castillo', schedule: 'MW · 11:00 AM–12:30 PM', room: 'South Hall 108', status: 'Enrolled' },
  { code: 'ENPL 330', title: 'Geospatial Methods II', units: 3, instructor: 'Prof. M. Dizon', schedule: 'F · 8:00–11:00 AM', room: 'Map Room 3', status: 'Enrolled' },
];
export const courseOptions: Course[] = [
  ...courses,
  { code: 'ENPL 342', title: 'Climate Adaptation Policy', units: 3, instructor: 'Dr. P. Manalo', schedule: 'TTh · 9:00–10:30 AM', room: 'East Hall 301', status: 'Open · 12 seats' },
  { code: 'ENPL 350', title: 'Field Methods Practicum', units: 2, instructor: 'Prof. C. Navarro', schedule: 'MW · 9:30–11:00 AM', room: 'Field Annex', status: 'Open · 4 seats' },
  { code: 'GE 226', title: 'Writing for Public Life', units: 3, instructor: 'Dr. R. Lim', schedule: 'TTh · 1:00–2:30 PM', room: 'South Hall 212', status: 'Waitlist · 2 seats' },
  { code: 'ENPL 360', title: 'Regional Planning Seminar', units: 3, instructor: 'Prof. E. Cruz', schedule: 'F · 1:00–4:00 PM', room: 'North Hall 106', status: 'Open · 18 seats' },
];
export const grades: Grade[] = [
  { courseCode: 'ENPL 302 · Planning Law', term: 'First Semester · AY 2025–26', value: '1.50', status: 'Official' },
  { courseCode: 'STAT 210 · Applied Statistics', term: 'First Semester · AY 2025–26', value: '1.75', status: 'Official' },
  { courseCode: 'ENPL 305 · Planning Studio I', term: 'First Semester · AY 2025–26', value: '1.25', status: 'Official' },
  { courseCode: 'GE 214 · Philippine Society', term: 'First Semester · AY 2025–26', value: '1.50', status: 'Official' },
  { courseCode: 'ENPL 321 · Urban Systems & Resilience', term: 'Second Semester · AY 2025–26', value: '—', status: 'Provisional' },
];
export const requirements: Requirement[] = [
  { category: 'Program core', title: 'Planning Theory & History', status: 'Satisfied', units: 3 },
  { category: 'Program core', title: 'Planning Law & Governance', status: 'Satisfied', units: 3 },
  { category: 'Program core', title: 'Urban Systems & Resilience', status: 'In progress', units: 3 },
  { category: 'Program core', title: 'Regional Planning Seminar', status: 'Remaining', units: 3 },
  { category: 'Studio sequence', title: 'Planning Studio I', status: 'Satisfied', units: 4 },
  { category: 'Studio sequence', title: 'Land Use Planning Studio', status: 'In progress', units: 4 },
  { category: 'Studio sequence', title: 'Capstone Planning Studio', status: 'Remaining', units: 6 },
  { category: 'General education', title: 'Humanities & Social Sciences', status: 'Satisfied', units: 18 },
  { category: 'Field experience', title: 'Community Planning Practicum', status: 'Remaining', units: 2 },
];
export const initialRequests: Request[] = [
  { reference: 'AD-260184', studentName: 'Lina Mercado', type: 'Admissions · document review', submittedAt: 'Mar 18, 2026', status: 'Needs review', priority: 'High' },
  { reference: 'GA-260097', studentName: 'Rafael Soriano', type: 'Grade approval · ENPL 302', submittedAt: 'Mar 17, 2026', status: 'Awaiting approval', priority: 'Normal' },
  { reference: 'GR-260041', studentName: 'Nadia Flores', type: 'Graduation check', submittedAt: 'Mar 16, 2026', status: 'Needs review', priority: 'High' },
  { reference: 'TR-260223', studentName: 'Mara Villanueva', type: 'Transcript of records', submittedAt: 'Mar 15, 2026', status: 'In queue', priority: 'Normal' },
  { reference: 'GA-260094', studentName: 'Tomas de Vera', type: 'Grade approval · STAT 210', submittedAt: 'Mar 14, 2026', status: 'Awaiting approval', priority: 'Normal' },
  { reference: 'AD-260179', studentName: 'Bea Santos', type: 'Admissions · credentials', submittedAt: 'Mar 13, 2026', status: 'Needs review', priority: 'Low' },
  { reference: 'TR-260216', studentName: 'Enzo Ramos', type: 'Transcript of records', submittedAt: 'Mar 12, 2026', status: 'In queue', priority: 'Low' },
];
export const documents = [
  { name: 'Official transcript from previous school', note: 'Received · verified Feb 08, 2026', status: 'Complete' },
  { name: 'Birth certificate', note: 'Received · verified Aug 14, 2023', status: 'Complete' },
  { name: 'Latest student identification photo', note: 'For your student profile', status: 'Action needed' },
  { name: 'Practicum health clearance', note: 'Required before field placement', status: 'Action needed' },
];