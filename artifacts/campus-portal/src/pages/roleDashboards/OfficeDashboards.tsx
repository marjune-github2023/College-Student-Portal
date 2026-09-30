import { useState } from 'react';
import { ArrowRight, CalendarDays, CheckCircle2, CircleHelp, ClipboardList, FileCheck2, FileText, Search, TriangleAlert, Users, X } from 'lucide-react';
import { Link } from 'wouter';
import { Badge, Modal, PageHeading, useNotice } from '../../components/PortalUI';
import { workspacePreviews, type WorkspaceItem } from '../../data';

const wp = (slug: string) => workspacePreviews.find((p) => p.slug === slug)!;

function toneFor(status: string) {
  if (/complete|approved|enrolled|ready|indexed/i.test(status)) return 'green' as const;
  if (/review|pending|queue|awaiting|open|draft|preparation|planning|consultation|coordination|upcoming|routing/i.test(status)) return 'amber' as const;
  if (/incomplete|needed|overdue|conflict|reconcile/i.test(status)) return 'red' as const;
  return 'gray' as const;
}

/* ── Admissions Officer ───────────────────────────────────── */

export function AdmissionsDashboard() {
  const data = wp('admissions-officer');
  const { announce, toast } = useNotice();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All files');
  const [activeItem, setActiveItem] = useState<WorkspaceItem | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const filtered = data.items.filter((item) => {
    const q = `${item.reference} ${item.title} ${item.detail}`.toLowerCase().includes(search.toLowerCase());
    const f = filter === 'All files' || item.status === filter;
    return q && f;
  });
  const statusOptions = ['All files', ...Array.from(new Set(data.items.map((i) => i.status)))];

  function confirmAction() {
    if (!activeItem) return;
    announce('Sample application file previewed. No admissions decision was made.');
    setActiveItem(null);
    setConfirmed(false);
  }

  return <main className="main-content">
    <PageHeading eyebrow={`${data.unit} · DEMO PREVIEW`} title={data.heading} subtitle={data.intro} action={<Link className="btn btn-outline btn-small" href="/login">Switch demo role <ArrowRight /></Link>} />

    <section className="hero-card" aria-label="Admissions office summary">
      <div className="hero-top"><span className="hero-tag">Admissions intake snapshot</span><span className="hero-tag">LOCAL SAMPLE PROFILE</span></div>
      <div className="hero-name"><h2>AY 2026–27 Admissions Cycle</h2><p>Review application files for completeness and evaluation readiness. All applicant names and document statuses are fictional — no verification occurs here.</p><button className="btn btn-secondary btn-small" onClick={() => announce('Admissions details are shown in this local demo.')}>View intake summary <ArrowRight /></button></div>
      <div className="hero-symbol"><span>164 received</span><span>28 in queue</span><span>12 ready for evaluation</span></div>
    </section>

    <div className="grid queue-stats section-space" style={{ gridTemplateColumns: 'repeat(4,1fr)', gap: 11 }}>
      <div className="queue-stat"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Applications</span><Users size={16} color="#678b78" /></div><strong>28</strong></div>
      <div className="queue-stat"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Files to complete</span><FileCheck2 size={16} color="#678b78" /></div><strong>9</strong></div>
      <div className="queue-stat"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Ready for evaluation</span><CheckCircle2 size={16} color="#678b78" /></div><strong>12</strong></div>
      <div className="queue-stat"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Next panel</span><CalendarDays size={16} color="#678b78" /></div><strong>Apr 08</strong></div>
    </div>

    <section className="panel panel-pad section-space">
      <div className="panel-header"><div><div className="panel-kicker">Application file review · local sample</div><h2>{data.queueTitle}</h2></div><Badge tone="amber">{filtered.length} in view</Badge></div>
      <div className="filter-row">
        <div style={{ position: 'relative', flex: '1 1 230px' }}><Search size={15} style={{ position: 'absolute', left: 11, top: 11, color: '#8a928e' }} /><input className="field" style={{ paddingLeft: 34 }} type="search" placeholder="Search name, reference, program…" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search applications" data-testid="input-workspace-search" /></div>
        <select className="field" style={{ width: 'auto', minWidth: 130 }} value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter by status" data-testid="select-status-filter">{statusOptions.map((s) => <option key={s}>{s}</option>)}</select>
        <button className="btn btn-outline btn-small" onClick={() => { setSearch(''); setFilter('All files'); }} data-testid="button-clear-filters"><X /> Clear</button>
      </div>
      <div className="table-wrap">
        <table className="data-table"><thead><tr><th>Reference</th><th>Applicant</th><th>Detail</th><th>Status</th><th>Priority</th><th>Review</th></tr></thead>
          <tbody>{filtered.map((item) => <tr key={item.reference} className="staff-row" onClick={() => { setActiveItem(item); setConfirmed(false); }} tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') { setActiveItem(item); setConfirmed(false); } }} data-testid={`row-item-${item.reference.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>
            <td><strong>{item.reference}</strong></td><td>{item.title}</td><td><small>{item.detail}</small></td><td><Badge tone={toneFor(item.status)}>{item.status}</Badge></td><td><Badge tone={item.priority === 'High' ? 'red' : 'amber'}>{item.priority}</Badge></td>
            <td><button className="btn btn-outline btn-small" onClick={(e) => { e.stopPropagation(); setActiveItem(item); setConfirmed(false); }} data-testid={`button-review-${item.reference.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>Review <ArrowRight /></button></td>
          </tr>)}</tbody>
        </table>
      </div>
      <div className="mobile-card-list">{filtered.map((item) => <div className="mobile-record" key={item.reference}><div className="mobile-record-top"><strong>{item.title}</strong><Badge tone={item.priority === 'High' ? 'red' : 'amber'}>{item.priority}</Badge></div><p>{item.reference} · {item.detail}</p><div className="mobile-record-foot"><Badge tone={toneFor(item.status)}>{item.status}</Badge><button className="btn btn-outline btn-small" onClick={() => { setActiveItem(item); setConfirmed(false); }} data-testid={`mobile-review-${item.reference.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>Review <ArrowRight /></button></div></div>)}</div>
      {filtered.length === 0 && <div className="empty-state"><Search /><strong>No matching applications</strong><p>Adjust the filters or search for another sample record.</p><button className="btn btn-secondary btn-small" style={{ marginTop: 12 }} onClick={() => { setSearch(''); setFilter('All files'); }}>Reset filters</button></div>}
      <p className="tagline-note">Sample applicant names, references, and document statuses are fictional.</p>
    </section>

    <div className="notice section-space"><CircleHelp /><div><strong>About this admissions preview</strong>{data.boundary}</div></div>

    {activeItem && <Modal title={activeItem.action} subtitle={`${activeItem.reference} · ${activeItem.title}`} onClose={() => setActiveItem(null)} footer={confirmed ? <><button className="btn btn-outline" onClick={() => setConfirmed(false)}>Go back</button><button className="btn btn-primary" onClick={confirmAction}>Confirm demo action</button></> : <><button className="btn btn-outline" onClick={() => setActiveItem(null)}>Close preview</button><button className="btn btn-primary" onClick={() => setConfirmed(true)} data-testid="button-confirm-role-preview">Preview action</button></>}>
      <div className="detail-row"><span>Applicant</span><strong>{activeItem.title}</strong></div>
      <div className="detail-row"><span>Reference</span><strong>{activeItem.reference}</strong></div>
      <div className="detail-row"><span>Current status</span><Badge tone={toneFor(activeItem.status)}>{activeItem.status}</Badge></div>
      <div className="detail-row"><span>Priority</span><Badge tone={activeItem.priority === 'High' ? 'red' : 'amber'}>{activeItem.priority}</Badge></div>
      <div className="detail-row"><span>Detail</span><strong>{activeItem.detail}</strong></div>
      <ul className="timeline" style={{ marginTop: 14 }}><li>Created in sample workspace</li><li>Current status · {activeItem.status}</li><li>Next step · {confirmed ? 'Confirm to mark as previewed' : 'Preview the action to continue'}</li></ul>
      <div className="notice section-space"><CircleHelp /><div><strong>Local interface preview only</strong>No admissions decision or verification occurs here.</div></div>
      {confirmed && <div className="modal-confirm-line" role="status">Confirm this sample-only action? The file will be labeled "Previewed locally".</div>}
    </Modal>}
    {toast}
  </main>;
}

/* ── Records Officer ──────────────────────────────────────── */

export function RecordsDashboard() {
  const data = wp('records-officer');
  const { announce, toast } = useNotice();
  const [search, setSearch] = useState('');
  const [activeItem, setActiveItem] = useState<WorkspaceItem | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const filtered = data.items.filter((item) => `${item.reference} ${item.title} ${item.detail}`.toLowerCase().includes(search.toLowerCase()));

  function confirmAction() { if (!activeItem) return; announce('Sample record previewed. No credential was issued.'); setActiveItem(null); setConfirmed(false); }

  return <main className="main-content">
    <PageHeading eyebrow={`${data.unit} · DEMO PREVIEW`} title={data.heading} subtitle={data.intro} action={<Link className="btn btn-outline btn-small" href="/login">Switch demo role <ArrowRight /></Link>} />

    <section className="hero-card" aria-label="Records office summary">
      <div className="hero-top"><span className="hero-tag">Records workbench snapshot</span><span className="hero-tag">LOCAL SAMPLE PROFILE</span></div>
      <div className="hero-name"><h2>Student files & credential preparation</h2><p>Manage file checks, transcript requests, and certificate drafts. All records are fictional — no credentials are issued from this interface.</p><button className="btn btn-secondary btn-small" onClick={() => announce('Records details are shown in this local demo.')}>View workbench <ArrowRight /></button></div>
      <div className="hero-symbol"><span>17 file checks</span><span>6 credential drafts</span><span>11 TOR requests</span></div>
    </section>

    <div className="grid queue-stats section-space" style={{ gridTemplateColumns: 'repeat(4,1fr)', gap: 11 }}>
      <div className="queue-stat"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>File checks</span><FileText size={16} color="#678b78" /></div><strong>17</strong></div>
      <div className="queue-stat"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Credential drafts</span><FileCheck2 size={16} color="#678b78" /></div><strong>6</strong></div>
      <div className="queue-stat"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>TOR requests</span><ClipboardList size={16} color="#678b78" /></div><strong>11</strong></div>
      <div className="queue-stat"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Sample cutoff</span><CalendarDays size={16} color="#678b78" /></div><strong>Mar 27 · 3 PM</strong></div>
    </div>

    <section className="panel panel-pad section-space">
      <div className="panel-header"><div><div className="panel-kicker">Records preparation · local sample</div><h2>{data.queueTitle}</h2></div><Badge tone="amber">{filtered.length} in view</Badge></div>
      <div className="filter-row">
        <div style={{ position: 'relative', flex: '1 1 230px' }}><Search size={15} style={{ position: 'absolute', left: 11, top: 11, color: '#8a928e' }} /><input className="field" style={{ paddingLeft: 34 }} type="search" placeholder="Search reference, name, type…" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search records" data-testid="input-workspace-search" /></div>
        <button className="btn btn-outline btn-small" onClick={() => setSearch('')} data-testid="button-clear-filters"><X /> Clear</button>
      </div>
      <div className="table-wrap">
        <table className="data-table"><thead><tr><th>Reference</th><th>Record</th><th>Detail</th><th>Status</th><th>Priority</th><th>Review</th></tr></thead>
          <tbody>{filtered.map((item) => <tr key={item.reference} className="staff-row" onClick={() => { setActiveItem(item); setConfirmed(false); }} tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') { setActiveItem(item); setConfirmed(false); } }} data-testid={`row-item-${item.reference.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>
            <td><strong>{item.reference}</strong></td><td>{item.title}</td><td><small>{item.detail}</small></td><td><Badge tone={toneFor(item.status)}>{item.status}</Badge></td><td><Badge tone={item.priority === 'High' ? 'red' : 'amber'}>{item.priority}</Badge></td>
            <td><button className="btn btn-outline btn-small" onClick={(e) => { e.stopPropagation(); setActiveItem(item); setConfirmed(false); }} data-testid={`button-review-${item.reference.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>Review <ArrowRight /></button></td>
          </tr>)}</tbody>
        </table>
      </div>
      <div className="mobile-card-list">{filtered.map((item) => <div className="mobile-record" key={item.reference}><div className="mobile-record-top"><strong>{item.title}</strong><Badge tone={item.priority === 'High' ? 'red' : 'amber'}>{item.priority}</Badge></div><p>{item.reference} · {item.detail}</p><div className="mobile-record-foot"><Badge tone={toneFor(item.status)}>{item.status}</Badge><button className="btn btn-outline btn-small" onClick={() => { setActiveItem(item); setConfirmed(false); }} data-testid={`mobile-review-${item.reference.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>Review <ArrowRight /></button></div></div>)}</div>
      {filtered.length === 0 && <div className="empty-state"><Search /><strong>No matching records</strong><p>Adjust the search for another sample record.</p><button className="btn btn-secondary btn-small" style={{ marginTop: 12 }} onClick={() => setSearch('')}>Reset</button></div>}
      <p className="tagline-note">Sample student names, references, and file statuses are fictional.</p>
    </section>

    <div className="notice section-space"><CircleHelp /><div><strong>About this records preview</strong>{data.boundary}</div></div>

    {activeItem && <Modal title={activeItem.action} subtitle={`${activeItem.reference} · ${activeItem.title}`} onClose={() => setActiveItem(null)} footer={confirmed ? <><button className="btn btn-outline" onClick={() => setConfirmed(false)}>Go back</button><button className="btn btn-primary" onClick={confirmAction}>Confirm demo action</button></> : <><button className="btn btn-outline" onClick={() => setActiveItem(null)}>Close preview</button><button className="btn btn-primary" onClick={() => setConfirmed(true)} data-testid="button-confirm-role-preview">Preview action</button></>}>
      <div className="detail-row"><span>Record</span><strong>{activeItem.title}</strong></div><div className="detail-row"><span>Reference</span><strong>{activeItem.reference}</strong></div><div className="detail-row"><span>Current status</span><Badge tone={toneFor(activeItem.status)}>{activeItem.status}</Badge></div><div className="detail-row"><span>Priority</span><Badge tone={activeItem.priority === 'High' ? 'red' : 'amber'}>{activeItem.priority}</Badge></div><div className="detail-row"><span>Detail</span><strong>{activeItem.detail}</strong></div>
      <ul className="timeline" style={{ marginTop: 14 }}><li>Created in sample workspace</li><li>Current status · {activeItem.status}</li><li>Next step · {confirmed ? 'Confirm to mark as previewed' : 'Preview the action to continue'}</li></ul>
      <div className="notice section-space"><CircleHelp /><div><strong>Local interface preview only</strong>This preview does not access official student files, verify records, issue credentials, or release a transcript.</div></div>
      {confirmed && <div className="modal-confirm-line" role="status">Confirm this sample-only action? The record will be labeled "Previewed locally".</div>}
    </Modal>}
    {toast}
  </main>;
}

/* ── Finance Officer ──────────────────────────────────────── */

export function FinanceDashboard() {
  const data = wp('finance-officer');
  const { announce, toast } = useNotice();
  const [search, setSearch] = useState('');
  const [activeItem, setActiveItem] = useState<WorkspaceItem | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const filtered = data.items.filter((item) => `${item.reference} ${item.title} ${item.detail}`.toLowerCase().includes(search.toLowerCase()));

  function confirmAction() { if (!activeItem) return; announce('Sample finance item previewed. No payment was collected.'); setActiveItem(null); setConfirmed(false); }

  return <main className="main-content">
    <PageHeading eyebrow={`${data.unit} · DEMO PREVIEW`} title={data.heading} subtitle={data.intro} action={<Link className="btn btn-outline btn-small" href="/login">Switch demo role <ArrowRight /></Link>} />

    <section className="hero-card" aria-label="Finance office summary">
      <div className="hero-top"><span className="hero-tag">Finance desk snapshot</span><span className="hero-tag">LOCAL SAMPLE PROFILE</span></div>
      <div className="hero-name"><h2>Assessment & clearance coordination</h2><p>Review sample assessment records, coordinate clearances, and track reconciliation batches. All amounts are fictional — no payments are processed here.</p><button className="btn btn-secondary btn-small" onClick={() => announce('Finance details are shown in this local demo.')}>View daybook <ArrowRight /></button></div>
      <div className="hero-symbol"><span>14 assessments</span><span>7 clearances</span><span>3 unmatched entries</span></div>
    </section>

    <div className="grid queue-stats section-space" style={{ gridTemplateColumns: 'repeat(4,1fr)', gap: 11 }}>
      <div className="queue-stat"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Assessments</span><ClipboardList size={16} color="#678b78" /></div><strong>14</strong></div>
      <div className="queue-stat"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Clearance checks</span><CheckCircle2 size={16} color="#678b78" /></div><strong>7</strong></div>
      <div className="queue-stat"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Reconciliation</span><TriangleAlert size={16} color="#678b78" /></div><strong>3 unmatched</strong></div>
      <div className="queue-stat"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Sample batch</span><FileText size={16} color="#678b78" /></div><strong>₱184,250</strong></div>
    </div>

    <section className="panel panel-pad section-space">
      <div className="panel-header"><div><div className="panel-kicker">Assessment follow-up · local sample</div><h2>{data.queueTitle}</h2></div><Badge tone="amber">{filtered.length} in view</Badge></div>
      <div className="filter-row">
        <div style={{ position: 'relative', flex: '1 1 230px' }}><Search size={15} style={{ position: 'absolute', left: 11, top: 11, color: '#8a928e' }} /><input className="field" style={{ paddingLeft: 34 }} type="search" placeholder="Search reference, name, type…" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search finance queue" data-testid="input-workspace-search" /></div>
        <button className="btn btn-outline btn-small" onClick={() => setSearch('')} data-testid="button-clear-filters"><X /> Clear</button>
      </div>
      <div className="table-wrap">
        <table className="data-table"><thead><tr><th>Reference</th><th>Item</th><th>Detail</th><th>Status</th><th>Priority</th><th>Review</th></tr></thead>
          <tbody>{filtered.map((item) => <tr key={item.reference} className="staff-row" onClick={() => { setActiveItem(item); setConfirmed(false); }} tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') { setActiveItem(item); setConfirmed(false); } }} data-testid={`row-item-${item.reference.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>
            <td><strong>{item.reference}</strong></td><td>{item.title}</td><td><small>{item.detail}</small></td><td><Badge tone={toneFor(item.status)}>{item.status}</Badge></td><td><Badge tone={item.priority === 'High' ? 'red' : 'amber'}>{item.priority}</Badge></td>
            <td><button className="btn btn-outline btn-small" onClick={(e) => { e.stopPropagation(); setActiveItem(item); setConfirmed(false); }} data-testid={`button-review-${item.reference.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>Review <ArrowRight /></button></td>
          </tr>)}</tbody>
        </table>
      </div>
      <div className="mobile-card-list">{filtered.map((item) => <div className="mobile-record" key={item.reference}><div className="mobile-record-top"><strong>{item.title}</strong><Badge tone={item.priority === 'High' ? 'red' : 'amber'}>{item.priority}</Badge></div><p>{item.reference} · {item.detail}</p><div className="mobile-record-foot"><Badge tone={toneFor(item.status)}>{item.status}</Badge><button className="btn btn-outline btn-small" onClick={() => { setActiveItem(item); setConfirmed(false); }} data-testid={`mobile-review-${item.reference.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>Review <ArrowRight /></button></div></div>)}</div>
      {filtered.length === 0 && <div className="empty-state"><Search /><strong>No matching items</strong><p>Adjust the search for another sample record.</p><button className="btn btn-secondary btn-small" style={{ marginTop: 12 }} onClick={() => setSearch('')}>Reset</button></div>}
      <p className="tagline-note">All amounts and references are fictional examples, not student balances.</p>
    </section>

    <div className="notice section-space"><CircleHelp /><div><strong>About this finance preview</strong>{data.boundary}</div></div>

    {activeItem && <Modal title={activeItem.action} subtitle={`${activeItem.reference} · ${activeItem.title}`} onClose={() => setActiveItem(null)} footer={confirmed ? <><button className="btn btn-outline" onClick={() => setConfirmed(false)}>Go back</button><button className="btn btn-primary" onClick={confirmAction}>Confirm demo action</button></> : <><button className="btn btn-outline" onClick={() => setActiveItem(null)}>Close preview</button><button className="btn btn-primary" onClick={() => setConfirmed(true)} data-testid="button-confirm-role-preview">Preview action</button></>}>
      <div className="detail-row"><span>Item</span><strong>{activeItem.title}</strong></div><div className="detail-row"><span>Reference</span><strong>{activeItem.reference}</strong></div><div className="detail-row"><span>Current status</span><Badge tone={toneFor(activeItem.status)}>{activeItem.status}</Badge></div><div className="detail-row"><span>Priority</span><Badge tone={activeItem.priority === 'High' ? 'red' : 'amber'}>{activeItem.priority}</Badge></div><div className="detail-row"><span>Detail</span><strong>{activeItem.detail}</strong></div>
      <ul className="timeline" style={{ marginTop: 14 }}><li>Created in sample workspace</li><li>Current status · {activeItem.status}</li><li>Next step · {confirmed ? 'Confirm to mark as previewed' : 'Preview the action to continue'}</li></ul>
      <div className="notice section-space"><CircleHelp /><div><strong>Local interface preview only</strong>All amounts are fictional. This workspace cannot accept payments, post transactions, or release clearances.</div></div>
      {confirmed && <div className="modal-confirm-line" role="status">Confirm this sample-only action? The item will be labeled "Previewed locally".</div>}
    </Modal>}
    {toast}
  </main>;
}

/* ── Scholarship Officer ───────────────────────────────────── */

export function ScholarshipDashboard() {
  const data = wp('scholarship-officer');
  const { announce, toast } = useNotice();
  const [search, setSearch] = useState('');
  const [activeItem, setActiveItem] = useState<WorkspaceItem | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const filtered = data.items.filter((item) => `${item.reference} ${item.title} ${item.detail}`.toLowerCase().includes(search.toLowerCase()));

  function confirmAction() { if (!activeItem) return; announce('Sample scholarship item previewed. No award was approved.'); setActiveItem(null); setConfirmed(false); }

  return <main className="main-content">
    <PageHeading eyebrow={`${data.unit} · DEMO PREVIEW`} title={data.heading} subtitle={data.intro} action={<Link className="btn btn-outline btn-small" href="/login">Switch demo role <ArrowRight /></Link>} />

    <section className="hero-card" aria-label="Scholarship office summary">
      <div className="hero-top"><span className="hero-tag">Scholarship review snapshot</span><span className="hero-tag">LOCAL SAMPLE PROFILE</span></div>
      <div className="hero-name"><h2>AY 2026–27 Renewal Cycle</h2><p>Coordinate renewal packets, eligibility reviews, and cohort reports. All scholar profiles are fictional — no eligibility determination occurs here.</p><button className="btn btn-secondary btn-small" onClick={() => announce('Scholarship details are shown in this local demo.')}>View renewal calendar <ArrowRight /></button></div>
      <div className="hero-symbol"><span>83 active scholars</span><span>12 renewals</span><span>5 missing docs</span></div>
    </section>

    <div className="grid queue-stats section-space" style={{ gridTemplateColumns: 'repeat(4,1fr)', gap: 11 }}>
      <div className="queue-stat"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Active scholars</span><Users size={16} color="#678b78" /></div><strong>83</strong></div>
      <div className="queue-stat"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Renewals to review</span><ClipboardList size={16} color="#678b78" /></div><strong>12</strong></div>
      <div className="queue-stat"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Missing documents</span><FileCheck2 size={16} color="#678b78" /></div><strong>5</strong></div>
      <div className="queue-stat"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Renewal closes</span><CalendarDays size={16} color="#678b78" /></div><strong>Apr 18</strong></div>
    </div>

    <section className="panel panel-pad section-space">
      <div className="panel-header"><div><div className="panel-kicker">Renewal follow-up · local sample</div><h2>{data.queueTitle}</h2></div><Badge tone="amber">{filtered.length} in view</Badge></div>
      <div className="filter-row">
        <div style={{ position: 'relative', flex: '1 1 230px' }}><Search size={15} style={{ position: 'absolute', left: 11, top: 11, color: '#8a928e' }} /><input className="field" style={{ paddingLeft: 34 }} type="search" placeholder="Search reference, scholar, type…" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search scholarship queue" data-testid="input-workspace-search" /></div>
        <button className="btn btn-outline btn-small" onClick={() => setSearch('')} data-testid="button-clear-filters"><X /> Clear</button>
      </div>
      <div className="table-wrap">
        <table className="data-table"><thead><tr><th>Reference</th><th>Scholar</th><th>Detail</th><th>Status</th><th>Priority</th><th>Review</th></tr></thead>
          <tbody>{filtered.map((item) => <tr key={item.reference} className="staff-row" onClick={() => { setActiveItem(item); setConfirmed(false); }} tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') { setActiveItem(item); setConfirmed(false); } }} data-testid={`row-item-${item.reference.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>
            <td><strong>{item.reference}</strong></td><td>{item.title}</td><td><small>{item.detail}</small></td><td><Badge tone={toneFor(item.status)}>{item.status}</Badge></td><td><Badge tone={item.priority === 'High' ? 'red' : 'amber'}>{item.priority}</Badge></td>
            <td><button className="btn btn-outline btn-small" onClick={(e) => { e.stopPropagation(); setActiveItem(item); setConfirmed(false); }} data-testid={`button-review-${item.reference.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>Review <ArrowRight /></button></td>
          </tr>)}</tbody>
        </table>
      </div>
      <div className="mobile-card-list">{filtered.map((item) => <div className="mobile-record" key={item.reference}><div className="mobile-record-top"><strong>{item.title}</strong><Badge tone={item.priority === 'High' ? 'red' : 'amber'}>{item.priority}</Badge></div><p>{item.reference} · {item.detail}</p><div className="mobile-record-foot"><Badge tone={toneFor(item.status)}>{item.status}</Badge><button className="btn btn-outline btn-small" onClick={() => { setActiveItem(item); setConfirmed(false); }} data-testid={`mobile-review-${item.reference.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>Review <ArrowRight /></button></div></div>)}</div>
      {filtered.length === 0 && <div className="empty-state"><Search /><strong>No matching items</strong><p>Adjust the search for another sample record.</p><button className="btn btn-secondary btn-small" style={{ marginTop: 12 }} onClick={() => setSearch('')}>Reset</button></div>}
      <p className="tagline-note">Sample scholar names and award references are fictional.</p>
    </section>

    <div className="notice section-space"><CircleHelp /><div><strong>About this scholarship preview</strong>{data.boundary}</div></div>

    {activeItem && <Modal title={activeItem.action} subtitle={`${activeItem.reference} · ${activeItem.title}`} onClose={() => setActiveItem(null)} footer={confirmed ? <><button className="btn btn-outline" onClick={() => setConfirmed(false)}>Go back</button><button className="btn btn-primary" onClick={confirmAction}>Confirm demo action</button></> : <><button className="btn btn-outline" onClick={() => setActiveItem(null)}>Close preview</button><button className="btn btn-primary" onClick={() => setConfirmed(true)} data-testid="button-confirm-role-preview">Preview action</button></>}>
      <div className="detail-row"><span>Scholar</span><strong>{activeItem.title}</strong></div><div className="detail-row"><span>Reference</span><strong>{activeItem.reference}</strong></div><div className="detail-row"><span>Current status</span><Badge tone={toneFor(activeItem.status)}>{activeItem.status}</Badge></div><div className="detail-row"><span>Priority</span><Badge tone={activeItem.priority === 'High' ? 'red' : 'amber'}>{activeItem.priority}</Badge></div><div className="detail-row"><span>Detail</span><strong>{activeItem.detail}</strong></div>
      <ul className="timeline" style={{ marginTop: 14 }}><li>Created in sample workspace</li><li>Current status · {activeItem.status}</li><li>Next step · {confirmed ? 'Confirm to mark as previewed' : 'Preview the action to continue'}</li></ul>
      <div className="notice section-space"><CircleHelp /><div><strong>Local interface preview only</strong>No eligibility determination, award approval, or disbursement takes place.</div></div>
      {confirmed && <div className="modal-confirm-line" role="status">Confirm this sample-only action? The item will be labeled "Previewed locally".</div>}
    </Modal>}
    {toast}
  </main>;
}

/* ── OJT Coordinator ──────────────────────────────────────── */

export function OJTDashboard() {
  const data = wp('ojt-coordinator');
  const { announce, toast } = useNotice();
  const [search, setSearch] = useState('');
  const [activeItem, setActiveItem] = useState<WorkspaceItem | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const filtered = data.items.filter((item) => `${item.reference} ${item.title} ${item.detail}`.toLowerCase().includes(search.toLowerCase()));

  function confirmAction() { if (!activeItem) return; announce('Sample placement item previewed. No placement was authorized.'); setActiveItem(null); setConfirmed(false); }

  return <main className="main-content">
    <PageHeading eyebrow={`${data.unit} · DEMO PREVIEW`} title={data.heading} subtitle={data.intro} action={<Link className="btn btn-outline btn-small" href="/login">Switch demo role <ArrowRight /></Link>} />

    <section className="hero-card" aria-label="OJT coordination summary">
      <div className="hero-top"><span className="hero-tag">Fieldwork coordination snapshot</span><span className="hero-tag">LOCAL SAMPLE PROFILE</span></div>
      <div className="hero-name"><h2>Practicum placements · AY 2025–26</h2><p>Track placement readiness, partner agreements, and field log submissions. All placement partners are fictional — no placements are authorized here.</p><button className="btn btn-secondary btn-small" onClick={() => announce('OJT details are shown in this local demo.')}>View fieldwork pulse <ArrowRight /></button></div>
      <div className="hero-symbol"><span>22 in placement</span><span>4 agreements</span><span>8 logs pending</span></div>
    </section>

    <div className="grid queue-stats section-space" style={{ gridTemplateColumns: 'repeat(4,1fr)', gap: 11 }}>
      <div className="queue-stat"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Students in placement</span><Users size={16} color="#678b78" /></div><strong>22</strong></div>
      <div className="queue-stat"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Agreements to check</span><FileCheck2 size={16} color="#678b78" /></div><strong>4</strong></div>
      <div className="queue-stat"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Logs awaiting review</span><ClipboardList size={16} color="#678b78" /></div><strong>8</strong></div>
      <div className="queue-stat"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Orientation</span><CalendarDays size={16} color="#678b78" /></div><strong>Apr 01</strong></div>
    </div>

    <section className="panel panel-pad section-space">
      <div className="panel-header"><div><div className="panel-kicker">Placement readiness · local sample</div><h2>{data.queueTitle}</h2></div><Badge tone="amber">{filtered.length} in view</Badge></div>
      <div className="filter-row">
        <div style={{ position: 'relative', flex: '1 1 230px' }}><Search size={15} style={{ position: 'absolute', left: 11, top: 11, color: '#8a928e' }} /><input className="field" style={{ paddingLeft: 34 }} type="search" placeholder="Search reference, student, partner…" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search placement queue" data-testid="input-workspace-search" /></div>
        <button className="btn btn-outline btn-small" onClick={() => setSearch('')} data-testid="button-clear-filters"><X /> Clear</button>
      </div>
      <div className="table-wrap">
        <table className="data-table"><thead><tr><th>Reference</th><th>Placement</th><th>Detail</th><th>Status</th><th>Priority</th><th>Review</th></tr></thead>
          <tbody>{filtered.map((item) => <tr key={item.reference} className="staff-row" onClick={() => { setActiveItem(item); setConfirmed(false); }} tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') { setActiveItem(item); setConfirmed(false); } }} data-testid={`row-item-${item.reference.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>
            <td><strong>{item.reference}</strong></td><td>{item.title}</td><td><small>{item.detail}</small></td><td><Badge tone={toneFor(item.status)}>{item.status}</Badge></td><td><Badge tone={item.priority === 'High' ? 'red' : 'amber'}>{item.priority}</Badge></td>
            <td><button className="btn btn-outline btn-small" onClick={(e) => { e.stopPropagation(); setActiveItem(item); setConfirmed(false); }} data-testid={`button-review-${item.reference.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>Review <ArrowRight /></button></td>
          </tr>)}</tbody>
        </table>
      </div>
      <div className="mobile-card-list">{filtered.map((item) => <div className="mobile-record" key={item.reference}><div className="mobile-record-top"><strong>{item.title}</strong><Badge tone={item.priority === 'High' ? 'red' : 'amber'}>{item.priority}</Badge></div><p>{item.reference} · {item.detail}</p><div className="mobile-record-foot"><Badge tone={toneFor(item.status)}>{item.status}</Badge><button className="btn btn-outline btn-small" onClick={() => { setActiveItem(item); setConfirmed(false); }} data-testid={`mobile-review-${item.reference.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>Review <ArrowRight /></button></div></div>)}</div>
      {filtered.length === 0 && <div className="empty-state"><Search /><strong>No matching placements</strong><p>Adjust the search for another sample record.</p><button className="btn btn-secondary btn-small" style={{ marginTop: 12 }} onClick={() => setSearch('')}>Reset</button></div>}
      <p className="tagline-note">Sample placement partner names and status notes are fictional.</p>
    </section>

    <div className="notice section-space"><CircleHelp /><div><strong>About this fieldwork preview</strong>{data.boundary}</div></div>

    {activeItem && <Modal title={activeItem.action} subtitle={`${activeItem.reference} · ${activeItem.title}`} onClose={() => setActiveItem(null)} footer={confirmed ? <><button className="btn btn-outline" onClick={() => setConfirmed(false)}>Go back</button><button className="btn btn-primary" onClick={confirmAction}>Confirm demo action</button></> : <><button className="btn btn-outline" onClick={() => setActiveItem(null)}>Close preview</button><button className="btn btn-primary" onClick={() => setConfirmed(true)} data-testid="button-confirm-role-preview">Preview action</button></>}>
      <div className="detail-row"><span>Placement</span><strong>{activeItem.title}</strong></div><div className="detail-row"><span>Reference</span><strong>{activeItem.reference}</strong></div><div className="detail-row"><span>Current status</span><Badge tone={toneFor(activeItem.status)}>{activeItem.status}</Badge></div><div className="detail-row"><span>Priority</span><Badge tone={activeItem.priority === 'High' ? 'red' : 'amber'}>{activeItem.priority}</Badge></div><div className="detail-row"><span>Detail</span><strong>{activeItem.detail}</strong></div>
      <ul className="timeline" style={{ marginTop: 14 }}><li>Created in sample workspace</li><li>Current status · {activeItem.status}</li><li>Next step · {confirmed ? 'Confirm to mark as previewed' : 'Preview the action to continue'}</li></ul>
      <div className="notice section-space"><CircleHelp /><div><strong>Local interface preview only</strong>This interface does not clear health records, sign agreements, or authorize off-campus work.</div></div>
      {confirmed && <div className="modal-confirm-line" role="status">Confirm this sample-only action? The item will be labeled "Previewed locally".</div>}
    </Modal>}
    {toast}
  </main>;
}

/* ── Research Coordinator ─────────────────────────────────── */

export function ResearchDashboard() {
  const data = wp('research-coordinator');
  const { announce, toast } = useNotice();
  const [search, setSearch] = useState('');
  const [activeItem, setActiveItem] = useState<WorkspaceItem | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const filtered = data.items.filter((item) => `${item.reference} ${item.title} ${item.detail}`.toLowerCase().includes(search.toLowerCase()));

  function confirmAction() { if (!activeItem) return; announce('Sample research item previewed. No protocol was approved.'); setActiveItem(null); setConfirmed(false); }

  return <main className="main-content">
    <PageHeading eyebrow={`${data.unit} · DEMO PREVIEW`} title={data.heading} subtitle={data.intro} action={<Link className="btn btn-outline btn-small" href="/login">Switch demo role <ArrowRight /></Link>} />

    <section className="hero-card" aria-label="Research office summary">
      <div className="hero-top"><span className="hero-tag">Research coordination snapshot</span><span className="hero-tag">LOCAL SAMPLE PROFILE</span></div>
      <div className="hero-name"><h2>Research portfolio · AY 2025–26</h2><p>Track proposal milestones, panel reviews, and ethics routing. All research projects are fictional — no protocols are reviewed or approved here.</p><button className="btn btn-secondary btn-small" onClick={() => announce('Research details are shown in this local demo.')}>View review calendar <ArrowRight /></button></div>
      <div className="hero-symbol"><span>19 proposals</span><span>5 panel reviews</span><span>7 milestones due</span></div>
    </section>

    <div className="grid queue-stats section-space" style={{ gridTemplateColumns: 'repeat(4,1fr)', gap: 11 }}>
      <div className="queue-stat"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Active proposals</span><ClipboardList size={16} color="#678b78" /></div><strong>19</strong></div>
      <div className="queue-stat"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Panel reviews</span><Users size={16} color="#678b78" /></div><strong>5</strong></div>
      <div className="queue-stat"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Milestones due</span><CalendarDays size={16} color="#678b78" /></div><strong>7</strong></div>
      <div className="queue-stat"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Ethics panel</span><FileCheck2 size={16} color="#678b78" /></div><strong>Apr 04</strong></div>
    </div>

    <section className="panel panel-pad section-space">
      <div className="panel-header"><div><div className="panel-kicker">Research milestones · local sample</div><h2>{data.queueTitle}</h2></div><Badge tone="amber">{filtered.length} in view</Badge></div>
      <div className="filter-row">
        <div style={{ position: 'relative', flex: '1 1 230px' }}><Search size={15} style={{ position: 'absolute', left: 11, top: 11, color: '#8a928e' }} /><input className="field" style={{ paddingLeft: 34 }} type="search" placeholder="Search reference, project, type…" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search research queue" data-testid="input-workspace-search" /></div>
        <button className="btn btn-outline btn-small" onClick={() => setSearch('')} data-testid="button-clear-filters"><X /> Clear</button>
      </div>
      <div className="table-wrap">
        <table className="data-table"><thead><tr><th>Reference</th><th>Project</th><th>Detail</th><th>Status</th><th>Priority</th><th>Review</th></tr></thead>
          <tbody>{filtered.map((item) => <tr key={item.reference} className="staff-row" onClick={() => { setActiveItem(item); setConfirmed(false); }} tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') { setActiveItem(item); setConfirmed(false); } }} data-testid={`row-item-${item.reference.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>
            <td><strong>{item.reference}</strong></td><td>{item.title}</td><td><small>{item.detail}</small></td><td><Badge tone={toneFor(item.status)}>{item.status}</Badge></td><td><Badge tone={item.priority === 'High' ? 'red' : 'amber'}>{item.priority}</Badge></td>
            <td><button className="btn btn-outline btn-small" onClick={(e) => { e.stopPropagation(); setActiveItem(item); setConfirmed(false); }} data-testid={`button-review-${item.reference.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>Review <ArrowRight /></button></td>
          </tr>)}</tbody>
        </table>
      </div>
      <div className="mobile-card-list">{filtered.map((item) => <div className="mobile-record" key={item.reference}><div className="mobile-record-top"><strong>{item.title}</strong><Badge tone={item.priority === 'High' ? 'red' : 'amber'}>{item.priority}</Badge></div><p>{item.reference} · {item.detail}</p><div className="mobile-record-foot"><Badge tone={toneFor(item.status)}>{item.status}</Badge><button className="btn btn-outline btn-small" onClick={() => { setActiveItem(item); setConfirmed(false); }} data-testid={`mobile-review-${item.reference.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>Review <ArrowRight /></button></div></div>)}</div>
      {filtered.length === 0 && <div className="empty-state"><Search /><strong>No matching projects</strong><p>Adjust the search for another sample record.</p><button className="btn btn-secondary btn-small" style={{ marginTop: 12 }} onClick={() => setSearch('')}>Reset</button></div>}
      <p className="tagline-note">Sample proposal titles, milestones, and review statuses are fictional.</p>
    </section>

    <div className="notice section-space"><CircleHelp /><div><strong>About this research preview</strong>{data.boundary}</div></div>

    {activeItem && <Modal title={activeItem.action} subtitle={`${activeItem.reference} · ${activeItem.title}`} onClose={() => setActiveItem(null)} footer={confirmed ? <><button className="btn btn-outline" onClick={() => setConfirmed(false)}>Go back</button><button className="btn btn-primary" onClick={confirmAction}>Confirm demo action</button></> : <><button className="btn btn-outline" onClick={() => setActiveItem(null)}>Close preview</button><button className="btn btn-primary" onClick={() => setConfirmed(true)} data-testid="button-confirm-role-preview">Preview action</button></>}>
      <div className="detail-row"><span>Project</span><strong>{activeItem.title}</strong></div><div className="detail-row"><span>Reference</span><strong>{activeItem.reference}</strong></div><div className="detail-row"><span>Current status</span><Badge tone={toneFor(activeItem.status)}>{activeItem.status}</Badge></div><div className="detail-row"><span>Priority</span><Badge tone={activeItem.priority === 'High' ? 'red' : 'amber'}>{activeItem.priority}</Badge></div><div className="detail-row"><span>Detail</span><strong>{activeItem.detail}</strong></div>
      <ul className="timeline" style={{ marginTop: 14 }}><li>Created in sample workspace</li><li>Current status · {activeItem.status}</li><li>Next step · {confirmed ? 'Confirm to mark as previewed' : 'Preview the action to continue'}</li></ul>
      <div className="notice section-space"><CircleHelp /><div><strong>Local interface preview only</strong>Nothing is routed to an ethics board or marked approved.</div></div>
      {confirmed && <div className="modal-confirm-line" role="status">Confirm this sample-only action? The item will be labeled "Previewed locally".</div>}
    </Modal>}
    {toast}
  </main>;
}
