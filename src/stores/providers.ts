import { create } from 'zustand'
import { PROVIDERS, type Provider } from '../lib/providers'

interface ProvidersState {
  providers: Provider[]
  defaultProviderId: string
  defaultModelId: string
  hasApiKey: Record<string, boolean>
  setDefault: (providerId: string, modelId: string) => void
  setHasApiKey: (providerId: string, has: boolean) => void
  checkApiKeys: () => Promise<void>
}

export const useProvidersStore = create<ProvidersState>((set) => ({
  providers: PROVIDERS,
  defaultProviderId: PROVIDERS[0].id,
  defaultModelId: PROVIDERS[0].models[0].id,
  hasApiKey: {},

  setDefault: (providerId, modelId) => set({ defaultProviderId: providerId, defaultModelId: modelId }),

  setHasApiKey: (providerId, has) =>
    set(state => ({ hasApiKey: { ...state.hasApiKey, [providerId]: has } })),

  checkApiKeys: async () => {
    const results: Record<string, boolean> = {}
    for (const p of PROVIDERS) {
      if (p.isLocal) {
        results[p.id] = true
        continue
      }
      try {
        results[p.id] = await window.clawwin.secure.hasApiKey(p.id)
      } catch {
        results[p.id] = false
      }
    }
    set({ hasApiKey: results })
  },
}))
