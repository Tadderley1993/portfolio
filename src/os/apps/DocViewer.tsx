import { docById } from '../../content/docs'
import { useOs } from '../context'

export function DocViewer({ docId }: { docId: string }) {
  const { compact } = useOs()
  const doc = docById(docId)
  if (!doc) return <p className="app-empty">Document not found.</p>
  return (
    <div className="docv">
      {!compact && (
        <div className="docv-toolbar" aria-hidden="true">
          <span className="docv-tool docv-font">Newsreader</span>
          <span className="docv-tool">12</span>
          <span className="docv-sep" />
          <span className="docv-tool"><b>B</b></span>
          <span className="docv-tool"><i>I</i></span>
          <span className="docv-tool"><u>U</u></span>
          <span className="docv-sep" />
          <span className="docv-tool docv-align">
            <svg viewBox="0 0 16 16" width="14" height="14" stroke="currentColor" strokeWidth="1.5"><path d="M2 4h12M2 8h8M2 12h12" /></svg>
          </span>
          <span className="docv-spacer" />
          <span className="docv-status">Saved · Read only</span>
        </div>
      )}
      <div className="docv-scroll">
        <article className="docv-page">
          {doc.blocks.map((b, i) => {
            switch (b.type) {
              case 'title':
                return <h1 key={i}>{b.text}</h1>
              case 'subtitle':
                return <p key={i} className="docv-sub">{b.text}</p>
              case 'h2':
                return <h2 key={i}>{b.text}</h2>
              case 'p':
                return <p key={i}>{b.text}</p>
              case 'quote':
                return <blockquote key={i}>{b.text}</blockquote>
              case 'list':
                return (
                  <ul key={i}>
                    {b.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                )
            }
          })}
        </article>
      </div>
    </div>
  )
}
