import { PROJECTS, projectById, type Project } from '../../content/projects'
import { useWm } from '../wm'
import { useOs } from '../context'

export function Browser() {
  const { browser, browse, browserBack, browserForward } = useWm()
  const { compact } = useOs()
  const page = browser.history[browser.index]
  const project = page === 'home' ? undefined : projectById(page)
  const url = project ? `https://${project.url}` : 'd://studio/start'

  return (
    <div className={`browser ${compact ? 'is-compact' : ''}`}>
      <div className="browser-chrome">
        <div className="browser-nav">
          <button aria-label="Back" disabled={browser.index === 0} onClick={browserBack}>
            <svg viewBox="0 0 16 16"><path d="M10 3 5 8l5 5" /></svg>
          </button>
          <button
            aria-label="Forward"
            disabled={browser.index >= browser.history.length - 1}
            onClick={browserForward}
          >
            <svg viewBox="0 0 16 16"><path d="m6 3 5 5-5 5" /></svg>
          </button>
          <button aria-label="Start page" onClick={() => browse('home')}>
            <svg viewBox="0 0 16 16"><path d="M2.5 7.5 8 3l5.5 4.5V13h-4V9.5h-3V13h-4Z" /></svg>
          </button>
        </div>
        <div className="browser-url" title={url}>
          <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="4" y="7" width="8" height="6" rx="1" /><path d="M5.5 7V5.5a2.5 2.5 0 0 1 5 0V7" /></svg>
          <span>{url}</span>
        </div>
        {(project?.liveUrl || project?.site) && (
          <a className="browser-live" href={project.liveUrl ?? project.site} target="_blank" rel="noreferrer">
            Visit live site ↗
          </a>
        )}
      </div>
      <div className="browser-view">{project ? <ProjectPage p={project} /> : <StartPage />}</div>
    </div>
  )
}

function StartPage() {
  const { browse } = useWm()
  return (
    <div className="startpage">
      <p className="startpage-kicker">Designs By Terrence Adderley · Bookmarks</p>
      <h2>Where to next?</h2>
      <div className="startpage-grid">
        {PROJECTS.map((p) => (
          <button key={p.id} className="startpage-card" onClick={() => browse(p.id)}>
            {p.thumb ? (
              <img className="startpage-thumb startpage-thumb-img" src={p.thumb} alt="" loading="lazy" />
            ) : (
              <span className="startpage-thumb" style={{ background: p.palette.bg, color: p.palette.fg }}>
                <span style={{ background: p.palette.accent }} />
                {p.title}
              </span>
            )}
            <span className="startpage-label">{p.url}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/** Placeholder site mock built from the project's palette. Replaced by screenshots when provided. */
function ProjectPage({ p }: { p: Project }) {
  const { preview } = useOs()
  // A real concept site: load it live. The small monitor preview shows the thumbnail instead,
  // so the site isn't loaded twice.
  if (p.site) {
    if (preview) return p.thumb ? <img className="projsite-thumb" src={p.thumb} alt="" /> : null
    return <iframe className="projsite" src={p.site} title={`${p.title} (concept site)`} loading="lazy" />
  }
  if (p.screenshots?.length) {
    return (
      <div className="projshots">
        {p.screenshots.map((src) => (
          <img key={src} src={src} alt={`${p.title} screenshot`} loading="lazy" />
        ))}
      </div>
    )
  }
  const { bg, fg, accent } = p.palette
  return (
    <div className="mock" style={{ background: bg, color: fg, ['--accent' as string]: accent }}>
      <nav className="mock-nav">
        <strong>{p.title}</strong>
        <span>Work</span>
        <span>About</span>
        <span className="mock-cta">Contact</span>
      </nav>
      <header className="mock-hero">
        <p className="mock-kicker">{p.kind === 'concept' ? 'Concept' : p.client} · {p.year}</p>
        <h1>{p.headline}</h1>
        <p className="mock-sum">{p.summary}</p>
        <div className="mock-tags">
          {p.services.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
      </header>
      <div className="mock-visual" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      {p.sections.map((s) => (
        <section key={s.heading} className="mock-section">
          <h2>{s.heading}</h2>
          <p>{s.body}</p>
        </section>
      ))}
      <footer className="mock-foot">Placeholder project · replace with real screenshots</footer>
    </div>
  )
}
