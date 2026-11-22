import type { FsItem } from '../content/fs'

/** Custom d>OS file icons. 48×48 artboard. */
export function FsIcon({ item, size = 48 }: { item: FsItem; size?: number }) {
  const s = { width: size, height: size }
  if (item.kind === 'folder') {
    return (
      <svg viewBox="0 0 48 48" style={s} aria-hidden="true">
        <path d="M4 12a3 3 0 0 1 3-3h11l4 4h19a3 3 0 0 1 3 3v3H4Z" fill="#c9a26b" />
        <rect x="4" y="16" width="40" height="25" rx="3" fill="#e8c38c" />
        <rect x="4" y="16" width="40" height="3" fill="#f3d6a8" />
      </svg>
    )
  }
  if (item.kind === 'doc') {
    return (
      <svg viewBox="0 0 48 48" style={s} aria-hidden="true">
        <path d="M11 4h19l9 9v29a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" fill="#f4efe6" />
        <path d="M30 4v7a2 2 0 0 0 2 2h7" fill="#d9d2c4" />
        <rect x="14" y="20" width="18" height="2" rx="1" fill="#9aa3b2" />
        <rect x="14" y="25" width="20" height="2" rx="1" fill="#c3c9d3" />
        <rect x="14" y="30" width="16" height="2" rx="1" fill="#c3c9d3" />
        <rect x="14" y="35" width="19" height="2" rx="1" fill="#c3c9d3" />
        <rect x="9" y="36" width="12" height="7" rx="1.5" fill="#3c6ff0" />
        <text x="15" y="41.6" fontSize="5" fontFamily="Geist, sans-serif" fontWeight="700" fill="#fff" textAnchor="middle">
          DOC
        </text>
      </svg>
    )
  }
  if (item.kind === 'project') {
    return (
      <svg viewBox="0 0 48 48" style={s} aria-hidden="true">
        <rect x="4" y="8" width="40" height="32" rx="4" fill="#1f2530" />
        <rect x="4" y="8" width="40" height="7" rx="4" fill="#2c3442" />
        <circle cx="9" cy="11.5" r="1.3" fill="#ff7a6b" />
        <circle cx="13" cy="11.5" r="1.3" fill="#ffc985" />
        <circle cx="17" cy="11.5" r="1.3" fill="#8fdca2" />
        <rect x="9" y="19" width="18" height="3" rx="1.5" fill="#f4efe6" />
        <rect x="9" y="25" width="26" height="2" rx="1" fill="#6b7586" />
        <rect x="9" y="29" width="22" height="2" rx="1" fill="#6b7586" />
        <rect x="31" y="18" width="9" height="9" rx="2" fill="#7cc4ff" />
      </svg>
    )
  }
  switch (item.app) {
    case 'browser':
      return (
        <svg viewBox="0 0 48 48" style={s} aria-hidden="true">
          <circle cx="24" cy="24" r="19" fill="#20324a" />
          <circle cx="24" cy="24" r="19" fill="none" stroke="#7cc4ff" strokeWidth="2" />
          <ellipse cx="24" cy="24" rx="8" ry="19" fill="none" stroke="#7cc4ff" strokeWidth="2" />
          <path d="M5 24h38M8 14h32M8 34h32" stroke="#7cc4ff" strokeWidth="2" />
        </svg>
      )
    case 'terminal':
      return (
        <svg viewBox="0 0 48 48" style={s} aria-hidden="true">
          <rect x="4" y="7" width="40" height="34" rx="5" fill="#111318" stroke="#3a404c" />
          <path d="m12 18 6 6-6 6" stroke="#8fdca2" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M22 31h12" stroke="#f4efe6" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      )
    case 'trash':
      return (
        <svg viewBox="0 0 48 48" style={s} aria-hidden="true">
          <path d="M12 14h24l-2 28a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2Z" fill="#cfd5de" />
          <rect x="9" y="9" width="30" height="5" rx="2" fill="#aab2bf" />
          <rect x="20" y="5" width="8" height="5" rx="1.5" fill="#aab2bf" />
          <path d="M19 20v18M24 20v18M29 20v18" stroke="#8e97a5" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    case 'notebook':
      return (
        <svg viewBox="0 0 48 48" style={s} aria-hidden="true">
          <rect x="10" y="5" width="30" height="38" rx="3" fill="#f6f0e3" />
          <path d="M16 15h18M16 21h18M16 27h18M16 33h12" stroke="#b9c7d9" strokeWidth="1.5" />
          {[9, 15, 21, 27, 33, 39].map((y) => (
            <rect key={y} x="7" y={y - 1.5} width="7" height="3" rx="1.5" fill="#6b7586" />
          ))}
          <path d="m30 36 9-14 3 2-9 14-4 1Z" fill="#ffb45c" />
        </svg>
      )
  }
}
