import { useState } from 'react';
import { ArrowRight, CircleHelp, FileCheck2, FileText, Search, ShieldCheck, Users, X } from 'lucide-react';
import { Link } from 'wouter';
import { Badge, Modal, PageHeading, useNotice } from '../../components/PortalUI';
import { workspacePreviews, type WorkspaceItem } from '../../data';

const wp = (slug: string) => workspacePreviews.find((p) => p.slug === slug)!;

function toneFor(status: string) {
  if (/indexed|complete|ready|approved/i.test(status)) return 'green' as const;
  if (/review|pending|sampling|observation|discussion|documentation|configuration|informational/i.test(status)) return 'amber' as const;
  if (/incomplete|needed|overdue/i.test(status)) return 'red' as const;
  return 'gray' as const;
}

/* ── System Administrator ──────────────────────────────────── */

export function SystemAdminDashboard() {
  const data = wp('system-administrator');
  const { announce, toast } = useNotice();
  const [search, setSearch] = useState('');
  const [activeItem, setActiveItem] = useState<WorkspaceItem | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const filtered = data.items.filter((item) => `${item.reference} ${item.title} ${item.detail}`.toLowerCase().includes(search.toLowerCase()));

  function confirmAction() { if (!activeItem) return; announce('Sample platform item previewed. No system configuration was changed.'); setActiveItem(null); setConfirmed(false); }

  return <main className="main-content">
    <PageHeading eyebrow={`${data.unit} · DEMO PREVIEW`} title={data.heading} subtitle={data.intro} action={<Link className="btn btn-outline btn-small" href="/login">Switch demo role <ArrowRight /></Link>} />

    <section className="hero-card" aria-label="System administration summary">
      <div className="hero-top"><span className="hero-tag">Platform operations snapshot</span><span className="hero-tag">LOCAL SAMPLE PROFILE</span></div>
      <div className="hero-name"><h2>Account lifecycle & service health</h2><p>Review account directories, role catalog labels, and service health checks. All controls are safe preview tasks — no live configuration is changed.</p><button className="btn btn-secondary btn-small" onClick={() => announce('System admin details are shown in this local demo.')}>View operational boundary <ArrowRight /></button></div>
      <div className="hero-symbol"><span>142 demo accounts</span><span>16 role mappings</span><span>4 / 4 services</span></div>
    </section>

    <div className="grid queue-stats section-space" style={{ gridTemplateColumns: 'repeat(4,1fr)', gap: 11 }}>
      <div className="queue-stat"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Demo accounts</span><Users size={16} color="#678b78" /></div><strong>142</strong></div>
      <div className="queue-stat"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Role mappings</span><FileText size={16} color="#678b78" /></div><strong>16</strong></div>
      <div className="queue-stat"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Service checks</span><FileCheck2 size={16} color="#678b78" /></div><strong>4 / 4</strong></div>
      <div className="queue-stat"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Academic records</span><ShieldCheck size={16} color="#678b78" /></div><strong>No edit controls</strong></div>
    </div>

    <section className="panel panel-pad section-space">
      <div className="panel-header"><div><div className="panel-kicker">Platform operations · local sample</div><h2>{data.queueTitle}</h2></div><Badge tone="amber">{filtered.length} in view</Badge></div>
      <div className="filter-row">
        <div style={{ position: 'relative', flex: '1 1 230px' }}><Search size={15} style={{ position: 'absolute', left: 11, top: 11, color: '#8a928e' }} /><input className="field" style={{ paddingLeft: 34 }} type="search" placeholder="Search reference, item, type…" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search operations queue" data-testid="input-workspace-search" /></div>
        <button className="btn btn-outline btn-small" onClick={() => setSearch('')} data-testid="button-clear-filters"><X /> Clear</button>
      </div>
      <div className="table-wrap">
        <table className="data-table"><thead><tr><th>Reference</th><th>Item</th><th>Detail</th><th>Status</th><th>Priority</th><th>Review</th></tr></thead>
          <tbody>{filtered.map((item) => <tr key={item.reference} className="staff-row" onClick={() => { setActiveItem(item); setConfirmed(false); }} tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') { setActiveItem(item); setConfirmed(false); } }} data-testid={`row-item-${item.reference.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>
            <td><strong>{item.reference}</strong></td><td>{item.title}</td><td><small>{item.detail}</small></td><td><Badge tone={toneFor(item.status)}>{item.status}</Badge></td><td><Badge tone={item.priority === 'High' ? 'red' : item.priority === 'Low' ? 'gray' : 'amber'}>{item.priority}</Badge></td>
            <td><button className="btn btn-outline btn-small" onClick={(e) => { e.stopPropagation(); setActiveItem(item); setConfirmed(false); }} data-testid={`button-review-${item.reference.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>Review <ArrowRight /></button></td>
          </tr>)}</tbody>
        </table>
      </div>
      <div className="mobile-card-list">{filtered.map((item) => <div className="mobile-record" key={item.reference}><div className="mobile-record-top"><strong>{item.title}</strong><Badge tone={item.priority === 'High' ? 'red' : item.priority === 'Low' ? 'gray' : 'amber'}>{item.priority}</Badge></div><p>{item.reference} · {item.detail}</p><div className="mobile-record-foot"><Badge tone={toneFor(item.status)}>{item.status}</Badge><button className="btn btn-outline btn-small" onClick={() => { setActiveItem(item); setConfirmed(false); }} data-testid={`mobile-review-${item.reference.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>Review <ArrowRight /></button></div></div>)}</div>
      {filtered.length === 0 && <div className="empty-state"><Search /><strong>No matching items</strong><p>Adjust the search for another sample record.</p><button className="btn btn-secondary btn-small" style={{ marginTop: 12 }} onClick={() => setSearch('')}>Reset</button></div>}
      <p className="tagline-note">Sample account references and service statuses are fictional.</p>
    </section>

    <div className="notice section-space"><CircleHelp /><div><strong>About this system admin preview</strong>{data.boundary}</div></div>

    {activeItem && <Modal title={activeItem.action} subtitle={`${activeItem.reference} · ${activeItem.title}`} onClose={() => setActiveItem(null)} footer={confirmed ? <><button className="btn btn-outline" onClick={() => setConfirmed(false)}>Go back</button><button className="btn btn-primary" onClick={confirmAction}>Confirm demo action</button></> : <><button className="btn btn-outline" onClick={() => setActiveItem(null)}>Close preview</button><button className="btn btn-primary" onClick={() => setConfirmed(true)} data-testid="button-confirm-role-preview">Preview action</button></>}>
      <div className="detail-row"><span>Item</span><strong>{activeItem.title}</strong></div><div className="detail-row"><span>Reference</span><strong>{activeItem.reference}</strong></div><div className="detail-row"><span>Current status</span><Badge tone={toneFor(activeItem.status)}>{activeItem.status}</Badge></div><div className="detail-row"><span>Priority</span><Badge tone={activeItem.priority === 'High' ? 'red' : 'amber'}>{activeItem.priority}</Badge></div><div className="detail-row"><span>Detail</span><strong>{activeItem.detail}</strong></div>
      <ul className="timeline" style={{ marginTop: 14 }}><li>Created in sample workspace</li><li>Current status · {activeItem.status}</li><li>Next step · {confirmed ? 'Confirm to mark as previewed' : 'Preview the action to continue'}</li></ul>
      <div className="notice section-space"><CircleHelp /><div><strong>Local interface preview only</strong>System administration is limited here to fictional accounts, role labels, and service-health concepts. No record-editing controls are present.</div></div>
      {confirmed && <div className="modal-confirm-line" role="status">Confirm this sample-only action? The item will be labeled "Previewed locally".</div>}
    </Modal>}
    {toast}
  </main>;
}

/* ── Auditor / Compliance (read-only) ─────────────────────── */

export function AuditorDashboard() {
  const data = wp('auditor-compliance');
  const { toast } = useNotice();
  const [search, setSearch] = useState('');
  const [activeItem, setActiveItem] = useState<WorkspaceItem | null>(null);

  const filtered = data.items.filter((item) => `${item.reference} ${item.title} ${item.detail}`.toLowerCase().includes(search.toLowerCase()));

  return <main className="main-content">
    <PageHeading eyebrow={`${data.unit} · DEMO PREVIEW`} title={data.heading} subtitle={data.intro} action={<Link className="btn btn-outline btn-small" href="/login">Switch demo role <ArrowRight /></Link>} />

    <section className="hero-card" aria-label="Compliance review summary">
      <div className="hero-top"><span className="hero-tag">Read-only evidence snapshot</span><span className="hero-tag">LOCAL SAMPLE PROFILE</span></div>
      <div className="hero-name"><h2>Compliance sampling · AY 2025–26</h2><p>Review evidence samples, control checks, and observations. This workspace is intentionally read-only — no buttons here change a record or mark a control complete.</p><ShieldCheck size={28} color="#507661" /></div>
      <div className="hero-symbol"><span>24 evidence samples</span><span>18 / 20 controls</span><span>2 observations</span></div>
    </section>

    <div className="grid queue-stats section-space" style={{ gridTemplateColumns: 'repeat(4,1fr)', gap: 11 }}>
      <div className="queue-stat"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Evidence samples</span><FileText size={16} color="#678b78" /></div><strong>24</strong></div>
      <div className="queue-stat"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Control checks</span><FileCheck2 size={16} color="#678b78" /></div><strong>18 / 20</strong></div>
      <div className="queue-stat"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Open observations</span><ShieldCheck size={16} color="#678b78" /></div><strong>2</strong></div>
      <div className="queue-stat"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Access mode</span><ShieldCheck size={16} color="#678b78" /></div><strong>Read-only</strong></div>
    </div>

    <div className="notice section-space"><ShieldCheck /><div><strong>Read-only workspace.</strong>This role cannot approve, modify, delete, or resolve academic records or evidence. All buttons open a read-only sample view.</div></div>

    <section className="panel panel-pad section-space">
      <div className="panel-header"><div><div className="panel-kicker">Read-only evidence index · local sample</div><h2>{data.queueTitle}</h2></div><Badge tone="gray">{filtered.length} indexed</Badge></div>
      <div className="filter-row">
        <div style={{ position: 'relative', flex: '1 1 230px' }}><Search size={15} style={{ position: 'absolute', left: 11, top: 11, color: '#8a928e' }} /><input className="field" style={{ paddingLeft: 34 }} type="search" placeholder="Search reference, evidence, type…" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search evidence index" data-testid="input-workspace-search" /></div>
        <button className="btn btn-outline btn-small" onClick={() => setSearch('')} data-testid="button-clear-filters"><X /> Clear</button>
      </div>
      <div className="table-wrap">
        <table className="data-table"><thead><tr><th>Reference</th><th>Evidence</th><th>Detail</th><th>Status</th><th>Priority</th><th>View</th></tr></thead>
          <tbody>{filtered.map((item) => <tr key={item.reference} className="staff-row" onClick={() => setActiveItem(item)} tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') setActiveItem(item); }} data-testid={`row-item-${item.reference.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>
            <td><strong>{item.reference}</strong></td><td>{item.title}</td><td><small>{item.detail}</small></td><td><Badge tone={toneFor(item.status)}>{item.status}</Badge></td><td><Badge tone={item.priority === 'High' ? 'red' : 'gray'}>{item.priority}</Badge></td>
            <td><button className="btn btn-outline btn-small" onClick={(e) => { e.stopPropagation(); setActiveItem(item); }} data-testid={`button-review-${item.reference.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>Read-only <ArrowRight /></button></td>
          </tr>)}</tbody>
        </table>
      </div>
      <div className="mobile-card-list">{filtered.map((item) => <div className="mobile-record" key={item.reference}><div className="mobile-record-top"><strong>{item.title}</strong><Badge tone={item.priority === 'High' ? 'red' : 'gray'}>{item.priority}</Badge></div><p>{item.reference} · {item.detail}</p><div className="mobile-record-foot"><Badge tone={toneFor(item.status)}>{item.status}</Badge><button className="btn btn-outline btn-small" onClick={() => setActiveItem(item)} data-testid={`mobile-review-${item.reference.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>Read-only <ArrowRight /></button></div></div>)}</div>
      {filtered.length === 0 && <div className="empty-state"><Search /><strong>No matching evidence</strong><p>Adjust the search for another sample record.</p><button className="btn btn-secondary btn-small" style={{ marginTop: 12 }} onClick={() => setSearch('')}>Reset</button></div>}
      <p className="tagline-note">Sample evidence references and control statuses are fictional.</p>
    </section>

    <div className="notice section-space"><CircleHelp /><div><strong>About this compliance preview</strong>{data.boundary}</div></div>

    {activeItem && <Modal title="Read-only sample" subtitle={`${activeItem.reference} · ${activeItem.title}`} onClose={() => setActiveItem(null)} footer={<button className="btn btn-outline" onClick={() => setActiveItem(null)}>Close</button>}>
      <div className="detail-row"><span>Evidence</span><strong>{activeItem.title}</strong></div><div className="detail-row"><span>Reference</span><strong>{activeItem.reference}</strong></div><div className="detail-row"><span>Status</span><Badge tone={toneFor(activeItem.status)}>{activeItem.status}</Badge></div><div className="detail-row"><span>Priority</span><Badge tone={activeItem.priority === 'High' ? 'red' : 'gray'}>{activeItem.priority}</Badge></div><div className="detail-row"><span>Detail</span><strong>{activeItem.detail}</strong></div>
      <div className="notice section-space"><ShieldCheck /><div><strong>Read-only access</strong>This is an evidence sample view. No record can be modified, approved, or resolved from this workspace.</div></div>
    </Modal>}
    {toast}
  </main>;
}

/* ── Super Administrator ──────────────────────────────────── */

export function SuperAdminDashboard() {
  const data = wp('super-administrator');
  const { announce, toast } = useNotice();
  const [search, setSearch] = useState('');
  const [activeItem, setActiveItem] = useState<WorkspaceItem | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const filtered = data.items.filter((item) => `${item.reference} ${item.title} ${item.detail}`.toLowerCase().includes(search.toLowerCase()));

  function confirmAction() { if (!activeItem) return; announce('Sample governance item previewed. No policy or configuration was changed.'); setActiveItem(null); setConfirmed(false); }

  return <main className="main-content">
    <PageHeading eyebrow={`${data.unit} · DEMO PREVIEW`} title={data.heading} subtitle={data.intro} action={<Link className="btn btn-outline btn-small" href="/login">Switch demo role <ArrowRight /></Link>} />

    <section className="hero-card" aria-label="Platform governance summary">
      <div className="hero-top"><span className="hero-tag">Governance overview snapshot</span><span className="hero-tag">LOCAL SAMPLE PROFILE</span></div>
      <div className="hero-name"><h2>Platform-wide governance & oversight</h2><p>Review role boundaries, configuration notes, and continuity checklists. This is a fictional governance preview — no live configuration controls are available.</p><button className="btn btn-secondary btn-small" onClick={() => announce('Governance details are shown in this local demo.')}>View governance scope <ArrowRight /></button></div>
      <div className="hero-symbol"><span>16 role definitions</span><span>3 config reviews</span><span>7 policy checkpoints</span></div>
    </section>

    <div className="grid queue-stats section-space" style={{ gridTemplateColumns: 'repeat(4,1fr)', gap: 11 }}>
      <div className="queue-stat"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Role definitions</span><Users size={16} color="#678b78" /></div><strong>16</strong></div>
      <div className="queue-stat"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Config reviews</span><FileText size={16} color="#678b78" /></div><strong>3</strong></div>
      <div className="queue-stat"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Policy checkpoints</span><ShieldCheck size={16} color="#678b78" /></div><strong>7</strong></div>
      <div className="queue-stat"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Next forum</span><FileCheck2 size={16} color="#678b78" /></div><strong>Apr 12</strong></div>
    </div>

    <section className="panel panel-pad section-space">
      <div className="panel-header"><div><div className="panel-kicker">Governance review · local sample</div><h2>{data.queueTitle}</h2></div><Badge tone="amber">{filtered.length} in view</Badge></div>
      <div className="filter-row">
        <div style={{ position: 'relative', flex: '1 1 230px' }}><Search size={15} style={{ position: 'absolute', left: 11, top: 11, color: '#8a928e' }} /><input className="field" style={{ paddingLeft: 34 }} type="search" placeholder="Search reference, item, type…" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search governance queue" data-testid="input-workspace-search" /></div>
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
      <p className="tagline-note">Sample governance references and review statuses are fictional.</p>
    </section>

    <div className="notice section-space"><CircleHelp /><div><strong>About this governance preview</strong>{data.boundary}</div></div>

    {activeItem && <Modal title={activeItem.action} subtitle={`${activeItem.reference} · ${activeItem.title}`} onClose={() => setActiveItem(null)} footer={confirmed ? <><button className="btn btn-outline" onClick={() => setConfirmed(false)}>Go back</button><button className="btn btn-primary" onClick={confirmAction}>Confirm demo action</button></> : <><button className="btn btn-outline" onClick={() => setActiveItem(null)}>Close preview</button><button className="btn btn-primary" onClick={() => setConfirmed(true)} data-testid="button-confirm-role-preview">Preview action</button></>}>
      <div className="detail-row"><span>Item</span><strong>{activeItem.title}</strong></div><div className="detail-row"><span>Reference</span><strong>{activeItem.reference}</strong></div><div className="detail-row"><span>Current status</span><Badge tone={toneFor(activeItem.status)}>{activeItem.status}</Badge></div><div className="detail-row"><span>Priority</span><Badge tone={activeItem.priority === 'High' ? 'red' : 'amber'}>{activeItem.priority}</Badge></div><div className="detail-row"><span>Detail</span><strong>{activeItem.detail}</strong></div>
      <ul className="timeline" style={{ marginTop: 14 }}><li>Created in sample workspace</li><li>Current status · {activeItem.status}</li><li>Next step · {confirmed ? 'Confirm to mark as previewed' : 'Preview the action to continue'}</li></ul>
      <div className="notice section-space"><CircleHelp /><div><strong>Local interface preview only</strong>This is a fictional governance preview, not an authenticated superuser session. No unrestricted record editing or live configuration controls.</div></div>
      {confirmed && <div className="modal-confirm-line" role="status">Confirm this sample-only action? The item will be labeled "Previewed locally".</div>}
    </Modal>}
    {toast}
  </main>;
}
