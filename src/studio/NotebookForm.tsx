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
import { useBackLayer } from '../lib/backLayer'
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

type Field = 'name' | 'email' | 'phone' | 'project_type' | 'message'
type Errors = Partial<Record<Field, string>>
const FIELD_ORDER: Field[] = ['name', 'email', 'phone', 'project_type', 'message']

/** name@domain.tld: no spaces, one @, a dotted domain ending in a 2+ letter TLD, no ".." anywhere. */
const EMAIL_RE = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@[A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/

function emailError(raw: string): string | undefined {
  const v = raw.trim()
  if (!v) return 'We need an email to reply to.'
  if (!v.includes('@')) return 'An email needs an @, like name@example.com.'
  if (!EMAIL_RE.test(v)) return 'That email doesn’t look right. Check for typos, like name@example.com.'
}

/** Digits only, dropping a leading US country code, capped at 10. */
const phoneDigits = (raw: string) => {
  let d = raw.replace(/\D/g, '')
  if (d.length === 11 && d.startsWith('1')) d = d.slice(1)
  return d.slice(0, 10)
}

/** Formats as the visitor types: 555 → 555-1 → 555-123-4567. */
function formatPhone(raw: string): string {
  const d = phoneDigits(raw)
  if (d.length <= 3) return d
  if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`
  return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`
}

/** Optional, but if given it must be a full US/Canada number (area code and exchange can't start with 0 or 1). */
function phoneError(raw: string): string | undefined {
  const d = raw.replace(/\D/g, '')
  if (!d) return
  if (d.length !== 10) return 'Use all 10 digits, like 617-555-0123.'
  if (!/^[2-9]\d{2}[2-9]\d{6}$/.test(d)) return 'That doesn’t look like a valid US number. Check for typos.'
}

function validate(f: ConsultationInput): Errors {
  const e: Errors = {}
  if (!f.name.trim()) e.name = 'What should we call you?'
  e.email = emailError(f.email)
  e.phone = phoneError(f.phone ?? '')
  if (!f.project_type) e.project_type = 'Pick the closest one.'
  if (!f.message.trim()) e.message = 'A sentence or two is plenty.'
  return e
}

/** Budget and timeline are optional; an empty choice is stored as "Not sure yet". */
const NOT_SURE = 'Not sure yet'

type State = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent' } | { kind: 'error'; message: string }

export function NotebookForm({ sheet, source, origin, onClose }: NotebookFormProps) {
  const [form, setForm] = useState(EMPTY)
  const [state, setState] = useState<State>({ kind: 'idle' })
  const [honeypot, setHoneypot] = useState('')
  const [errors, setErrors] = useState<Errors>({})
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
    // Desktop only: on phones the keyboard would cover half the sheet before the visitor has read it.
    if (!sheet) el.querySelector<HTMLInputElement>('input')?.focus({ preventScroll: true })
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

  // Back gesture / browser Back closes the notebook.
  useBackLayer(true, close)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const set = (k: keyof ConsultationInput) => (e: { target: { value: string } }) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    if (k in errors) setErrors((x) => ({ ...x, [k]: undefined }))
  }

  // Email and phone are checked as soon as the visitor leaves the field, not only on submit.
  const checkOnBlur = (k: 'email' | 'phone') => () => {
    const msg = k === 'email' ? (form.email.trim() ? emailError(form.email) : undefined) : phoneError(form.phone ?? '')
    setErrors((x) => ({ ...x, [k]: msg }))
  }

  const onPhone = (e: { target: { value: string } }) => {
    setForm((f) => ({ ...f, phone: formatPhone(e.target.value) }))
    if (errors.phone) setErrors((x) => ({ ...x, phone: undefined }))
  }

  const err = (k: Field) =>
    errors[k] ? (
      <span className="nb-err" id={`nb-err-${k}`}>
        {errors[k]}
      </span>
    ) : null
  const invalid = (k: Field) =>
    errors[k] ? { 'aria-invalid': true as const, 'aria-describedby': `nb-err-${k}` } : {}

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (honeypot) {
      setState({ kind: 'sent' })
      return
    }
    const found = validate(form)
    setErrors(found)
    const first = FIELD_ORDER.find((k) => found[k])
    if (first) {
      const el = page.current?.querySelector<HTMLElement>(`[name="${first}"]`)
      el?.focus({ preventScroll: true })
      el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      return
    }
    setState({ kind: 'sending' })
    try {
      await submitConsultation(
        {
          ...form,
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone ? formatPhone(form.phone) : '',
          message: form.message.trim(),
          budget: form.budget || NOT_SURE,
          timeline: form.timeline || NOT_SURE,
        },
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
            <p className="nb-sign">— Designs By Terrence Adderley</p>
            <button className="nb-submit" onClick={close}>
              Back to the desk
            </button>
          </div>
        ) : (
          <form className="nb-form" onSubmit={submit} noValidate>
            <p className="nb-date">{new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</p>
            <h2 id="nb-title" className="nb-title">Let’s plan your project</h2>

            <div className="nb-row">
              <label className="nb-field">
                <span>My name is</span>
                <input name="name" required maxLength={120} autoComplete="name" enterKeyHint="next" value={form.name} onChange={set('name')} {...invalid('name')} />
                {err('name')}
              </label>
              <label className="nb-field">
                <span>from</span>
                <input maxLength={160} autoComplete="organization" enterKeyHint="next" placeholder="company (optional)" value={form.company} onChange={set('company')} />
              </label>
            </div>

            <div className="nb-row">
              <label className="nb-field">
                <span>Reach me at</span>
                <input name="email" required type="email" inputMode="email" maxLength={200} autoComplete="email" enterKeyHint="next" placeholder="email" value={form.email} onChange={set('email')} onBlur={checkOnBlur('email')} {...invalid('email')} />
                {err('email')}
              </label>
              <label className="nb-field">
                <span>or</span>
                <input name="phone" type="tel" inputMode="tel" maxLength={14} autoComplete="tel-national" enterKeyHint="next" placeholder="xxx-xxx-xxxx (optional)" value={form.phone} onChange={onPhone} onBlur={checkOnBlur('phone')} {...invalid('phone')} />
                {err('phone')}
              </label>
            </div>

            <fieldset className="nb-choices" {...invalid('project_type')}>
              <legend>I need help with</legend>
              {PROJECT_TYPES.map((t) => (
                <label key={t} className="nb-chip">
                  <input type="radio" name="project_type" value={t} checked={form.project_type === t} onChange={set('project_type')} />
                  <span>{t}</span>
                </label>
              ))}
              {err('project_type')}
            </fieldset>

            <div className="nb-row">
              <label className="nb-field">
                <span>Budget</span>
                <select value={form.budget} onChange={set('budget')}>
                  <option value="">not sure yet</option>
                  {BUDGETS.filter((b) => b !== NOT_SURE).map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </label>
              <label className="nb-field">
                <span>Timeline</span>
                <select value={form.timeline} onChange={set('timeline')}>
                  <option value="">not sure yet</option>
                  {TIMELINES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="nb-field nb-message">
              <span>Tell us about it</span>
              <textarea name="message" required maxLength={4000} rows={4} value={form.message} onChange={set('message')} {...invalid('message')} />
              {err('message')}
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
              {state.kind === 'sending' ? 'Sending…' : 'Book my consultation'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
