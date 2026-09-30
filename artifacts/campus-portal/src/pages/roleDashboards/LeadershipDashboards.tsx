import { useState } from 'react';
import { ArrowRight, Bell, CalendarDays, CircleHelp, ClipboardList, FileText, GraduationCap, Users } from 'lucide-react';
import { Link } from 'wouter';
import { Badge, Modal, PageHeading, useNotice } from '../../components/PortalUI';
import { workspacePreviews, type WorkspaceItem } from '../../data';

const wp = (slug: string) => workspacePreviews.find((p) => p.slug === slug)!;

/* ── Academic Adviser ─────────────────────────────────────── */

export function AdviserDashboard() {
  const data = wp('academic-adviser');
  const { announce, toast } = useNotice();
  const [activeItem, setActiveItem] = useState<WorkspaceItem | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  function confirmAction() {
    if (!activeItem) return;
    announce('Sample advising note previewed. No academic record was changed.');
    setActiveItem(null);
    setConfirmed(false);
  }

  return <main className="main-content">
    <PageHeading eyebrow={`${data.unit} · DEMO PREVIEW`} title={data.heading} subtitle={data.intro} action={<Link className="btn btn-outline btn-small" href="/login">Switch demo role <ArrowRight /></Link>} />

    <section className="hero-card" aria-label="Adviser profile summary">
      <div className="hero-top"><span className="hero-tag">Your advising snapshot</span><span className="hero-tag">LOCAL SAMPLE PROFILE</span></div>
      <div className="hero-name"><h2>36 assigned advisees · Environmental Planning</h2><p>Review planning notes, audit questions, and meeting requests. All records are fictional samples — no holds are cleared from this interface.</p><button className="btn btn-secondary btn-small" onClick={() => announce('Advising details are shown in this local demo.')}>View caseload <ArrowRight /></button></div>
      <div className="hero-symbol"><span>36 advisees</span><span>8 open reviews</span><span>5 meetings this week</span></div>
    </section>

    <div className="grid overview-grid section-space">
      {data.metrics.map((m) => <div className="panel panel-pad" key={m.label}><div className="panel-kicker">{m.label}</div><div className="stat-value">{m.value}</div><div className="stat-foot">{m.note}</div></div>)}
    </div>

    <div className="grid two-col section-space">
      <section className="panel panel-pad">
        <div className="panel-header"><div><div className="panel-kicker">Advisee follow-up · sample records</div><h2>{data.queueTitle}</h2></div><Badge tone="amber">{data.items.length} open</Badge></div>
        <div className="role-work-list">
          {data.items.map((item) => <article className="role-work-item" key={item.reference}>
            <div className="role-work-ref">{item.reference}</div>
            <div className="role-work-copy">
              <div className="role-work-title-row"><h3>{item.title}</h3><Badge tone={item.priority === 'High' ? 'red' : 'amber'}>{item.priority}</Badge></div>
              <p>{item.detail}</p>
              <div className="role-work-meta"><Badge tone={item.status.includes('Needs') ? 'red' : item.status.includes('Meeting') ? 'amber' : 'gray'}>{item.status}</Badge></div>
            </div>
            <button className="btn btn-outline btn-small role-work-action" onClick={() => { setActiveItem(item); setConfirmed(false); }} data-testid={`button-preview-${item.reference.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>{item.action}<ArrowRight /></button>
          </article>)}
        </div>
      </section>
      <aside className="grid" style={{ gap: 16 }}>
        <section className="panel panel-pad">
          <div className="panel-header"><div><div className="panel-kicker">This week</div><h2>Advising schedule</h2></div><Bell size={17} color="#8c9b8f" /></div>
          <div className="alert-row"><div className="alert-icon"><Users /></div><div><strong>5 meetings scheduled</strong><p>Term check-ins and plan reviews across your sample caseload.</p></div></div>
          <div className="alert-row"><div className="alert-icon" style={{ background: '#e7eee8', color: '#507661' }}><CalendarDays /></div><div><strong>Next appointment · Wed 10:30 AM</strong><p>Inez Navarro · term check-in</p></div></div>
        </section>
        <section className="panel panel-pad">
          <div className="panel-kicker">Advising focus</div><h2>Quick reference</h2>
          <div className="detail-row"><span>Next appointment</span><strong>Wed · 10:30 AM</strong></div>
          <div className="detail-row"><span>Curriculum version</span><strong>2023 cohort</strong></div>
          <div className="detail-row"><span>Referral pathway</span><strong>Registrar · audit question</strong></div>
        </section>
        <div className="role-demo-stamp"><span className="demo-dot" /> Demo preview · sample data · not live · no account authenticated</div>
      </aside>
    </div>

    <div className="notice section-space"><CircleHelp /><div><strong>About this advising preview</strong>{data.boundary}</div></div>

    {activeItem && <Modal title={activeItem.action} subtitle={`${activeItem.reference} · ${activeItem.title}`} onClose={() => setActiveItem(null)} footer={confirmed ? <><button className="btn btn-outline" onClick={() => setConfirmed(false)}>Go back</button><button className="btn btn-primary" onClick={confirmAction}>Confirm demo action</button></> : <><button className="btn btn-outline" onClick={() => setActiveItem(null)}>Close preview</button><button className="btn btn-primary" onClick={() => setConfirmed(true)} data-testid="button-confirm-role-preview">Preview action</button></>}>
      <div className="detail-row"><span>Advisee</span><strong>{activeItem.title}</strong></div>
      <div className="detail-row"><span>Reference</span><strong>{activeItem.reference}</strong></div>
      <div className="detail-row"><span>Current status</span><Badge tone={activeItem.status.includes('Needs') ? 'red' : 'amber'}>{activeItem.status}</Badge></div>
      <div className="detail-row"><span>Priority</span><Badge tone={activeItem.priority === 'High' ? 'red' : 'amber'}>{activeItem.priority}</Badge></div>
      <div className="detail-row"><span>Notes</span><strong>{activeItem.detail}</strong></div>
      <ul className="timeline" style={{ marginTop: 14 }}>
        <li>Created in sample workspace</li>
        <li>Current status · {activeItem.status}</li>
        <li>Next step · {confirmed ? 'Confirm to mark as previewed' : 'Preview the action to continue'}</li>
      </ul>
      <div className="notice section-space"><CircleHelp /><div><strong>Local interface preview only</strong>Advising notes are fictional. This preview cannot modify academic records, approve a plan, or remove a student hold.</div></div>
      {confirmed && <div className="modal-confirm-line" role="status">Confirm this sample-only action? The record will be labeled "Previewed locally".</div>}
    </Modal>}
    {toast}
  </main>;
}

/* ── Program Head ──────────────────────────────────────────── */

export function ProgramHeadDashboard() {
  const data = wp('program-head');
  const { announce, toast } = useNotice();
  const [activeItem, setActiveItem] = useState<WorkspaceItem | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  function confirmAction() {
    if (!activeItem) return;
    announce('Sample department item previewed. No curriculum was published.');
    setActiveItem(null);
    setConfirmed(false);
  }

  return <main className="main-content">
    <PageHeading eyebrow={`${data.unit} · DEMO PREVIEW`} title={data.heading} subtitle={data.intro} action={<Link className="btn btn-outline btn-small" href="/login">Switch demo role <ArrowRight /></Link>} />

    <section className="hero-card" aria-label="Department profile summary">
      <div className="hero-top"><span className="hero-tag">Department snapshot</span><span className="hero-tag">LOCAL SAMPLE PROFILE</span></div>
      <div className="hero-name"><h2>Environmental Planning Department</h2><p>Coordinate curriculum maps, section coverage, and faculty load across your sample department. Committee actions are previews only.</p><button className="btn btn-secondary btn-small" onClick={() => announce('Department details are shown in this local demo.')}>View department brief <ArrowRight /></button></div>
      <div className="hero-symbol"><span>4 programs</span><span>92% coverage</span><span>6 curriculum items</span></div>
    </section>

    <div className="grid overview-grid section-space">
      {data.metrics.map((m) => <div className="panel panel-pad" key={m.label}><div className="panel-kicker">{m.label}</div><div className="stat-value">{m.value}</div><div className="stat-foot">{m.note}</div></div>)}
    </div>

    <div className="grid two-col section-space">
      <section className="panel panel-pad">
        <div className="panel-header"><div><div className="panel-kicker">Department review · sample items</div><h2>{data.queueTitle}</h2></div><Badge tone="amber">{data.items.length} open</Badge></div>
        <div className="role-work-list">
          {data.items.map((item) => <article className="role-work-item" key={item.reference}>
            <div className="role-work-ref">{item.reference}</div>
            <div className="role-work-copy">
              <div className="role-work-title-row"><h3>{item.title}</h3><Badge tone={item.priority === 'High' ? 'red' : 'amber'}>{item.priority}</Badge></div>
              <p>{item.detail}</p>
              <div className="role-work-meta"><Badge tone={item.status.includes('review') || item.status.includes('Review') ? 'amber' : item.status.includes('gathering') ? 'red' : 'gray'}>{item.status}</Badge></div>
            </div>
            <button className="btn btn-outline btn-small role-work-action" onClick={() => { setActiveItem(item); setConfirmed(false); }} data-testid={`button-preview-${item.reference.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>{item.action}<ArrowRight /></button>
          </article>)}
        </div>
      </section>
      <aside className="grid" style={{ gap: 16 }}>
        <section className="panel panel-pad">
          <div className="panel-header"><div><div className="panel-kicker">Department pulse</div><h2>Planning indicators</h2></div><ClipboardList size={17} color="#8c9b8f" /></div>
          <div className="alert-row"><div className="alert-icon"><GraduationCap /></div><div><strong>Next committee · Apr 02</strong><p>Curriculum map and syllabus review on the agenda.</p></div></div>
          <div className="alert-row"><div className="alert-icon" style={{ background: '#e7eee8', color: '#507661' }}><Users /></div><div><strong>2 sections need instructor assignment</strong><p>Summer term staffing plan awaiting confirmation.</p></div></div>
        </section>
        <section className="panel panel-pad">
          <div className="panel-kicker">Department pulse</div><h2>Quick reference</h2>
          <div className="detail-row"><span>Next committee</span><strong>Apr 02</strong></div>
          <div className="detail-row"><span>Curriculum versions</span><strong>7 active maps</strong></div>
          <div className="detail-row"><span>Assessment cycle</span><strong>AY 2025–26</strong></div>
          <div className="detail-row"><span>Assessment due</span><strong>Apr 15</strong></div>
        </section>
        <div className="role-demo-stamp"><span className="demo-dot" /> Demo preview · sample data · not live · no account authenticated</div>
      </aside>
    </div>

    <div className="notice section-space"><CircleHelp /><div><strong>About this department preview</strong>{data.boundary}</div></div>

    {activeItem && <Modal title={activeItem.action} subtitle={`${activeItem.reference} · ${activeItem.title}`} onClose={() => setActiveItem(null)} footer={confirmed ? <><button className="btn btn-outline" onClick={() => setConfirmed(false)}>Go back</button><button className="btn btn-primary" onClick={confirmAction}>Confirm demo action</button></> : <><button className="btn btn-outline" onClick={() => setActiveItem(null)}>Close preview</button><button className="btn btn-primary" onClick={() => setConfirmed(true)} data-testid="button-confirm-role-preview">Preview action</button></>}>
      <div className="detail-row"><span>Item</span><strong>{activeItem.title}</strong></div>
      <div className="detail-row"><span>Reference</span><strong>{activeItem.reference}</strong></div>
      <div className="detail-row"><span>Current status</span><Badge tone="amber">{activeItem.status}</Badge></div>
      <div className="detail-row"><span>Priority</span><Badge tone={activeItem.priority === 'High' ? 'red' : 'amber'}>{activeItem.priority}</Badge></div>
      <div className="detail-row"><span>Detail</span><strong>{activeItem.detail}</strong></div>
      <ul className="timeline" style={{ marginTop: 14 }}>
        <li>Created in sample workspace</li>
        <li>Current status · {activeItem.status}</li>
        <li>Next step · {confirmed ? 'Confirm to mark as previewed' : 'Preview the action to continue'}</li>
      </ul>
      <div className="notice section-space"><CircleHelp /><div><strong>Local interface preview only</strong>Program-level previews do not publish curriculum, assign instructors, or change any student academic record.</div></div>
      {confirmed && <div className="modal-confirm-line" role="status">Confirm this sample-only action? The item will be labeled "Previewed locally".</div>}
    </Modal>}
    {toast}
  </main>;
}

/* ── Academic Administrator ────────────────────────────────── */

export function AcademicAdminDashboard() {
  const data = wp('academic-administrator');
  const { announce, toast } = useNotice();
  const [activeItem, setActiveItem] = useState<WorkspaceItem | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  function confirmAction() {
    if (!activeItem) return;
    announce('Sample operations item previewed. No calendar or policy was published.');
    setActiveItem(null);
    setConfirmed(false);
  }

  return <main className="main-content">
    <PageHeading eyebrow={`${data.unit} · DEMO PREVIEW`} title={data.heading} subtitle={data.intro} action={<Link className="btn btn-outline btn-small" href="/login">Switch demo role <ArrowRight /></Link>} />

    <section className="hero-card" aria-label="Academic affairs summary">
      <div className="hero-top"><span className="hero-tag">Academic affairs snapshot</span><span className="hero-tag">LOCAL SAMPLE PROFILE</span></div>
      <div className="hero-name"><h2>Cross-unit academic operations</h2><p>Review calendar alignment, policy consultations, and term readiness across sample academic units. Coordination actions prepare a discussion preview only.</p><button className="btn btn-secondary btn-small" onClick={() => announce('Academic affairs details are shown in this local demo.')}>View operations brief <ArrowRight /></button></div>
      <div className="hero-symbol"><span>8 academic units</span><span>6 milestones</span><span>3 policy reviews</span></div>
    </section>

    <div className="grid overview-grid section-space">
      {data.metrics.map((m) => <div className="panel panel-pad" key={m.label}><div className="panel-kicker">{m.label}</div><div className="stat-value">{m.value}</div><div className="stat-foot">{m.note}</div></div>)}
    </div>

    <div className="grid two-col section-space">
      <section className="panel panel-pad">
        <div className="panel-header"><div><div className="panel-kicker">Academic operations · sample items</div><h2>{data.queueTitle}</h2></div><Badge tone="amber">{data.items.length} open</Badge></div>
        <div className="role-work-list">
          {data.items.map((item) => <article className="role-work-item" key={item.reference}>
            <div className="role-work-ref">{item.reference}</div>
            <div className="role-work-copy">
              <div className="role-work-title-row"><h3>{item.title}</h3><Badge tone={item.priority === 'High' ? 'red' : 'amber'}>{item.priority}</Badge></div>
              <p>{item.detail}</p>
              <div className="role-work-meta"><Badge tone={item.status.includes('Cross-unit') ? 'amber' : item.status.includes('Consultation') ? 'amber' : 'gray'}>{item.status}</Badge></div>
            </div>
            <button className="btn btn-outline btn-small role-work-action" onClick={() => { setActiveItem(item); setConfirmed(false); }} data-testid={`button-preview-${item.reference.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>{item.action}<ArrowRight /></button>
          </article>)}
        </div>
      </section>
      <aside className="grid" style={{ gap: 16 }}>
        <section className="panel panel-pad">
          <div className="panel-header"><div><div className="panel-kicker">Academic calendar</div><h2>Key dates</h2></div><CalendarDays size={17} color="#8c9b8f" /></div>
          <div className="alert-row"><div className="alert-icon"><CalendarDays /></div><div><strong>Final exam week · May 18–23</strong><p>Review alignment across all sample academic units.</p></div></div>
          <div className="alert-row"><div className="alert-icon" style={{ background: '#e7eee8', color: '#507661' }}><GraduationCap /></div><div><strong>Summer term opens Jun 08</strong><p>Room and section readiness checklist in progress.</p></div></div>
        </section>
        <section className="panel panel-pad">
          <div className="panel-kicker">Academic calendar</div><h2>Planning dates</h2>
          <div className="detail-row"><span>Final exam week</span><strong>May 18–23</strong></div>
          <div className="detail-row"><span>Summer term opens</span><strong>Jun 08</strong></div>
          <div className="detail-row"><span>Policy council</span><strong>Apr 09</strong></div>
        </section>
        <div className="role-demo-stamp"><span className="demo-dot" /> Demo preview · sample data · not live · no account authenticated</div>
      </aside>
    </div>

    <div className="notice section-space"><CircleHelp /><div><strong>About this academic affairs preview</strong>{data.boundary}</div></div>

    {activeItem && <Modal title={activeItem.action} subtitle={`${activeItem.reference} · ${activeItem.title}`} onClose={() => setActiveItem(null)} footer={confirmed ? <><button className="btn btn-outline" onClick={() => setConfirmed(false)}>Go back</button><button className="btn btn-primary" onClick={confirmAction}>Confirm demo action</button></> : <><button className="btn btn-outline" onClick={() => setActiveItem(null)}>Close preview</button><button className="btn btn-primary" onClick={() => setConfirmed(true)} data-testid="button-confirm-role-preview">Preview action</button></>}>
      <div className="detail-row"><span>Item</span><strong>{activeItem.title}</strong></div>
      <div className="detail-row"><span>Reference</span><strong>{activeItem.reference}</strong></div>
      <div className="detail-row"><span>Current status</span><Badge tone="amber">{activeItem.status}</Badge></div>
      <div className="detail-row"><span>Priority</span><Badge tone={activeItem.priority === 'High' ? 'red' : 'amber'}>{activeItem.priority}</Badge></div>
      <div className="detail-row"><span>Detail</span><strong>{activeItem.detail}</strong></div>
      <ul className="timeline" style={{ marginTop: 14 }}>
        <li>Created in sample workspace</li>
        <li>Current status · {activeItem.status}</li>
        <li>Next step · {confirmed ? 'Confirm to mark as previewed' : 'Preview the action to continue'}</li>
      </ul>
      <div className="notice section-space"><CircleHelp /><div><strong>Local interface preview only</strong>This overview does not publish the academic calendar, approve policy, or make student-level academic record changes.</div></div>
      {confirmed && <div className="modal-confirm-line" role="status">Confirm this sample-only action? The item will be labeled "Previewed locally".</div>}
    </Modal>}
    {toast}
  </main>;
}
