import { getStore } from './store'

/**
 * Get a config value
 */
export function getConfig(key?: string): unknown {
  const store = getStore()
  if (!key) {
    return store.store
  }
  return store.get(key as any)
}

/**
 * Set a config value
 */
export function setConfig(key: string, value: unknown): void {
  const store = getStore()
  store.set(key as any, value as any)
}

/**
 * Delete a config key
 */
export function deleteConfig(key: string): void {
  const store = getStore()
  store.delete(key as any)
}

/**
 * Check if a config key exists
 */
export function hasConfig(key: string): boolean {
  const store = getStore()
  return store.has(key as any)
}

/**
 * Reset all config to defaults
 */
export function resetConfig(): void {
  const store = getStore()
  store.clear()
}

/**
 * Get gateway port
 */
export function getGatewayPort(): number {
  return (getConfig('gatewayPort') as number) ?? 18789
}

/**
 * Get selected provider
 */
export function getSelectedProvider(): string {
  return (getConfig('selectedProvider') as string) ?? 'zhipu'
}

/**
 * Get selected model
 */
export function getSelectedModel(): string {
  return (getConfig('selectedModel') as string) ?? 'glm-4-flash'
}

/**
 * Check if setup is completed
 */
export function isSetupCompleted(): boolean {
  return (getConfig('setupCompleted') as boolean) ?? false
}

/**
 * Mark setup as completed
 */
export function markSetupCompleted(): void {
  setConfig('setupCompleted', true)
  setConfig('isFirstRun', false)
}
