import { create } from 'zustand'
import type { Channel } from '../types/channel'

interface ChannelsState {
  channels: Channel[]
  loading: boolean
  setChannels: (channels: Channel[]) => void
  setLoading: (v: boolean) => void
  refresh: () => Promise<void>
}

export const useChannelsStore = create<ChannelsState>((set) => ({
  channels: [],
  loading: false,

  setChannels: (channels) => set({ channels }),
  setLoading: (loading) => set({ loading }),

  refresh: async () => {
    set({ loading: true })
    try {
      const result = await window.clawwin.cli.run(['channels', 'list', '--json'])
      if (result.success) {
        const data = JSON.parse(result.stdout)
        set({ channels: data })
      }
    } catch { /* ignore */ } finally {
      set({ loading: false })
    }
  },
}))
