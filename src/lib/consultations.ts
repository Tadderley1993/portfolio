import { supabase } from './supabase'

export const PROJECT_TYPES = ['New website', 'Website redesign', 'Web app', 'E-commerce', 'Branding', 'Something else'] as const
export const BUDGETS = ['Under $5k', '$5k – $15k', '$15k – $40k', '$40k+', 'Not sure yet'] as const
export const TIMELINES = ['ASAP', '1 – 3 months', '3 – 6 months', 'Flexible'] as const
export const CONTACT_METHODS = ['Email', 'Phone', 'Video call'] as const
export const STATUSES = ['new', 'contacted', 'booked', 'closed', 'archived'] as const
export type Status = (typeof STATUSES)[number]

export interface ConsultationInput {
  name: string
  email: string
  phone?: string
  company?: string
  project_type: string
  budget: string
  timeline: string
  message: string
  contact_method: string
}

export interface Consultation extends ConsultationInput {
  id: string
  created_at: string
  status: Status
  admin_notes: string | null
  source: string | null
}

export class BackendNotConfigured extends Error {
  constructor() {
    super('The booking backend is not connected yet.')
  }
}

export async function submitConsultation(input: ConsultationInput, source: string) {
  if (!supabase) throw new BackendNotConfigured()
  const { error } = await supabase.from('consultations').insert({
    ...input,
    phone: input.phone || null,
    company: input.company || null,
    source,
    user_agent: navigator.userAgent.slice(0, 300),
  })
  if (error) throw error
}
