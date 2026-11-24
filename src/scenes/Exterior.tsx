import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import gsap from 'gsap'
import { Stage, cameraTo } from '../components/Stage'
import { Logo } from '../components/Logo'
import { computeStage, REGIONS } from '../lib/stage'
import type { Viewport } from '../lib/device'
import './exterior.css'

interface ExteriorProps {
  vp: Viewport
  /** false while the intro is still covering the scene */
  active: boolean
  onEnter: () => void
}

export function Exterior({ vp, active, onEnter }: ExteriorProps) {
  const camera = useRef<HTMLDivElement>(null)
  const ui = useRef<HTMLDivElement>(null)
  const black = useRef<HTMLDivElement>(null)
  const [leaving, setLeaving] = useState(false)

  // Keep the building (and the target window) in frame on narrow screens.
  const rect = useMemo(
    () => computeStage(vp.w, vp.h, { band: [0.2, 0.78], focusX: 0.52, alignTop: vp.device === 'mobile' }),
    [vp.w, vp.h],
  )
  /** Portrait phone: video pinned to the top, page content in the space below it. */
  const stacked = vp.device === 'mobile' && rect.letterboxed

  useEffect(() => {
    if (!active) {
      gsap.set(ui.current, { autoAlpha: 0 })
      return
    }
    gsap.fromTo(ui.current, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 1, delay: 0.2, ease: 'power3.out' })
    ui.current?.querySelector('button')?.focus({ preventScroll: true })
  }, [active])

  const enter = () => {
    if (leaving) return
    setLeaving(true)
    if (vp.reducedMotion) {
      gsap.to(black.current, { opacity: 1, duration: 0.5, onComplete: onEnter })
      return
    }
    const win = REGIONS.exteriorWindow
    const k = Math.max(vp.w / (win.w * rect.scale), vp.h / (win.h * rect.scale)) * 1.15
    const t = cameraTo(rect, win, k, vp.w, vp.h)
    const quick = vp.device === 'mobile'
    const tl = gsap.timeline({ onComplete: onEnter })
    tl.to(ui.current, { autoAlpha: 0, y: -8, duration: 0.3, ease: 'power2.in' }, 0)
      .to(
        camera.current,
        {
          x: t.x,
          y: t.y,
          scale: t.scale,
          duration: quick ? 1.0 : 1.35,
          ease: 'power3.in',
        },
        0.1,
      )
      .to(camera.current, { filter: 'blur(6px)', duration: 0.5, ease: 'power2.in' }, quick ? 0.6 : 0.85)
      .to(black.current, { opacity: 1, duration: 0.45, ease: 'power2.in' }, quick ? 0.75 : 1.0)
  }

  return (
    <main className="exterior" aria-label="Designs By Terrence Adderley exterior">
      <Stage name="exterior" rect={rect} small={vp.device === 'mobile'} ref={camera}>
        <div className="vignette" />
      </Stage>

      <div
        className={`exterior-ui ${stacked ? 'is-stacked' : ''}`}
        ref={ui}
        style={{ '--stage-bottom': `${rect.top + rect.height}px` } as CSSProperties}
      >
        <header className="exterior-top">
          <Logo className="brand-mark" />
          <span className="exterior-tag">Design &amp; Development Studio</span>
        </header>

        <div className="exterior-center">
          <h1 className="exterior-title">
            We design and build
            <br />
            <em>websites worth visiting.</em>
          </h1>
          {stacked && (
            <p className="exterior-intro">
              An independent design &amp; development studio. Step inside to explore our work, or book a consultation from
              the desk.
            </p>
          )}
          <button className="btn-pill" onClick={enter} disabled={leaving}>
            Enter The Studio
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </button>
          {stacked && (
            <ul className="exterior-services" aria-label="Services">
              <li>Web Design</li>
              <li>Development</li>
              <li>Branding</li>
            </ul>
          )}
        </div>
      </div>
      <div className="fade-black" ref={black} />
    </main>
  )
}
