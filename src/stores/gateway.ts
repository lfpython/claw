import { create } from 'zustand'

interface GatewayState {
  status: 'stopped' | 'starting' | 'running' | 'stopping' | 'error'
  port: number
  pid?: number
  error?: string
  connectedAt?: number
  uptime?: number
  setStatus: (status: Partial<Omit<GatewayState, 'setStatus' | 'start' | 'stop' | 'restart'>>) => void
  start: () => Promise<void>
  stop: () => Promise<void>
  restart: () => Promise<void>
}

export const useGatewayStore = create<GatewayState>((set, get) => ({
  status: 'stopped',
  port: 18789,

  setStatus: (update) => set(state => ({ ...state, ...update })),

  start: async () => {
    set({ status: 'starting', error: undefined })
    try {
      const result = await window.clawwin.gateway.start()
      if (!result.success) {
        set({ status: 'error', error: result.error })
      }
    } catch (e) {
      set({ status: 'error', error: String(e) })
    }
  },

  stop: async () => {
    set({ status: 'stopping' })
    try {
      await window.clawwin.gateway.stop()
      set({ status: 'stopped', pid: undefined })
    } catch (e) {
      set({ status: 'error', error: String(e) })
    }
  },

  restart: async () => {
    const { start } = get()
    set({ status: 'stopping' })
    try {
      await window.clawwin.gateway.restart()
    } catch {
      await start()
    }
  },
}))
