import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { CheckCircle2, KeyRound, Plus, RefreshCw, ShieldCheck, UserX } from 'lucide-react';
import { Badge, Modal, PageHeading, useNotice } from '../components/PortalUI';
import { apiFetch, ApiError } from '../lib/api';
import { useAuth } from '../lib/auth';
import { PORTAL_ROLES, ROLE_LABELS, roleLabel } from '../lib/roles';

type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: string;
};

const PASSWORD_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';

function suggestPassword() {
  const values = new Uint32Array(14);
  crypto.getRandomValues(values);
  let out = '';
  values.forEach((value) => { out += PASSWORD_ALPHABET[value % PASSWORD_ALPHABET.length]; });
  return out;
}

function readableDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function AccountsPage() {
  const { user } = useAuth();
  const { announce, toast } = useNotice();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');
  const [password, setPassword] = useState('');
  const [creating, setCreating] = useState(false);

  const [resetTarget, setResetTarget] = useState<AdminUser | null>(null);
  const [resetPassword, setResetPassword] = useState('');

  const canGrantSuperAdmin = user?.role === 'super-administrator';
  const roleOptions = useMemo(
    () => PORTAL_ROLES.filter((item) => canGrantSuperAdmin || item !== 'super-administrator'),
    [canGrantSuperAdmin],
  );

  const load = useCallback(async () => {
    setError('');
    try {
      const data = await apiFetch<{ users: AdminUser[] }>('/admin/users');
      setUsers(data.users);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : 'Could not load accounts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function createAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreating(true);
    setError('');
    try {
      await apiFetch('/admin/users', {
        method: 'POST',
        body: JSON.stringify({ name: name.trim(), email: email.trim(), role, password }),
      });
      announce(`${name.trim()} was added as ${roleLabel(role)}.`);
      setName('');
      setEmail('');
      setRole('student');
      setPassword('');
      await load();
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : 'Could not create the account.');
    } finally {
      setCreating(false);
    }
  }

  async function patchAccount(account: AdminUser, body: Record<string, unknown>, message: string) {
    setBusyId(account.id);
    setError('');
    try {
      await apiFetch(`/admin/users/${account.id}`, { method: 'PATCH', body: JSON.stringify(body) });
      announce(message);
      await load();
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : 'Could not update the account.');
    } finally {
      setBusyId('');
    }
  }

  async function confirmReset() {
    if (!resetTarget) return;
    await patchAccount(resetTarget, { password: resetPassword }, `Temporary password set for ${resetTarget.name}.`);
    setResetTarget(null);
    setResetPassword('');
  }

  return <main className="main-content">
    <PageHeading
      eyebrow="Governance · Accounts"
      title="Portal accounts"
      subtitle="Provision one account per person, assign exactly one role, and keep access current. New users receive the temporary password you set here."
      action={<Badge tone="green"><ShieldCheck size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />{users.length} accounts</Badge>}
    />

    {error && <div className="login-alert" role="alert" style={{ marginBottom: 16 }}><ShieldCheck /><div>{error}</div></div>}

    <div className="grid two-col">
      <section className="panel panel-pad">
        <div className="panel-header"><div><div className="panel-kicker">Provision an account</div><h2>New portal user</h2></div><Plus size={18} color="#678b78" /></div>
        <form onSubmit={createAccount}>
          <label className="field-label" htmlFor="account-name">Full name</label>
          <input id="account-name" className="field" value={name} onChange={(event) => setName(event.target.value)} required minLength={2} disabled={creating} data-testid="input-account-name" />

          <label className="field-label" htmlFor="account-email" style={{ marginTop: 12 }}>Email address</label>
          <input id="account-email" className="field" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={creating} placeholder="name@northfield.edu" data-testid="input-account-email" />

          <label className="field-label" htmlFor="account-role" style={{ marginTop: 12 }}>Role</label>
          <select id="account-role" className="field" value={role} onChange={(event) => setRole(event.target.value)} disabled={creating} data-testid="select-account-role">
            {roleOptions.map((item) => <option key={item} value={item}>{ROLE_LABELS[item]}</option>)}
          </select>

          <label className="field-label" htmlFor="account-password" style={{ marginTop: 12 }}>Temporary password</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input id="account-password" className="field" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={10} disabled={creating} placeholder="At least 10 characters" data-testid="input-account-password" />
            <button type="button" className="btn btn-outline btn-small" onClick={() => setPassword(suggestPassword())} disabled={creating} data-testid="button-suggest-password"><RefreshCw /> Suggest</button>
          </div>

          <button className="btn btn-primary" type="submit" style={{ marginTop: 16, width: '100%' }} disabled={creating} data-testid="button-create-account">
            {creating ? 'Creating…' : 'Create account'}
          </button>
        </form>
        <p className="tagline-note" style={{ marginTop: 12 }}>Share the temporary password through a secure channel. A password reset signs that user out everywhere.</p>
      </section>

      <section className="panel panel-pad">
        <div className="panel-header"><div><div className="panel-kicker">Directory</div><h2>Accounts by role</h2></div><Badge tone={users.filter((item) => item.isActive).length ? 'green' : 'gray'}>{users.filter((item) => item.isActive).length} active</Badge></div>
        {loading ? <div className="empty-state"><RefreshCw /><strong>Loading accounts…</strong></div> : <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Person</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{users.map((account) => {
              const self = account.id === user?.id;
              const busy = busyId === account.id;
              // A system administrator cannot manage super administrator accounts.
              const locked = account.role === 'super-administrator' && !canGrantSuperAdmin;
              const readOnly = self || locked;
              const optionsForRow = roleOptions.includes(account.role) ? roleOptions : [account.role, ...roleOptions];
              return <tr key={account.id} data-testid={`row-account-${account.id}`}>
                <td><strong>{account.name}</strong><small>{account.email} · added {readableDate(account.createdAt)}</small></td>
                <td>{readOnly ? <Badge tone="gray">{roleLabel(account.role)}</Badge> : <select className="field" value={account.role} disabled={busy} aria-label={`Role for ${account.name}`} onChange={(event) => void patchAccount(account, { role: event.target.value }, `Role updated for ${account.name}.`)}>{optionsForRow.map((item) => <option key={item} value={item}>{ROLE_LABELS[item]}</option>)}</select>}</td>
                <td><Badge tone={account.isActive ? 'green' : 'red'}>{account.isActive ? 'Active' : 'Disabled'}</Badge></td>
                <td>{readOnly ? <small>{self ? 'You' : 'Managed by super administrator'}</small> : <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <button className="btn btn-outline btn-small" disabled={busy} onClick={() => { setResetTarget(account); setResetPassword(suggestPassword()); }} data-testid={`button-reset-${account.id}`}><KeyRound /> Reset</button>
                  <button className="btn btn-outline btn-small" disabled={busy} onClick={() => void patchAccount(account, { isActive: !account.isActive }, account.isActive ? `${account.name} was disabled.` : `${account.name} was re-enabled.`)} data-testid={`button-toggle-${account.id}`}>{account.isActive ? <><UserX /> Disable</> : <><CheckCircle2 /> Enable</>}</button>
                </div>}</td>
              </tr>;
            })}</tbody>
          </table>
        </div>}
        <p className="tagline-note">Every account has exactly one role; its dashboard is chosen by that role on every sign-in.</p>
      </section>
    </div>

    {resetTarget && <Modal
      title={`Reset password for ${resetTarget.name}?`}
      subtitle="This signs the user out of every device. Share the new temporary password securely."
      onClose={() => setResetTarget(null)}
      footer={<><button className="btn btn-outline" onClick={() => setResetTarget(null)}>Cancel</button><button className="btn btn-primary" onClick={() => void confirmReset()} disabled={resetPassword.length < 10} data-testid="button-confirm-reset">Set temporary password</button></>}
    >
      <label className="field-label" htmlFor="reset-password">Temporary password</label>
      <div style={{ display: 'flex', gap: 8 }}>
        <input id="reset-password" className="field" value={resetPassword} onChange={(event) => setResetPassword(event.target.value)} minLength={10} data-testid="input-reset-password" />
        <button type="button" className="btn btn-outline btn-small" onClick={() => setResetPassword(suggestPassword())}><RefreshCw /> Suggest</button>
      </div>
    </Modal>}
    {toast}
  </main>;
}
