import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { FS, DESKTOP_ITEMS, type FsItem } from '../content/fs'
import { FsIcon } from './icons'
import { Window } from './Window'
import { useWm, type AppSpec } from './wm'
import { OsContext } from './context'
import { Finder } from './apps/Finder'
import { DocViewer } from './apps/DocViewer'
import { Browser } from './apps/Browser'
import { Terminal } from './apps/Terminal'
import { Trash } from './apps/Trash'
import { Logo } from '../components/Logo'
import './os.css'

interface DesktopProps {
  /** Preview = shown small inside the monitor, not interactive. */
  preview?: boolean
  /** Touch input: single tap opens icons. */
  touch?: boolean
  onBook: () => void
  onExit: () => void
}

function Clock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 15_000)
    return () => window.clearInterval(t)
  }, [])
  return (
    <span>
      {now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}{' '}
      {now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
    </span>
  )
}

export function renderApp(app: AppSpec) {
  switch (app.type) {
    case 'finder':
      return <Finder folderId={app.folderId} />
    case 'doc':
      return <DocViewer docId={app.docId} />
    case 'browser':
      return <Browser />
    case 'terminal':
      return <Terminal />
    case 'trash':
      return <Trash />
  }
}

export function useOpenItem(onBook: () => void) {
  const { open, browse } = useWm()
  return (item: FsItem) => {
    switch (item.kind) {
      case 'folder':
        return open({ type: 'finder', folderId: item.id }, item.name)
      case 'doc':
        return open({ type: 'doc', docId: item.docId }, item.name)
      case 'project':
        return browse(item.projectId)
      case 'app':
        if (item.app === 'notebook') return onBook()
        if (item.app === 'browser') return open({ type: 'browser' }, 'Browser')
        return open({ type: item.app }, item.name)
    }
  }
}

export function Desktop({ preview, touch = false, onBook, onExit }: DesktopProps) {
  const root = useRef<HTMLDivElement>(null)
  const { windows, setBounds, focus } = useWm()
  const [selected, setSelected] = useState<string | null>(null)
  const openItem = useOpenItem(onBook)

  useLayoutEffect(() => {
    if (preview || !root.current) return
    const el = root.current
    const ro = new ResizeObserver(() => setBounds(el.clientWidth, el.clientHeight))
    ro.observe(el)
    return () => ro.disconnect()
  }, [preview, setBounds])

  const items = DESKTOP_ITEMS.map((id) => FS.get(id)!)

  return (
    <OsContext.Provider value={{ openItem, onBook, onExit, compact: false, touch }}>
      <div
        ref={root}
        className={`os ${preview ? 'is-preview' : ''}`}
        onPointerDown={(e) => e.target === e.currentTarget && setSelected(null)}
        aria-hidden={preview}
        inert={preview}
      >
        <div className="os-wallpaper" aria-hidden="true">
          <Logo className="os-wallpaper-mark" strokeWidth={10} />
        </div>

        <header className="os-menubar">
          <span className="os-menu-logo">
            <Logo strokeWidth={18} />
          </span>
          <span className="os-menu-app">Studio</span>
          <span className="os-menu-item">File</span>
          <span className="os-menu-item">View</span>
          <span className="os-menu-item">Help</span>
          <span className="os-menu-spacer" />
          <Clock />
          {!preview && (
            <button className="os-exit" onClick={onExit}>
              Stand up <span className="kbd">Esc</span>
            </button>
          )}
        </header>

        <ul className="os-icons" role="list" aria-label="Desktop">
          {items.map((item) => (
            <li key={item.id}>
              <button
                className={`os-icon ${selected === item.id ? 'is-selected' : ''}`}
                onClick={(e) => {
                  setSelected(item.id)
                  if (touch || e.detail === 0) openItem(item) // touch or keyboard
                }}
                onDoubleClick={() => openItem(item)}
                tabIndex={preview ? -1 : 0}
              >
                <FsIcon item={item} size={52} />
                <span className="os-icon-label">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>

        {windows.map((w) => (
          <Window key={w.id} win={w}>
            {renderApp(w.app)}
          </Window>
        ))}

        {!preview && (
          <nav className="os-dock" aria-label="Open windows">
            {windows.length === 0 ? (
              <span className="os-dock-hint">{touch ? 'Tap an icon to open it' : 'Double-click an icon to open it'}</span>
            ) : (
              windows.map((w) => (
                <button
                  key={w.id}
                  className={`os-dock-item ${w.minimized ? 'is-min' : ''}`}
                  onClick={() => focus(w.id)}
                >
                  {w.title}
                </button>
              ))
            )}
          </nav>
        )}
      </div>
    </OsContext.Provider>
  )
}
