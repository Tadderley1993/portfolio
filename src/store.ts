import { create } from 'zustand'

export type Scene = 'intro' | 'exterior' | 'studio'
export type StudioFocus = 'desk' | 'monitor' | 'notebook'

interface ExperienceState {
  scene: Scene
  focus: StudioFocus
  lampOn: boolean
  setScene: (s: Scene) => void
  setFocus: (f: StudioFocus) => void
  toggleLamp: () => void
}

export const useExperience = create<ExperienceState>((set) => ({
  scene: 'intro',
  focus: 'desk',
  lampOn: false,
  setScene: (scene) => set({ scene, focus: 'desk' }),
  setFocus: (focus) => set({ focus }),
  toggleLamp: () => set((s) => ({ lampOn: !s.lampOn })),
}))
