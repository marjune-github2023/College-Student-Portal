import { useState, type FormEvent } from 'react';
import { Link, Redirect, useLocation, useSearch } from 'wouter';
import { ArrowRight, Landmark, ShieldCheck } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { ApiError } from '../lib/api';
import { homeForRole } from '../lib/roles';

export function LoginPage() {
  const { user, loading, login } = useAuth();
  const [, setLocation] = useLocation();
  const search = useSearch();
  const next = new URLSearchParams(search).get('next');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    return <Redirect to={next && next.startsWith('/') ? next : homeForRole(user.role)} />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const signedIn = await login(email.trim(), password);
      setLocation(next && next.startsWith('/') ? next : homeForRole(signedIn.role));
    } catch (caught) {
      if (caught instanceof ApiError) {
        setError(caught.message);
      } else {
        setError('Could not reach the portal. Check your connection and try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return <main className="login-page">
    <section className="login-story" aria-label="Northfield College introduction">
      <Link className="login-brand" href="/login" aria-label="Northfield College Campus Portal"><span className="brand-mark">N</span><span><span className="brand-name">Northfield College</span><span className="brand-sub" style={{ display: 'block' }}>Campus portal</span></span></Link>
      <div className="login-quote"><div className="login-overline">A clearer way through college</div><h1>Know where you are. <span>See what comes next.</span></h1><p>One welcoming place to understand academic plans, official records, and the steps between them.</p></div>
      <div className="login-orbit" aria-hidden="true"><Landmark /></div>
      <div className="login-story-foot">NORTHFIELD COLLEGE · STUDENT &amp; REGISTRAR PORTAL</div>
    </section>

    <section className="login-main" aria-labelledby="login-heading">
      <div className="login-card">
        <div className="eyebrow">Campus portal · secure sign-in</div>
        <h2 id="login-heading">Sign in to your workspace.</h2>
        <p className="subtitle">Use the account issued to you by the College. Your role decides which dashboard opens.</p>

        <form onSubmit={handleSubmit} noValidate>
          <label className="field-label" htmlFor="login-email">Email address</label>
          <input
            id="login-email"
            className="field"
            type="email"
            autoComplete="username"
            inputMode="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@northfield.edu"
            required
            disabled={submitting}
            data-testid="input-login-email"
          />

          <label className="field-label" htmlFor="login-password" style={{ marginTop: 14 }}>Password</label>
          <input
            id="login-password"
            className="field"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Your password"
            required
            disabled={submitting}
            data-testid="input-login-password"
          />

          {error && <div className="login-alert" role="alert" style={{ marginTop: 15, marginBottom: 0 }}><ShieldCheck /><div><strong style={{ display: 'block', marginBottom: 2 }}>Sign-in failed</strong>{error}</div></div>}

          <button className="btn btn-primary login-continue" type="submit" disabled={submitting} style={{ marginTop: 18 }} data-testid="button-login">
            {submitting ? 'Signing in…' : 'Sign in'} <ArrowRight />
          </button>
        </form>

        <p className="login-footnote" style={{ marginTop: 18 }}>Forgot your password? Account recovery is handled by the Registrar or a System Administrator — they can issue a new temporary password.</p>
        <p className="login-footnote">Accounts are provisioned by authorised administrators. There is no public sign-up, and no way to choose your own role.</p>
      </div>
    </section>
  </main>;
}
