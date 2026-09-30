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

export type DemoRole = { name: string; slug: string; group: string; summary: string; route: string };
export type WorkspaceItem = { reference: string; title: string; detail: string; status: string; priority: string; action: string };
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

export const demoRoles: DemoRole[] = [
  { name: 'Applicant', slug: 'applicant', group: 'Learners & teaching', summary: 'Application checklist and admissions milestones', route: '/workspace/applicant' },
  { name: 'Student', slug: 'student', group: 'Learners & teaching', summary: 'Term schedule, grades, degree progress', route: '/student/dashboard' },
  { name: 'Instructor', slug: 'instructor', group: 'Learners & teaching', summary: 'Teaching sections and grade preparation', route: '/workspace/instructor' },
  { name: 'Academic Adviser', slug: 'academic-adviser', group: 'Academic leadership', summary: 'Advisee planning and audit conversations', route: '/workspace/academic-adviser' },
  { name: 'Program Head / Department', slug: 'program-head', group: 'Academic leadership', summary: 'Program reviews, curriculum and teaching load', route: '/workspace/program-head' },
  { name: 'Admissions Officer', slug: 'admissions-officer', group: 'Campus offices', summary: 'Application evaluation and file completeness', route: '/workspace/admissions-officer' },
  { name: 'Registrar', slug: 'registrar', group: 'Campus offices', summary: 'Admissions, approvals, graduation checks and TOR', route: '/registrar/dashboard' },
  { name: 'Records Officer', slug: 'records-officer', group: 'Campus offices', summary: 'Student files and credential preparation', route: '/workspace/records-officer' },
  { name: 'Finance Officer', slug: 'finance-officer', group: 'Campus offices', summary: 'Assessment review and clearance coordination', route: '/workspace/finance-officer' },
  { name: 'Scholarship Officer', slug: 'scholarship-officer', group: 'Campus offices', summary: 'Scholar eligibility and renewal follow-up', route: '/workspace/scholarship-officer' },
  { name: 'OJT Coordinator', slug: 'ojt-coordinator', group: 'Campus offices', summary: 'Placement agreements and fieldwork readiness', route: '/workspace/ojt-coordinator' },
  { name: 'Research Coordinator', slug: 'research-coordinator', group: 'Campus offices', summary: 'Proposal milestones and research review', route: '/workspace/research-coordinator' },
  { name: 'Academic Administrator', slug: 'academic-administrator', group: 'Academic leadership', summary: 'Academic calendars and cross-unit readiness', route: '/workspace/academic-administrator' },
  { name: 'System Administrator', slug: 'system-administrator', group: 'Governance & oversight', summary: 'Accounts, role catalog and service health', route: '/workspace/system-administrator' },
  { name: 'Auditor / Compliance', slug: 'auditor-compliance', group: 'Governance & oversight', summary: 'Read-only evidence and compliance sampling', route: '/workspace/auditor-compliance' },
  { name: 'Super Administrator', slug: 'super-administrator', group: 'Governance & oversight', summary: 'Platform-wide configuration oversight', route: '/workspace/super-administrator' },
];

export const workspacePreviews: WorkspacePreview[] = [
  {
    slug: 'applicant', heading: 'Application journey', intro: 'A personal checklist preview for a fictional applicant moving through admissions milestones.', unit: 'APPLICANT SERVICES',
    metrics: [{ label: 'Checklist', value: '3 / 5', note: 'sample items prepared' }, { label: 'File review', value: 'In review', note: 'portfolio sample' }, { label: 'Next milestone', value: 'Apr 03', note: 'interview window' }],
    queueTitle: 'Your application checklist', queueNote: 'Steps shown here are illustrative and are not submitted to the College.',
    items: [
      { reference: 'AP-26-0318', title: 'Academic history form', detail: 'Completed in this sample profile · submitted Mar 19', status: 'Sample complete', priority: 'Normal', action: 'View sample form' },
      { reference: 'AP-26-0324', title: 'Portfolio materials', detail: 'Review window · Architecture & Planning track', status: 'In review', priority: 'High', action: 'Review requirement' },
      { reference: 'AP-26-0331', title: 'Applicant interview', detail: 'Choose a preferred sample time before Apr 03', status: 'Upcoming', priority: 'Normal', action: 'See interview options' },
      { reference: 'AP-26-0325', title: 'Recommendation letters', detail: '2 of 3 received · follow up with referee', status: 'In review', priority: 'Normal', action: 'View letter status' },
      { reference: 'AP-26-0328', title: 'Application fee confirmation', detail: 'Payment verification pending in sample queue', status: 'Needs review', priority: 'Normal', action: 'View fee status' },
    ],
    widgetTitle: 'Applicant snapshot', widgetNote: 'Sample pathway · AY 2026–27', widgetRows: [{ label: 'Program choice', value: 'Environmental Planning' }, { label: 'Entry term', value: 'First semester' }, { label: 'Application ID', value: 'AP-26-0418' }],
    boundary: 'This applicant preview does not create or submit an application. Documents, dates, and statuses are fictional sample data.',
  },
  {
    slug: 'instructor', heading: 'Teaching desk', intro: 'A course-centered view for preparing sections, checking roster changes, and reviewing grade deadlines.', unit: 'FACULTY WORKSPACE',
    metrics: [{ label: 'Teaching sections', value: '3', note: 'sample term load' }, { label: 'Grade drafts', value: '2', note: 'not submitted' }, { label: 'Roster updates', value: '4', note: 'sample changes to review' }],
    queueTitle: 'Section worklist', queueNote: 'Grade actions open a review preview; no grades are posted from this interface.',
    items: [
      { reference: 'ENPL 321 · S01', title: 'Urban Systems & Resilience', detail: '24 learners · grade draft due Apr 10', status: 'Draft ready', priority: 'High', action: 'Open gradebook preview' },
      { reference: 'GE 208 · S02', title: 'Ethics, Place & Community', detail: '31 learners · roster changed Mar 21', status: 'Roster update', priority: 'Normal', action: 'Review roster sample' },
      { reference: 'ENPL 210 · S01', title: 'Planning Foundations', detail: '18 learners · attendance review for week 7', status: 'Needs review', priority: 'Normal', action: 'View section notes' },
      { reference: 'ENPL 330 S01', title: 'Geospatial Methods II', detail: '20 learners · midterm grading window open', status: 'Draft ready', priority: 'High', action: 'Open gradebook preview' },
      { reference: 'GE 208 S01', title: 'Ethics Place & Community', detail: '28 learners · attendance review for week 8', status: 'Needs review', priority: 'Normal', action: 'View section notes' },
    ],
    widgetTitle: 'Teaching calendar', widgetNote: 'Upcoming sample deadlines', widgetRows: [{ label: 'Grade draft', value: 'Apr 10' }, { label: 'Class meeting', value: 'Wed · 9:00 AM' }, { label: 'Advising week', value: 'Apr 20–24' }],
    boundary: 'Instructor actions in this preview do not publish grades, change rosters, or contact students.',
  },
  {
    slug: 'academic-adviser', heading: 'Advising overview', intro: 'A planning workspace for advising conversations, degree-audit questions, and student follow-up.', unit: 'ADVISING SERVICES',
    metrics: [{ label: 'Assigned advisees', value: '36', note: 'fictional caseload' }, { label: 'Plan reviews', value: '8', note: 'sample open items' }, { label: 'Meetings this week', value: '5', note: 'illustrative schedule' }],
    queueTitle: 'Advisee follow-up', queueNote: 'Use these sample records to explore an advising review, not to clear official holds.',
    items: [
      { reference: 'AD-031', title: 'Mikaela Santos · study plan', detail: 'Environmental Planning · review elective sequence', status: 'Plan review', priority: 'High', action: 'Open planning notes' },
      { reference: 'AD-044', title: 'Gabriel Dela Cruz · audit question', detail: 'Transfer credit mapping · discuss with Records', status: 'Needs conversation', priority: 'Normal', action: 'Review audit preview' },
      { reference: 'AD-052', title: 'Inez Navarro · term check-in', detail: 'Junior standing · meeting requested Mar 22', status: 'Meeting requested', priority: 'Normal', action: 'View meeting brief' },
      { reference: 'AD-061', title: 'Sofia Reyes · course adjustment', detail: 'Request to add ENPL 342 for summer term', status: 'Pending review', priority: 'Normal', action: 'Review adjustment' },
      { reference: 'AD-068', title: 'Marcus Tan · graduation timeline', detail: 'On-track check for AY 2026-27 completion', status: 'Planning', priority: 'Normal', action: 'View timeline' },
    ],
    widgetTitle: 'Advising focus', widgetNote: 'Quick reference · no official changes', widgetRows: [{ label: 'Next appointment', value: 'Wed · 10:30 AM' }, { label: 'Curriculum version', value: '2023 cohort' }, { label: 'Referral pathway', value: 'Registrar · audit question' }],
    boundary: 'Advising notes are fictional. This preview cannot modify academic records, approve a plan, or remove a student hold.',
  },
  {
    slug: 'program-head', heading: 'Department overview', intro: 'A program-level view of curriculum coordination, section coverage, and academic review.', unit: 'PROGRAM LEADERSHIP',
    metrics: [{ label: 'Active programs', value: '4', note: 'sample department' }, { label: 'Curriculum items', value: '6', note: 'for committee review' }, { label: 'Section coverage', value: '92%', note: 'illustrative staffing view' }],
    queueTitle: 'Department review queue', queueNote: 'Committee actions are previews only; curriculum decisions require the institution’s official process.',
    items: [
      { reference: 'CUR-26-014', title: 'Environmental Planning · curriculum map', detail: '2023 version · outcomes crosswalk for studio sequence', status: 'Committee review', priority: 'High', action: 'Open curriculum brief' },
      { reference: 'FAC-26-028', title: 'Section coverage · AY 2026–27', detail: 'Two seminar sections need instructor assignment', status: 'Planning', priority: 'Normal', action: 'Review staffing plan' },
      { reference: 'PRG-26-009', title: 'Annual program assessment', detail: 'Evidence summary due to Academic Affairs Apr 15', status: 'Evidence gathering', priority: 'Normal', action: 'View assessment outline' },
      { reference: 'CUR-26-021', title: 'Syllabus review · ENPL', detail: '3 syllabi need updating for AY 2026-27 outcomes', status: 'Review needed', priority: 'Normal', action: 'Open syllabus list' },
      { reference: 'STF-26-031', title: 'Faculty load · summer term', detail: '2 instructors need assignment confirmation', status: 'Planning', priority: 'High', action: 'Review assignments' },
    ],
    widgetTitle: 'Department pulse', widgetNote: 'Fictional planning indicators', widgetRows: [{ label: 'Next committee', value: 'Apr 02' }, { label: 'Curriculum versions', value: '7 active maps' }, { label: 'Assessment cycle', value: 'AY 2025–26' }],
    boundary: 'Program-level previews do not publish curriculum, assign instructors, or change any student academic record.',
  },
  {
    slug: 'admissions-officer', heading: 'Admissions review desk', intro: 'A document-first queue for fictional applications awaiting completeness and evaluation review.', unit: 'ADMISSIONS OFFICE',
    metrics: [{ label: 'Applications in queue', value: '28', note: 'sample intake cycle' }, { label: 'Files to complete', value: '9', note: 'document checklist' }, { label: 'Ready for evaluation', value: '12', note: 'illustrative status' }],
    queueTitle: 'Application file review', queueNote: 'Sample case actions do not verify documents or change a real admission decision.',
    items: [
      { reference: 'AP-26-0418', title: 'Nicolette Reyes · first-year', detail: 'Environmental Planning · transcript scan needs review', status: 'File review', priority: 'High', action: 'Review file checklist' },
      { reference: 'AP-26-0395', title: 'Joaquin Lim · transfer', detail: 'Credit equivalency worksheet not yet attached', status: 'Incomplete file', priority: 'Normal', action: 'Open document list' },
      { reference: 'AP-26-0379', title: 'Amara Villanueva · first-year', detail: 'Interview notes ready for evaluation panel', status: 'Panel review', priority: 'Normal', action: 'View evaluation brief' },
      { reference: 'AP-26-0421', title: 'Diego Morales · second-degree', detail: 'Supporting documents need verification', status: 'File review', priority: 'Normal', action: 'Review file' },
      { reference: 'AP-26-0435', title: 'Pia Navarro · returning student', detail: 'Re-entry form and clearance check pending', status: 'Incomplete file', priority: 'Normal', action: 'Open document list' },
    ],
    widgetTitle: 'Intake snapshot', widgetNote: 'AY 2026–27 · demo figures', widgetRows: [{ label: 'Applications received', value: '164' }, { label: 'Next panel date', value: 'Apr 08' }, { label: 'Open document requests', value: '9 sample files' }],
    boundary: 'Admissions items, applicant names, and document statuses are fictional. No admissions decision or verification occurs here.',
  },
  {
    slug: 'records-officer', heading: 'Records workbench', intro: 'A focused records queue for student-file checks, credential preparation, and transcript requests.', unit: 'RECORDS OFFICE',
    metrics: [{ label: 'File checks', value: '17', note: 'sample queue' }, { label: 'Credential drafts', value: '6', note: 'not issued' }, { label: 'TOR requests', value: '11', note: 'illustrative requests' }],
    queueTitle: 'Records preparation queue', queueNote: 'Credential and transcript actions remain drafts in this frontend preview.',
    items: [
      { reference: 'TOR-26-223', title: 'Mara Villanueva · transcript copy', detail: 'Sample request · verify term coverage in official workflow', status: 'Preparation', priority: 'High', action: 'Review TOR checklist' },
      { reference: 'FILE-26-084', title: 'Tomas de Vera · student file', detail: 'Curriculum version field needs reconciliation', status: 'File check', priority: 'Normal', action: 'Open file summary' },
      { reference: 'CERT-26-061', title: 'Bea Santos · enrollment certificate', detail: 'Draft template prepared · not issued', status: 'Draft', priority: 'Normal', action: 'Preview certificate' },
      { reference: 'TOR-26-229', title: 'Rafael Soriano · transcript copy', detail: 'Verify term coverage before release', status: 'Preparation', priority: 'Normal', action: 'Review TOR checklist' },
      { reference: 'FILE-26-091', title: 'Nadia Flores · graduation file', detail: 'Degree audit summary for review', status: 'File check', priority: 'High', action: 'Open file summary' },
    ],
    widgetTitle: 'Credential standards', widgetNote: 'Reference reminders · sample', widgetRows: [{ label: 'TOR checklist', value: 'Identity · terms · holds' }, { label: 'Drafts awaiting check', value: '6' }, { label: 'Sample cutoff', value: 'Mar 27 · 3:00 PM' }],
    boundary: 'This preview does not access official student files, verify records, issue credentials, or release a transcript.',
  },
  {
    slug: 'finance-officer', heading: 'Student finance desk', intro: 'A reconciliation and clearance overview using fictional assessment records and sample balances.', unit: 'FINANCE OFFICE',
    metrics: [{ label: 'Assessments to review', value: '14', note: 'sample records' }, { label: 'Clearance checks', value: '7', note: 'pending coordination' }, { label: 'Reconciliation batch', value: '03', note: 'illustrative cycle' }],
    queueTitle: 'Assessment follow-up', queueNote: 'Figures are not balances due. Preview actions do not collect or reconcile payments.',
    items: [
      { reference: 'FIN-26-105', title: 'Lara Medina · term assessment', detail: 'Sample fee breakdown · one line item needs review', status: 'Check breakdown', priority: 'High', action: 'Open assessment preview' },
      { reference: 'FIN-26-091', title: 'Emilio Cruz · clearance check', detail: 'Coordinate with Records before credential workflow', status: 'Coordination', priority: 'Normal', action: 'Review clearance notes' },
      { reference: 'REC-26-033', title: 'AY 2025–26 · batch reconciliation', detail: 'Illustrative batch has 3 unmatched sample entries', status: 'Reconcile sample', priority: 'Normal', action: 'View batch summary' },
      { reference: 'FIN-26-112', title: 'Joaquin Reyes · payment plan', detail: 'Sample installment schedule review', status: 'Check breakdown', priority: 'Normal', action: 'Open assessment' },
      { reference: 'CLR-26-045', title: 'Graduation batch · clearance', detail: '12 students pending finance clearance', status: 'Coordination', priority: 'High', action: 'Review batch' },
    ],
    widgetTitle: 'Finance daybook', widgetNote: 'No actual money or transactions', widgetRows: [{ label: 'Sample batch total', value: '₱184,250' }, { label: 'Unmatched entries', value: '3 illustrative' }, { label: 'Next coordination', value: 'Records office · 2 PM' }],
    boundary: 'All amounts are fictional examples, not student balances. This workspace cannot accept payments, post transactions, or release clearances.',
  },
  {
    slug: 'scholarship-officer', heading: 'Scholarship review', intro: 'A renewal and eligibility workspace for coordinating fictional scholar documents and review windows.', unit: 'SCHOLARSHIP OFFICE',
    metrics: [{ label: 'Active scholar profiles', value: '83', note: 'sample cohort' }, { label: 'Renewals to review', value: '12', note: 'current cycle' }, { label: 'Missing documents', value: '5', note: 'illustrative follow-up' }],
    queueTitle: 'Renewal follow-up', queueNote: 'Scholarship decisions and award amounts remain outside this sample view.',
    items: [
      { reference: 'SCH-26-018', title: 'Isabel Flores · renewal packet', detail: 'Term grades and household statement listed for review', status: 'Documents pending', priority: 'High', action: 'Review renewal checklist' },
      { reference: 'SCH-26-024', title: 'Rafael Soriano · merit renewal', detail: 'Sample standing check for AY 2026–27', status: 'Eligibility review', priority: 'Normal', action: 'Open eligibility preview' },
      { reference: 'SCH-26-031', title: 'Community fellows · cohort report', detail: 'Prepare a fictional retention summary for committee', status: 'Report draft', priority: 'Normal', action: 'View cohort summary' },
      { reference: 'SCH-26-038', title: 'Mara Villanueva · merit award', detail: 'GPA threshold review for renewal cycle', status: 'Eligibility review', priority: 'Normal', action: 'Open eligibility' },
      { reference: 'SCH-26-042', title: 'Community fellows · documents', detail: '3 scholars missing household statements', status: 'Documents pending', priority: 'High', action: 'Review checklist' },
    ],
    widgetTitle: 'Renewal calendar', widgetNote: 'Sample checkpoints', widgetRows: [{ label: 'Renewal window closes', value: 'Apr 18' }, { label: 'Committee review', value: 'Apr 24' }, { label: 'Cohort', value: 'AY 2026–27 preview' }],
    boundary: 'Scholar profiles and award references are fictional. No eligibility determination, award approval, or disbursement takes place.',
  },
  {
    slug: 'ojt-coordinator', heading: 'Fieldwork coordination', intro: 'A practicum desk for fictional placement readiness, partner agreements, and supervisor feedback.', unit: 'OJT & FIELD PLACEMENT',
    metrics: [{ label: 'Students in placement', value: '22', note: 'sample cohort' }, { label: 'Agreements to check', value: '4', note: 'partner copies' }, { label: 'Logs awaiting review', value: '8', note: 'week 7 sample' }],
    queueTitle: 'Placement readiness queue', queueNote: 'These previews do not authorize placements or verify partner agreements.',
    items: [
      { reference: 'OJT-26-056', title: 'Miko Santos · City Planning Office', detail: 'Agreement signature copy listed as outstanding', status: 'Agreement check', priority: 'High', action: 'Review placement file' },
      { reference: 'OJT-26-061', title: 'Alyssa Ramos · Coastal Futures Lab', detail: 'Week 7 field log submitted in sample workspace', status: 'Log review', priority: 'Normal', action: 'Open log preview' },
      { reference: 'OJT-26-067', title: 'Benedict Lim · North District Office', detail: 'Supervisor evaluation window opens Apr 06', status: 'Upcoming', priority: 'Normal', action: 'View evaluation guide' },
      { reference: 'OJT-26-072', title: 'Diego Morales · Environmental NGO', detail: 'Weekly log submission overdue by 3 days', status: 'Log review', priority: 'High', action: 'Open log preview' },
      { reference: 'OJT-26-078', title: 'Sofia Reyes · City Engineering', detail: 'Final evaluation schedule needed', status: 'Upcoming', priority: 'Normal', action: 'View evaluation guide' },
    ],
    widgetTitle: 'Fieldwork pulse', widgetNote: 'AY 2025–26 · fictional placements', widgetRows: [{ label: 'Approved partner samples', value: '14' }, { label: 'Orientation session', value: 'Apr 01 · 9:00 AM' }, { label: 'Weekly log cadence', value: 'Every Friday' }],
    boundary: 'Placement partner names and status notes are invented. This interface does not clear health records, sign agreements, or authorize off-campus work.',
  },
  {
    slug: 'research-coordinator', heading: 'Research coordination', intro: 'A milestone-centered view for fictional proposals, panel reviews, and research compliance follow-up.', unit: 'RESEARCH OFFICE',
    metrics: [{ label: 'Active proposals', value: '19', note: 'sample portfolio' }, { label: 'Panel reviews', value: '5', note: 'scheduled' }, { label: 'Milestones due', value: '7', note: 'next 30 days' }],
    queueTitle: 'Research milestone queue', queueNote: 'Research and ethics states are illustrative; no protocol is reviewed or approved here.',
    items: [
      { reference: 'RES-26-044', title: 'Urban heat mapping · student team', detail: 'Ethics checklist needs committee routing in official process', status: 'Routing preview', priority: 'High', action: 'Review ethics checklist' },
      { reference: 'RES-26-037', title: 'River corridor livelihoods · faculty', detail: 'Progress report milestone expected Mar 29', status: 'Milestone due', priority: 'Normal', action: 'Open progress brief' },
      { reference: 'RES-26-029', title: 'Campus mobility study · capstone', detail: 'Panel feedback summary prepared for coordinator review', status: 'Feedback ready', priority: 'Normal', action: 'View panel summary' },
      { reference: 'RES-26-051', title: 'Coastal erosion mapping · team', detail: 'Informed consent forms need committee review', status: 'Routing preview', priority: 'Normal', action: 'Review consent forms' },
      { reference: 'RES-26-044', title: 'Urban heat mapping · faculty', detail: 'Budget revision request for committee', status: 'Milestone due', priority: 'Normal', action: 'Open budget brief' },
    ],
    widgetTitle: 'Review calendar', widgetNote: 'Sample research cycle', widgetRows: [{ label: 'Ethics panel', value: 'Apr 04' }, { label: 'Progress reports', value: '7 due this month' }, { label: 'Grant reporting', value: 'May 06' }],
    boundary: 'Proposal titles, milestones, and review statuses are fictional. Nothing is routed to an ethics board or marked approved.',
  },
  {
    slug: 'academic-administrator', heading: 'Academic affairs overview', intro: 'A cross-unit view of calendar readiness, academic operations, and policy coordination.', unit: 'ACADEMIC ADMINISTRATION',
    metrics: [{ label: 'Academic units', value: '8', note: 'sample colleges' }, { label: 'Calendar milestones', value: '6', note: 'upcoming' }, { label: 'Policy reviews', value: '3', note: 'committee queue' }],
    queueTitle: 'Academic operations', queueNote: 'Coordination actions prepare a discussion preview only; no term configuration is published.',
    items: [
      { reference: 'ACAD-26-021', title: 'AY 2026–27 calendar alignment', detail: 'Review exam and term start dates across sample units', status: 'Cross-unit review', priority: 'High', action: 'Open calendar brief' },
      { reference: 'POL-26-008', title: 'Assessment policy refresh', detail: 'Committee comments due from 3 academic units', status: 'Consultation', priority: 'Normal', action: 'View comment summary' },
      { reference: 'OPS-26-016', title: 'Summer term readiness', detail: 'Room, section, and support-service checklist', status: 'Planning', priority: 'Normal', action: 'Review readiness list' },
      { reference: 'ACAD-26-028', title: 'Faculty workload · cross-unit', detail: 'Standardize teaching load criteria across units', status: 'Cross-unit review', priority: 'Normal', action: 'Open workload brief' },
      { reference: 'POL-26-012', title: 'Grading policy · appeals', detail: 'Draft comments from 2 academic units', status: 'Consultation', priority: 'Normal', action: 'View comment summary' },
    ],
    widgetTitle: 'Academic calendar', widgetNote: 'Planning dates · sample only', widgetRows: [{ label: 'Final exam week', value: 'May 18–23' }, { label: 'Summer term opens', value: 'Jun 08' }, { label: 'Policy council', value: 'Apr 09' }],
    boundary: 'This overview does not publish the academic calendar, approve policy, or make student-level academic record changes.',
  },
  {
    slug: 'system-administrator', heading: 'Platform operations', intro: 'A bounded operations view for account lifecycle, role catalog maintenance, and service health.', unit: 'SYSTEM ADMINISTRATION',
    metrics: [{ label: 'Demo accounts', value: '142', note: 'fictional directory count' }, { label: 'Role mappings', value: '16', note: 'guide role types' }, { label: 'Service checks', value: '4 / 4', note: 'sample status only' }],
    queueTitle: 'Platform operations queue', queueNote: 'System controls are represented as safe preview tasks, not connected admin tools.',
    items: [
      { reference: 'IAM-26-040', title: 'Role catalog · review descriptions', detail: 'Confirm labels match the college role guide', status: 'Documentation', priority: 'Normal', action: 'View role catalog note' },
      { reference: 'OPS-26-017', title: 'Account lifecycle · expired demo entries', detail: 'Sample directory cleanup checklist', status: 'Ready to inspect', priority: 'Low', action: 'Open lifecycle checklist' },
      { reference: 'SYS-26-012', title: 'Service health snapshot', detail: 'Preview of portal, queue, and reporting service checks', status: 'Informational', priority: 'Normal', action: 'View health summary' },
      { reference: 'IAM-26-045', title: 'Access review · quarterly', detail: 'Sample role-access verification checklist', status: 'Documentation', priority: 'Normal', action: 'View access note' },
      { reference: 'OPS-26-019', title: 'Backup verification · restore', detail: 'Test data integrity check for recovery', status: 'Ready to inspect', priority: 'Low', action: 'Open restore checklist' },
    ],
    widgetTitle: 'Operational boundary', widgetNote: 'System-level preview controls', widgetRows: [{ label: 'Identity services', value: 'Demo status · available' }, { label: 'Role catalog', value: '16 named roles' }, { label: 'Academic records', value: 'No editing controls' }],
    boundary: 'System administration is limited here to fictional accounts, role labels, and service-health concepts. This role does not imply unrestricted academic-record editing; no record-editing controls are present.',
  },
  {
    slug: 'auditor-compliance', heading: 'Compliance review', intro: 'A read-only evidence overview for sampling procedural controls, record trails, and policy checkpoints.', unit: 'AUDIT & COMPLIANCE',
    metrics: [{ label: 'Evidence samples', value: '24', note: 'fictional review set' }, { label: 'Control checks', value: '18 / 20', note: 'sample checklist' }, { label: 'Open observations', value: '2', note: 'for discussion' }],
    queueTitle: 'Read-only evidence index', queueNote: 'This workspace is intentionally read-only. No buttons here change a record or mark a control complete.',
    items: [
      { reference: 'AUD-26-021', title: 'Admissions document trail', detail: 'Sample evidence window · Jan–Mar 2026', status: 'Evidence indexed', priority: 'Normal', action: 'Read-only sample' },
      { reference: 'AUD-26-026', title: 'Grade approval sequence', detail: 'Compare fictional approval timestamps with policy checklist', status: 'Sampling', priority: 'Normal', action: 'Read-only sample' },
      { reference: 'AUD-26-031', title: 'Credential release control', detail: 'TOR sample lifecycle · evidence reference only', status: 'Observation noted', priority: 'High', action: 'Read-only sample' },
      { reference: 'AUD-26-034', title: 'Enrollment record trail', detail: 'Sample evidence window · Feb-Mar 2026', status: 'Evidence indexed', priority: 'Normal', action: 'Read-only sample' },
      { reference: 'AUD-26-038', title: 'Scholarship disbursement control', detail: 'Verify approval chain in sample records', status: 'Sampling', priority: 'Normal', action: 'Read-only sample' },
    ],
    widgetTitle: 'Review scope', widgetNote: 'Fictional evidence references', widgetRows: [{ label: 'Period sampled', value: 'AY 2025–26' }, { label: 'Evidence source', value: 'Sample index only' }, { label: 'Access mode', value: 'Read-only' }],
    boundary: 'Auditor / Compliance is read-only in this prototype. It cannot approve, modify, delete, or resolve academic records or evidence.',
  },
  {
    slug: 'super-administrator', heading: 'Platform governance', intro: 'A governance view of system-wide role definitions, configuration review, and operational oversight.', unit: 'PLATFORM GOVERNANCE',
    metrics: [{ label: 'Role definitions', value: '16', note: 'guide-aligned sample' }, { label: 'Configuration reviews', value: '3', note: 'illustrative queue' }, { label: 'Policy checkpoints', value: '7', note: 'sample controls' }],
    queueTitle: 'Governance review queue', queueNote: 'High-level oversight preview. No policy, access, or institutional setting is changed here.',
    items: [
      { reference: 'GOV-26-005', title: 'Role boundaries · annual review', detail: 'Confirm distinct duties for records, system, and audit roles', status: 'Review outline', priority: 'High', action: 'Open boundary brief' },
      { reference: 'GOV-26-011', title: 'Demo workspace configuration', detail: 'Review sample data labels and non-live disclosures', status: 'Configuration note', priority: 'Normal', action: 'View configuration summary' },
      { reference: 'GOV-26-019', title: 'Service continuity checklist', detail: 'Illustrative escalation and ownership map', status: 'For discussion', priority: 'Normal', action: 'Read continuity brief' },
      { reference: 'GOV-26-023', title: 'Data retention · policy review', detail: 'Confirm retention schedule alignment', status: 'Review outline', priority: 'Normal', action: 'Open retention brief' },
      { reference: 'GOV-26-027', title: 'Access tier · annual audit', detail: 'Verify role-boundary documentation', status: 'For discussion', priority: 'Normal', action: 'Read access brief' },
    ],
    widgetTitle: 'Governance scope', widgetNote: 'Oversight indicators · sample', widgetRows: [{ label: 'Institutional scope', value: 'Northfield demo' }, { label: 'Academic records', value: 'No edit workflow' }, { label: 'Next governance forum', value: 'Apr 12' }],
    boundary: 'Super Administrator is a fictional governance preview, not an authenticated superuser session. It offers no unrestricted record editing or live configuration controls.',
  },
];