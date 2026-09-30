import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { Bell, BookOpen, CalendarDays, Check, ChevronDown, ChevronRight, ClipboardList, FileText, GraduationCap, LayoutDashboard, LogOut, X } from 'lucide-react';
import { student } from '../data';

export function Badge({ children, tone }: { children: ReactNode; tone?: 'green' | 'amber' | 'red' | 'gray' }) {
  return <span className={`chip chip-${tone ?? 'gray'}`}>{children}</span>;
}

export function PageHeading({ eyebrow, title, subtitle, action }: { eyebrow: string; title: ReactNode; subtitle: string; action?: ReactNode }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p className="subtitle">{subtitle}</p></div>{action}</div>;
}

export function Modal({ title, subtitle, onClose, children, footer }: { title: string; subtitle?: string; onClose: () => void; children?: React.ReactNode; footer?: React.ReactNode }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-head"><div><h2 id="modal-title">{title}</h2>{subtitle && <p className="subtitle">{subtitle}</p>}</div><button className="modal-close" onClick={onClose} aria-label="Close dialog" data-testid="button-close-dialog"><X /></button></div>
      {children}
      {footer && <div className="modal-actions">{footer}</div>}
    </section>
  </div>;
}

export function useNotice() {
  const [notice, setNotice] = useState('');
  const announce = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 3200);
  };
  const toast = notice ? <div className="toast" role="status" aria-live="polite"><Check />{notice}</div> : null;
  return { announce, toast };
}

const studentLinks = [
  { href: '/student/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/student/enrollment', label: 'Enrollment', icon: CalendarDays },
  { href: '/student/grades', label: 'Grades', icon: ClipboardList },
  { href: '/student/progress', label: 'Degree progress', icon: GraduationCap },
  { href: '/student/documents', label: 'Documents', icon: FileText },
];
const staffLinks = [{ href: '/registrar/dashboard', label: 'Staff dashboard', icon: LayoutDashboard }];

export function PortalShell({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const [sampleNotice, setSampleNotice] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const staff = location.startsWith('/registrar');
  if (location === '/login') return <>{children}</>;
  function signOut() {
    setAccountOpen(false);
    setLocation('/login');
  }
  return <div className="app-shell">
    <aside className="sidebar" aria-label="Primary navigation">
      <Link href="/student/dashboard" className="brand" data-testid="link-campus-home">
        <div className="brand-mark" aria-hidden="true">N</div><div><div className="brand-name">Northfield College</div><div className="brand-sub">Campus portal</div></div>
      </Link>
      <div className="nav-caption">Student workspace</div>
      {studentLinks.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={`nav-link ${location === href || (location === '/' && href === '/student/dashboard') ? 'active' : ''}`} aria-current={location === href ? 'page' : undefined} data-testid={`link-${label.toLowerCase().replaceAll(' ', '-')}`}><Icon />{label}</Link>)}
      <div className="nav-caption">Registrar office</div>
      {staffLinks.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={`nav-link ${location === href ? 'active' : ''}`} aria-current={location === href ? 'page' : undefined} data-testid="link-registrar-dashboard"><Icon />{label}</Link>)}
      <div className="sidebar-bottom"><div className="profile"><div className="avatar">MV</div><div><strong>{staff ? 'Registrar desk' : student.name}</strong><small>{staff ? 'Staff sample view' : student.studentId}</small></div></div></div>
    </aside>
    <div className="shell-main">
      <header className="topbar"><div className="crumb"><BookOpen size={15} />{staff ? 'Registrar workspace' : 'Student workspace'}<ChevronRight size={13} /><span>{staff ? 'Review queue' : 'Academic year 2025–26'}</span></div><div className="top-actions"><span className="demo-tag"><span className="demo-dot" />DEMO DATA</span><button className="icon-button" aria-label="Sample portal notice" title="Sample portal notice" onClick={() => setSampleNotice((value) => !value)}><Bell size={17} /></button><div className="account-wrap"><button className="account-trigger" type="button" aria-haspopup="menu" aria-expanded={accountOpen} aria-controls="account-menu" onClick={() => setAccountOpen((value) => !value)} onKeyDown={(event) => { if (event.key === 'Escape') setAccountOpen(false); }} data-testid="button-account-menu"><span className="account-avatar">{staff ? 'RO' : 'MV'}</span><span className="account-label">{staff ? 'Registrar desk' : 'Mara V.'}<small>Demo account</small></span><ChevronDown size={14} /></button>{accountOpen && <div className="account-menu" id="account-menu" role="menu" aria-label="Demo account actions"><div className="account-menu-intro"><strong>{staff ? 'Registrar sample view' : student.name}</strong><span>{staff ? 'Staff demo workspace' : student.studentId}</span></div><div className="account-menu-note">This is a demo-only workspace. No account is authenticated.</div><button className="account-menu-action" role="menuitem" onClick={signOut} data-testid="button-sign-out"><LogOut size={15} />Sign out to demo welcome</button></div>}</div></div></header>
      {sampleNotice && <div className="sample-banner" role="status"><span>This portal is showing fictional local sample information.</span><button onClick={() => setSampleNotice(false)} aria-label="Dismiss notice"><X size={14} /></button></div>}
      {children}
    </div>
    <nav className="mobile-bottom" aria-label="Mobile navigation">{[...studentLinks, ...staffLinks].map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={location === href || (location === '/' && href === '/student/dashboard') ? 'active' : ''} aria-label={label} data-testid={`mobile-link-${label.toLowerCase().replaceAll(' ', '-')}`}><Icon /><span>{label === 'Degree progress' ? 'Progress' : label === 'Staff dashboard' ? 'Staff' : label === 'Documents' ? 'Docs' : label}</span></Link>)}</nav>
  </div>;
}