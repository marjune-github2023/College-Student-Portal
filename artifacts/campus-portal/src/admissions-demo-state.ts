import { useCallback, useEffect, useRef, useState } from 'react';

export const ADMISSIONS_STORAGE_KEY = 'northfield.admissions-demo.v1';
export const PRIMARY_APPLICATION_ID = 'AP-26-0418';

export type DocumentItem = { name: string; status: 'Received · sample' | 'Requested · sample' | 'Not received'; note: string };
export type OfficerUpdate = { id: string; date: string; title: string; message: string };
export type AdmissionDecision = 'Admit' | 'Waitlist' | 'Not admitted' | null;
export type ApplicantResponse = 'Accepted · sample' | 'Declined · sample' | null;
export type AdmissionsCase = {
  id: string;
  name: string;
  program: string;
  entry: string;
  stage: string;
  documents: DocumentItem[];
  academicPreparation: number;
  portfolioFit: number;
  notes: string;
  recommendation: string;
  decision: AdmissionDecision;
  interviewDate: string;
  interviewInvite: string;
  applicantResponse: ApplicantResponse;
  updates: OfficerUpdate[];
};
export type AdmissionsDemoData = { version: 1; cases: Record<string, AdmissionsCase> };

const docSet = (received: string[], missing: string[]): DocumentItem[] => [
  ...received.map((name) => ({ name, status: 'Received · sample' as const, note: 'Listed as received for this local preview; not reviewed as an actual file.' })),
  ...missing.map((name) => ({ name, status: 'Not received' as const, note: 'No file is uploaded in this demo.' })),
];

export function makeSampleAdmissionsData(): AdmissionsDemoData {
  return {
    version: 1,
    cases: {
      'AP-26-0418': {
        id: 'AP-26-0418', name: 'Nicolette Reyes', program: 'Environmental Planning', entry: 'First-year · AY 2026–27',
        stage: 'File review',
        documents: docSet(['Application form', 'School transcript', 'Personal statement'], ['Portfolio sample', 'Recommendation letter']),
        academicPreparation: 3, portfolioFit: 3, notes: '', recommendation: 'Pending review', decision: null,
        interviewDate: '', interviewInvite: '', applicantResponse: null, updates: [],
      },
      'AP-26-0395': {
        id: 'AP-26-0395', name: 'Joaquin Lim', program: 'Environmental Planning', entry: 'Transfer · AY 2026–27',
        stage: 'Incomplete file',
        documents: docSet(['Application form', 'School transcript'], ['Credit equivalency worksheet', 'Personal statement']),
        academicPreparation: 2, portfolioFit: 2, notes: '', recommendation: 'Pending review', decision: null,
        interviewDate: '', interviewInvite: '', applicantResponse: null, updates: [],
      },
      'AP-26-0379': {
        id: 'AP-26-0379', name: 'Amara Villanueva', program: 'Environmental Planning', entry: 'First-year · AY 2026–27',
        stage: 'Panel review',
        documents: docSet(['Application form', 'School transcript', 'Personal statement', 'Portfolio sample'], ['Recommendation letter']),
        academicPreparation: 4, portfolioFit: 4, notes: 'Interview notes ready for panel discussion.', recommendation: 'Pending review', decision: null,
        interviewDate: '', interviewInvite: '', applicantResponse: null, updates: [],
      },
    },
  };
}

function isCase(value: unknown): value is AdmissionsCase {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<AdmissionsCase>;
  return typeof item.id === 'string' && typeof item.name === 'string' &&
    typeof item.program === 'string' && typeof item.entry === 'string' && typeof item.stage === 'string' &&
    Array.isArray(item.documents) && item.documents.every((doc) => Boolean(doc) && typeof doc.name === 'string' &&
      (doc.status === 'Received · sample' || doc.status === 'Requested · sample' || doc.status === 'Not received') && typeof doc.note === 'string') &&
    Array.isArray(item.updates) && item.updates.every((update) => Boolean(update) && typeof update.id === 'string' &&
      typeof update.date === 'string' && typeof update.title === 'string' && typeof update.message === 'string') &&
    typeof item.notes === 'string' && typeof item.recommendation === 'string' &&
    typeof item.academicPreparation === 'number' && item.academicPreparation >= 1 && item.academicPreparation <= 5 &&
    typeof item.portfolioFit === 'number' && item.portfolioFit >= 1 && item.portfolioFit <= 5 &&
    typeof item.interviewDate === 'string' && typeof item.interviewInvite === 'string' &&
    (item.decision === null || item.decision === 'Admit' || item.decision === 'Waitlist' || item.decision === 'Not admitted') &&
    (item.applicantResponse === null || item.applicantResponse === 'Accepted · sample' || item.applicantResponse === 'Declined · sample');
}

export function readAdmissionsDemoData(): AdmissionsDemoData {
  const fallback = makeSampleAdmissionsData();
  try {
    const raw = window.localStorage.getItem(ADMISSIONS_STORAGE_KEY);
    if (!raw) return fallback;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || (parsed as AdmissionsDemoData).version !== 1) return fallback;
    const cases = (parsed as AdmissionsDemoData).cases;
    if (!cases || typeof cases !== 'object') return fallback;
    const valid = { ...fallback.cases };
    for (const id of Object.keys(fallback.cases)) {
      const stored = (cases as Record<string, unknown>)[id];
      if (isCase(stored) && stored.id === id) valid[id] = stored;
    }
    return { version: 1, cases: valid };
  } catch {
    return fallback;
  }
}

const EVENT_NAME = 'northfield-admissions-demo-change';

export function useAdmissionsDemo() {
  const [data, setData] = useState<AdmissionsDemoData>(() => readAdmissionsDemoData());
  const current = useRef(data);
  current.current = data;

  useEffect(() => {
    const refresh = () => {
      const next = readAdmissionsDemoData();
      current.current = next;
      setData(next);
    };
    window.addEventListener('storage', refresh);
    window.addEventListener(EVENT_NAME, refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener(EVENT_NAME, refresh);
    };
  }, []);

  const save = useCallback((next: AdmissionsDemoData) => {
    current.current = next;
    setData(next);
    try {
      window.localStorage.setItem(ADMISSIONS_STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(EVENT_NAME));
    } catch {
      // The screen remains usable if browser storage is unavailable.
    }
  }, []);

  const updateCase = useCallback((id: string, updater: (item: AdmissionsCase) => AdmissionsCase) => {
    const latest = current.current;
    const item = latest.cases[id];
    if (!item) return;
    save({ ...latest, cases: { ...latest.cases, [id]: updater(item) } });
  }, [save]);

  const reset = useCallback(() => save(makeSampleAdmissionsData()), [save]);
  return { data, updateCase, reset };
}