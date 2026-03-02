import { safeStorage } from 'electron'
import { getStore } from './store'
import { logger } from './logger'

const API_KEY_PREFIX = 'apikey_'

class SecureStorage {
  private fallbackToStore: boolean

  constructor() {
    // Check if safe storage is available
    this.fallbackToStore = !safeStorage.isEncryptionAvailable()
    if (this.fallbackToStore) {
      logger.warn('safeStorage not available, falling back to plain store (less secure)')
    } else {
      logger.info('safeStorage available, using encrypted storage for API keys')
    }
  }

  async setApiKey(provider: string, apiKey: string): Promise<boolean> {
    try {
      const storeKey = `${API_KEY_PREFIX}${provider}` as any
      const store = getStore()

      if (!this.fallbackToStore && safeStorage.isEncryptionAvailable()) {
        const encrypted = safeStorage.encryptString(apiKey)
        store.set(storeKey, encrypted.toString('base64'))
      } else {
        // Fallback: store as-is (basic obfuscation)
        const encoded = Buffer.from(apiKey).toString('base64')
        store.set(storeKey, encoded)
      }

      logger.info(`API key stored for provider: ${provider}`)
      return true
    } catch (error) {
      logger.error(`Failed to store API key for ${provider}:`, error)
      return false
    }
  }

  async getApiKey(provider: string): Promise<string | null> {
    try {
      const storeKey = `${API_KEY_PREFIX}${provider}` as any
      const store = getStore()
      const stored = store.get(storeKey) as string | undefined

      if (!stored) return null

      if (!this.fallbackToStore && safeStorage.isEncryptionAvailable()) {
        const encrypted = Buffer.from(stored, 'base64')
        return safeStorage.decryptString(encrypted)
      } else {
        return Buffer.from(stored, 'base64').toString('utf-8')
      }
    } catch (error) {
      logger.error(`Failed to retrieve API key for ${provider}:`, error)
      return null
    }
  }

  async deleteApiKey(provider: string): Promise<boolean> {
    try {
      const storeKey = `${API_KEY_PREFIX}${provider}` as any
      const store = getStore()
      store.delete(storeKey)
      logger.info(`API key deleted for provider: ${provider}`)
      return true
    } catch (error) {
      logger.error(`Failed to delete API key for ${provider}:`, error)
      return false
    }
  }

  async hasApiKey(provider: string): Promise<boolean> {
    try {
      const storeKey = `${API_KEY_PREFIX}${provider}` as any
      const store = getStore()
      const val = store.get(storeKey)
      return val !== undefined && val !== null && val !== ''
    } catch {
      return false
    }
  }
}

let secureStorageInstance: SecureStorage | null = null

export function getSecureStorage(): SecureStorage {
  if (!secureStorageInstance) {
    secureStorageInstance = new SecureStorage()
  }
  return secureStorageInstance
}
