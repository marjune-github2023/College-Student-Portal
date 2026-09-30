import { useState } from 'react';
import { ArrowRight, Bell, CalendarDays, Check, CheckCircle2, CircleHelp, ClipboardList, FileCheck2, FileText, GraduationCap, ShieldCheck, TriangleAlert, Upload, X } from 'lucide-react';
import { Link } from 'wouter';
import { Badge, Modal, PageHeading, useNotice } from '../../components/PortalUI';
import { workspacePreviews, type WorkspaceItem } from '../../data';

const wp = (slug: string) => workspacePreviews.find((p) => p.slug === slug)!;

/* ── Applicant ─────────────────────────────────────────────── */

export function ApplicantDashboard() {
  const data = wp('applicant');
  const { announce, toast } = useNotice();
  const [activeItem, setActiveItem] = useState<WorkspaceItem | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  function confirmAction() {
    if (!activeItem) return;
    announce('Sample checklist step previewed. No live application was changed.');
    setActiveItem(null);
    setConfirmed(false);
  }

  const completed = data.items.filter((i) => i.status.includes('complete') || i.status.includes('Sample complete'));
  const inReview = data.items.filter((i) => i.status.includes('review') || i.status.includes('Needs'));
  const upcoming = data.items.filter((i) => i.status.includes('Upcoming'));

  return <main className="main-content">
    <PageHeading eyebrow={`${data.unit} · DEMO PREVIEW`} title={data.heading} subtitle={data.intro} action={<Link className="btn btn-outline btn-small" href="/login" data-testid="button-return-role-selector">Switch demo role <ArrowRight /></Link>} />

    <section className="hero-card" aria-label="Applicant profile summary">
      <div className="hero-top"><span className="hero-tag">Your application snapshot</span><span className="hero-tag">LOCAL SAMPLE PROFILE</span></div>
      <div className="hero-name"><h2>B.S. Environmental Planning · AY 2026–27</h2><p>Track your admissions milestones from submission to decision. Each step below is a fictional sample — nothing is submitted to the College.</p><button className="btn btn-secondary btn-small" onClick={() => announce('Applicant profile details are shown in this local demo.')}>View application details <ArrowRight /></button></div>
      <div className="hero-symbol"><span>AP-26-0418</span><span>First semester entry</span><span>In review</span></div>
    </section>

    <div className="grid overview-grid section-space">
      {data.metrics.map((m) => <div className="panel panel-pad" key={m.label}><div className="panel-kicker">{m.label}</div><div className="stat-value">{m.value}</div><div className="stat-foot">{m.note}</div></div>)}
    </div>

    <div className="grid two-col section-space">
      <section className="panel panel-pad">
        <div className="panel-header"><div><div className="panel-kicker">Admissions milestones</div><h2>Application checklist</h2></div><Badge tone="amber">{inReview.length + upcoming.length} pending</Badge></div>
        <div className="role-work-list">
          {data.items.map((item) => <article className="role-work-item" key={item.reference}>
            <div className="role-work-ref">{item.reference}</div>
            <div className="role-work-copy">
              <div className="role-work-title-row"><h3>{item.title}</h3><Badge tone={item.status.includes('complete') ? 'green' : item.status.includes('review') || item.status.includes('Needs') ? 'amber' : 'gray'}>{item.status}</Badge></div>
              <p>{item.detail}</p>
            </div>
            <button className="btn btn-outline btn-small role-work-action" onClick={() => { setActiveItem(item); setConfirmed(false); }} data-testid={`button-preview-${item.reference.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>{item.action}<ArrowRight /></button>
          </article>)}
        </div>
      </section>
      <aside className="grid" style={{ gap: 16 }}>
        <section className="panel panel-pad">
          <div className="panel-header"><div><div className="panel-kicker">To keep in mind</div><h2>Next steps</h2></div><Bell size={17} color="#8c9b8f" /></div>
          <div className="alert-row"><div className="alert-icon"><FileCheck2 /></div><div><strong>Portfolio under review</strong><p>Architecture & Planning track · panel feedback expected by Apr 03.</p></div></div>
          <div className="alert-row"><div className="alert-icon" style={{ background: '#e7eee8', color: '#507661' }}><GraduationCap /></div><div><strong>Interview window opens soon</strong><p>Choose a preferred sample time before Apr 03.</p></div></div>
        </section>
        <section className="panel panel-pad">
          <div className="panel-kicker">Application progress</div><h2>Checklist at a glance</h2>
          <div className="progress-label"><strong>{completed.length} <span style={{ fontSize: 13, fontWeight: 500 }}>of {data.items.length} steps</span></strong><span>sample milestones</span></div>
          <div className="progress-track"><div className="progress-fill" style={{ width: `${(completed.length / data.items.length) * 100}%` }} /></div>
          <div className="detail-row" style={{ marginTop: 14 }}><span>Completed</span><strong>{completed.length}</strong></div>
          <div className="detail-row"><span>In review</span><strong>{inReview.length}</strong></div>
          <div className="detail-row"><span>Upcoming</span><strong>{upcoming.length}</strong></div>
        </section>
        <div className="role-demo-stamp"><span className="demo-dot" /> Demo preview · sample data · not live · no account authenticated</div>
      </aside>
    </div>

    <div className="notice section-space"><CircleHelp /><div><strong>About this applicant preview</strong>{data.boundary}</div></div>

    {activeItem && <Modal title={activeItem.action} subtitle={`${activeItem.reference} · ${activeItem.title}`} onClose={() => setActiveItem(null)} footer={confirmed ? <><button className="btn btn-outline" onClick={() => setConfirmed(false)}>Go back</button><button className="btn btn-primary" onClick={confirmAction}>Confirm demo action</button></> : <><button className="btn btn-outline" onClick={() => setActiveItem(null)}>Close preview</button><button className="btn btn-primary" onClick={() => setConfirmed(true)} data-testid="button-confirm-role-preview">Preview action</button></>}>
      <div className="detail-row"><span>Current sample status</span><Badge tone={activeItem.status.includes('complete') ? 'green' : 'amber'}>{activeItem.status}</Badge></div>
      <div className="detail-row"><span>Priority</span><Badge tone={activeItem.priority === 'High' ? 'red' : 'amber'}>{activeItem.priority}</Badge></div>
      <div className="detail-row"><span>Reference</span><strong>{activeItem.reference}</strong></div>
      <div className="detail-row"><span>Detail</span><strong>{activeItem.detail}</strong></div>
      <ul className="timeline" style={{ marginTop: 14 }}>
        <li>Created in sample workspace</li>
        <li>Current status · {activeItem.status}</li>
        <li>Next step · {confirmed ? 'Confirm to mark as previewed' : 'Preview the action to continue'}</li>
      </ul>
      <div className="notice section-space"><CircleHelp /><div><strong>Local interface preview only</strong>This action will only update the status shown in this sample workspace. It will not contact the College or change an official application.</div></div>
      {confirmed && <div className="modal-confirm-line" role="status">Confirm this sample-only action? The milestone will be labeled "Previewed locally".</div>}
    </Modal>}
    {toast}
  </main>;
}

/* ── Instructor ────────────────────────────────────────────── */

export function InstructorDashboard() {
  const data = wp('instructor');
  const { announce, toast } = useNotice();
  const [activeItem, setActiveItem] = useState<WorkspaceItem | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  function confirmAction() {
    if (!activeItem) return;
    announce('Sample section action previewed. No grades were posted.');
    setActiveItem(null);
    setConfirmed(false);
  }

  const draftReady = data.items.filter((i) => i.status.includes('Draft'));
  const needsReview = data.items.filter((i) => i.status.includes('review') || i.status.includes('Needs'));

  return <main className="main-content">
    <PageHeading eyebrow={`${data.unit} · DEMO PREVIEW`} title={data.heading} subtitle={data.intro} action={<Link className="btn btn-outline btn-small" href="/login">Switch demo role <ArrowRight /></Link>} />

    <section className="hero-card" aria-label="Instructor profile summary">
      <div className="hero-top"><span className="hero-tag">Your teaching snapshot</span><span className="hero-tag">LOCAL SAMPLE PROFILE</span></div>
      <div className="hero-name"><h2>Second Semester · AY 2025–26</h2><p>Manage your teaching sections, review roster changes, and prepare grade drafts. All actions are local previews — no grades are posted from this interface.</p><button className="btn btn-secondary btn-small" onClick={() => announce('Teaching details are shown in this local demo.')}>View teaching load <ArrowRight /></button></div>
      <div className="hero-symbol"><span>3 sections</span><span>93 students</span><span>2 grade drafts</span></div>
    </section>

    <div className="grid overview-grid section-space">
      {data.metrics.map((m) => <div className="panel panel-pad" key={m.label}><div className="panel-kicker">{m.label}</div><div className="stat-value">{m.value}</div><div className="stat-foot">{m.note}</div></div>)}
    </div>

    <div className="grid two-col section-space">
      <section className="panel panel-pad">
        <div className="panel-header"><div><div className="panel-kicker">Your sections · this term</div><h2>Section worklist</h2></div><Badge tone="amber">{data.items.length} sections</Badge></div>
        <div className="role-work-list">
          {data.items.map((item) => <article className="role-work-item" key={item.reference}>
            <div className="role-work-ref">{item.reference}</div>
            <div className="role-work-copy">
              <div className="role-work-title-row"><h3>{item.title}</h3><Badge tone={item.status.includes('Draft') ? 'amber' : item.status.includes('review') || item.status.includes('Needs') ? 'red' : 'gray'}>{item.status}</Badge></div>
              <p>{item.detail}</p>
            </div>
            <button className="btn btn-outline btn-small role-work-action" onClick={() => { setActiveItem(item); setConfirmed(false); }} data-testid={`button-preview-${item.reference.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>{item.action}<ArrowRight /></button>
          </article>)}
        </div>
      </section>
      <aside className="grid" style={{ gap: 16 }}>
        <section className="panel panel-pad">
          <div className="panel-header"><div><div className="panel-kicker">Grade deadlines</div><h2>Upcoming</h2></div><ClipboardList size={17} color="#8c9b8f" /></div>
          <div className="alert-row"><div className="alert-icon"><TriangleAlert /></div><div><strong>Grade draft due Apr 10</strong><p>2 sections have draft-ready gradebooks awaiting your review.</p></div></div>
          <div className="alert-row"><div className="alert-icon" style={{ background: '#e7eee8', color: '#507661' }}><CalendarDays /></div><div><strong>Advising week Apr 20–24</strong><p>Prepare availability for advisee meetings.</p></div></div>
        </section>
        <section className="panel panel-pad">
          <div className="panel-kicker">Teaching calendar</div><h2>Key dates</h2>
          <div className="detail-row"><span>Grade draft deadline</span><strong>Apr 10</strong></div>
          <div className="detail-row"><span>Next class meeting</span><strong>Wed · 9:00 AM</strong></div>
          <div className="detail-row"><span>Advising week</span><strong>Apr 20–24</strong></div>
          <div className="detail-row"><span>Final exam week</span><strong>May 18–23</strong></div>
        </section>
        <div className="role-demo-stamp"><span className="demo-dot" /> Demo preview · sample data · not live · no account authenticated</div>
      </aside>
    </div>

    <div className="notice section-space"><CircleHelp /><div><strong>About this instructor preview</strong>{data.boundary}</div></div>

    {activeItem && <Modal title={activeItem.action} subtitle={`${activeItem.reference} · ${activeItem.title}`} onClose={() => setActiveItem(null)} footer={confirmed ? <><button className="btn btn-outline" onClick={() => setConfirmed(false)}>Go back</button><button className="btn btn-primary" onClick={confirmAction}>Confirm demo action</button></> : <><button className="btn btn-outline" onClick={() => setActiveItem(null)}>Close preview</button><button className="btn btn-primary" onClick={() => setConfirmed(true)} data-testid="button-confirm-role-preview">Preview action</button></>}>
      <div className="detail-row"><span>Section</span><strong>{activeItem.reference}</strong></div>
      <div className="detail-row"><span>Course</span><strong>{activeItem.title}</strong></div>
      <div className="detail-row"><span>Current status</span><Badge tone={activeItem.status.includes('Draft') ? 'amber' : 'gray'}>{activeItem.status}</Badge></div>
      <div className="detail-row"><span>Priority</span><Badge tone={activeItem.priority === 'High' ? 'red' : 'amber'}>{activeItem.priority}</Badge></div>
      <div className="detail-row"><span>Notes</span><strong>{activeItem.detail}</strong></div>
      <ul className="timeline" style={{ marginTop: 14 }}>
        <li>Section created in sample workspace</li>
        <li>Current status · {activeItem.status}</li>
        <li>Next step · {confirmed ? 'Confirm to mark as previewed' : 'Preview the action to continue'}</li>
      </ul>
      <div className="notice section-space"><CircleHelp /><div><strong>Local interface preview only</strong>This action will not publish grades, change rosters, or contact students.</div></div>
      {confirmed && <div className="modal-confirm-line" role="status">Confirm this sample-only action? The section will be labeled "Previewed locally".</div>}
    </Modal>}
    {toast}
  </main>;
}
