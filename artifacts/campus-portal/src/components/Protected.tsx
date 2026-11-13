import type { ReactNode } from 'react';
import { Link, Redirect, useLocation } from 'wouter';
import { useAuth } from '../lib/auth';
import { homeForRole, roleLabel } from '../lib/roles';

function SessionLoading() {
  return <main className="main-content">
    <div className="panel panel-pad" role="status" aria-live="polite">
      <div className="panel-kicker">Campus portal</div>
      <h2>Checking your session…</h2>
      <p className="subtitle">Verifying your sign-in with the portal.</p>
    </div>
  </main>;
}

function AccessDenied({ role }: { role: string }) {
  return <main className="main-content">
    <div className="panel panel-pad" role="alert">
      <div className="panel-kicker">Access denied</div>
      <h1 style={{ marginBottom: 8 }}>This dashboard is not yours</h1>
      <p className="subtitle" style={{ maxWidth: 560 }}>Your account is signed in as <strong>{roleLabel(role)}</strong>. That role cannot open this area — each account only sees the workspace assigned to it by an administrator.</p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 18 }}>
        <Link className="btn btn-primary" href={homeForRole(role)}>Go to my dashboard</Link>
      </div>
    </div>
  </main>;
}

/**
 * Server-verified route gate: no session means the sign-in screen, and a role
 * mismatch means an access-denied state. The API enforces the same rule again.
 */
export function Protected({ roles, children }: { roles?: string[]; children: ReactNode }) {
  const { user, loading } = useAuth();
  const [location] = useLocation();

  if (loading) return <SessionLoading />;
  if (!user) return <Redirect to={`/login?next=${encodeURIComponent(location)}`} />;
  if (roles && !roles.includes(user.role)) return <AccessDenied role={user.role} />;
  return <>{children}</>;
}


