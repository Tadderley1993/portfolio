import { useEffect, useRef } from 'react'

/**
 * Lets the phone's Back gesture (and the browser Back button) close whatever is open on top —
 * a Phone OS app, the computer, the notebook — instead of leaving the studio.
 *
 * Each open layer adds one same-URL history entry tagged with an increasing id. On popstate, every
 * layer newer than the entry we landed on is closed, newest first. A layer closed from the UI
 * instead removes its own entry with history.go(-n), batched so several layers closing at once (the
 * computer and the app inside it) cost one traversal. If a new layer opens while that removal is
 * still pending (e.g. computer → notebook), it reuses the entry instead of adding one.
 */

interface Entry {
  id: number
  onBack: () => void
}

const stack: Entry[] = []
let nextId = 1
let pendingBack = 0
let listening = false

function layerOf(state: unknown): number {
  const v = (state as { layer?: unknown } | null)?.layer
  return typeof v === 'number' ? v : 0
}

function listen() {
  if (listening || typeof window === 'undefined') return
  listening = true
  window.addEventListener('popstate', (e) => {
    const current = layerOf(e.state)
    while (stack.length && stack[stack.length - 1].id > current) stack.pop()!.onBack()
  })
}

function scheduleBack() {
  pendingBack++
  if (pendingBack > 1) return
  queueMicrotask(() => {
    const n = pendingBack
    pendingBack = 0
    if (n > 0) window.history.go(-n)
  })
}

function pushLayer(onBack: () => void): () => void {
  listen()
  const entry: Entry = { id: nextId++, onBack }
  // Keep the router's own state (key, idx) so it treats the entry as the same location.
  const state = { ...(window.history.state ?? {}), layer: entry.id }
  if (pendingBack > 0) {
    pendingBack--
    window.history.replaceState(state, '')
  } else {
    window.history.pushState(state, '')
  }
  stack.push(entry)

  return () => {
    const i = stack.indexOf(entry)
    if (i === -1) return // already closed by Back
    stack.splice(i, 1)
    scheduleBack()
  }
}

/** While `active`, Back closes this layer by calling `onBack`. */
export function useBackLayer(active: boolean, onBack: () => void) {
  const cb = useRef(onBack)
  cb.current = onBack
  useEffect(() => {
    if (!active) return
    return pushLayer(() => cb.current())
  }, [active])
}
