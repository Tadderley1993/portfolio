import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import gsap from 'gsap'
import { Stage, boxStyle, cameraTo } from '../components/Stage'
import { Logo } from '../components/Logo'
import { computeStage, REGIONS, SHAPES, HIT_SHAPES, LAMP, type Box } from '../lib/stage'
import type { Viewport } from '../lib/device'
import { useExperience } from '../store'
import { Desktop } from '../os/Desktop'
import { PhoneOS } from '../os/PhoneOS'
import { NotebookForm } from '../studio/NotebookForm'
import './studio.css'

interface StudioProps {
  vp: Viewport
  onExit: () => void
}

/** Virtual resolution of the in-monitor desktop preview (matches the ultrawide screen). */
const PREVIEW_W = 1280

type Hotspot = 'monitor' | 'notebook' | 'lamp'

export function Studio({ vp, onExit }: StudioProps) {
  const { focus, setFocus, lampOn, toggleLamp } = useExperience()
  const camera = useRef<HTMLDivElement>(null)
  const black = useRef<HTMLDivElement>(null)
  const ui = useRef<HTMLDivElement>(null)
  const full = useRef<HTMLDivElement>(null)
  const preview = useRef<HTMLDivElement>(null)
  const busy = useRef(false)
  const [desktopMounted, setDesktopMounted] = useState(false)
  const [hover, setHover] = useState<Hotspot | null>(null)
  const [notebookOrigin, setNotebookOrigin] = useState<{ x: number; y: number }>()

  const mobile = vp.device === 'mobile'
  const touch = !vp.canHover
  const rect = useMemo(
    () => computeStage(vp.w, vp.h, { band: [0.13, 0.88], focusX: 0.5, alignTop: mobile }),
    [vp.w, vp.h, mobile],
  )
  /** Portrait phone: video pinned to the top, desk panel in the space below it. */
  const stacked = mobile && rect.letterboxed

  // Fade in from black on arrival.
  useEffect(() => {
    gsap.fromTo(black.current, { opacity: 1 }, { opacity: 0, duration: 1.1, ease: 'power2.out' })
    gsap.fromTo(ui.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, delay: 0.6 })
    gsap.fromTo(camera.current, { scale: 1.06, x: -vp.w * 0.03, y: -vp.h * 0.03 }, { scale: 1, x: 0, y: 0, duration: 1.6, ease: 'power3.out' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /** Bezel box → the screen-space rect it occupies after a camera transform. */
  const screenRectAfter = (box: Box, t: { x: number; y: number; scale: number }) => ({
    left: t.x + t.scale * (rect.left + box.x * rect.scale),
    top: t.y + t.scale * (rect.top + box.y * rect.scale),
    width: t.scale * box.w * rect.scale,
    height: t.scale * box.h * rect.scale,
  })

  const openMonitor = useCallback(() => {
    if (busy.current || focus !== 'desk') return
    busy.current = true
    setFocus('monitor')
    setDesktopMounted(true)
    const bezel = REGIONS.monitorBezel
    const screen = REGIONS.monitorScreen
    const k = Math.min((vp.w * 1.0) / (bezel.w * rect.scale), (vp.h * 0.95) / (bezel.h * rect.scale))
    const t = cameraTo(rect, bezel, k, vp.w, vp.h)
    const s = screenRectAfter(screen, t)
    const clipFrom = `inset(${s.top}px ${vp.w - s.left - s.width}px ${vp.h - s.top - s.height}px ${s.left}px round 6px)`
    const quick = vp.reducedMotion

    const tl = gsap.timeline({ onComplete: () => void (busy.current = false) })
    tl.to(ui.current, { autoAlpha: 0, duration: 0.25 }, 0)
      .to(camera.current, { x: t.x, y: t.y, scale: t.scale, duration: quick ? 0.01 : mobile ? 0.7 : 1.0, ease: 'power3.inOut' }, 0)
      .add(() => {
        gsap.set(full.current, { clipPath: clipFrom, autoAlpha: 1, display: 'block' })
      })
      .to(preview.current, { autoAlpha: 0, duration: 0.2 })
      .to(full.current, { clipPath: `inset(0px 0px 0px 0px round 0px)`, duration: quick ? 0.01 : 0.55, ease: 'power3.inOut' }, '<')
      .to(camera.current, { filter: 'blur(8px) brightness(0.5)', duration: 0.5 }, '<')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus, rect, vp.w, vp.h, mobile, vp.reducedMotion])

  /** Zoom back out to the desk. `then` runs once the camera has fully settled (instead of focus → desk). */
  const closeMonitor = useCallback((then?: () => void) => {
    if (focus !== 'monitor') return
    // Let a request from inside the computer (e.g. "Book a Consultation") interrupt an unfinished zoom-in.
    if (busy.current && !then) return
    gsap.killTweensOf([camera.current, full.current, preview.current, ui.current])
    busy.current = true
    const bezel = REGIONS.monitorBezel
    const screen = REGIONS.monitorScreen
    const k = Math.min((vp.w * 1.0) / (bezel.w * rect.scale), (vp.h * 0.95) / (bezel.h * rect.scale))
    const t = cameraTo(rect, bezel, k, vp.w, vp.h)
    const s = screenRectAfter(screen, t)
    const clipTo = `inset(${s.top}px ${vp.w - s.left - s.width}px ${vp.h - s.top - s.height}px ${s.left}px round 6px)`
    const tl = gsap.timeline({
      onComplete: () => {
        busy.current = false
        setDesktopMounted(false)
        if (then) then()
        else setFocus('desk')
      },
    })
    tl.to(camera.current, { filter: 'blur(0px) brightness(1)', duration: 0.4 }, 0)
      .to(full.current, { clipPath: clipTo, duration: 0.45, ease: 'power3.inOut' }, 0)
      .to(preview.current, { autoAlpha: 1, duration: 0.2 }, 0.3)
      .to(full.current, { autoAlpha: 0, duration: 0.2 }, 0.35)
      .to(camera.current, { x: 0, y: 0, scale: 1, duration: 0.9, ease: 'power3.inOut' }, 0.45)
      .to(ui.current, { autoAlpha: 1, duration: 0.4 }, '-=0.3')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus, rect, vp.w, vp.h])

  const openNotebook = useCallback(
    (fromMonitor = false) => {
      const go = () => {
        const [cx, cy] = [340, 572]
        setNotebookOrigin({ x: rect.left + cx * rect.scale, y: rect.top + cy * rect.scale })
        setFocus('notebook')
      }
      // From inside the computer: zoom out first, then open the notebook once the camera is back.
      if (fromMonitor) closeMonitor(go)
      else if (focus === 'desk') go()
    },
    [rect, focus, setFocus, closeMonitor],
  )

  // Esc leaves the computer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && focus === 'monitor') closeMonitor()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [focus, closeMonitor])

  const activate = (h: Hotspot) => {
    if (h === 'monitor') openMonitor()
    else if (h === 'notebook') openNotebook()
    else toggleLamp()
  }

  const leave = () => {
    if (busy.current) return
    busy.current = true
    gsap.to(black.current, { opacity: 1, duration: 0.6, ease: 'power2.in', onComplete: onExit })
  }

  const previewScale = (REGIONS.monitorScreen.w * rect.scale) / PREVIEW_W
  const previewH = (PREVIEW_W * REGIONS.monitorScreen.h) / REGIONS.monitorScreen.w

  const hotspots: { id: Hotspot; shape: string; label: string; anchor: [number, number] }[] = [
    { id: 'monitor', shape: SHAPES.monitor, label: 'Open the computer', anchor: [639, 262] },
    { id: 'notebook', shape: SHAPES.notebook, label: 'Book a consultation', anchor: [330, 528] },
    { id: 'lamp', shape: SHAPES.lamp, label: lampOn ? 'Turn the lamp off' : 'Turn the lamp on', anchor: [1030, 318] },
  ]

  return (
    <main className={`studio ${lampOn ? 'lamp-on' : ''} ${touch ? 'is-touch' : ''}`} aria-label="The studio desk">
      <Stage name="studio" rect={rect} small={mobile} ref={camera}>
        {/* Lamp light — layered gradients in video space */}
        <svg className="stage-overlay-svg lamp-light" viewBox="0 0 1280 720" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <radialGradient id="lamp-head" cx={LAMP.head.x} cy={LAMP.head.y} r="60" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#fff4d6" stopOpacity="1" />
              <stop offset="0.35" stopColor="#ffc985" stopOpacity="0.7" />
              <stop offset="1" stopColor="#ffb45c" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="lamp-pool" cx={LAMP.pool.x} cy={LAMP.pool.y} r="210" gradientUnits="userSpaceOnUse" gradientTransform={`translate(${LAMP.pool.x} ${LAMP.pool.y}) scale(1 0.32) translate(${-LAMP.pool.x} ${-LAMP.pool.y})`}>
              <stop offset="0" stopColor="#ffe2b0" stopOpacity="0.9" />
              <stop offset="0.5" stopColor="#ffc985" stopOpacity="0.35" />
              <stop offset="1" stopColor="#ffb45c" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="lamp-cone" x1="0" y1={LAMP.head.y} x2="0" y2={LAMP.pool.y} gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#ffe6bd" stopOpacity="0.55" />
              <stop offset="1" stopColor="#ffc985" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="room-warm" cx="1000" cy="420" r="900" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#ffb45c" stopOpacity="0.22" />
              <stop offset="1" stopColor="#ffb45c" stopOpacity="0" />
            </radialGradient>
            <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="14" />
            </filter>
          </defs>
          <rect width="1280" height="720" fill="url(#room-warm)" />
          <polygon points={`${LAMP.head.x - 14},${LAMP.head.y + 6} ${LAMP.head.x + 22},${LAMP.head.y + 2} ${LAMP.pool.x + 170},${LAMP.pool.y + 30} ${LAMP.pool.x - 180},${LAMP.pool.y + 30}`} fill="url(#lamp-cone)" filter="url(#soft)" />
          <rect width="1280" height="720" fill="url(#lamp-pool)" />
          <circle cx={LAMP.head.x} cy={LAMP.head.y} r="60" fill="url(#lamp-head)" />
        </svg>

        {/* The custom desktop shown on the monitor */}
        <div className="monitor-preview" style={boxStyle(REGIONS.monitorScreen)} ref={preview} aria-hidden="true">
          <div className="monitor-preview-inner" style={{ width: PREVIEW_W, height: previewH, transform: `scale(${previewScale})` }}>
            <Desktop preview onBook={() => {}} onExit={() => {}} />
          </div>
          <div className="monitor-glare" />
        </div>

        {/* Interactive hotspots */}
        <svg className="stage-overlay-svg hotspots" viewBox="0 0 1280 720" preserveAspectRatio="none">
          <defs>
            <filter id="glow" x="-30%" y="-60%" width="160%" height="220%">
              <feGaussianBlur stdDeviation="9" />
            </filter>
          </defs>
          {hotspots.map((h) => (
            <g
              key={h.id}
              className={`hotspot hotspot-${h.id} ${hover === h.id ? 'is-hover' : ''}`}
              role="button"
              tabIndex={focus === 'desk' ? 0 : -1}
              aria-label={h.label}
              onPointerEnter={() => setHover(h.id)}
              onPointerLeave={() => setHover(null)}
              onFocus={() => setHover(h.id)}
              onBlur={() => setHover(null)}
              onClick={() => activate(h.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  activate(h.id)
                }
              }}
            >
              <polygon className="hs-glow" points={h.shape} filter="url(#glow)" />
              <polygon className="hs-edge" points={h.shape} />
              <polygon className="hs-hit" points={HIT_SHAPES[h.id] ?? h.shape} />
            </g>
          ))}
        </svg>

        {/* Labels + touch pulses, positioned in video space */}
        {hotspots.map((h) => (
          <div
            key={h.id}
            className={`hs-label ${hover === h.id ? 'is-visible' : ''}`}
            style={{ left: `${(h.anchor[0] / 1280) * 100}%`, top: `${(h.anchor[1] / 720) * 100}%` }}
            aria-hidden="true"
          >
            {/* Glowing marker on every device; it's clickable too, so it works even where it
                sits just off the object. Keyboard users get the SVG hotspot buttons. */}
            <span
              className="hs-pulse"
              onPointerEnter={() => setHover(h.id)}
              onPointerLeave={() => setHover(null)}
              onClick={() => activate(h.id)}
            />
            <span className="hs-text">{h.label}</span>
          </div>
        ))}
        <div className="vignette" />
      </Stage>

      <div
        className={`studio-ui ${stacked ? 'is-stacked' : ''}`}
        ref={ui}
        style={{ '--stage-bottom': `${rect.top + rect.height}px` } as CSSProperties}
      >
        <header className="studio-top">
          <button className="btn-ghost" onClick={leave}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M13 8H3M7 4 3 8l4 4" /></svg>
            Step outside
          </button>
          <Logo className="studio-mark" />
        </header>

        {!mobile && (
          <p className="studio-hint">
            {touch ? 'Tap the computer, notebook or lamp' : 'Explore the desk — the computer, notebook and lamp are all interactive'}
          </p>
        )}

        {stacked && (
          // Portrait phone: the video sits at the top; this panel fills the space underneath.
          <section className="desk-panel" aria-label="The desk">
            <p className="desk-eyebrow">The studio</p>
            <h1 className="desk-title">Pull up a chair.</h1>
            <p className="desk-sub">Tap a glowing marker on the desk, or pick a spot below.</p>
            <nav className="desk-cards" aria-label="Desk">
              <button onClick={openMonitor}>
                <svg viewBox="0 0 24 24"><rect x="2.5" y="4" width="19" height="12" rx="1.5" /><path d="M9 20h6M12 16v4" /></svg>
                <span className="dc-text">
                  <span className="dc-title">Our work</span>
                  <span className="dc-sub">Open the computer: projects, services &amp; more</span>
                </span>
              </button>
              <button onClick={() => openNotebook()} className="is-primary">
                <svg viewBox="0 0 24 24"><path d="M6 3h12v18H6Z" /><path d="M9 8h6M9 12h6M9 16h3" /></svg>
                <span className="dc-text">
                  <span className="dc-title">Book a consultation</span>
                  <span className="dc-sub">Tell us about your project in the notebook</span>
                </span>
              </button>
              <button onClick={toggleLamp} aria-pressed={lampOn}>
                <svg viewBox="0 0 24 24"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z" /></svg>
                <span className="dc-text">
                  <span className="dc-title">{lampOn ? 'Lamp on' : 'Lamp'}</span>
                  <span className="dc-sub">{lampOn ? 'Tap to switch it off' : 'Set the mood'}</span>
                </span>
              </button>
            </nav>
          </section>
        )}

        {mobile && !stacked && (
          <nav className="tool-tray" aria-label="Desk">
            <button onClick={openMonitor}>
              <svg viewBox="0 0 24 24"><rect x="2.5" y="4" width="19" height="12" rx="1.5" /><path d="M9 20h6M12 16v4" /></svg>
              Our work
            </button>
            <button onClick={() => openNotebook()} className="is-primary">
              <svg viewBox="0 0 24 24"><path d="M6 3h12v18H6Z" /><path d="M9 8h6M9 12h6M9 16h3" /></svg>
              Book a consultation
            </button>
            <button onClick={toggleLamp} aria-pressed={lampOn}>
              <svg viewBox="0 0 24 24"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z" /></svg>
              Lamp
            </button>
          </nav>
        )}
      </div>

      {/* Full-screen computer (first-person view) */}
      <div className="computer" ref={full} style={{ display: 'none' }}>
        {desktopMounted &&
          (mobile ? (
            <PhoneOS onBook={() => openNotebook(true)} onExit={() => closeMonitor()} />
          ) : (
            <Desktop touch={touch} onBook={() => openNotebook(true)} onExit={() => closeMonitor()} />
          ))}
      </div>

      {focus === 'notebook' && (
        <NotebookForm
          sheet={mobile}
          source={vp.device}
          origin={notebookOrigin}
          onClose={() => setFocus('desk')}
        />
      )}

      <div className="fade-black" ref={black} style={{ opacity: 1 }} />
    </main>
  )
}
