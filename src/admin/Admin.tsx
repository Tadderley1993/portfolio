import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { STATUSES, type Consultation, type Status } from '../lib/consultations'
import { Logo } from '../components/Logo'
import './admin.css'

export function Admin() {
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    document.title = 'Admin — d> Studio'
    if (!supabase) return setReady(true)
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setReady(true)
    })
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  return (
    <div className="admin">
      <header className="admin-top">
        <Logo className="admin-logo" />
        <span className="admin-name">Studio admin</span>
        <span className="admin-spacer" />
        {session && (
          <>
            <span className="admin-user">{session.user.email}</span>
            <button className="admin-btn" onClick={() => supabase!.auth.signOut()}>
              Sign out
            </button>
          </>
        )}
      </header>
      {!supabase ? (
        <Notice title="Backend not connected">
          Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> (see <code>.env.example</code>) and
          run the migration in <code>supabase/migrations</code>.
        </Notice>
      ) : !ready ? null : session ? (
        <Inbox />
      ) : (
        <Login />
      )}
    </div>
  )
}

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="admin-notice">
      <h1>{title}</h1>
      <p>{children}</p>
    </div>
  )
}

function Login() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setState('sending')
    const { error } = await supabase!.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/admin`, shouldCreateUser: false },
    })
    setState(error ? 'error' : 'sent')
  }
  return (
    <form className="admin-login" onSubmit={submit}>
      <h1>Sign in</h1>
      <p>We’ll email you a one-time sign-in link.</p>
      <input type="email" required placeholder="you@studio.com" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
      <button className="admin-btn is-primary" disabled={state === 'sending'}>
        {state === 'sending' ? 'Sending…' : 'Email me a link'}
      </button>
      {state === 'sent' && <p className="admin-ok">Check your inbox for the sign-in link.</p>}
      {state === 'error' && <p className="admin-err">Couldn’t send a link to that address.</p>}
    </form>
  )
}

function Inbox() {
  const [rows, setRows] = useState<Consultation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [filter, setFilter] = useState<Status | 'all' | 'open'>('open')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data: me } = await supabase!.from('admins').select('email').limit(1)
    setIsAdmin(Boolean(me?.length))
    const { data, error } = await supabase!
      .from('consultations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500)
    if (error) setError(error.message)
    setRows((data as Consultation[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((r) => {
      if (filter === 'open' && (r.status === 'closed' || r.status === 'archived')) return false
      if (filter !== 'all' && filter !== 'open' && r.status !== filter) return false
      if (!q) return true
      return [r.name, r.email, r.company, r.message, r.project_type].some((v) => v?.toLowerCase().includes(q))
    })
  }, [rows, filter, query])

  const selected = rows.find((r) => r.id === selectedId) ?? null
  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    rows.forEach((r) => (c[r.status] = (c[r.status] ?? 0) + 1))
    return c
  }, [rows])

  const update = async (id: string, patch: Partial<Consultation>) => {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)))
    const { error } = await supabase!.from('consultations').update(patch).eq('id', id)
    if (error) {
      setError(error.message)
      load()
    }
  }

  const exportCsv = () => {
    const cols = ['created_at', 'status', 'name', 'email', 'phone', 'company', 'project_type', 'budget', 'timeline', 'contact_method', 'message', 'admin_notes', 'source'] as const
    const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
    const csv = [cols.join(','), ...filtered.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = `consultations-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  if (isAdmin === false) {
    return (
      <Notice title="Not an admin">
        This account isn’t on the admin list. Add its email to the <code>admins</code> table in Supabase.
      </Notice>
    )
  }

  return (
    <div className="admin-body">
      <section className="admin-list">
        <div className="admin-toolbar">
          <input type="search" placeholder="Search name, email, message…" value={query} onChange={(e) => setQuery(e.target.value)} />
          <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}>
            <option value="open">Open</option>
            <option value="all">All ({rows.length})</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s[0].toUpperCase() + s.slice(1)} ({counts[s] ?? 0})
              </option>
            ))}
          </select>
          <button className="admin-btn" onClick={load} aria-label="Refresh">
            ↻
          </button>
          <button className="admin-btn" onClick={exportCsv}>
            Export CSV
          </button>
        </div>
        {error && <p className="admin-err">{error}</p>}
        {loading ? (
          <p className="admin-muted">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="admin-muted">No requests here yet.</p>
        ) : (
          <ul className="admin-rows">
            {filtered.map((r) => (
              <li key={r.id}>
                <button className={`admin-row ${r.id === selectedId ? 'is-selected' : ''}`} onClick={() => setSelectedId(r.id)}>
                  <span className={`admin-status s-${r.status}`}>{r.status}</span>
                  <span className="admin-row-main">
                    <strong>{r.name}</strong>
                    {r.company && <span className="admin-muted"> · {r.company}</span>}
                    <span className="admin-row-msg">{r.message}</span>
                  </span>
                  <span className="admin-row-meta">
                    <span>{r.project_type}</span>
                    <time>{new Date(r.created_at).toLocaleDateString()}</time>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <aside className="admin-detail">
        {selected ? <Detail key={selected.id} row={selected} onUpdate={(p) => update(selected.id, p)} /> : <p className="admin-muted">Select a request to see the details.</p>}
      </aside>
    </div>
  )
}

function Detail({ row, onUpdate }: { row: Consultation; onUpdate: (p: Partial<Consultation>) => void }) {
  const [notes, setNotes] = useState(row.admin_notes ?? '')
  const fields: [string, string | null | undefined][] = [
    ['Email', row.email],
    ['Phone', row.phone],
    ['Company', row.company],
    ['Project', row.project_type],
    ['Budget', row.budget],
    ['Timeline', row.timeline],
    ['Prefers', row.contact_method],
    ['Received', new Date(row.created_at).toLocaleString()],
    ['Device', row.source],
  ]
  return (
    <div className="admin-card">
      <h2>{row.name}</h2>
      <div className="admin-status-picker" role="radiogroup" aria-label="Status">
        {STATUSES.map((s) => (
          <button key={s} role="radio" aria-checked={row.status === s} className={`admin-status s-${s} ${row.status === s ? 'is-on' : ''}`} onClick={() => onUpdate({ status: s })}>
            {s}
          </button>
        ))}
      </div>
      <dl>
        {fields.map(([k, v]) =>
          v ? (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ) : null,
        )}
      </dl>
      <h3>Message</h3>
      <p className="admin-message">{row.message}</p>
      <h3>Private notes</h3>
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} onBlur={() => notes !== (row.admin_notes ?? '') && onUpdate({ admin_notes: notes })} rows={4} placeholder="Only visible to admins" />
      <a
        className="admin-btn is-primary"
        href={`mailto:${row.email}?subject=${encodeURIComponent('Your project with d> Studio')}&body=${encodeURIComponent(`Hi ${row.name.split(' ')[0]},\n\n`)}`}
        onClick={() => row.status === 'new' && onUpdate({ status: 'contacted' })}
      >
        Reply by email
      </a>
    </div>
  )
}
