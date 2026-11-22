import { useEffect, useRef, useState, type FormEvent } from 'react'
import gsap from 'gsap'
import {
  BUDGETS,
  CONTACT_METHODS,
  PROJECT_TYPES,
  TIMELINES,
  BackendNotConfigured,
  submitConsultation,
  type ConsultationInput,
} from '../lib/consultations'
import './notebook.css'

interface NotebookFormProps {
  sheet: boolean
  source: string
  /** Where the page should appear to grow from (viewport px). */
  origin?: { x: number; y: number }
  onClose: () => void
}

const EMPTY: ConsultationInput = {
  name: '',
  email: '',
  phone: '',
  company: '',
  project_type: '',
  budget: '',
  timeline: '',
  message: '',
  contact_method: 'Email',
}

type State = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent' } | { kind: 'error'; message: string }

export function NotebookForm({ sheet, source, origin, onClose }: NotebookFormProps) {
  const [form, setForm] = useState(EMPTY)
  const [state, setState] = useState<State>({ kind: 'idle' })
  const [honeypot, setHoneypot] = useState('')
  const page = useRef<HTMLDivElement>(null)
  const backdrop = useRef<HTMLDivElement>(null)
  const closing = useRef(false)

  useEffect(() => {
    const el = page.current!
    if (sheet) {
      gsap.fromTo(el, { yPercent: 100 }, { yPercent: 0, duration: 0.5, ease: 'power3.out' })
    } else {
      const r = el.getBoundingClientRect()
      const ox = origin ? origin.x - (r.left + r.width / 2) : 0
      const oy = origin ? origin.y - (r.top + r.height / 2) : 120
      gsap.fromTo(
        el,
        { x: ox, y: oy, scale: 0.18, rotate: -14, autoAlpha: 0 },
        { x: 0, y: 0, scale: 1, rotate: -1.2, autoAlpha: 1, duration: 0.75, ease: 'power3.out' },
      )
    }
    gsap.fromTo(backdrop.current, { opacity: 0 }, { opacity: 1, duration: 0.4 })
    el.querySelector<HTMLInputElement>('input')?.focus({ preventScroll: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const close = () => {
    if (closing.current) return
    closing.current = true
    const el = page.current
    gsap.to(backdrop.current, { opacity: 0, duration: 0.35 })
    gsap.to(
      el,
      sheet
        ? { yPercent: 100, duration: 0.35, ease: 'power2.in', onComplete: onClose }
        : { y: 80, scale: 0.9, autoAlpha: 0, duration: 0.35, ease: 'power2.in', onComplete: onClose },
    )
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const set = (k: keyof ConsultationInput) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (honeypot) {
      setState({ kind: 'sent' })
      return
    }
    setState({ kind: 'sending' })
    try {
      await submitConsultation(
        { ...form, name: form.name.trim(), email: form.email.trim(), message: form.message.trim() },
        source,
      )
      setState({ kind: 'sent' })
    } catch (err) {
      setState({
        kind: 'error',
        message:
          err instanceof BackendNotConfigured
            ? 'Booking isn’t switched on yet — please check back soon.'
            : 'Something went wrong sending that. Please try again.',
      })
    }
  }

  return (
    <div className={`nb-layer ${sheet ? 'is-sheet' : ''}`} role="dialog" aria-modal="true" aria-labelledby="nb-title">
      <div className="nb-backdrop" ref={backdrop} onClick={close} />
      <div className="nb-page" ref={page}>
        <div className="nb-spiral" aria-hidden="true">
          {Array.from({ length: 14 }, (_, i) => (
            <span key={i} />
          ))}
        </div>
        <button className="nb-close" onClick={close} aria-label="Close notebook">
          <svg viewBox="0 0 12 12"><path d="m3 3 6 6M9 3 3 9" /></svg>
        </button>

        {state.kind === 'sent' ? (
          <div className="nb-done">
            <p className="nb-date">{new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</p>
            <h2 id="nb-title" className="nb-title">Got it, thank you!</h2>
            <p className="nb-hand">
              We’ll read this properly and get back to you within one business day.
            </p>
            <p className="nb-sign">— the d&gt; studio</p>
            <button className="nb-submit" onClick={close}>
              Back to the desk
            </button>
          </div>
        ) : (
          <form className="nb-form" onSubmit={submit} noValidate={false}>
            <p className="nb-date">{new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</p>
            <h2 id="nb-title" className="nb-title">Let’s plan your project</h2>

            <div className="nb-row">
              <label className="nb-field">
                <span>My name is</span>
                <input required maxLength={120} autoComplete="name" value={form.name} onChange={set('name')} />
              </label>
              <label className="nb-field">
                <span>from</span>
                <input maxLength={160} autoComplete="organization" placeholder="company (optional)" value={form.company} onChange={set('company')} />
              </label>
            </div>

            <div className="nb-row">
              <label className="nb-field">
                <span>Reach me at</span>
                <input required type="email" maxLength={200} autoComplete="email" placeholder="email" value={form.email} onChange={set('email')} />
              </label>
              <label className="nb-field">
                <span>or</span>
                <input type="tel" maxLength={40} autoComplete="tel" placeholder="phone (optional)" value={form.phone} onChange={set('phone')} />
              </label>
            </div>

            <fieldset className="nb-choices">
              <legend>I need help with</legend>
              {PROJECT_TYPES.map((t) => (
                <label key={t} className="nb-chip">
                  <input type="radio" name="project_type" value={t} required checked={form.project_type === t} onChange={set('project_type')} />
                  <span>{t}</span>
                </label>
              ))}
            </fieldset>

            <div className="nb-row">
              <label className="nb-field">
                <span>Budget</span>
                <select required value={form.budget} onChange={set('budget')}>
                  <option value="" disabled>choose…</option>
                  {BUDGETS.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </label>
              <label className="nb-field">
                <span>Timeline</span>
                <select required value={form.timeline} onChange={set('timeline')}>
                  <option value="" disabled>choose…</option>
                  {TIMELINES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="nb-field nb-message">
              <span>Tell us about it</span>
              <textarea required maxLength={4000} rows={4} value={form.message} onChange={set('message')} />
            </label>

            <fieldset className="nb-choices nb-inline">
              <legend>Best way to talk</legend>
              {CONTACT_METHODS.map((m) => (
                <label key={m} className="nb-chip">
                  <input type="radio" name="contact_method" value={m} checked={form.contact_method === m} onChange={set('contact_method')} />
                  <span>{m}</span>
                </label>
              ))}
            </fieldset>

            <label className="nb-hp" aria-hidden="true">
              Leave this empty
              <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
            </label>

            {state.kind === 'error' && (
              <p className="nb-error" role="alert">
                {state.message}
              </p>
            )}

            <button className="nb-submit" type="submit" disabled={state.kind === 'sending'}>
              {state.kind === 'sending' ? 'Sending…' : 'Schedule my consultation →'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
