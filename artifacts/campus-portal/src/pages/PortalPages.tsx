import { useMemo, useState } from 'react';
import { ArrowDownRight, ArrowRight, Bell, CalendarDays, Check, CheckCircle2, CircleHelp, ClipboardList, FileCheck2, FileText, Flag, GraduationCap, Landmark, Search, ShieldCheck, TriangleAlert, Upload, Users, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { Badge, Modal, PageHeading, useNotice } from '../components/PortalUI';
import { courses, courseOptions, demoRoles, documents, grades, initialRequests, requirements, student, type Request } from '../data';

function toneFor(status: string) {
  if (/official|satisfied|complete|approved|enrolled/i.test(status)) return 'green' as const;
  if (/provisional|progress|queue|awaiting|open/i.test(status)) return 'amber' as const;
  if (/needed|review|remaining|waitlist|high/i.test(status)) return 'red' as const;
  return 'gray' as const;
}

export function LoginPage() {
  const [, setLocation] = useLocation();
  const [roleQuery, setRoleQuery] = useState('');
  const groups = Array.from(new Set(demoRoles.map((role) => role.group)));
  const normalizedQuery = roleQuery.trim().toLowerCase();
  const matchingRoles = demoRoles.filter((role) => `${role.name} ${role.group} ${role.summary}`.toLowerCase().includes(normalizedQuery));
  return <main className="login-page">
    <section className="login-story" aria-label="Northfield College introduction">
      <Link className="login-brand" href="/" aria-label="Northfield College Campus Portal"><span className="brand-mark">N</span><span><span className="brand-name">Northfield College</span><span className="brand-sub" style={{ display:'block' }}>Campus portal</span></span></Link>
      <div className="login-quote"><div className="login-overline">A clearer way through college</div><h1>Know where you are. <span>See what comes next.</span></h1><p>One welcoming place to understand academic plans, official records, and the steps between them.</p></div>
      <div className="login-orbit" aria-hidden="true"><Landmark /></div>
      <div className="login-story-foot">NORTHFIELD COLLEGE · STUDENT & REGISTRAR PORTAL</div>
    </section>
    <section className="login-main" aria-labelledby="login-heading">
      <div className="login-card">
        <div className="eyebrow">Campus portal · role preview</div>
        <h2 id="login-heading">Choose a demo workspace.</h2>
        <p className="subtitle">Explore role-specific screens built from fictional examples in the College Admission-to-TOR guide.</p>
        <div className="login-alert" role="note"><ShieldCheck /><div><strong style={{ display:'block', marginBottom:2 }}>Demo preview · sample data · not live.</strong>No account is authenticated. Choosing a role only opens its fictional workspace; it does not sign in or grant access to a real system.</div></div>
        <Link className="btn btn-primary login-continue" href="/" data-testid="button-continue-demo">Continue to demo workspace <ArrowRight /></Link>
        <p className="login-footnote" style={{ marginTop:8, marginBottom:18 }}>Opens the Student dashboard. Or choose any role preview below.</p>
        <label className="role-search-label" htmlFor="role-search">Find a role</label>
        <div className="role-search-wrap"><Search aria-hidden="true" /><input id="role-search" className="field" type="search" placeholder="Search roles or responsibilities…" value={roleQuery} onChange={(event) => setRoleQuery(event.target.value)} autoComplete="off" data-testid="input-role-search" /></div>
        <div className="role-groups">
          {groups.map((group) => {
            const roles = matchingRoles.filter((role) => role.group === group);
            if (!roles.length) return null;
            return <section className="role-group" key={group} aria-label={group}>
              <div className="role-group-heading">{group}<span>{roles.length.toString().padStart(2,'0')}</span></div>
              <div className="role-grid">{roles.map((role) => <button key={role.slug} type="button" className="role-option" onClick={() => setLocation(role.route)} aria-label={`Open ${role.name} demo preview`} data-testid={`button-role-${role.slug}`}><span className="role-option-copy"><strong>{role.name}</strong><small>{role.summary}</small></span><ArrowRight aria-hidden="true" /></button>)}</div>
            </section>;
          })}
          {matchingRoles.length === 0 && <div className="role-empty" role="status"><Search /><strong>No matching roles</strong><span>Try a role title or responsibility keyword.</span></div>}
        </div>
        <p className="login-footnote">All role previews are local interface samples using fictional data. Applicant, Student, Registrar, and staff views are distinct demo workspaces.</p>
      </div>
    </section>
  </main>;
}

function CurrentTerm() {
  return <div className="panel panel-pad"><div className="panel-kicker">Current term</div><div style={{ fontSize: 13, fontWeight: 700, color: '#304149' }}>Second Semester</div><div className="stat-foot">Academic year 2025–26 <span aria-hidden="true">·</span> Week 8 of 16</div></div>;
}

export function StudentDashboard() {
  const { announce, toast } = useNotice();
  return <main className="main-content">
    <PageHeading eyebrow="Tuesday, March 24, 2026 · Student home" title={<>Good morning, <span style={{ color: '#427260' }}>Mara.</span></>} subtitle="A clear view of what’s next in your semester." />
    <section className="hero-card" aria-label="Student profile summary">
      <div className="hero-top"><span className="hero-tag">Your academic snapshot</span><span className="hero-tag">LOCAL SAMPLE PROFILE</span></div>
      <div className="hero-name"><h2>{student.program}</h2><p>Keep your semester moving. Your progress and next steps are gathered here, with official records clearly labeled.</p><button className="btn btn-secondary btn-small" onClick={() => announce('Student profile details are shown in this local demo.')}>View student details <ArrowRight /></button></div>
      <div className="hero-symbol"><span>{student.studentId}</span><span>{student.yearLevel}</span><span>{student.standing}</span></div>
    </section>
    <div className="grid overview-grid section-space">
      <CurrentTerm />
      <div className="panel panel-pad"><div className="panel-kicker">Enrolled units</div><div className="stat-value">13 <span style={{ fontSize: 14, fontWeight: 500, color: '#8a908d' }}>/ 18</span></div><div className="stat-foot"><CalendarDays size={13} /> Active schedule this term</div></div>
      <div className="panel panel-pad"><div className="panel-kicker">Degree progress</div><div className="stat-value">68<span style={{ fontSize: 17 }}>%</span></div><div className="stat-foot"><ArrowDownRight size={13} /> 82 of 120 units completed</div></div>
    </div>
    <div className="grid two-col section-space">
      <section className="panel panel-pad">
        <div className="panel-header"><div><div className="panel-kicker">Your week · Tuesday</div><h2>Upcoming classes</h2></div><Link className="link" href="/student/enrollment">Full schedule →</Link></div>
        <div className="schedule-list">{courses.slice(0, 3).map((course, index) => <div className="schedule-row" key={course.code}><div className="schedule-time">{['9:00–10:30 AM', '1:00–3:00 PM', '11:00 AM–12:30 PM'][index]}<br />{index === 1 ? 'TTh' : 'MW'}</div><div className={`schedule-line ${index === 1 ? 'coral' : index === 2 ? 'gold' : ''}`} /><div><div className="course-title">{course.title}</div><div className="course-meta">{course.code} · {course.instructor}</div></div><div className="room">{course.room}</div></div>)}</div>
      </section>
      <div className="grid" style={{ gap: 16 }}>
        <section className="panel panel-pad"><div className="panel-header"><div><div className="panel-kicker">To keep in mind</div><h2>Next steps</h2></div><Bell size={17} color="#8c9b8f" /></div>
          <div className="alert-row"><div className="alert-icon"><FileCheck2 /></div><div><strong>Two documents need attention</strong><p>Health clearance and student photo are still outstanding.</p><Link className="link" href="/student/documents">Review checklist →</Link></div></div>
          <div className="alert-row"><div className="alert-icon" style={{ background: '#e7eee8', color: '#507661' }}><GraduationCap /></div><div><strong>Enrollment window is open</strong><p>Review your draft courses before submitting.</p><Link className="link" href="/student/enrollment">Plan your term →</Link></div></div>
        </section>
        <section className="panel panel-pad"><div className="panel-header"><div><div className="panel-kicker">Progress snapshot</div><h2>On your way</h2></div><Link className="link" href="/student/progress">Audit →</Link></div>
          <div className="progress-label"><strong>82 <span style={{ fontSize: 13, fontWeight: 500 }}>units</span></strong><span>of 120 required</span></div><div className="progress-track"><div className="progress-fill" style={{ width: '68%' }} /></div><p className="tagline-note">4 requirements in progress · 3 remaining</p>
        </section>
      </div>
    </div>
    <div className="notice section-space"><CircleHelp /><div><strong>About this portal preview</strong>Everything labeled demo uses local sample information. Your working plan is separate from official academic records.</div></div>
    {toast}
  </main>;
}

export function EnrollmentPage() {
  const { announce, toast } = useNotice();
  const [term, setTerm] = useState('Second Semester · AY 2025–26');
  const [selected, setSelected] = useState<string[]>(courses.map((course) => course.code));
  const [step, setStep] = useState(0);
  const [modal, setModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const chosen = courseOptions.filter((course) => selected.includes(course.code));
  const conflicts = useMemo(() => {
    const checks: [string, string, string][] = [
      ['ENPL 321', 'ENPL 350', 'MW · overlapping morning studio'],
      ['ENPL 314', 'GE 226', 'TTh · overlapping afternoon block'],
    ];
    return checks.filter(([a, b]) => selected.includes(a) && selected.includes(b));
  }, [selected]);
  const units = chosen.reduce((sum, course) => sum + course.units, 0);
  function toggle(code: string) {
    setSubmitted(false);
    setSelected((current) => current.includes(code) ? current.filter((item) => item !== code) : [...current, code]);
  }
  function apply() {
    setModal(false);
    setSubmitted(true);
    setStep(0);
    announce('Your sample enrollment plan was confirmed on this device.');
  }
  return <main className="main-content">
    <PageHeading eyebrow="Student workspace · Planning" title="Plan your enrollment" subtitle="Build a working schedule, then review the demo conflicts and capacity notes before confirming." action={<span className="demo-tag"><span className="demo-dot" />WORKING PLAN</span>} />
    <div className="notice" style={{ marginBottom: 21 }}><CircleHelp /><div><strong>This is a planning preview, not an official registration.</strong>Changes stay in this browser session. Confirmation only updates the sample schedule shown here.</div></div>
    <div className="stepper" aria-label="Enrollment steps">
      <div className={`step-item ${step === 0 ? 'current' : 'done'}`}><span className="step-num">{step > 0 ? <Check size={13} /> : '01'}</span>Select courses</div><div className="step-connector" /><div className={`step-item ${step === 1 ? 'current' : ''}`}><span className="step-num">02</span>Review plan</div>
    </div>
    <div className="grid two-col">
      <section className="panel panel-pad">
        <div className="panel-header"><div><div className="panel-kicker">Choose your term</div><h2>Available courses</h2></div><Badge tone="green">{units} units selected</Badge></div>
        <label className="field-label" htmlFor="term-select">Academic term</label>
        <select className="field" id="term-select" value={term} onChange={(event) => { setTerm(event.target.value); setSubmitted(false); }} data-testid="select-enrollment-term">
          <option>Second Semester · AY 2025–26</option><option>Summer Term · AY 2025–26</option><option>First Semester · AY 2026–27</option>
        </select>
        <div className="section-space">{courseOptions.map((course) => {
          const active = selected.includes(course.code);
          const conflict = conflicts.some(([a,b]) => (a === course.code && selected.includes(b)) || (b === course.code && selected.includes(a)));
          return <label key={course.code} className={`course-option toggle-card ${active ? 'selected' : ''}`} htmlFor={`course-${course.code}`}>
            <input id={`course-${course.code}`} className="check" type="checkbox" checked={active} onChange={() => toggle(course.code)} aria-label={`${active ? 'Remove' : 'Add'} ${course.code}: ${course.title}`} data-testid={`input-course-${course.code.toLowerCase().replaceAll(' ', '-')}`} />
            <div><div className="course-code">{course.code} · {course.units} units {conflict && <span style={{ color: '#a65543' }}>· schedule conflict</span>}</div><h3>{course.title}</h3><p>{course.instructor} · {course.schedule} · {course.room}</p></div>
            <div className="course-side"><Badge tone={toneFor(course.status)}>{course.status}</Badge></div>
          </label>;
        })}</div>
        {conflicts.length > 0 && <div className="notice" role="status"><TriangleAlert /><div><strong>Schedule overlap in this demo plan</strong>{conflicts.map(([a,b,detail]) => <div key={a + b}>{a} and {b}: {detail}.</div>)}</div></div>}
        <div style={{ display:'flex', justifyContent:'space-between', gap:10, alignItems:'center', marginTop:18 }}><span className="tagline-note" style={{ margin:0 }}>Unit guide: 12–18 units</span><button className="btn btn-primary" onClick={() => setStep(1)} data-testid="button-review-plan">Review plan <ArrowRight /></button></div>
      </section>
      <aside className="panel panel-pad">
        <div className="panel-kicker">Plan summary</div><h2>{term.split(' · ')[0]}</h2><p className="subtitle" style={{ marginTop:7 }}>Your selected sections are a working plan until you confirm this demo.</p>
        <div className="progress-label"><strong>{units}</strong><span>units in plan</span></div><div className="progress-track"><div className="progress-fill" style={{ width: `${Math.min(100, units/18*100)}%` }} /></div>
        <div style={{ marginTop:20 }}>
          <div className="detail-row"><span>Selected courses</span><strong>{chosen.length}</strong></div><div className="detail-row"><span>Schedule overlaps</span><strong style={{ color: conflicts.length ? '#a65543' : '#43715a' }}>{conflicts.length ? `${conflicts.length} to review` : 'None found'}</strong></div><div className="detail-row"><span>Capacity notes</span><strong>{chosen.filter((item) => item.status.startsWith('Waitlist')).length ? 'Waitlist section' : 'No waitlist sections'}</strong></div>
        </div>
        {submitted && <div className="notice section-space" role="status"><CheckCircle2 /><div><strong>Sample plan confirmed</strong>Your updated choices are saved in this local page state only.</div></div>}
        {step === 1 && <div className="section-space"><div className="notice"><TriangleAlert /><div><strong>Before you confirm</strong>Check any listed schedule overlap and waitlist section. This action will update only the on-screen demo plan.</div></div><button className="btn btn-primary" style={{ width:'100%', marginTop:13 }} onClick={() => setModal(true)} data-testid="button-confirm-enrollment"><Check /> Confirm sample plan</button></div>}
      </aside>
    </div>
    {modal && <Modal title="Confirm your working plan?" subtitle="This will update the sample schedule on this device. It is not official course registration." onClose={() => setModal(false)} footer={<><button className="btn btn-outline" onClick={() => setModal(false)}>Go back</button><button className="btn btn-primary" onClick={apply}>Confirm demo plan</button></>}>
      <div className="detail-row"><span>Term</span><strong>{term}</strong></div><div className="detail-row"><span>Selected sections</span><strong>{chosen.length} courses · {units} units</strong></div>{conflicts.length > 0 && <p className="tagline-note" style={{ color:'#a65543' }}>There are {conflicts.length} schedule overlap(s) in this sample plan.</p>}
    </Modal>}
    {toast}
  </main>;
}

export function GradesPage() {
  const [term, setTerm] = useState('All terms');
  const filtered = grades.filter((grade) => term === 'All terms' || grade.term === term);
  const terms = ['All terms', ...Array.from(new Set(grades.map((grade) => grade.term)))];
  return <main className="main-content">
    <PageHeading eyebrow="Student workspace · Academic record" title="Grades" subtitle="Read-only grade history with authoritative and in-progress results clearly separated." />
    <div className="notice" style={{ marginBottom:20 }}><ShieldCheck /><div><strong>Official records are read-only.</strong>Only results labeled “Official” are part of the authoritative record. Provisional values are not final grades.</div></div>
    <section className="panel panel-pad">
      <div className="panel-header"><div><div className="panel-kicker">Academic history · local sample</div><h2>Term grades</h2></div><label><span className="field-label" style={{ display:'inline-block', marginRight:8 }}>Show</span><select className="field" style={{ width:'auto', display:'inline-block' }} value={term} onChange={(event) => setTerm(event.target.value)} data-testid="select-grade-term">{terms.map((item) => <option key={item}>{item}</option>)}</select></label></div>
      <div className="table-wrap"><table className="data-table"><thead><tr><th>Course</th><th>Term</th><th>Grade</th><th>Record status</th></tr></thead><tbody>{filtered.map((grade) => <tr key={grade.courseCode}><td><strong>{grade.courseCode.split(' · ')[0]}</strong><small>{grade.courseCode.split(' · ')[1]}</small></td><td>{grade.term}</td><td><strong>{grade.value}</strong></td><td><Badge tone={toneFor(grade.status)}>{grade.status}</Badge></td></tr>)}</tbody></table></div>
      <div className="mobile-card-list">{filtered.map((grade) => <div className="mobile-record" key={grade.courseCode}><div className="mobile-record-top"><strong>{grade.courseCode}</strong><Badge tone={toneFor(grade.status)}>{grade.status}</Badge></div><p>{grade.term}</p><div className="mobile-record-foot"><span>Recorded grade</span><strong>{grade.value}</strong></div></div>)}</div>
      {filtered.length === 0 && <div className="empty-state"><FileText /><strong>No grades for this term</strong><p>Choose another academic term to see sample results.</p></div>}
      <p className="tagline-note">Sample grade scale: 1.00 is highest · 3.00 is passing. Provisional entries are illustrative, not final.</p>
    </section>
    <div className="grid" style={{ gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))', marginTop:17 }}>
      <div className="panel panel-pad"><div className="panel-kicker">Term average · sample</div><div className="stat-value">1.50</div><div className="stat-foot">Based on official results shown</div></div>
      <div className="panel panel-pad"><div className="panel-kicker">Current coursework</div><div className="stat-value">1 <span style={{ fontSize:14,fontWeight:500 }}>provisional</span></div><div className="stat-foot">Not included in official average</div></div>
    </div>
  </main>;
}

export function ProgressPage() {
  const [filter, setFilter] = useState('All requirements');
  const filtered = requirements.filter((item) => filter === 'All requirements' || item.status === filter);
  const done = requirements.filter((item) => item.status === 'Satisfied').reduce((sum,item) => sum + item.units, 0);
  return <main className="main-content">
    <PageHeading eyebrow="Student workspace · Degree audit" title="Your degree progress" subtitle="A planning view of curriculum requirements. Confirm official completion with the Registrar." action={<span className="demo-tag"><span className="demo-dot" />AUDIT PREVIEW</span>} />
    <div className="grid" style={{ gridTemplateColumns:'minmax(0,1.4fr) minmax(220px,.65fr)', gap:17, marginBottom:18 }}>
      <section className="panel panel-pad"><div className="panel-kicker">{student.program} · {student.curriculumVersion}</div><div className="progress-label"><strong>82 <span style={{ fontSize:14,fontWeight:500 }}>units completed</span></strong><span>of 120 required</span></div><div className="progress-track"><div className="progress-fill" style={{ width:'68%' }} /></div><div className="detail-row" style={{ marginTop:14 }}><span>Completed requirements</span><strong>{done} units listed as satisfied</strong></div><p className="tagline-note">Totals are illustrative; this preview does not replace an official graduation evaluation.</p></section>
      <div className="queue-stat"><span>Curriculum status</span><strong style={{ fontSize:17 }}>On track</strong><div style={{ marginTop:9 }}><Badge tone="green">No holds in sample</Badge></div></div>
    </div>
    <section className="panel panel-pad">
      <div className="panel-header"><div><div className="panel-kicker">Requirements by curriculum area</div><h2>Requirement audit</h2></div><select className="field" style={{ width:'auto' }} value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter requirements" data-testid="select-requirement-status">{['All requirements','Satisfied','In progress','Remaining'].map((item) => <option key={item}>{item}</option>)}</select></div>
      {filtered.map((item) => <div className="requirement-row" key={item.title}><div><strong>{item.title}</strong><small>{item.category}</small></div><span className="units">{item.units} units</span><Badge tone={toneFor(item.status)}>{item.status}</Badge></div>)}
      {filtered.length === 0 && <div className="empty-state"><GraduationCap /><strong>No requirements in this group</strong><p>Choose a different filter.</p></div>}
    </section>
    <div className="notice section-space"><CircleHelp /><div><strong>Reading your audit</strong>“Satisfied” reflects sample completed work. “In progress” is current coursework. Remaining items are curriculum planning notes, not a graduation clearance.</div></div>
  </main>;
}

export function DocumentsPage() {
  const { announce, toast } = useNotice();
  const [complete, setComplete] = useState<string[]>(documents.filter((item) => item.status === 'Complete').map((item) => item.name));
  const [modal, setModal] = useState('');
  const [draftRequests, setDraftRequests] = useState<{ type:string; ref:string }[]>([]);
  const [target, setTarget] = useState('');
  function request(type: string) { setModal(type); }
  function confirm() {
    if (modal === 'provide' && target && !complete.includes(target)) setComplete((list) => [...list, target]);
    else if (modal !== 'provide') setDraftRequests((list) => [...list, { type:modal, ref:`DEMO-${String(list.length + 221).padStart(4,'0')}` }]);
    announce(modal === 'provide' ? 'Checklist updated in this local demo.' : `${modal} request added to the local sample list.`);
    setModal('');
  }
  return <main className="main-content">
    <PageHeading eyebrow="Student workspace · Records & requests" title="Documents & credentials" subtitle="Track the sample checklist and prepare a credential request." />
    <div className="notice" style={{ marginBottom:20 }}><CircleHelp /><div><strong>Sample document statuses only.</strong>Request actions create a local preview entry; nothing is sent to a school or records office.</div></div>
    <div className="grid two-col">
      <section className="panel panel-pad"><div className="panel-header"><div><div className="panel-kicker">Student file checklist</div><h2>Supporting documents</h2></div><Badge tone="amber">{documents.length - complete.length} to do</Badge></div>
        {documents.map((doc) => { const done = complete.includes(doc.name); return <div className="document-item" key={doc.name}><div className="document-icon">{done ? <CheckCircle2 /> : <FileText />}</div><div className="document-copy"><strong>{doc.name}</strong><p>{done ? doc.note : doc.note}</p></div>{done ? <Badge tone="green">Complete</Badge> : <button className="btn btn-outline btn-small" onClick={() => { setTarget(doc.name); setModal('provide'); }} data-testid={`button-update-${doc.name.toLowerCase().replaceAll(/[^a-z0-9]+/g,'-')}`}><Upload /> Mark provided</button>}</div>; })}
        <p className="tagline-note">Marking a document provided is a visual checklist action, not an upload or verification.</p>
      </section>
      <aside>
        <section className="panel panel-pad"><div className="panel-kicker">Credential services</div><h2>Request an official copy</h2><p className="subtitle" style={{ marginTop:8 }}>Select a service to create a local request preview. Processing details below are sample states only.</p>
          <button className="quick-link" style={{ width:'100%', background:'none', border:0, textAlign:'left', cursor:'pointer' }} onClick={() => request('Transcript of records')} data-testid="button-request-transcript"><span><FileText size={15} style={{ verticalAlign:'middle', marginRight:9 }} />Transcript of records</span><ArrowRight /></button>
          <button className="quick-link" style={{ width:'100%', background:'none', border:0, textAlign:'left', cursor:'pointer' }} onClick={() => request('Certificate of enrollment')} data-testid="button-request-certificate"><span><GraduationCap size={15} style={{ verticalAlign:'middle', marginRight:9 }} />Certificate of enrollment</span><ArrowRight /></button>
          <div className="section-space"><div className="panel-kicker">Sample turnaround</div><div className="detail-row"><span>Preparation</span><strong>3–5 working days</strong></div><div className="detail-row"><span>Delivery</span><strong>Pickup at records office</strong></div><p className="tagline-note">Illustrative information, not a service guarantee.</p></div>
        </section>
        <section className="panel panel-pad section-space"><div className="panel-header"><div><div className="panel-kicker">Request tracker</div><h2>Your requests</h2></div><Badge tone={draftRequests.length ? 'green' : 'gray'}>{draftRequests.length} demo</Badge></div>
          {draftRequests.length === 0 ? <div className="empty-state" style={{ padding: '20px 8px' }}><FileCheck2 /><strong>No sample requests yet</strong><p>Choose a credential service above.</p></div> : draftRequests.map((item) => <div className="request-card" key={item.ref}><div className="request-header"><div><div className="request-number">{item.ref}</div><strong style={{ display:'block', fontSize:12, marginTop:5 }}>{item.type}</strong></div><Badge tone="amber">Draft preview</Badge></div><ul className="timeline"><li>Created locally · Just now</li><li>Next step · Review service instructions</li></ul></div>)}
        </section>
      </aside>
    </div>
    {modal && <Modal title={modal === 'provide' ? 'Update checklist?' : `Prepare ${modal.toLowerCase()} request?`} subtitle={modal === 'provide' ? 'This marks a sample checklist item as provided on this device.' : 'This creates a local request preview only. It does not transmit or submit a request.'} onClose={() => setModal('')} footer={<><button className="btn btn-outline" onClick={() => setModal('')}>Cancel</button><button className="btn btn-primary" onClick={confirm}>{modal === 'provide' ? 'Update sample checklist' : 'Create preview'}</button></>}>{modal === 'provide' && <div className="notice"><FileCheck2 /><div><strong>{target}</strong>Document receipt and verification are not represented by this action.</div></div>}</Modal>}
    {toast}
  </main>;
}

export function RegistrarDashboard() {
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [filter, setFilter] = useState('All work');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Request | null>(null);
  const [confirmStatus, setConfirmStatus] = useState('');
  const { announce, toast } = useNotice();
  const filtered = requests.filter((item) => {
    const category = filter === 'All work' || item.type.toLowerCase().includes(filter.toLowerCase().replace('grade approvals','grade approval').replace('graduation checks','graduation check').replace('tor requests','transcript'));
    const query = `${item.reference} ${item.studentName} ${item.type} ${item.status}`.toLowerCase().includes(search.toLowerCase());
    return category && query;
  });
  const counts = [
    { label:'Admissions', count:requests.filter((r) => r.type.startsWith('Admissions')).length, icon:Users },
    { label:'Grade approvals', count:requests.filter((r) => r.type.startsWith('Grade approval')).length, icon:ClipboardList },
    { label:'Graduation checks', count:requests.filter((r) => r.type.startsWith('Graduation')).length, icon:GraduationCap },
    { label:'TOR requests', count:requests.filter((r) => r.type.startsWith('Transcript')).length, icon:FileText },
  ];
  function applyStatus() {
    if (!selected) return;
    setRequests((list) => list.map((row) => row.reference === selected.reference ? { ...row, status:confirmStatus === 'Approved' ? 'Approved · demo' : confirmStatus === 'Completed' ? 'Completed · demo' : 'Returned for follow-up' } : row));
    setSelected(null);
    announce(`Sample item marked ${confirmStatus.toLowerCase()}.`);
  }
  return <main className="main-content">
    <PageHeading eyebrow="Registrar office · Staff sample view" title="Review queue" subtitle="Triage academic record work with clear sample statuses. No actions are sent to a live system." action={<span className="demo-tag"><span className="demo-dot" />STAFF DEMO</span>} />
    <div className="notice" style={{ marginBottom:18 }}><CircleHelp /><div><strong>Local prototype queue.</strong>Opening, filtering, and reviewing rows works in this browser. Approve or return actions update only the sample list.</div></div>
    <div className="grid queue-stats" style={{ gridTemplateColumns:'repeat(4,1fr)', gap:11, marginBottom:19 }}>{counts.map(({label,count,icon:Icon}) => <div className="queue-stat" key={label}><div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}><span>{label}</span><Icon size={16} color="#678b78" /></div><strong>{count}</strong></div>)}</div>
    <section className="panel panel-pad">
      <div className="panel-header"><div><div className="panel-kicker">Incoming work · local sample records</div><h2>Requests and reviews</h2></div><Badge tone="amber">{filtered.length} in view</Badge></div>
      <div className="filter-row"><div style={{ position:'relative', flex:'1 1 230px' }}><Search size={15} style={{ position:'absolute',left:11,top:11,color:'#8a928e' }} /><input className="field" style={{ paddingLeft:34 }} type="search" placeholder="Search name, type, reference…" value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search queue" data-testid="input-queue-search" /></div><select className="field" value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter work type" data-testid="select-queue-filter">{['All work','Admissions','Grade approvals','Graduation checks','TOR requests'].map((item) => <option key={item}>{item}</option>)}</select><button className="btn btn-outline btn-small" onClick={() => { setSearch(''); setFilter('All work'); }} data-testid="button-clear-filters"><X /> Clear</button></div>
      <div className="table-wrap"><table className="data-table"><thead><tr><th>Reference / Student</th><th>Work type</th><th>Received</th><th>Priority</th><th>Status</th><th>Review</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.reference} className="staff-row" onClick={() => setSelected(item)} tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter') setSelected(item); }} data-testid={`row-request-${item.reference.toLowerCase()}`}><td><strong>{item.reference}</strong><small>{item.studentName}</small></td><td>{item.type}</td><td>{item.submittedAt}</td><td><Badge tone={toneFor(item.priority)}>{item.priority}</Badge></td><td><Badge tone={toneFor(item.status)}>{item.status}</Badge></td><td><button className="btn btn-outline btn-small" onClick={(event) => { event.stopPropagation(); setSelected(item); }} aria-label={`Review ${item.reference}`} data-testid={`button-review-${item.reference.toLowerCase()}`}>Review <ArrowRight /></button></td></tr>)}</tbody></table></div>
      <div className="mobile-card-list">{filtered.map((item) => <div className="mobile-record" key={item.reference}><div className="mobile-record-top"><strong>{item.type}</strong><Badge tone={toneFor(item.priority)}>{item.priority}</Badge></div><p>{item.reference} · {item.studentName}<br />Received {item.submittedAt}</p><div className="mobile-record-foot"><Badge tone={toneFor(item.status)}>{item.status}</Badge><button className="btn btn-outline btn-small" onClick={() => setSelected(item)} data-testid={`mobile-review-${item.reference.toLowerCase()}`}>Review <ArrowRight /></button></div></div>)}</div>
      {filtered.length === 0 && <div className="empty-state"><Search /><strong>No matching queue items</strong><p>Adjust the filters or search for another sample record.</p><button className="btn btn-secondary btn-small" style={{ marginTop:12 }} onClick={() => { setSearch(''); setFilter('All work'); }}>Reset filters</button></div>}
      <p className="tagline-note">Sample student names, request references, and timestamps are fictional.</p>
    </section>
    {selected && <Modal title="Review sample request" subtitle={`${selected.reference} · ${selected.submittedAt}`} onClose={() => setSelected(null)}>
      <div className="detail-row"><span>Student</span><strong>{selected.studentName}</strong></div><div className="detail-row"><span>Request type</span><strong>{selected.type}</strong></div><div className="detail-row"><span>Current status</span><Badge tone={toneFor(selected.status)}>{selected.status}</Badge></div><div className="detail-row"><span>Priority</span><Badge tone={toneFor(selected.priority)}>{selected.priority}</Badge></div>
      <div className="notice section-space"><Flag /><div><strong>Review checklist · illustrative</strong>Verify supporting records, student identity, and applicable policy in your official workflow. These details are not connected here.</div></div>
      <div className="modal-actions" style={{ justifyContent:'space-between' }}><button className="btn btn-outline" onClick={() => setSelected(null)}>Close</button><div style={{ display:'flex',gap:8 }}><button className="btn btn-secondary" onClick={() => setConfirmStatus('Returned')}>Return</button><button className="btn btn-primary" onClick={() => setConfirmStatus(selected.type.startsWith('Transcript') || selected.type.startsWith('Graduation') ? 'Completed' : 'Approved')}>Mark reviewed</button></div></div>
    </Modal>}
    {confirmStatus && selected && <Modal title={`${confirmStatus} this sample item?`} subtitle="This is a consequential staff action in the demo queue and only changes local sample data." onClose={() => setConfirmStatus('')} footer={<><button className="btn btn-outline" onClick={() => setConfirmStatus('')}>Cancel</button><button className="btn btn-primary" onClick={applyStatus}>Confirm {confirmStatus.toLowerCase()}</button></>}><div className="notice"><TriangleAlert /><div><strong>{selected.reference} · {selected.studentName}</strong>The displayed status will be updated in this browser session only.</div></div></Modal>}
    {toast}
  </main>;
}

export { EnhancedWorkspace as RoleWorkspacePage } from '../components/EnhancedWorkspace';
