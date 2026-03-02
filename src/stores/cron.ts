import { create } from 'zustand'
import type { CronJob } from '../types/cron'

interface CronState {
  jobs: CronJob[]
  loading: boolean
  setJobs: (jobs: CronJob[]) => void
  setLoading: (v: boolean) => void
  refresh: () => Promise<void>
}

export const useCronStore = create<CronState>((set) => ({
  jobs: [],
  loading: false,
  setJobs: (jobs) => set({ jobs }),
  setLoading: (loading) => set({ loading }),

  refresh: async () => {
    set({ loading: true })
    try {
      const result = await window.clawwin.cli.run(['cron', 'list', '--json'])
      if (result.success) {
        const data = JSON.parse(result.stdout)
        set({ jobs: data })
      }
    } catch { /* ignore */ } finally {
      set({ loading: false })
    }
  },
}))
