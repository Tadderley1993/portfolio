/**
 * The "stage" is a box sized exactly like the displayed video. Hotspots, overlays and
 * camera moves are expressed in the video's own 1280×720 coordinate space, so they stay
 * locked to the footage whatever the viewport.
 */
export const VIDEO_W = 1280
export const VIDEO_H = 720

export interface StageRect {
  left: number
  top: number
  width: number
  height: number
  /** px per video px */
  scale: number
  /** true when a blurred backdrop is needed behind a stage that doesn't fill the screen */
  letterboxed: boolean
}

export interface FramingOptions {
  /** Horizontal band (0..1 of the video) that must stay visible in narrow viewports. */
  band: [number, number]
  /** Horizontal focus (0..1) used to position the crop when the video covers the screen. */
  focusX?: number
  /** Vertical offset in px applied when letterboxed (e.g. lift above a bottom tray). */
  liftY?: number
}

export function computeStage(vw: number, vh: number, opts: FramingOptions): StageRect {
  const focusX = opts.focusX ?? 0.5
  const coverScale = Math.max(vw / VIDEO_W, vh / VIDEO_H)
  const coverW = VIDEO_W * coverScale

  // Fraction of the video width visible when covering.
  const visibleFrac = vw / coverW
  const bandW = opts.band[1] - opts.band[0]

  if (visibleFrac >= bandW - 0.001) {
    // Cover works: position the crop so the band stays in view, biased to focusX.
    const width = coverW
    const height = VIDEO_H * coverScale
    // left must keep the screen covered (vw - width ≤ left ≤ 0) and the band on screen
    // (left + width·b0 ≥ 0 and left + width·b1 ≤ vw).
    const lo = Math.max(vw - width, -width * opts.band[0])
    const hi = Math.min(0, vw - width * opts.band[1])
    const left = Math.min(Math.max(vw / 2 - width * focusX, lo), hi)
    return { left, top: (vh - height) / 2, width, height, scale: coverScale, letterboxed: false }
  }

  // Narrow viewport: size the video so the band fits, and letterbox vertically.
  const width = vw / bandW
  const height = (width * VIDEO_H) / VIDEO_W
  const bandCenter = (opts.band[0] + opts.band[1]) / 2
  const left = vw / 2 - width * bandCenter
  const top = Math.max(0, (vh - height) / 2 - (opts.liftY ?? 0))
  return { left, top, width, height, scale: width / VIDEO_W, letterboxed: true }
}

export interface Box {
  x: number
  y: number
  w: number
  h: number
}

/** Video-space regions (1280×720). */
export const REGIONS = {
  exteriorWindow: { x: 790, y: 228, w: 96, h: 70 } as Box,
  monitorScreen: { x: 353, y: 256, w: 571, h: 206 } as Box,
  monitorBezel: { x: 346, y: 249, w: 586, h: 220 } as Box,
}

/** Video-space polygons for hotspot shapes. */
export const SHAPES = {
  notebook: '194,572 318,540 396,533 427,586 270,611',
  lamp: '962,350 990,318 1032,308 1062,330 1092,388 1094,528 1040,538 1016,520 1048,505 1052,392 1030,372 990,384 968,376',
  monitor: '346,249 932,249 932,469 346,469',
}

/** Larger, simpler hit areas where the visible shape is thin or concave. */
export const HIT_SHAPES: Partial<Record<keyof typeof SHAPES, string>> = {
  lamp: '952,300 1102,300 1104,545 1005,545 952,400',
  notebook: '186,566 318,530 400,524 436,590 266,620',
}

/** Lamp lighting anchor points (video space). */
export const LAMP = {
  head: { x: 992, y: 372 },
  pool: { x: 975, y: 560 },
}
