import { useEffect, useState } from 'react';
import { ArrowRight, CircleHelp, Search, ShieldCheck, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { Badge, Modal, PageHeading, useNotice } from './PortalUI';
import { demoRoles, workspacePreviews, type WorkspaceItem } from '../data';

function toneFor(status: string) {
  if (/official|satisfied|complete|approved|enrolled|previewed|ready|indexed/i.test(status)) return 'green' as const;
  if (/provisional|progress|queue|awaiting|open|review|draft|in review|routing|planning|consultation|preparation|sampling|upcoming|documentation|informational|configuration|for discussion/i.test(status)) return 'amber' as const;
  if (/needed|remaining|waitlist|high|incomplete|overdue|check|conflict|reconcile|evidence gathering/i.test(status)) return 'red' as const;
  return 'gray' as const;
}

function priorityTone(priority: string) {
  if (/high/i.test(priority)) return 'red' as const;
  if (/normal/i.test(priority)) return 'amber' as const;
  return 'gray' as const;
}

export function EnhancedWorkspace() {
  const [location, setLocation] = useLocation();
  const slug = location.split('/').filter(Boolean).pop() ?? '';
  const workspace = workspacePreviews.find((p) => p.slug === slug);
  const role = demoRoles.find((r) => r.slug === slug);
  const [tab, setTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [items, setItems] = useState<WorkspaceItem[]>(workspace?.items ?? []);
  const [activeItem, setActiveItem] = useState<WorkspaceItem | null>(null);
  const [actionConfirmed, setActionConfirmed] = useState(false);
  const { announce, toast } = useNotice();
  const readOnly = slug === 'auditor-compliance';

  useEffect(() => {
    setItems(workspace?.items ?? []);
    setActiveItem(null);
    setTab('overview');
    setSearch('');
    setPriorityFilter('All');
    setStatusFilter('All');
  }, [slug, workspace]);

  const filtered = items.filter((item) => {
    const q = `${item.reference} ${item.title} ${item.detail}`.toLowerCase().includes(search.toLowerCase());
    const p = priorityFilter === 'All' || item.priority === priorityFilter;
    const s = statusFilter === 'All' || item.status === statusFilter;
    return q && p && s;
  });
  const priorities = ['All', ...Array.from(new Set(items.map((i) => i.priority)))];
  const statuses = ['All', ...Array.from(new Set(items.map((i) => i.status)))];
  const highCount = items.filter((i) => i.priority === 'High').length;
  const actionedCount = items.filter((i) => i.status.includes('Previewed')).length;
  const needsAction = items.length - actionedCount;

  function clearFilters() { setSearch(''); setPriorityFilter('All'); setStatusFilter('All'); }

  function confirmPreviewAction() {
    if (!activeItem) return;
    setItems((cur) => cur.map((it) => it.reference === activeItem.reference ? { ...it, status: 'Previewed locally' } : it));
    setActiveItem(null);
    setActionConfirmed(false);
    announce('Sample action previewed. No live system was changed.');
  }

  if (!workspace || !role) {
    return <main className="main-content"><PageHeading eyebrow="Role preview" title="Workspace not found" subtitle="Choose one of the defined demo roles to continue." action={<Link className="btn btn-primary" href="/login">Choose a demo role <ArrowRight /></Link>} /></main>;
  }

  const tabBtn = (id: string, label: string) => (
    <button className={`tab ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)} data-testid={`tab-${id}`}>{label}</button>
  );

  return <main className="main-content">
    <PageHeading eyebrow={`${workspace.unit} · DEMO PREVIEW`} title={workspace.heading} subtitle={workspace.intro} action={<Link className="btn btn-outline btn-small" href="/login" data-testid="button-return-role-selector">Switch demo role <ArrowRight /></Link>} />

    <section className="role-preview-banner">
      <div><span className="role-preview-overline">{role.name} workspace · fictional sample data</span><h2>{workspace.queueTitle}</h2><p>{workspace.queueNote}</p></div>
      <div className="role-preview-seal" aria-hidden="true"><span>N</span><small>DEMO<br />VIEW</small></div>
    </section>

    <div className="tabs" role="tablist">
      {tabBtn('overview', 'Overview')}
      {tabBtn('queue', workspace.queueTitle)}
      {tabBtn('reference', 'Reference')}
    </div>

    {tab === 'overview' && <>
      <section className="role-metric-strip section-space" aria-label={`${role.name} sample metrics`}>
        {workspace.metrics.map((m, i) => <div className="role-metric" key={m.label}>
          <span className="role-metric-label">{m.label}</span><strong>{m.value}</strong><small>{m.note}</small>
          {i < workspace.metrics.length - 1 && <i aria-hidden="true" />}
        </div>)}
      </section>
      <div className="grid two-col section-space">
        <section className="panel panel-pad">
          <div className="panel-header"><div><div className="panel-kicker">Latest from the queue</div><h2>Recent activity</h2></div><Badge tone={readOnly ? 'gray' : 'amber'}>{items.length} items</Badge></div>
          <div className="role-work-list">{items.map((item) => <article className="role-work-item" key={item.reference}>
            <div className="role-work-ref">{item.reference}</div>
            <div className="role-work-copy">
              <div className="role-work-title-row"><h3>{item.title}</h3><Badge tone={priorityTone(item.priority)}>{item.priority}</Badge></div>
              <p>{item.detail}</p>
              <div className="role-work-meta"><Badge tone={toneFor(item.status)}>{item.status}</Badge>{readOnly && <span className="read-only-caption">View only · no record actions</span>}</div>
            </div>
            {readOnly ? <span className="read-only-action"><ShieldCheck size={15} /> Read only</span> : <button className="btn btn-outline btn-small role-work-action" onClick={() => { setActiveItem(item); setActionConfirmed(false); }} data-testid={`button-preview-${item.reference.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>{item.action}<ArrowRight /></button>}
          </article>)}
        </div>
        </section>
        <aside className="grid" style={{ gap: 16 }}>
          <section className="panel panel-pad">
            <div className="panel-kicker">Quick summary</div><h2>Queue at a glance</h2>
            <div className="detail-row"><span>Total sample items</span><strong>{items.length}</strong></div>
            <div className="detail-row"><span>High priority</span><strong style={{ color: highCount ? '#a65543' : '#43715a' }}>{highCount}</strong></div>
            <div className="detail-row"><span>Actioned in preview</span><strong>{actionedCount}</strong></div>
            <div className="detail-row"><span>Awaiting action</span><strong>{needsAction}</strong></div>
          </section>
          <section className="notice"><CircleHelp /><div><strong>Preview boundary</strong>{workspace.boundary}</div></section>
          <div className="role-demo-stamp"><span className="demo-dot" /> Demo preview · sample data · not live · no account authenticated</div>
        </aside>
      </div>
    </>}

    {tab === 'queue' && <section className="panel panel-pad section-space">
      <div className="panel-header">
        <div><div className="panel-kicker">{readOnly ? 'Read-only evidence sample' : `${role.name} · sample work items`}</div><h2>{workspace.queueTitle}</h2><p className="subtitle">{workspace.queueNote}</p></div>
        <Badge tone={readOnly ? 'gray' : 'amber'}>{readOnly ? 'Read only' : `${filtered.length} items`}</Badge>
      </div>
      <div className="filter-row">
        <div style={{ position: 'relative', flex: '1 1 230px' }}>
          <Search size={15} style={{ position: 'absolute', left: 11, top: 11, color: '#8a928e' }} />
          <input className="field" style={{ paddingLeft: 34 }} type="search" placeholder="Search reference, title, detail…" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search items" data-testid="input-workspace-search" />
        </div>
        <select className="field" style={{ width: 'auto', minWidth: 130 }} value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} aria-label="Filter by priority" data-testid="select-priority-filter">
          {priorities.map((p) => <option key={p}>{p}</option>)}
        </select>
        <select className="field" style={{ width: 'auto', minWidth: 130 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by status" data-testid="select-status-filter">
          {statuses.map((s) => <option key={s}>{s}</option>)}
        </select>
        <button className="btn btn-outline btn-small" onClick={clearFilters} data-testid="button-clear-filters"><X /> Clear</button>
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead><tr><th>Reference</th><th>Title</th><th>Detail</th><th>Status</th><th>Priority</th><th>{readOnly ? 'Access' : 'Action'}</th></tr></thead>
          <tbody>
            {filtered.map((item) => <tr key={item.reference} className="staff-row" onClick={() => !readOnly && setActiveItem(item)} tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' && !readOnly) setActiveItem(item); }} data-testid={`row-item-${item.reference.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>
              <td><strong>{item.reference}</strong></td>
              <td>{item.title}</td>
              <td><small>{item.detail}</small></td>
              <td><Badge tone={toneFor(item.status)}>{item.status}</Badge></td>
              <td><Badge tone={priorityTone(item.priority)}>{item.priority}</Badge></td>
              <td>{readOnly ? <span className="read-only-action"><ShieldCheck size={15} /> Read only</span> : <button className="btn btn-outline btn-small" onClick={(e) => { e.stopPropagation(); setActiveItem(item); }} data-testid={`button-review-${item.reference.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>{item.action} <ArrowRight /></button>}</td>
            </tr>)}
          </tbody>
        </table>
      </div>
      <div className="mobile-card-list">
        {filtered.map((item) => <div className="mobile-record" key={item.reference}>
          <div className="mobile-record-top"><strong>{item.title}</strong><Badge tone={priorityTone(item.priority)}>{item.priority}</Badge></div>
          <p>{item.reference} · {item.detail}</p>
          <div className="mobile-record-foot"><Badge tone={toneFor(item.status)}>{item.status}</Badge>{readOnly ? <span className="read-only-action"><ShieldCheck size={15} /> Read only</span> : <button className="btn btn-outline btn-small" onClick={() => setActiveItem(item)} data-testid={`mobile-review-${item.reference.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>{item.action} <ArrowRight /></button>}</div>
        </div>)}
      </div>
      {filtered.length === 0 && <div className="empty-state"><Search /><strong>No matching items</strong><p>Adjust the filters or search for another sample record.</p><button className="btn btn-secondary btn-small" style={{ marginTop: 12 }} onClick={clearFilters}>Reset filters</button></div>}
      <p className="tagline-note">Sample references, titles, and statuses are fictional.</p>
    </section>}

    {tab === 'reference' && <div className="grid two-col section-space">
      <section className="panel panel-pad">
        <div className="panel-kicker">{workspace.unit}</div><h2>{workspace.widgetTitle}</h2><p className="subtitle" style={{ marginTop: 8 }}>{workspace.widgetNote}</p>
        <div className="role-widget-rows">{workspace.widgetRows.map((row) => <div className="detail-row" key={row.label}><span>{row.label}</span><strong>{row.value}</strong></div>)}</div>
      </section>
      <aside className="grid" style={{ gap: 16 }}>
        <section className="panel panel-pad">
          <div className="panel-kicker">Role profile</div><h2>{role.name}</h2><p className="subtitle" style={{ marginTop: 8 }}>{role.summary}</p>
          <div className="detail-row"><span>Group</span><strong>{role.group}</strong></div>
          <div className="detail-row"><span>Workspace</span><strong>{workspace.heading}</strong></div>
          <div className="detail-row"><span>Sample items</span><strong>{items.length} fictional records</strong></div>
        </section>
        <section className="notice role-boundary"><CircleHelp /><div><strong>Preview boundary</strong>{workspace.boundary}</div></section>
        <div className="role-demo-stamp"><span className="demo-dot" /> Demo preview · sample data · not live · no account authenticated</div>
      </aside>
    </div>}

    {activeItem && <Modal title={activeItem.action} subtitle={`${activeItem.reference} · ${activeItem.title}`} onClose={() => setActiveItem(null)} footer={actionConfirmed ? <><button className="btn btn-outline" onClick={() => setActionConfirmed(false)}>Go back</button><button className="btn btn-primary" onClick={confirmPreviewAction}>Confirm demo action</button></> : <><button className="btn btn-outline" onClick={() => setActiveItem(null)}>Close preview</button><button className="btn btn-primary" onClick={() => setActionConfirmed(true)} data-testid="button-confirm-role-preview">Preview action</button></>}>
      <div className="detail-row"><span>Current sample status</span><Badge tone={toneFor(activeItem.status)}>{activeItem.status}</Badge></div>
      <div className="detail-row"><span>Priority</span><Badge tone={priorityTone(activeItem.priority)}>{activeItem.priority}</Badge></div>
      <div className="detail-row"><span>Role</span><strong>{role.name}</strong></div>
      <div className="detail-row"><span>Reference</span><strong>{activeItem.reference}</strong></div>
      <ul className="timeline" style={{ marginTop: 14 }}>
        <li>Created in sample workspace</li>
        <li>Current status · {activeItem.status}</li>
        <li>Next step · {actionConfirmed ? 'Confirm to mark as previewed' : 'Preview the action to continue'}</li>
      </ul>
      <div className="notice section-space"><CircleHelp /><div><strong>Local interface preview only</strong>This action will only update the status shown in this sample workspace. It will not contact a campus office or change an official record.</div></div>
      {actionConfirmed && <div className="modal-confirm-line" role="status">Confirm this sample-only action? The record will be labeled "Previewed locally".</div>}
    </Modal>}
    {toast}
  </main>;
}
