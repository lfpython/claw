import { create } from 'zustand'

interface SettingsState {
  language: 'zh' | 'en'
  theme: 'dark' | 'light' | 'system'
  setupCompleted: boolean
  gatewayPort: number
  autoStart: boolean
  minimizeToTray: boolean
  setLanguage: (lang: 'zh' | 'en') => void
  setTheme: (theme: 'dark' | 'light' | 'system') => void
  setSetupCompleted: (v: boolean) => void
  setGatewayPort: (port: number) => void
  setAutoStart: (v: boolean) => void
  setMinimizeToTray: (v: boolean) => void
  load: () => Promise<void>
  save: () => Promise<void>
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  language: 'zh',
  theme: 'dark',
  setupCompleted: false,
  gatewayPort: 18789,
  autoStart: false,
  minimizeToTray: true,

  setLanguage: (language) => set({ language }),
  setTheme: (theme) => set({ theme }),
  setSetupCompleted: (setupCompleted) => set({ setupCompleted }),
  setGatewayPort: (gatewayPort) => set({ gatewayPort }),
  setAutoStart: (autoStart) => set({ autoStart }),
  setMinimizeToTray: (minimizeToTray) => set({ minimizeToTray }),

  load: async () => {
    try {
      const all = await window.clawwin.config.getAll()
      set({
        language: (all.language as 'zh' | 'en') ?? 'zh',
        theme: (all.theme as 'dark' | 'light' | 'system') ?? 'dark',
        setupCompleted: (all.setupCompleted as boolean) ?? false,
        gatewayPort: (all.gatewayPort as number) ?? 18789,
        autoStart: (all.autoStart as boolean) ?? false,
        minimizeToTray: (all.minimizeToTray as boolean) ?? true,
      })
    } catch { /* ignore */ }
  },

  save: async () => {
    const s = get()
    try {
      await window.clawwin.config.set('language', s.language)
      await window.clawwin.config.set('theme', s.theme)
      await window.clawwin.config.set('setupCompleted', s.setupCompleted)
      await window.clawwin.config.set('gatewayPort', s.gatewayPort)
      await window.clawwin.config.set('autoStart', s.autoStart)
      await window.clawwin.config.set('minimizeToTray', s.minimizeToTray)
    } catch { /* ignore */ }
  },
}))
