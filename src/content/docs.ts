/** Documents opened in the desktop's word-processor view. Mission and About are final; service docs are placeholders. */
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
      { type: 'subtitle', text: 'Designs By Terrence Adderley — Design & Development' },
      {
        type: 'quote',
        text: 'Most websites get scrolled past. We design and build the ones people stop for: fast, accessible sites that turn visitors into customers.',
      },
      { type: 'h2', text: 'What we believe' },
      {
        type: 'p',
        text: "People don't buy websites. They pay for more sales and a better experience for their customers. Every decision we make is measured against those two things.",
      },
      {
        type: 'list',
        items: [
          "Every page has a job. Book, buy, call, visit. If a page doesn't move someone toward it, it goes.",
          "Ordinary is invisible. If your site looks like everyone else's, customers can't tell you apart.",
          "Speed is measured, not promised. Every site we design is tested for load time on phones before launch, because that's where many of your customers arrive.",
          'Accessible by default. A site that works with a keyboard and a screen reader works better for everyone, and reaches more people.',
          'Taste is a business decision. Careful type, generous space and real restraint tell customers you take your work seriously.',
        ],
      },
      { type: 'h2', text: 'How we work' },
      {
        type: 'p',
        text: 'Design and development happen under one roof, so what we draw is what ships. When a project calls for specialist work such as photography, we bring in trusted partners case by case.',
      },
      {
        type: 'list',
        items: [
          'Consultation. Your goals, your customers, your current site and what success looks like.',
          'Proposal. One clear direction, with scope, timeline and cost agreed in writing before work begins.',
          'Design. Page layouts and a visual system, reviewed with you at each stage.',
          'Build and test. Clean code, checked for speed, accessibility and every common screen size.',
          'Launch and care. We put it live and handle your updates from there, so you never have to touch the code.',
        ],
      },
      {
        type: 'p',
        text: 'Already have a site that feels slow? We offer performance optimization for existing websites as a separate, quoted service.',
      },
      {
        type: 'p',
        text: 'Worth a conversation? Book a consultation from the notebook on the desk. We reply within one business day.',
      },
    ],
  },
  {
    id: 'about',
    filename: 'About the Studio.docx',
    blocks: [
      { type: 'title', text: 'About the Studio' },
      { type: 'subtitle', text: 'Who we are' },
      {
        type: 'p',
        text: 'Designs By Terrence Adderley (DBTA) is a design and development studio founded by Terrence Adderley. We design and build websites for businesses that want more than an online presence: more sales, and a better experience for their customers.',
      },
      { type: 'h2', text: 'The team' },
      { type: 'list', items: ['Terrence Adderley — Founder & CEO'] },
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
