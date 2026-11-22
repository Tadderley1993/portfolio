import { useRef, type PointerEvent as RPointerEvent, type ReactNode } from 'react'
import { useWm, type Win } from './wm'

export function Window({ win, children }: { win: Win; children: ReactNode }) {
  const { focus, close, minimize, toggleMax, moveTo, resizeTo, topZ } = useWm()
  const drag = useRef<{ dx: number; dy: number } | null>(null)
  const size = useRef<{ x: number; y: number; w: number; h: number } | null>(null)

  const onBarDown = (e: RPointerEvent) => {
    if ((e.target as HTMLElement).closest('button') || win.maximized) return
    focus(win.id)
    drag.current = { dx: e.clientX - win.x, dy: e.clientY - win.y }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onBarMove = (e: RPointerEvent) => {
    if (!drag.current) return
    moveTo(win.id, e.clientX - drag.current.dx, e.clientY - drag.current.dy)
  }
  const onBarUp = () => (drag.current = null)

  const onGripDown = (e: RPointerEvent) => {
    e.stopPropagation()
    size.current = { x: e.clientX, y: e.clientY, w: win.w, h: win.h }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onGripMove = (e: RPointerEvent) => {
    if (!size.current) return
    resizeTo(win.id, size.current.w + e.clientX - size.current.x, size.current.h + e.clientY - size.current.y)
  }

  const active = win.z === topZ
  const style = win.maximized
    ? { zIndex: win.z }
    : { zIndex: win.z, left: win.x, top: win.y, width: win.w, height: win.h }

  return (
    <section
      className={`win ${active ? 'is-active' : ''} ${win.maximized ? 'is-max' : ''} ${win.minimized ? 'is-min' : ''}`}
      style={style}
      onPointerDown={() => focus(win.id)}
      aria-label={win.title}
      role="dialog"
    >
      <header
        className="win-bar"
        onPointerDown={onBarDown}
        onPointerMove={onBarMove}
        onPointerUp={onBarUp}
        onPointerCancel={onBarUp}
        onDoubleClick={() => toggleMax(win.id)}
      >
        <span className="win-title">{win.title}</span>
        <div className="win-ctrls">
          <button aria-label="Minimize" onClick={() => minimize(win.id)}>
            <svg viewBox="0 0 12 12"><path d="M2.5 6h7" /></svg>
          </button>
          <button aria-label={win.maximized ? 'Restore' : 'Maximize'} onClick={() => toggleMax(win.id)}>
            <svg viewBox="0 0 12 12"><rect x="2.5" y="2.5" width="7" height="7" rx="1" /></svg>
          </button>
          <button className="win-close" aria-label="Close" onClick={() => close(win.id)}>
            <svg viewBox="0 0 12 12"><path d="m3 3 6 6M9 3 3 9" /></svg>
          </button>
        </div>
      </header>
      <div className="win-body">{children}</div>
      {!win.maximized && (
        <span
          className="win-grip"
          onPointerDown={onGripDown}
          onPointerMove={onGripMove}
          onPointerUp={() => (size.current = null)}
          aria-hidden="true"
        />
      )}
    </section>
  )
}
