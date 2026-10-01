import { useState } from 'react';
import { CalendarDays, Check, CheckCircle2, ClipboardCheck, FileText, MessageSquareText, RotateCcw, ShieldCheck, UserRoundCheck } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge, PageHeading, useNotice } from '../components/PortalUI';
import { demoRoles } from '../data';
import { AdmissionsCase, PRIMARY_APPLICATION_ID, useAdmissionsDemo } from '../admissions-demo-state';
import { RoleContentsGuide } from './PortalPages';

const applicantId = PRIMARY_APPLICATION_ID;
const officerRole = demoRoles.find((role) => role.slug === 'admissions-officer')!;
const applicantRole = demoRoles.find((role) => role.slug === 'applicant')!;
const applicantTimes = [
  '2026-04-03T10:00|Apr 03, 2026 · 10:00 AM',
  '2026-04-03T13:30|Apr 03, 2026 · 1:30 PM',
  '2026-04-04T09:30|Apr 04, 2026 · 9:30 AM',
];

function tone(status: string) {
  if (/not admitted|declined|not received|incomplete|missing/i.test(status)) return 'red' as const;
  if (/received|complete|\badmit(?:ted)?\b|accepted|saved/i.test(status)) return 'green' as const;
  if (/review|pending|waitlist|requested|interview/i.test(status)) return 'amber' as const;
  return 'gray' as const;
}

function StatusBadge({ value, testId }: { value: string; testId: string }) {
  return <span data-testid={testId}><Badge tone={tone(value)}>{value}</Badge></span>;
}

function addUpdate(item: AdmissionsCase, title: string, message: string): AdmissionsCase {
  const stamp = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return { ...item, updates: [{ id: `${Date.now()}-${item.updates.length}`, date: stamp, title, message }, ...item.updates] };
}

function NoticeBoundary({ children }: { children: string }) {
  return <div className="notice admissions-boundary" role="note"><ShieldCheck aria-hidden="true" /><div><strong>Local demo · fictional sample information</strong>{children}</div></div>;
}

export function ApplicantAdmissionsPage() {
  const { data, updateCase, reset } = useAdmissionsDemo();
  const { announce, toast } = useNotice();
  const application = data.cases[applicantId];
  const [timeChoice, setTimeChoice] = useState('');
  const [responseDraft, setResponseDraft] = useState<'' | 'Accepted · sample' | 'Declined · sample'>('');
  const chosenTime = applicantTimes.find(([value]) => value === timeChoice)?.[1];
  const decision = application.decision;
  const fileReviewComplete = ['Interview', 'Decision', 'Offer response'].includes(application.stage) || Boolean(decision);
  const interviewComplete = ['Decision', 'Offer response'].includes(application.stage) || Boolean(decision);
  const currentStep = application.stage === 'Offer response' ? 5 : decision === 'Admit' ? 5 : decision ? 4 : application.stage === 'Interview' ? 3 : 2;
  const timeline = [
    { label: 'Application submitted', detail: 'Sample record · Feb 18, 2026', done: true },
    { label: 'File review', detail: application.stage === 'Incomplete file' ? 'A document is still listed as missing' : application.stage === 'Documents requested' ? 'Waiting on a requested document' : fileReviewComplete ? 'Review step recorded' : 'In progress', done: fileReviewComplete },
    { label: 'Interview', detail: application.interviewInvite ? `Invitation listed · ${application.interviewInvite}` : application.interviewDate ? `Your saved preference · ${application.interviewDate}` : chosenTime ? `Your selected time · ${chosenTime}` : 'No time saved yet', done: interviewComplete },
    { label: 'Decision', detail: decision ? `${decision} · sample decision` : 'Not recorded', done: Boolean(decision) },
    { label: 'Offer response', detail: application.applicantResponse ?? (decision === 'Admit' ? 'Response not recorded' : 'Only available after an offer'), done: Boolean(application.applicantResponse) },
  ];

  function saveInterview() {
    if (!timeChoice || !chosenTime) {
      announce('Choose a sample interview time first.');
      return;
    }
    updateCase(applicantId, (item) => ({ ...item, interviewDate: chosenTime, stage: item.decision ? item.stage : 'Interview' }));
    announce('Interview preference saved on this device only.');
  }
  function saveResponse() {
    if (!responseDraft || decision !== 'Admit') return;
    updateCase(applicantId, (item) => addUpdate({ ...item, applicantResponse: responseDraft, stage: 'Offer response' }, 'Applicant response · sample', `Nicolette recorded: ${responseDraft.replace(' · sample', '')}. This response is local to the demo.`));
    announce('Sample offer response saved locally.');
    setResponseDraft('');
  }
  function resetDemo() {
    reset();
    setTimeChoice('');
    setResponseDraft('');
    announce('Admissions demo restored to sample data.');
  }

  return <main className="main-content admissions-page">
    <PageHeading eyebrow="Applicant workspace · AY 2026–27" title={<>Your application, <span style={{ color: '#427260' }}>step by step.</span></>} subtitle="A personal view of the fictional Northfield application journey and the next milestone." action={<button className="btn btn-outline btn-small" type="button" onClick={resetDemo} data-testid="button-applicant-reset"><RotateCcw />Reset to sample data</button>} />
    <RoleContentsGuide role={applicantRole} heading="Your admissions workspace" />
    <NoticeBoundary>No file is uploaded here. Nothing is submitted; interview preferences, decisions, and offer responses are samples only. No appointment, admission decision, or enrollment occurs.</NoticeBoundary>
    <section className="applicant-profile panel" aria-label="Application summary" data-testid="status-applicant-application">
      <div className="applicant-profile-main">
        <div className="profile-eyebrow">Primary application <span>LOCAL SAMPLE</span></div>
        <div className="applicant-title-row"><div><h2>{application.name}</h2><p>{application.program} <span aria-hidden="true">·</span> First-year entry</p></div><StatusBadge value={decision ? `${decision} · sample` : application.stage} testId="status-applicant-stage" /></div>
        <div className="applicant-facts"><div><span>Application ID</span><strong>{application.id}</strong></div><div><span>Entry year</span><strong>AY 2026–27</strong></div><div><span>Application type</span><strong>First-year</strong></div></div>
      </div>
      <div className="applicant-seal" aria-hidden="true"><span>N</span><small>NORTHFIELD<br />ADMISSIONS</small></div>
    </section>

    <section className="panel panel-pad journey-panel" aria-labelledby="journey-heading">
      <div className="panel-header"><div><div className="panel-kicker">Application pathway</div><h2 id="journey-heading">From submission to your response</h2></div><span className="journey-count" data-testid="status-journey-progress">{String(currentStep).padStart(2, '0')} <span>/ 05 steps</span></span></div>
      <ol className="journey-list">{timeline.map((step, index) => <li key={step.label} className={step.done ? 'journey-done' : index === timeline.findIndex((item) => !item.done) ? 'journey-current' : ''} data-testid={`status-journey-${index + 1}`}>
        <span className="journey-marker" aria-hidden="true">{step.done ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span>
        <div className="journey-copy"><strong>{step.label}</strong><span>{step.detail}</span></div>
        <span className="journey-line" aria-hidden="true" />
      </li>)}</ol>
    </section>

    <div className="grid two-col admissions-columns">
      <section className="panel panel-pad" aria-labelledby="applicant-docs-heading">
        <div className="panel-header"><div><div className="panel-kicker">Application file · item by item</div><h2 id="applicant-docs-heading">Document checklist</h2></div><Badge tone={application.documents.every((doc) => doc.status.startsWith('Received')) ? 'green' : 'amber'}>{application.documents.filter((doc) => doc.status.startsWith('Received')).length} of {application.documents.length} listed</Badge></div>
        <div className="admissions-doc-list">{application.documents.map((doc, index) => <div className="admissions-doc-row" key={doc.name} data-testid={`status-applicant-document-${index}`}>
          <span className={`doc-check ${doc.status.startsWith('Received') ? 'complete' : ''}`} aria-hidden="true">{doc.status.startsWith('Received') ? <CheckCircle2 /> : <FileText />}</span>
          <div className="doc-details"><strong>{doc.name}</strong><small>{doc.note}</small></div><StatusBadge value={doc.status} testId={`status-doc-${index}`} />
        </div>)}</div>
        <p className="tagline-note">Checklist labels are fictional; they do not represent an upload, receipt, or verification.</p>
      </section>
      <div className="admissions-side-stack">
        <section className="panel panel-pad interview-card" aria-labelledby="interview-heading">
          <div className="panel-kicker"><CalendarDays size={13} /> Next step · interview</div><h2 id="interview-heading">Choose a sample time</h2>
          {application.interviewInvite && <div className="interview-invite" role="status" data-testid="status-officer-interview"><strong>Officer invitation · sample</strong><span>{application.interviewInvite}</span></div>}
          {application.interviewDate && <div className="interview-invite" role="status" data-testid="status-applicant-time-choice"><strong>Your saved preference</strong><span>{application.interviewDate}</span></div>}
          <label className="field-label" htmlFor="applicant-interview-time">Available sample times</label>
          <select id="applicant-interview-time" className="field" value={timeChoice} onChange={(event) => setTimeChoice(event.target.value)} data-testid="select-applicant-interview-time">
            <option value="">Choose a time</option>{applicantTimes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <button className="btn btn-primary" type="button" onClick={saveInterview} style={{ marginTop: 12, width: '100%' }} data-testid="button-save-interview"><CalendarDays />Save sample preference</button>
          <p className="tagline-note">This records a preference in local browser storage only. It does not book an appointment.</p>
        </section>
        <section className="panel panel-pad updates-card" aria-labelledby="updates-heading">
          <div className="panel-header"><div><div className="panel-kicker">Admissions desk</div><h2 id="updates-heading">Officer updates</h2></div><MessageSquareText size={18} color="#668675" /></div>
          {application.updates.length ? <div className="update-list">{application.updates.map((update) => <article className="officer-update" key={update.id} data-testid={`status-applicant-update-${update.id}`}><span className="update-date">{update.date}</span><strong>{update.title}</strong><p>{update.message}</p></article>)}</div> : <div className="empty-state admissions-empty"><MessageSquareText /><strong>No officer messages yet</strong><p>Any sample staff updates for this application will appear here.</p></div>}
        </section>
      </div>
    </div>

    {decision === 'Admit' && <section className="offer-card" aria-labelledby="offer-heading" data-testid="status-sample-offer">
      <div className="offer-mark"><CheckCircle2 /></div><div className="offer-copy"><div className="role-preview-overline">Offer response · sample only</div><h2 id="offer-heading">A sample admission offer is recorded</h2><p>No real admission is being offered. You can explore the local accept or decline response below.</p>{application.applicantResponse && <StatusBadge value={application.applicantResponse} testId="status-applicant-response" />}</div>
      {!application.applicantResponse && <div className="offer-actions"><label className="sr-only" htmlFor="sample-offer-response">Choose a sample offer response</label><select id="sample-offer-response" className="field" value={responseDraft} onChange={(event) => setResponseDraft(event.target.value as '' | 'Accepted · sample' | 'Declined · sample')} data-testid="select-offer-response"><option value="">Choose response</option><option value="Accepted · sample">Accept · sample</option><option value="Declined · sample">Decline · sample</option></select><button className="btn btn-primary" type="button" onClick={saveResponse} data-testid="button-save-offer-response">Save response</button></div>}
    </section>}
    {toast}
  </main>;
}

const recommendationOptions = ['Pending review', 'Recommend admit', 'Recommend waitlist', 'Recommend not admitted', 'Further review needed'] as const;
const reviewSchema = z.object({
  academicPreparation: z.number().int().min(1).max(5),
  portfolioFit: z.number().int().min(1).max(5),
  notes: z.string().max(600, 'Keep reviewer notes under 600 characters.'),
  recommendation: z.enum(recommendationOptions),
});
type ReviewValues = z.infer<typeof reviewSchema>;

function OfficerReviewForm({ application, saveReview }: { application: AdmissionsCase; saveReview: (values: ReviewValues) => void }) {
  const form = useForm<ReviewValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      academicPreparation: application.academicPreparation,
      portfolioFit: application.portfolioFit,
      notes: application.notes,
      recommendation: recommendationOptions.includes(application.recommendation as typeof recommendationOptions[number])
        ? application.recommendation as ReviewValues['recommendation']
        : 'Pending review',
    },
  });
  return <section className="panel panel-pad review-panel" aria-labelledby="rubric-heading">
    <div className="panel-header"><div><div className="panel-kicker">Evaluation · compact rubric</div><h2 id="rubric-heading">Review record</h2></div><ClipboardCheck size={19} color="#668675" /></div>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(saveReview)} noValidate>
        <div className="rubric-grid">
          <FormField control={form.control} name="academicPreparation" render={({ field }) => <FormItem className="rubric-control">
            <FormLabel>Academic preparation</FormLabel><FormDescription>Transcript readiness and prior coursework</FormDescription>
            <FormControl><select className="field" {...field} value={field.value} onChange={(event) => field.onChange(Number(event.target.value))} data-testid="select-academic-preparation">{[1, 2, 3, 4, 5].map((rating) => <option key={rating} value={rating}>{rating} · {['Limited', 'Developing', 'Meets', 'Strong', 'Exceptional'][rating - 1]}</option>)}</select></FormControl>
            <FormMessage />
          </FormItem>} />
          <FormField control={form.control} name="portfolioFit" render={({ field }) => <FormItem className="rubric-control">
            <FormLabel>Portfolio fit</FormLabel><FormDescription>Evidence of fit with Environmental Planning</FormDescription>
            <FormControl><select className="field" {...field} value={field.value} onChange={(event) => field.onChange(Number(event.target.value))} data-testid="select-portfolio-fit">{[1, 2, 3, 4, 5].map((rating) => <option key={rating} value={rating}>{rating} · {['Limited', 'Developing', 'Meets', 'Strong', 'Exceptional'][rating - 1]}</option>)}</select></FormControl>
            <FormMessage />
          </FormItem>} />
        </div>
        <FormField control={form.control} name="notes" render={({ field }) => <FormItem className="review-field">
          <FormLabel>Reviewer notes <span className="field-hint">Internal sample notes</span></FormLabel>
          <FormControl><textarea className="field review-notes" {...field} placeholder="Record concise evidence or follow-up context…" maxLength={600} data-testid="textarea-reviewer-notes" /></FormControl>
          <FormMessage />
        </FormItem>} />
        <FormField control={form.control} name="recommendation" render={({ field }) => <FormItem className="review-field">
          <FormLabel>Recommendation</FormLabel>
          <FormControl><select className="field" {...field} data-testid="select-review-recommendation">{recommendationOptions.map((option) => <option key={option}>{option}</option>)}</select></FormControl>
          <FormMessage />
        </FormItem>} />
        <div className="review-footer"><span>Scale: 1 = limited evidence · 5 = exceptional fit</span><button className="btn btn-primary" type="submit" data-testid="button-save-review"><Check />Save review</button></div>
      </form>
    </Form>
  </section>;
}

export function AdmissionsOfficerPage() {
  const { data, updateCase, reset } = useAdmissionsDemo();
  const { announce, toast } = useNotice();
  const ids = ['AP-26-0418', 'AP-26-0395', 'AP-26-0379'];
  const [selectedId, setSelectedId] = useState(ids[0]);
  const [requestTarget, setRequestTarget] = useState('');
  const [inviteDate, setInviteDate] = useState('');
  const selected = data.cases[selectedId];
  const cases = ids.map((id) => data.cases[id]);
  const outstandingDocuments = selected.documents.filter((doc) => !doc.status.startsWith('Received'));
  const pendingMissing = selected.documents.filter((doc) => doc.status === 'Not received');

  function requestDocument() {
    if (!requestTarget) {
      announce('Choose a missing document to request.');
      return;
    }
    updateCase(selectedId, (item) => addUpdate({
      ...item,
      documents: item.documents.map((doc) => doc.name === requestTarget
        ? { ...doc, status: 'Requested · sample', note: 'Sample request recorded locally; no upload has been received.' }
        : doc),
      stage: item.decision ? item.stage : 'Documents requested',
    }, 'Document requested · sample', `A sample request was recorded for: ${requestTarget}. No message was sent and no document was uploaded.`));
    setRequestTarget('');
    announce('Sample document request added locally.');
  }
  function inviteInterview() {
    if (!inviteDate) {
      announce('Choose a sample interview date first.');
      return;
    }
    const formatted = new Date(`${inviteDate}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    updateCase(selectedId, (item) => addUpdate({ ...item, interviewInvite: formatted, stage: item.decision ? item.stage : 'Interview' }, 'Interview invitation · sample', `A sample interview invitation is listed for ${formatted}. This is not a booked appointment.`));
    setInviteDate('');
    announce('Sample interview invitation saved locally.');
  }
  function saveReview(values: ReviewValues) {
    updateCase(selectedId, (item) => {
      const preservesCurrentStage = item.decision || ['Incomplete file', 'Documents requested', 'Interview'].includes(item.stage);
      return addUpdate({
        ...item, ...values, stage: preservesCurrentStage ? item.stage : 'File review',
      }, 'Review updated · sample', 'An admissions officer updated the local review record. No official evaluation was submitted.');
    });
    announce('Review saved to this browser’s sample data.');
  }
  function recordDecision(decision: Exclude<AdmissionsCase['decision'], null>) {
    updateCase(selectedId, (item) => addUpdate({ ...item, decision, stage: 'Decision', applicantResponse: null }, `Decision recorded · ${decision}`, `A sample “${decision}” decision was recorded for this demo. No real admission decision was made and no communication was sent.`));
    announce(`Sample decision recorded: ${decision}.`);
  }
  function resetDemo() {
    reset();
    setSelectedId(ids[0]);
    setRequestTarget('');
    setInviteDate('');
    announce('Admissions demo restored to sample data.');
  }

  return <main className="main-content admissions-page officer-page">
    <PageHeading eyebrow="Admissions office · AY 2026–27" title="Application review desk" subtitle="A focused sample queue for completeness checks, evaluation notes, and local decision previews." action={<button className="btn btn-outline btn-small" type="button" onClick={resetDemo} data-testid="button-officer-reset"><RotateCcw />Reset to sample data</button>} />
    <RoleContentsGuide role={officerRole} heading="Admissions review workspace" />
    <NoticeBoundary>All cases are fictional. Actions are stored in this browser only; no applicant communication is sent and no real admission decision is made.</NoticeBoundary>
    <section className="queue-panel panel panel-pad" aria-labelledby="queue-heading">
      <div className="panel-header"><div><div className="panel-kicker">Three sample cases · AY 2026–27</div><h2 id="queue-heading">Review queue</h2></div><Badge tone="amber">{cases.filter((item) => !item.decision).length} open sample cases</Badge></div>
      <div className="admissions-queue">{cases.map((item, index) => <button className={`admissions-queue-row ${selectedId === item.id ? 'selected' : ''}`} key={item.id} type="button" onClick={() => setSelectedId(item.id)} aria-pressed={selectedId === item.id} data-testid={`button-open-case-${item.id}`}>
        <span className="queue-index">0{index + 1}</span><span className="queue-person"><strong>{item.name}</strong><small>{item.id} <span aria-hidden="true">·</span> {item.program}</small></span><span className="queue-entry">{item.entry}</span><StatusBadge value={item.decision ? `${item.decision} · sample` : item.stage} testId={`status-queue-${item.id}`} />
      </button>)}</div>
      <div className="queue-scope">Only AP-26-0418 has an applicant-facing companion view. The other cases remain independent sample records.</div>
    </section>

    <section className="case-heading panel" aria-label={`${selected.name} selected application`} data-testid="status-selected-application">
      <div><div className="profile-eyebrow">Selected case <span>{selected.id}</span></div><h2>{selected.name}</h2><p>{selected.program} <span aria-hidden="true">·</span> {selected.entry}</p></div>
      <div className="case-heading-status"><span className="case-label">Current status</span><StatusBadge value={selected.decision ? `${selected.decision} · sample` : selected.stage} testId="status-selected-case-stage" /></div>
    </section>
    <div className="grid two-col officer-work-grid">
      <div className="officer-main-stack">
      <section className="panel panel-pad" aria-labelledby="case-documents-heading">
          <div className="panel-header"><div><div className="panel-kicker">File completeness</div><h2 id="case-documents-heading">Document checklist</h2></div><Badge tone={outstandingDocuments.length ? 'amber' : 'green'}>{outstandingDocuments.length ? `${outstandingDocuments.length} outstanding` : 'Listed complete'}</Badge></div>
          <div className="admissions-doc-list">{selected.documents.map((doc, index) => <div className="admissions-doc-row" key={doc.name} data-testid={`status-officer-document-${index}`}>
            <span className={`doc-check ${doc.status.startsWith('Received') ? 'complete' : ''}`} aria-hidden="true">{doc.status.startsWith('Received') ? <CheckCircle2 /> : <FileText />}</span><div className="doc-details"><strong>{doc.name}</strong><small>{doc.note}</small></div><StatusBadge value={doc.status} testId={`status-officer-doc-${index}`} />
          </div>)}</div>
          <div className="action-strip"><label className="field-label" htmlFor="request-document">Request a missing document</label><div className="inline-action"><select id="request-document" className="field" value={requestTarget} onChange={(event) => setRequestTarget(event.target.value)} data-testid="select-request-document"><option value="">Choose missing item</option>{pendingMissing.map((doc) => <option key={doc.name}>{doc.name}</option>)}</select><button className="btn btn-secondary" type="button" onClick={requestDocument} disabled={!pendingMissing.length} data-testid="button-request-document">Request sample</button></div><p className="tagline-note">Adds an applicant-visible update for AP-26-0418 only. No message is sent.</p></div>
        </section>
        <OfficerReviewForm key={selected.id} application={selected} saveReview={saveReview} />
      </div>
      <aside className="admissions-side-stack officer-side-stack">
        <section className="panel panel-pad" aria-labelledby="interview-invite-heading">
          <div className="panel-kicker"><CalendarDays size={13} /> Scheduling preview</div><h2 id="interview-invite-heading">Invite to an interview</h2>
          {selected.interviewInvite && <div className="interview-invite" data-testid="status-interview-invited"><strong>Sample invitation listed</strong><span>{selected.interviewInvite}</span></div>}
          <label className="field-label" htmlFor="officer-interview-date">Sample interview date</label><input id="officer-interview-date" className="field" type="date" value={inviteDate} onChange={(event) => setInviteDate(event.target.value)} data-testid="input-officer-interview-date" />
          <button className="btn btn-secondary full-button" type="button" onClick={inviteInterview} data-testid="button-invite-interview"><CalendarDays />Save sample invitation</button>
          <p className="tagline-note">Local status only; this does not contact the applicant or book a time.</p>
        </section>
        <section className="panel panel-pad decision-panel" aria-labelledby="decision-heading">
          <div className="panel-kicker">Outcome preview</div><h2 id="decision-heading">Record sample decision</h2>
          <p className="subtitle">A local label for walkthrough purposes only. No real decision or communication occurs.</p>
          <div className="decision-buttons">
            <button type="button" className={`decision-button ${selected.decision === 'Admit' ? 'chosen' : ''}`} onClick={() => recordDecision('Admit')} data-testid="button-decision-admit"><UserRoundCheck />Admit</button>
            <button type="button" className={`decision-button ${selected.decision === 'Waitlist' ? 'chosen' : ''}`} onClick={() => recordDecision('Waitlist')} data-testid="button-decision-waitlist"><ClipboardCheck />Waitlist</button>
            <button type="button" className={`decision-button ${selected.decision === 'Not admitted' ? 'chosen' : ''}`} onClick={() => recordDecision('Not admitted')} data-testid="button-decision-not-admitted"><FileText />Not admitted</button>
          </div>
          {selected.decision && <div className="decision-result" role="status" data-testid="status-recorded-decision"><CheckCircle2 /><span>Recorded locally: <strong>{selected.decision} · sample</strong></span></div>}
        </section>
        <section className="panel panel-pad case-updates" aria-labelledby="case-updates-heading">
          <div className="panel-header"><div><div className="panel-kicker">Case activity</div><h2 id="case-updates-heading">Updates & messages</h2></div></div>
          {selected.updates.length ? selected.updates.map((update) => <article className="officer-update compact" key={update.id} data-testid={`status-case-update-${update.id}`}><span className="update-date">{update.date}</span><strong>{update.title}</strong><p>{update.message}</p></article>) : <div className="empty-state admissions-empty"><MessageSquareText /><strong>No local activity yet</strong><p>Saved review and workflow actions will be listed here.</p></div>}
        </section>
      </aside>
    </div>
    {toast}
  </main>;
}