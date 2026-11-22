import { PROJECTS } from './projects'

/** The desktop's virtual file system. */
export type FsItem =
  | { kind: 'folder'; id: string; name: string; children: string[] }
  | { kind: 'project'; id: string; name: string; projectId: string }
  | { kind: 'doc'; id: string; name: string; docId: string }
  | { kind: 'app'; id: string; name: string; app: 'browser' | 'terminal' | 'trash' | 'notebook' }

const items: FsItem[] = [
  { kind: 'folder', id: 'concept', name: 'Concept Work', children: PROJECTS.filter((p) => p.kind === 'concept').map((p) => `p-${p.id}`) },
  { kind: 'folder', id: 'client', name: 'Client Work', children: PROJECTS.filter((p) => p.kind === 'client').map((p) => `p-${p.id}`) },
  { kind: 'folder', id: 'services', name: 'Services', children: ['d-svc-web-design', 'd-svc-development', 'd-svc-branding'] },
  { kind: 'doc', id: 'd-mission', name: 'Our Mission Statement.docx', docId: 'mission' },
  { kind: 'doc', id: 'd-about', name: 'About the Studio.docx', docId: 'about' },
  { kind: 'doc', id: 'd-svc-web-design', name: 'Web Design.docx', docId: 'svc-web-design' },
  { kind: 'doc', id: 'd-svc-development', name: 'Development.docx', docId: 'svc-development' },
  { kind: 'doc', id: 'd-svc-branding', name: 'Branding.docx', docId: 'svc-branding' },
  { kind: 'app', id: 'a-browser', name: 'Browser', app: 'browser' },
  { kind: 'app', id: 'a-terminal', name: 'Terminal', app: 'terminal' },
  { kind: 'app', id: 'a-trash', name: 'Trash', app: 'trash' },
  { kind: 'app', id: 'a-notebook', name: 'Book a Call', app: 'notebook' },
  ...PROJECTS.map((p): FsItem => ({ kind: 'project', id: `p-${p.id}`, name: p.title, projectId: p.id })),
]

export const FS = new Map(items.map((i) => [i.id, i]))

/** Icons on the desktop, in order. */
export const DESKTOP_ITEMS = ['concept', 'client', 'services', 'd-mission', 'd-about', 'a-browser', 'a-terminal', 'a-notebook', 'a-trash']
