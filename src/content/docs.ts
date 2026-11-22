/** Documents opened in the desktop's word-processor view. Placeholder copy. */
export type DocBlock =
  | { type: 'title'; text: string }
  | { type: 'subtitle'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'p'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'list'; items: string[] }

export interface Doc {
  id: string
  filename: string
  blocks: DocBlock[]
}

export const DOCS: Doc[] = [
  {
    id: 'mission',
    filename: 'Our Mission Statement.docx',
    blocks: [
      { type: 'title', text: 'Our Mission' },
      { type: 'subtitle', text: 'd> Studio — Design & Development' },
      {
        type: 'quote',
        text: 'Placeholder — a one-sentence mission statement that says why the studio exists.',
      },
      { type: 'h2', text: 'What we believe' },
      {
        type: 'p',
        text: 'Placeholder paragraph. Describe the values that shape how the studio designs and builds — craft, clarity, partnership, performance.',
      },
      { type: 'list', items: ['Placeholder belief one', 'Placeholder belief two', 'Placeholder belief three'] },
      { type: 'h2', text: 'How we work' },
      {
        type: 'p',
        text: 'Placeholder paragraph. Explain the process from first call to launch and beyond.',
      },
    ],
  },
  {
    id: 'about',
    filename: 'About the Studio.docx',
    blocks: [
      { type: 'title', text: 'About the Studio' },
      { type: 'subtitle', text: 'Who we are' },
      { type: 'p', text: 'Placeholder — a short studio bio: when it started, where it is, who it serves.' },
      { type: 'h2', text: 'The team' },
      { type: 'list', items: ['Name — Founder & Creative Director', 'Name — Lead Developer', 'Name — Designer'] },
    ],
  },
  {
    id: 'svc-web-design',
    filename: 'Web Design.docx',
    blocks: [
      { type: 'title', text: 'Web Design' },
      { type: 'p', text: 'Placeholder — what is included, typical timeline, and deliverables.' },
      { type: 'list', items: ['Discovery & strategy', 'Wireframes & prototypes', 'Visual design & design system'] },
    ],
  },
  {
    id: 'svc-development',
    filename: 'Development.docx',
    blocks: [
      { type: 'title', text: 'Development' },
      { type: 'p', text: 'Placeholder — stack, CMS options, performance and accessibility standards.' },
      { type: 'list', items: ['Marketing sites', 'Web apps', 'E-commerce', 'CMS integration'] },
    ],
  },
  {
    id: 'svc-branding',
    filename: 'Branding.docx',
    blocks: [
      { type: 'title', text: 'Branding' },
      { type: 'p', text: 'Placeholder — identity, logo, typography and brand guidelines.' },
    ],
  },
]

export const docById = (id: string) => DOCS.find((d) => d.id === id)
