import { contextBridge, ipcRenderer } from 'electron'

// Type for IPC event listener removal
type IpcListener = (...args: unknown[]) => void

// Exposed API on window.clawwin
const clawwinAPI = {
  // ── Window Controls ───────────────────────────────────────────
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close'),
    hide: () => ipcRenderer.invoke('window:hide'),
    isMaximized: () => ipcRenderer.invoke('window:isMaximized'),
    onMaximizeChange: (callback: (isMax: boolean) => void) => {
      const listener = (_: unknown, value: boolean) => callback(value)
      ipcRenderer.on('window:maximizeChanged', listener)
      return () => ipcRenderer.removeListener('window:maximizeChanged', listener)
    },
  },

  // ── App Info ──────────────────────────────────────────────────
  app: {
    getVersion: () => ipcRenderer.invoke('app:getVersion'),
    getName: () => ipcRenderer.invoke('app:getName'),
    getPath: (name: string) => ipcRenderer.invoke('app:getPath', name),
    openExternal: (url: string) => ipcRenderer.invoke('app:openExternal', url),
    showItemInFolder: (path: string) => ipcRenderer.invoke('app:showItemInFolder', path),
  },

  // ── Config ────────────────────────────────────────────────────
  config: {
    get: (key: string) => ipcRenderer.invoke('config:get', key),
    set: (key: string, value: unknown) => ipcRenderer.invoke('config:set', key, value),
    getAll: () => ipcRenderer.invoke('config:getAll'),
    reset: () => ipcRenderer.invoke('config:reset'),
  },

  // ── Secure Storage ────────────────────────────────────────────
  secure: {
    setApiKey: (provider: string, key: string) =>
      ipcRenderer.invoke('secure:setApiKey', provider, key),
    getApiKey: (provider: string) =>
      ipcRenderer.invoke('secure:getApiKey', provider),
    deleteApiKey: (provider: string) =>
      ipcRenderer.invoke('secure:deleteApiKey', provider),
    hasApiKey: (provider: string) =>
      ipcRenderer.invoke('secure:hasApiKey', provider),
  },

  // ── Gateway ───────────────────────────────────────────────────
  gateway: {
    start: () => ipcRenderer.invoke('gateway:start'),
    stop: () => ipcRenderer.invoke('gateway:stop'),
    restart: () => ipcRenderer.invoke('gateway:restart'),
    getStatus: () => ipcRenderer.invoke('gateway:getStatus'),
    send: (message: unknown) => ipcRenderer.invoke('gateway:send', message),
    onStatus: (callback: (status: unknown) => void) => {
      const listener = (_: unknown, status: unknown) => callback(status)
      ipcRenderer.on('gateway:status', listener)
      return () => ipcRenderer.removeListener('gateway:status', listener)
    },
    onMessage: (callback: (msg: unknown) => void) => {
      const listener = (_: unknown, msg: unknown) => callback(msg)
      ipcRenderer.on('gateway:message', listener)
      return () => ipcRenderer.removeListener('gateway:message', listener)
    },
    onError: (callback: (error: unknown) => void) => {
      const listener = (_: unknown, error: unknown) => callback(error)
      ipcRenderer.on('gateway:error', listener)
      return () => ipcRenderer.removeListener('gateway:error', listener)
    },
    onAction: (callback: (action: string) => void) => {
      const listener = (_: unknown, action: string) => callback(action)
      ipcRenderer.on('gateway:action', listener)
      return () => ipcRenderer.removeListener('gateway:action', listener)
    },
  },

  // ── Providers ─────────────────────────────────────────────────
  providers: {
    getAll: () => ipcRenderer.invoke('providers:getAll'),
  },

  // ── CLI ───────────────────────────────────────────────────────
  cli: {
    run: (args: string[]) => ipcRenderer.invoke('cli:run', args),
  },

  // ── Dialog ────────────────────────────────────────────────────
  dialog: {
    showOpen: (options: Electron.OpenDialogOptions) =>
      ipcRenderer.invoke('dialog:showOpen', options),
    showSave: (options: Electron.SaveDialogOptions) =>
      ipcRenderer.invoke('dialog:showSave', options),
    showMessage: (options: Electron.MessageBoxOptions) =>
      ipcRenderer.invoke('dialog:showMessage', options),
  },

  // ── Theme ─────────────────────────────────────────────────────
  theme: {
    set: (theme: 'dark' | 'light' | 'system') =>
      ipcRenderer.invoke('theme:set', theme),
    get: () => ipcRenderer.invoke('theme:get'),
    onChange: (callback: (theme: string) => void) => {
      const listener = (_: unknown, theme: string) => callback(theme)
      ipcRenderer.on('theme:changed', listener)
      return () => ipcRenderer.removeListener('theme:changed', listener)
    },
  },

  // ── Navigation ────────────────────────────────────────────────
  navigation: {
    onNavigate: (callback: (path: string) => void) => {
      const listener = (_: unknown, path: string) => callback(path)
      ipcRenderer.on('navigate', listener)
      return () => ipcRenderer.removeListener('navigate', listener)
    },
  },

  // ── Update ────────────────────────────────────────────────────
  update: {
    onStatus: (callback: (status: unknown) => void) => {
      const listener = (_: unknown, status: unknown) => callback(status)
      ipcRenderer.on('update:status', listener)
      return () => ipcRenderer.removeListener('update:status', listener)
    },
  },
}

// Expose to renderer process
contextBridge.exposeInMainWorld('clawwin', clawwinAPI)

// Type declaration for TypeScript
declare global {
  interface Window {
    clawwin: typeof clawwinAPI
  }
}
