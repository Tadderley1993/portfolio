import { useState } from 'react'
import { FS, DESKTOP_ITEMS, type FsItem } from '../content/fs'
import { FsIcon } from './icons'
import { OsContext } from './context'
import { useWm, type AppSpec } from './wm'
import { renderApp } from './Desktop'
import { Logo } from '../components/Logo'
import { useBackLayer } from '../lib/backLayer'
import './os.css'

interface PhoneOSProps {
  onBook: () => void
  onExit: () => void
}

/** One history entry per open app, so Back closes the app instead of leaving the studio. */
function BackEntry({ onBack }: { onBack: () => void }) {
  useBackLayer(true, onBack)
  return null
}

/** Mobile take on the desktop: an app grid, and apps open full-screen with a back button. */
export function PhoneOS({ onBook, onExit }: PhoneOSProps) {
  const [stack, setStack] = useState<{ app: AppSpec; title: string }[]>([])
  const { browse } = useWm()

  const push = (app: AppSpec, title: string) => setStack((s) => [...s, { app, title }])

  const openItem = (item: FsItem) => {
    switch (item.kind) {
      case 'folder':
        return push({ type: 'finder', folderId: item.id }, item.name)
      case 'doc':
        return push({ type: 'doc', docId: item.docId }, item.name)
      case 'project':
        browse(item.projectId)
        return push({ type: 'browser' }, item.name)
      case 'app':
        if (item.app === 'notebook') return onBook()
        return push({ type: item.app }, item.name)
    }
  }

  const top = stack[stack.length - 1]
  const pop = () => setStack((s) => s.slice(0, -1))

  return (
    <OsContext.Provider value={{ openItem, onBook, onExit, compact: true, touch: true }}>
      <div className="phone-os">
        <header className="phone-bar">
          {top ? (
            <button className="phone-back" onClick={pop}>
              <svg viewBox="0 0 16 16"><path d="M10 3 5 8l5 5" /></svg>
              Back
            </button>
          ) : (
            <span className="phone-brand">
              <Logo strokeWidth={18} /> Studio
            </span>
          )}
          <span className="phone-title">{top?.title ?? ''}</span>
          <button className="phone-close" onClick={onExit} aria-label="Leave the computer">
            <svg viewBox="0 0 12 12"><path d="m3 3 6 6M9 3 3 9" /></svg>
          </button>
        </header>

        {top ? (
          <div className="phone-app">{renderApp(top.app)}</div>
        ) : (
          <ul className="phone-grid" role="list">
            {DESKTOP_ITEMS.map((id) => {
              const item = FS.get(id)!
              return (
                <li key={id}>
                  <button className="phone-icon" onClick={() => openItem(item)}>
                    <FsIcon item={item} size={54} />
                    <span>{item.name.replace('.docx', '')}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}

        {/* Booking is always one tap away, in thumb reach. */}
        <div className="phone-book">
          <button onClick={onBook}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18H6Z" /><path d="M9 8h6M9 12h6M9 16h3" /></svg>
            Book a consultation
          </button>
        </div>

        {stack.map((_, i) => (
          <BackEntry key={i} onBack={pop} />
        ))}
      </div>
    </OsContext.Provider>
  )
}
