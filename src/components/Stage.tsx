import { forwardRef, type ReactNode } from 'react'
import { SceneVideo } from './SceneVideo'
import type { Box, StageRect } from '../lib/stage'
import './stage.css'

interface StageProps {
  name: 'exterior' | 'studio'
  rect: StageRect
  small?: boolean
  children?: ReactNode
  className?: string
}

/**
 * A camera wrapper (receives zoom transforms) containing the stage box, which is sized
 * exactly like the displayed video. Children are laid out in video-space percentages.
 */
export const Stage = forwardRef<HTMLDivElement, StageProps>(function Stage(
  { name, rect, small, children, className },
  cameraRef,
) {
  return (
    <div className={`stage-root ${className ?? ''}`}>
      {rect.letterboxed && (
        <div className="stage-backdrop" aria-hidden="true">
          <SceneVideo name={name} small className="stage-backdrop-video" />
        </div>
      )}
      <div className="stage-camera" ref={cameraRef}>
        <div
          className="stage"
          style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height }}
        >
          <SceneVideo name={name} small={small} className="stage-video" />
          {children}
        </div>
      </div>
    </div>
  )
})

/** Position helper: a video-space box as percentages of the stage. */
export function boxStyle(b: Box): React.CSSProperties {
  return {
    left: `${(b.x / 1280) * 100}%`,
    top: `${(b.y / 720) * 100}%`,
    width: `${(b.w / 1280) * 100}%`,
    height: `${(b.h / 720) * 100}%`,
  }
}

/** Camera transform that brings a video-space box to the viewport center at scale k. */
export function cameraTo(rect: StageRect, box: Box, k: number, vw: number, vh: number) {
  const bcx = rect.left + (box.x + box.w / 2) * rect.scale
  const bcy = rect.top + (box.y + box.h / 2) * rect.scale
  return { x: vw / 2 - k * bcx, y: vh / 2 - k * bcy, scale: k }
}
