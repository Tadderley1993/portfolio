import { create } from 'zustand'

export type AppSpec =
  | { type: 'finder'; folderId: string }
  | { type: 'doc'; docId: string }
  | { type: 'browser' }
  | { type: 'terminal' }
  | { type: 'trash' }

export interface Win {
  id: string
  app: AppSpec
  title: string
  x: number
  y: number
  w: number
  h: number
  z: number
  minimized: boolean
  maximized: boolean
}

/** Browser history entries: 'home' (start page) or a project id. */
export interface BrowserState {
  history: string[]
  index: number
}

interface WmState {
  windows: Win[]
  topZ: number
  bounds: { w: number; h: number }
  browser: BrowserState
  setBounds: (w: number, h: number) => void
  open: (app: AppSpec, title: string) => void
  close: (id: string) => void
  focus: (id: string) => void
  minimize: (id: string) => void
  toggleMax: (id: string) => void
  moveTo: (id: string, x: number, y: number) => void
  resizeTo: (id: string, w: number, h: number) => void
  browse: (page: string) => void
  browserBack: () => void
  browserForward: () => void
  reset: () => void
}

const keyOf = (a: AppSpec) =>
  a.type === 'finder' ? `finder:${a.folderId}` : a.type === 'doc' ? `doc:${a.docId}` : a.type

const DEFAULT_SIZE: Record<AppSpec['type'], [number, number]> = {
  finder: [640, 420],
  doc: [720, 620],
  browser: [1040, 680],
  terminal: [620, 380],
  trash: [460, 320],
}

let counter = 0

export const useWm = create<WmState>((set, get) => ({
  windows: [],
  topZ: 10,
  bounds: { w: 1280, h: 720 },
  browser: { history: ['home'], index: 0 },

  setBounds: (w, h) => set({ bounds: { w, h } }),

  open: (app, title) => {
    const { windows, topZ, bounds } = get()
    const existing = windows.find((w) => keyOf(w.app) === keyOf(app))
    if (existing) {
      set({
        windows: windows.map((w) =>
          w.id === existing.id ? { ...w, minimized: false, z: topZ + 1, title } : w,
        ),
        topZ: topZ + 1,
      })
      return
    }
    const [dw, dh] = DEFAULT_SIZE[app.type]
    const w = Math.min(dw, bounds.w - 40)
    const h = Math.min(dh, bounds.h - 90)
    const offset = (windows.length % 6) * 28
    const x = Math.max(16, Math.round((bounds.w - w) / 2) - 60 + offset)
    const y = Math.max(44, Math.round((bounds.h - h) / 2) - 40 + offset)
    counter += 1
    set({
      windows: [
        ...windows,
        { id: `w${counter}`, app, title, x, y, w, h, z: topZ + 1, minimized: false, maximized: false },
      ],
      topZ: topZ + 1,
    })
  },

  close: (id) => set({ windows: get().windows.filter((w) => w.id !== id) }),

  focus: (id) => {
    const { windows, topZ } = get()
    const win = windows.find((w) => w.id === id)
    if (!win || (win.z === topZ && !win.minimized)) return
    set({
      windows: windows.map((w) => (w.id === id ? { ...w, z: topZ + 1, minimized: false } : w)),
      topZ: topZ + 1,
    })
  },

  minimize: (id) =>
    set({ windows: get().windows.map((w) => (w.id === id ? { ...w, minimized: true } : w)) }),

  toggleMax: (id) =>
    set({ windows: get().windows.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)) }),

  moveTo: (id, x, y) => {
    const { bounds } = get()
    set({
      windows: get().windows.map((w) =>
        w.id === id
          ? {
              ...w,
              x: Math.min(Math.max(x, -w.w + 120), bounds.w - 120),
              y: Math.min(Math.max(y, 36), bounds.h - 60),
            }
          : w,
      ),
    })
  },

  resizeTo: (id, w, h) =>
    set({
      windows: get().windows.map((win) =>
        win.id === id ? { ...win, w: Math.max(320, w), h: Math.max(220, h) } : win,
      ),
    }),

  browse: (page) => {
    const { browser } = get()
    const current = browser.history[browser.index]
    const history =
      current === page ? browser.history : [...browser.history.slice(0, browser.index + 1), page]
    set({ browser: { history, index: history.length - 1 } })
    get().open({ type: 'browser' }, 'Browser')
  },
  browserBack: () => {
    const { browser } = get()
    if (browser.index > 0) set({ browser: { ...browser, index: browser.index - 1 } })
  },
  browserForward: () => {
    const { browser } = get()
    if (browser.index < browser.history.length - 1) set({ browser: { ...browser, index: browser.index + 1 } })
  },

  reset: () => set({ windows: [], browser: { history: ['home'], index: 0 } }),
}))
