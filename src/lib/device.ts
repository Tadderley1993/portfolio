import { useEffect, useState } from 'react'

export type DeviceClass = 'desktop' | 'tablet' | 'mobile'

export interface Viewport {
  w: number
  h: number
  device: DeviceClass
  /** true when the primary pointer can hover (mouse / trackpad) */
  canHover: boolean
  portrait: boolean
  reducedMotion: boolean
}

function read(): Viewport {
  const w = window.innerWidth
  const h = window.innerHeight
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const canHover = window.matchMedia('(hover: hover)').matches && !coarse
  const shortSide = Math.min(w, h)
  let device: DeviceClass = 'desktop'
  if (w < 768 || (coarse && shortSide < 600)) device = 'mobile'
  else if (w < 1024 || coarse) device = 'tablet'
  return {
    w,
    h,
    device,
    canHover,
    portrait: h > w,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  }
}

export function useViewport(): Viewport {
  const [vp, setVp] = useState(read)
  useEffect(() => {
    let raf = 0
    const on = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setVp(read()))
    }
    window.addEventListener('resize', on)
    window.addEventListener('orientationchange', on)
    return () => {
      window.removeEventListener('resize', on)
      window.removeEventListener('orientationchange', on)
      cancelAnimationFrame(raf)
    }
  }, [])
  return vp
}
