import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { Bell, BookOpen, CalendarDays, Check, ChevronDown, ChevronRight, ClipboardList, FileText, GraduationCap, LayoutDashboard, LogOut, UsersRound, X } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { ADMIN_ROLES, homeForRole, roleLabel } from '../lib/roles';

export function Badge({ children, tone }: { children: ReactNode; tone?: 'green' | 'amber' | 'red' | 'gray' }) {
  return <span className={`chip chip-${tone ?? 'gray'}`}>{children}</span>;
}

export function PageHeading({ eyebrow, title, subtitle, action }: { eyebrow: string; title: ReactNode; subtitle: string; action?: ReactNode }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p className="subtitle">{subtitle}</p></div>{action}</div>;
}

export function Modal({ title, subtitle, onClose, children, footer }: { title: string; subtitle?: string; onClose: () => void; children?: ReactNode; footer?: ReactNode }) {
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

export function PortalShell({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const { user, loading, logout } = useAuth();
  const [sampleNotice, setSampleNotice] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  if (location === '/login') return <>{children}</>;
  if (loading) return <div className="app-shell"><div className="shell-main"><main className="main-content" role="status" aria-live="polite"><div className="panel panel-pad"><div className="panel-kicker">Campus portal</div><h2>Checking your session…</h2></div></main></div></div>;
  if (!user) return <>{children}</>;

  const home = homeForRole(user.role);
  const isAdmin = ADMIN_ROLES.includes(user.role);
  const roleLinks = user.role === 'student' ? studentLinks : [{ href: home, label: 'Dashboard', icon: LayoutDashboard }];
  const links = isAdmin ? [...roleLinks, { href: '/admin/accounts', label: 'Accounts', icon: UsersRound }] : roleLinks;
  const roleInitials = user.name.split(/[\s.]+/).filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  const sectionLabel = location === '/admin/accounts' ? 'Account provisioning' : location === home ? 'Dashboard' : 'Workspace';

  async function signOut() {
    setAccountOpen(false);
    await logout();
    setLocation('/login');
  }

  return <div className="app-shell">
    <aside className="sidebar" aria-label="Primary navigation">
      <Link href={home} className="brand" data-testid="link-campus-home">
        <div className="brand-mark" aria-hidden="true">N</div><div><div className="brand-name">Northfield College</div><div className="brand-sub">Campus portal</div></div>
      </Link>
      <div className="nav-caption">{roleLabel(user.role)} workspace</div>
      {links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={`nav-link ${location === href ? 'active' : ''}`} aria-current={location === href ? 'page' : undefined} data-testid={`link-${label.toLowerCase().replaceAll(' ', '-')}`}><Icon />{label}</Link>)}
      <div className="sidebar-bottom"><div className="profile"><div className="avatar">{roleInitials}</div><div><strong>{user.name}</strong><small>{roleLabel(user.role)}</small></div></div></div>
    </aside>
    <div className="shell-main">
      <header className="topbar"><div className="crumb"><BookOpen size={15} /><strong>{roleLabel(user.role)}</strong><ChevronRight size={13} /><span>{sectionLabel}</span></div><div className="top-actions"><button className="icon-button" aria-label="Portal notice" title="Portal notice" onClick={() => setSampleNotice((value) => !value)}><Bell size={17} /></button><div className="account-wrap"><button className="account-trigger" type="button" aria-haspopup="menu" aria-expanded={accountOpen} aria-controls="account-menu" onClick={() => setAccountOpen((value) => !value)} onKeyDown={(event) => { if (event.key === 'Escape') setAccountOpen(false); }} data-testid="button-account-menu"><span className="account-avatar">{roleInitials}</span><span className="account-label">{user.name}<small>{roleLabel(user.role)}</small></span><ChevronDown size={14} /></button>{accountOpen && <div className="account-menu" id="account-menu" role="menu" aria-label="Account actions"><div className="account-menu-intro"><strong>{user.name}</strong><span>{user.email}</span></div><div className="account-menu-note">Signed in as {roleLabel(user.role)}. Your role decides which dashboard opens.</div><button className="account-menu-action" role="menuitem" onClick={() => { setAccountOpen(false); setLocation(home); }} data-testid="button-go-to-dashboard"><LayoutDashboard size={15} />My dashboard</button><button className="account-menu-action" role="menuitem" onClick={() => void signOut()} data-testid="button-sign-out"><LogOut size={15} />Sign out</button></div>}</div></div></header>
      <div className="demo-status-line" role="note"><span><strong>Preview environment</strong> · institutional sample data, not live records</span></div>
      {sampleNotice && <div className="sample-banner" role="status"><span>This portal is showing sample institutional data while it is being reviewed.</span><button onClick={() => setSampleNotice(false)} aria-label="Dismiss notice"><X size={14} /></button></div>}
      {children}
    </div>
    <nav className="mobile-bottom" aria-label="Mobile navigation">{links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={location === href ? 'active' : ''} aria-label={label} data-testid={`mobile-link-${label.toLowerCase().replaceAll(' ', '-')}`}><Icon /><span>{label === 'Degree progress' ? 'Progress' : label === 'Documents' ? 'Docs' : label === 'Account provisioning' ? 'Accounts' : label}</span></Link>)}</nav>
  </div>;
}
