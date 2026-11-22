import { FS, type FsItem } from '../../content/fs'
import { FsIcon } from '../icons'
import { useOs } from '../context'
import { projectById } from '../../content/projects'

export function Finder({ folderId }: { folderId: string }) {
  const { openItem, compact, touch } = useOs()
  const folder = FS.get(folderId)
  if (!folder || folder.kind !== 'folder') return <p className="app-empty">Folder not found.</p>
  const children = folder.children.map((id) => FS.get(id)).filter(Boolean) as FsItem[]

  return (
    <div className="finder">
      {!compact && (
        <aside className="finder-side" aria-label="Places">
          <p className="finder-side-title">Studio</p>
          {['concept', 'client', 'services'].map((id) => {
            const f = FS.get(id)!
            return (
              <button
                key={id}
                className={`finder-side-item ${id === folderId ? 'is-active' : ''}`}
                onClick={() => openItem(f)}
              >
                <FsIcon item={f} size={16} />
                {f.name}
              </button>
            )
          })}
        </aside>
      )}
      <div className="finder-main">
        <p className="finder-count">
          {children.length} item{children.length === 1 ? '' : 's'}
        </p>
        <ul className="finder-grid" role="list">
          {children.map((item) => {
            const project = item.kind === 'project' ? projectById(item.projectId) : undefined
            return (
              <li key={item.id}>
                <button
                  className="finder-item"
                  onDoubleClick={() => !compact && !touch && openItem(item)}
                  onClick={(e) => {
                    // single click opens on touch / compact; double-click on desktop;
                    // keyboard activation (detail === 0) always opens
                    if (compact || touch || e.detail === 0) openItem(item)
                  }}
                >
                  {project ? (
                    <span
                      className="finder-thumb"
                      style={{ background: project.palette.bg, color: project.palette.fg }}
                    >
                      <span className="finder-thumb-bar" style={{ background: project.palette.accent }} />
                      <span className="finder-thumb-title">{project.title}</span>
                    </span>
                  ) : (
                    <FsIcon item={item} size={56} />
                  )}
                  <span className="finder-name">{item.name}</span>
                  {project && <span className="finder-meta">{project.year}</span>}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
