import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Logo } from '../components/Logo'
import { INTRO_ICONS } from '../components/introIcons'
import './intro.css'

interface IntroProps {
  compact: boolean
  reducedMotion: boolean
  onDone: () => void
}

/**
 * Black screen, a single glyph slot shuffles through design/dev icons, decelerates,
 * and lands on the d> mark, which then draws itself and hands off to the exterior.
 */
export function Intro({ compact, reducedMotion, onDone }: IntroProps) {
  const [index, setIndex] = useState(0)
  const [landed, setLanded] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const doneRef = useRef(false)

  const finish = () => {
    if (doneRef.current) return
    doneRef.current = true
    gsap.to(root.current, { autoAlpha: 0, duration: 0.6, ease: 'power2.inOut', onComplete: onDone })
  }

  useEffect(() => {
    if (reducedMotion) {
      setLanded(true)
      const t = window.setTimeout(finish, 1200)
      return () => window.clearTimeout(t)
    }
    // Decelerating schedule (ms per glyph).
    const steps = compact
      ? [70, 70, 75, 85, 100, 125, 165, 220]
      : [85, 85, 85, 90, 95, 105, 120, 140, 170, 210, 260, 330]
    const timers: number[] = []
    let t = 350
    steps.forEach((ms, i) => {
      timers.push(window.setTimeout(() => setIndex(i % INTRO_ICONS.length), t))
      t += ms
    })
    timers.push(window.setTimeout(() => setLanded(true), t))
    timers.push(window.setTimeout(finish, t + (compact ? 1000 : 1350)))
    return () => timers.forEach(window.clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compact, reducedMotion])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') finish()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const icon = INTRO_ICONS[index]
  return (
    <div className="intro" ref={root} role="presentation">
      <div className="intro-slot" aria-hidden="true">
        {landed ? (
          <Logo className="intro-logo" />
        ) : (
          <svg
            key={index}
            className="intro-glyph"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {icon.svg}
          </svg>
        )}
      </div>
      <p className={`intro-caption ${landed ? 'is-landed' : ''}`}>
        {landed ? 'Design & Development Studio' : icon.label}
      </p>
      <span className="sr-only">Loading Designs By Terrence Adderley</span>
      <button className="intro-skip" onClick={finish}>
        Skip
      </button>
    </div>
  )
}
