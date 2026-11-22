import { useEffect, useRef, useState, type FormEvent } from 'react'
import { FS } from '../../content/fs'
import { useOs } from '../context'

type Line = { kind: 'in' | 'out'; text: string }

const HELP = `available commands:
  help        show this list
  ls          list the desktop
  open <name> open a folder or file
  whoami      who are we?
  contact     book a consultation
  clear       clear the screen
  exit        leave the computer`

export function Terminal() {
  const { openItem, onBook, onExit } = useOs()
  const [lines, setLines] = useState<Line[]>([
    { kind: 'out', text: 'd>OS terminal — type `help` to get started.' },
  ])
  const [value, setValue] = useState('')
  const end = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => end.current?.scrollIntoView({ block: 'end' }), [lines])

  const run = (raw: string) => {
    const [cmd, ...rest] = raw.trim().split(/\s+/)
    const arg = rest.join(' ').toLowerCase()
    switch ((cmd ?? '').toLowerCase()) {
      case '':
        return ''
      case 'help':
        return HELP
      case 'ls':
        return ['Concept Work/', 'Client Work/', 'Services/', 'Our Mission Statement.docx', 'About the Studio.docx'].join('\n')
      case 'whoami':
        return 'd> — a design & development studio. (placeholder bio)'
      case 'open': {
        const match = [...FS.values()].find((i) => i.name.toLowerCase().startsWith(arg) && arg)
        if (!match) return `open: no such file: ${arg || '(none)'}`
        openItem(match)
        return `opening ${match.name}…`
      }
      case 'contact':
        setTimeout(onBook, 400)
        return 'opening the notebook…'
      case 'exit':
        setTimeout(onExit, 300)
        return 'bye 👋'
      case 'sudo':
        return 'nice try.'
      case 'clear':
        setLines([])
        return null
      default:
        return `command not found: ${cmd}`
    }
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const out = run(value)
    if (out === null) {
      setValue('')
      return
    }
    setLines((l) => [...l, { kind: 'in', text: value }, ...(out ? [{ kind: 'out' as const, text: out }] : [])])
    setValue('')
  }

  return (
    <div className="term" onClick={() => input.current?.focus()}>
      {lines.map((l, i) => (
        <pre key={i} className={`term-line term-${l.kind}`}>
          {l.kind === 'in' ? <span className="term-prompt">studio ~ % </span> : null}
          {l.text}
        </pre>
      ))}
      <form onSubmit={submit} className="term-form">
        <label htmlFor="term-input" className="term-prompt">
          studio ~ %
        </label>
        <input
          id="term-input"
          ref={input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoComplete="off"
          spellCheck={false}
          autoFocus
        />
      </form>
      <div ref={end} />
    </div>
  )
}
