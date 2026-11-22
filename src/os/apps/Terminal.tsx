import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { DESKTOP_ITEMS, FS, type FsItem } from '../../content/fs'
import { useOs } from '../context'

type Line = { kind: 'in' | 'out'; text: string }

const HELP = `available commands:
  help             show this list
  ls [folder]      list the desktop, or a folder's contents
  open <name>      open a folder, file, project or app  (e.g. open mission)
  whoami           who are we?
  contact          book a consultation  (also: book)
  date             today's date
  echo <text>      print some text
  clear            clear the screen  (also: Ctrl+L)
  exit             leave the computer
tip: ↑ / ↓ scroll through previous commands`

/** Display name in listings: folders get a trailing slash. */
const label = (item: FsItem) => (item.kind === 'folder' ? `${item.name}/` : item.name)

/** Normalise for matching: lower-case, no quotes, no .docx, single spaces. */
const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/["'`]/g, '')
    .replace(/\.docx$/, '')
    .replace(/\/$/, '')
    .replace(/\s+/g, ' ')
    .trim()

/** Best match for a name: exact, then starts-with, then contains (desktop items win ties). */
function findItem(query: string): FsItem | undefined {
  const q = norm(query)
  if (!q) return undefined
  const all = [...DESKTOP_ITEMS.map((id) => FS.get(id)!), ...FS.values()]
  return (
    all.find((i) => norm(i.name) === q) ??
    all.find((i) => norm(i.name).startsWith(q)) ??
    all.find((i) => norm(i.name).includes(q))
  )
}

export function Terminal() {
  const { openItem, onBook, onExit, preview } = useOs()
  const [lines, setLines] = useState<Line[]>([
    { kind: 'out', text: 'd>OS terminal — type `help` to get started.' },
  ])
  const [value, setValue] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [cursor, setCursor] = useState<number | null>(null)
  const root = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const inputId = useId()

  // Keep the newest line in view by scrolling only the terminal's own window body.
  // (Not scrollIntoView: it scrolls every ancestor, and in current Chrome it returns a Promise,
  // which crashed React when returned from an effect.)
  useEffect(() => {
    const box = root.current?.parentElement
    if (box) box.scrollTop = box.scrollHeight
  }, [lines])

  const run = (raw: string): string | null => {
    const [cmd = '', ...rest] = raw.trim().split(/\s+/)
    const arg = rest.join(' ')
    switch (cmd.toLowerCase()) {
      case '':
        return ''
      case 'help':
      case '?':
        return HELP
      case 'ls':
      case 'dir': {
        if (!arg) return DESKTOP_ITEMS.map((id) => label(FS.get(id)!)).join('\n')
        const folder = findItem(arg)
        if (!folder || folder.kind !== 'folder') return `ls: ${arg}: not a folder`
        return folder.children.map((id) => label(FS.get(id)!)).join('\n') || '(empty)'
      }
      case 'open':
      case 'cd':
      case 'cat': {
        if (!arg) return `${cmd.toLowerCase()}: tell me what to open — try \`ls\``
        const item = findItem(arg)
        if (!item) return `${cmd.toLowerCase()}: no such file: ${arg}`
        if (item.kind === 'app' && item.app === 'terminal') return "you're already here."
        window.setTimeout(() => openItem(item), 150)
        return `opening ${item.name}…`
      }
      case 'whoami':
        return 'd> — a design & development studio. (placeholder bio)'
      case 'contact':
      case 'book':
        window.setTimeout(onBook, 400)
        return 'opening the notebook…'
      case 'date':
        return new Date().toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' })
      case 'echo':
        return arg
      case 'pwd':
        return '/Users/studio/Desktop'
      case 'exit':
      case 'quit':
        window.setTimeout(onExit, 300)
        return 'bye 👋'
      case 'sudo':
        return 'nice try.'
      case 'clear':
      case 'cls':
        setLines([])
        return null
      default:
        return `command not found: ${cmd} — type \`help\` for the list`
    }
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const entered = value
    const out = run(entered)
    if (entered.trim()) setHistory((h) => [...h, entered])
    setCursor(null)
    setValue('')
    if (out === null) return
    setLines((l) => [...l, { kind: 'in', text: entered }, ...(out ? [{ kind: 'out' as const, text: out }] : [])])
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault()
      const next = cursor === null ? history.length - 1 : Math.max(0, cursor - 1)
      setCursor(next)
      setValue(history[next])
    } else if (e.key === 'ArrowDown' && cursor !== null) {
      e.preventDefault()
      const next = cursor + 1
      if (next >= history.length) {
        setCursor(null)
        setValue('')
      } else {
        setCursor(next)
        setValue(history[next])
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setLines([])
    }
  }

  return (
    <div className="term" ref={root} onClick={() => !preview && input.current?.focus()}>
      {lines.map((l, i) => (
        <pre key={i} className={`term-line term-${l.kind}`}>
          {l.kind === 'in' ? <span className="term-prompt">studio ~ % </span> : null}
          {l.text}
        </pre>
      ))}
      <form onSubmit={submit} className="term-form">
        <label htmlFor={inputId} className="term-prompt">
          studio ~ %
        </label>
        <input
          id={inputId}
          ref={input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          // The small monitor preview mirrors open windows; it must never take the keyboard.
          readOnly={preview}
          tabIndex={preview ? -1 : undefined}
          autoFocus={!preview}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="go"
          aria-label="Terminal command"
        />
      </form>
    </div>
  )
}
