import { create } from 'zustand'
import type { Skill } from '../types/skill'

interface SkillsState {
  skills: Skill[]
  loading: boolean
  setSkills: (skills: Skill[]) => void
  setLoading: (v: boolean) => void
  refresh: () => Promise<void>
}

export const useSkillsStore = create<SkillsState>((set) => ({
  skills: [],
  loading: false,
  setSkills: (skills) => set({ skills }),
  setLoading: (loading) => set({ loading }),

  refresh: async () => {
    set({ loading: true })
    try {
      const result = await window.clawwin.cli.run(['skills', 'list', '--json'])
      if (result.success) {
        const data = JSON.parse(result.stdout)
        set({ skills: data })
      }
    } catch { /* ignore */ } finally {
      set({ loading: false })
    }
  },
}))
