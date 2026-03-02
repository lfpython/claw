import Store from 'electron-store'
import { logger } from './logger'

// Store schema type
interface StoreSchema {
  windowBounds: {
    width: number
    height: number
    x?: number
    y?: number
  }
  isFirstRun: boolean
  language: string
  theme: 'dark' | 'light' | 'system'
  minimizeToTray: boolean
  gatewayPort: number
  gatewayAutoStart: boolean
  selectedProvider: string
  selectedModel: string
  setupCompleted: boolean
  windowBounds_x?: number
  windowBounds_y?: number
}

let store: Store<StoreSchema> | null = null

export async function initStore(): Promise<Store<StoreSchema>> {
  if (store) return store

  store = new Store<StoreSchema>({
    name: 'clawwin-config',
    defaults: {
      isFirstRun: true,
      language: 'zh',
      theme: 'dark',
      minimizeToTray: true,
      gatewayPort: 18789,
      gatewayAutoStart: true,
      selectedProvider: 'zhipu',
      selectedModel: 'glm-4-flash',
      setupCompleted: false,
      windowBounds: {
        width: 1280,
        height: 800,
      },
    },
  })

  logger.info(`Store initialized at: ${store.path}`)
  return store
}

export function getStore(): Store<StoreSchema> {
  if (!store) {
    throw new Error('Store not initialized. Call initStore() first.')
  }
  return store
}
