import { useEffect, useState } from 'react';
import { adminLogin, adminSignatures, downloadCsv } from '../api.js';

const TOKEN_KEY = 'petitionAdminToken';

const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );

export default function Admin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [entries, setEntries] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      loadEntries(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadEntries(tkn) {
    setError('');
    setLoading(true);
    try {
      setEntries(await adminSignatures(tkn));
    } catch (err) {
      setEntries(null);
      setError(err.message);
      if (err.status === 401) {
        setToken('');
        setEntries(null);
        localStorage.removeItem(TOKEN_KEY);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password) {
      setError('Enter your username and password.');
      return;
    }
    setLoading(true);
    try {
      const data = await adminLogin(username.trim(), password);
      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      await loadEntries(data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setToken('');
    setEntries(null);
    localStorage.removeItem(TOKEN_KEY);
  }

  async function exportCsv() {
    setError('');
    try {
      await downloadCsv(token);
    } catch (err) {
      setError(err.message);
    }
  }

  if (!token) {
    return (
      <div className="forms-card admin-card">
        <div className="question">
          <span className="accent-bar" aria-hidden="true" />
          <div className="question-body">
            <h2 className="admin-title">Organiser sign in</h2>
            <p className="hint">Enter the admin username and password to view all applicants.</p>
          </div>
        </div>

        <form className="admin-login" onSubmit={handleLogin}>
          <label className="login-field">
            <span>Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              placeholder="Your answer"
            />
          </label>
          <label className="login-field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="Your answer"
            />
          </label>

          {error ? (
            <p className="error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="submit-row">
            <button type="submit" className="btn-primary submit-btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-card">
      <div className="admin-toolbar">
        <div>
          <h2 className="admin-title">
            Applicants{entries ? ` (${entries.length})` : ''}
          </h2>
          <p className="hint">Load every applicant, export as CSV, or print the full petition.</p>
        </div>
        <div className="toolbar-actions">
          {entries && entries.length > 0 ? (
            <>
              <button className="btn-ghost" onClick={exportCsv}>
                Export CSV
              </button>
              <button className="btn-primary" onClick={() => window.print()}>
                Print Petition
              </button>
            </>
          ) : null}
          <button className="btn-ghost" onClick={logout}>
            Log out
          </button>
        </div>
      </div>

      <div className="load-row">
        <button className="btn-ghost" onClick={() => loadEntries(token)} disabled={loading}>
          {loading ? 'Loading...' : 'Load applicants'}
        </button>
      </div>

      {error ? (
        <p className="error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="print-area">
        {entries ? (
          entries.length === 0 ? (
            <p className="empty">No applicants yet.</p>
          ) : (
            <div className="entries">
              {entries.map((entry, index) => (
                <div className="entry" key={entry._id}>
                  <div className="entry-head">
                    <span className="entry-no">{index + 1}</span>
                    <div className="entry-meta">
                      <strong>{escapeHtml(entry.fullName)}</strong>
                      <span>
                        {escapeHtml(entry.enrollmentNumber)} &middot; Room {escapeHtml(entry.roomNumber)}
                      </span>
                      <span>{new Date(entry.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <img
                    className="entry-sig"
                    src={entry.signatureData}
                    alt={`Signature of ${escapeHtml(entry.fullName)}`}
                  />
                </div>
              ))}
            </div>
          )
        ) : null}
      </div>
    </div>
  );
}