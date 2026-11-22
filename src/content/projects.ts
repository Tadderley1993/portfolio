/**
 * Projects shown in the desktop browser. Placeholders for now — replace the copy, colors and
 * add `screenshots` (paths under /public/work/...) when real work is ready.
 */
export interface Project {
  id: string
  title: string
  client: string
  year: string
  kind: 'concept' | 'client'
  url: string
  liveUrl?: string
  summary: string
  services: string[]
  /** Brand colors used by the placeholder site mock */
  palette: { bg: string; fg: string; accent: string }
  headline: string
  sections: { heading: string; body: string }[]
  /** Optional real full-page screenshots; when present they replace the mock. */
  screenshots?: string[]
}

export const PROJECTS: Project[] = [
  {
    id: 'lumen-coffee',
    title: 'Lumen Coffee',
    client: 'Concept',
    year: '2026',
    kind: 'concept',
    url: 'lumen.coffee',
    summary: 'A warm, editorial storefront concept for a specialty roaster.',
    services: ['Brand direction', 'Web design', 'E-commerce'],
    palette: { bg: '#f3ebe0', fg: '#2a1d14', accent: '#c4622d' },
    headline: 'Slow mornings, roasted daily.',
    sections: [
      { heading: 'The brief', body: 'Placeholder — describe the challenge, audience and goals here.' },
      { heading: 'The approach', body: 'Placeholder — outline the design system, typography and key interactions.' },
      { heading: 'The outcome', body: 'Placeholder — add results, metrics or a client quote.' },
    ],
  },
  {
    id: 'northwind-labs',
    title: 'Northwind Labs',
    client: 'Concept',
    year: '2026',
    kind: 'concept',
    url: 'northwindlabs.io',
    summary: 'A product site concept for a climate-data startup.',
    services: ['UX strategy', 'Web design', 'Motion'],
    palette: { bg: '#0d1b2a', fg: '#e0f2ff', accent: '#5ee6c5' },
    headline: 'Weather data, finally readable.',
    sections: [
      { heading: 'The brief', body: 'Placeholder — describe the challenge, audience and goals here.' },
      { heading: 'The approach', body: 'Placeholder — outline the design system, typography and key interactions.' },
      { heading: 'The outcome', body: 'Placeholder — add results, metrics or a client quote.' },
    ],
  },
  {
    id: 'atelier-noor',
    title: 'Atelier Noor',
    client: 'Concept',
    year: '2025',
    kind: 'concept',
    url: 'ateliernoor.com',
    summary: 'A portfolio concept for an architecture practice.',
    services: ['Art direction', 'Web design'],
    palette: { bg: '#e8e6e1', fg: '#1b1b1b', accent: '#8a7a5c' },
    headline: 'Spaces shaped by light.',
    sections: [
      { heading: 'The brief', body: 'Placeholder — describe the challenge, audience and goals here.' },
      { heading: 'The approach', body: 'Placeholder — outline the design system, typography and key interactions.' },
      { heading: 'The outcome', body: 'Placeholder — add results, metrics or a client quote.' },
    ],
  },
  {
    id: 'client-one',
    title: 'Client Project One',
    client: 'Client name',
    year: '2026',
    kind: 'client',
    url: 'clientone.com',
    liveUrl: 'https://example.com',
    summary: 'Placeholder for a shipped client website.',
    services: ['Web design', 'Development', 'CMS'],
    palette: { bg: '#ffffff', fg: '#111827', accent: '#2563eb' },
    headline: 'A headline from the client site.',
    sections: [
      { heading: 'The brief', body: 'Placeholder — describe the challenge, audience and goals here.' },
      { heading: 'What we built', body: 'Placeholder — list the stack, integrations and features.' },
      { heading: 'Results', body: 'Placeholder — add results, metrics or a client quote.' },
    ],
  },
  {
    id: 'client-two',
    title: 'Client Project Two',
    client: 'Client name',
    year: '2025',
    kind: 'client',
    url: 'clienttwo.co',
    liveUrl: 'https://example.com',
    summary: 'Placeholder for a shipped client website.',
    services: ['Web design', 'Development'],
    palette: { bg: '#111111', fg: '#f5f5f5', accent: '#f59e0b' },
    headline: 'A headline from the client site.',
    sections: [
      { heading: 'The brief', body: 'Placeholder — describe the challenge, audience and goals here.' },
      { heading: 'What we built', body: 'Placeholder — list the stack, integrations and features.' },
      { heading: 'Results', body: 'Placeholder — add results, metrics or a client quote.' },
    ],
  },
  {
    id: 'client-three',
    title: 'Client Project Three',
    client: 'Client name',
    year: '2025',
    kind: 'client',
    url: 'clientthree.org',
    liveUrl: 'https://example.com',
    summary: 'Placeholder for a shipped client website.',
    services: ['Web app', 'Design system'],
    palette: { bg: '#f0fdf4', fg: '#052e16', accent: '#16a34a' },
    headline: 'A headline from the client site.',
    sections: [
      { heading: 'The brief', body: 'Placeholder — describe the challenge, audience and goals here.' },
      { heading: 'What we built', body: 'Placeholder — list the stack, integrations and features.' },
      { heading: 'Results', body: 'Placeholder — add results, metrics or a client quote.' },
    ],
  },
]

export const projectById = (id: string) => PROJECTS.find((p) => p.id === id)
