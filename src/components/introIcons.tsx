import type { ReactNode } from 'react'

/** Design + development glyphs for the intro shuffle. 24×24, stroke-based. */
export const INTRO_ICONS: { label: string; svg: ReactNode }[] = [
  {
    label: 'Pen tool',
    svg: (
      <>
        <path d="M12 3 5.5 13.5 9 21h6l3.5-7.5Z" />
        <path d="M12 3v8" />
        <circle cx="12" cy="12.5" r="1.6" />
      </>
    ),
  },
  {
    label: 'Code',
    svg: (
      <>
        <path d="m8 7-5 5 5 5" />
        <path d="m16 7 5 5-5 5" />
        <path d="m13.5 4-3 16" />
      </>
    ),
  },
  {
    label: 'Bezier curve',
    svg: (
      <>
        <path d="M4 19C7 7 17 17 20 5" />
        <rect x="2.5" y="17.5" width="3" height="3" />
        <rect x="18.5" y="3.5" width="3" height="3" />
        <path d="M4 19 10 6M20 5l-6 13" strokeDasharray="1.5 2" />
      </>
    ),
  },
  {
    label: 'Terminal',
    svg: (
      <>
        <rect x="2.5" y="4" width="19" height="16" rx="2" />
        <path d="m6.5 9 3 3-3 3" />
        <path d="M12 15h5" />
      </>
    ),
  },
  {
    label: 'Cursor',
    svg: <path d="M5 3.5 18.5 10l-6 1.8L9.8 18Z" />,
  },
  {
    label: 'Grid',
    svg: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="1.5" />
        <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
      </>
    ),
  },
  {
    label: 'Color swatches',
    svg: (
      <>
        <circle cx="9" cy="9" r="5.5" />
        <circle cx="15" cy="9" r="5.5" />
        <circle cx="12" cy="14.5" r="5.5" />
      </>
    ),
  },
  {
    label: 'Layers',
    svg: (
      <>
        <path d="m12 3 9 5-9 5-9-5Z" />
        <path d="m3 12.5 9 5 9-5" />
        <path d="m3 16.5 9 5 9-5" />
      </>
    ),
  },
  {
    label: 'Typography',
    svg: (
      <>
        <path d="M3 19 8.5 5h1L15 19" />
        <path d="M5.2 14h7.6" />
        <circle cx="18.5" cy="16" r="2.8" />
        <path d="M21.3 13v6" />
      </>
    ),
  },
  {
    label: 'Frame',
    svg: (
      <>
        <path d="M7 2v20M17 2v20M2 7h20M2 17h20" />
      </>
    ),
  },
  {
    label: 'Responsive',
    svg: (
      <>
        <rect x="2" y="4" width="14" height="11" rx="1.5" />
        <rect x="15" y="8" width="7" height="12" rx="1.5" />
        <path d="M6 19h6" />
      </>
    ),
  },
  {
    label: 'Git branch',
    svg: (
      <>
        <circle cx="6" cy="5" r="2.2" />
        <circle cx="6" cy="19" r="2.2" />
        <circle cx="18" cy="8" r="2.2" />
        <path d="M6 7.2v9.6M18 10.2c0 5-12 2.5-12 6.6" />
      </>
    ),
  },
]
