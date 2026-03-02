import { ipcMain, app, shell, dialog, BrowserWindow } from 'electron'
import { getStore } from '../utils/store'
import { getConfig, setConfig } from '../utils/config'
import { logger } from '../utils/logger'
import { getSecureStorage } from '../utils/secure-storage'
import { GatewayManager } from '../gateway/manager'
import { getProviders } from '../utils/provider-registry'
import { runOpenClawCli } from '../utils/openclaw-cli'
import {
  minimizeWindow,
  maximizeWindow,
  closeWindow,
  hideWindow,
  isWindowMaximized,
} from './window'

export function registerIpcHandlers(win: BrowserWindow, gatewayManager: GatewayManager): void {
  // ── Window Controls ──────────────────────────────────────────
  ipcMain.handle('window:minimize', () => minimizeWindow())
  ipcMain.handle('window:maximize', () => maximizeWindow())
  ipcMain.handle('window:close', () => closeWindow())
  ipcMain.handle('window:hide', () => hideWindow())
  ipcMain.handle('window:isMaximized', () => isWindowMaximized())

  // ── App Info ─────────────────────────────────────────────────
  ipcMain.handle('app:getVersion', () => app.getVersion())
  ipcMain.handle('app:getName', () => app.getName())
  ipcMain.handle('app:getPath', (_, name: string) => app.getPath(name as any))
  ipcMain.handle('app:openExternal', (_, url: string) => shell.openExternal(url))
  ipcMain.handle('app:showItemInFolder', (_, path: string) => shell.showItemInFolder(path))

  // ── Config ───────────────────────────────────────────────────
  ipcMain.handle('config:get', (_, key: string) => getConfig(key))
  ipcMain.handle('config:set', (_, key: string, value: unknown) => setConfig(key, value))
  ipcMain.handle('config:getAll', () => getConfig())
  ipcMain.handle('config:reset', () => {
    const store = getStore()
    store.clear()
    return true
  })

  // ── Secure Storage (API Keys) ────────────────────────────────
  const secureStorage = getSecureStorage()
  ipcMain.handle('secure:setApiKey', async (_, provider: string, key: string) => {
    return secureStorage.setApiKey(provider, key)
  })
  ipcMain.handle('secure:getApiKey', async (_, provider: string) => {
    return secureStorage.getApiKey(provider)
  })
  ipcMain.handle('secure:deleteApiKey', async (_, provider: string) => {
    return secureStorage.deleteApiKey(provider)
  })
  ipcMain.handle('secure:hasApiKey', async (_, provider: string) => {
    return secureStorage.hasApiKey(provider)
  })

  // ── Gateway ──────────────────────────────────────────────────
  ipcMain.handle('gateway:start', async () => {
    try {
      await gatewayManager.start()
      return { success: true }
    } catch (error) {
      logger.error('Gateway start failed:', error)
      return { success: false, error: String(error) }
    }
  })

  ipcMain.handle('gateway:stop', async () => {
    try {
      await gatewayManager.stop()
      return { success: true }
    } catch (error) {
      return { success: false, error: String(error) }
    }
  })

  ipcMain.handle('gateway:restart', async () => {
    try {
      await gatewayManager.restart()
      return { success: true }
    } catch (error) {
      return { success: false, error: String(error) }
    }
  })

  ipcMain.handle('gateway:getStatus', () => gatewayManager.getStatus())

  ipcMain.handle('gateway:send', async (_, message: unknown) => {
    return gatewayManager.send(message)
  })

  // Forward gateway events to renderer
  gatewayManager.on('status-change', (status) => {
    win.webContents.send('gateway:status', status)
  })

  gatewayManager.on('message', (msg) => {
    win.webContents.send('gateway:message', msg)
  })

  gatewayManager.on('error', (error) => {
    win.webContents.send('gateway:error', error)
  })

  // ── Providers ────────────────────────────────────────────────
  ipcMain.handle('providers:getAll', () => getProviders())

  // ── OpenClaw CLI ─────────────────────────────────────────────
  ipcMain.handle('cli:run', async (_, args: string[]) => {
    return runOpenClawCli(args)
  })

  // ── Dialog ───────────────────────────────────────────────────
  ipcMain.handle('dialog:showOpen', async (_, options: Electron.OpenDialogOptions) => {
    return dialog.showOpenDialog(win, options)
  })

  ipcMain.handle('dialog:showSave', async (_, options: Electron.SaveDialogOptions) => {
    return dialog.showSaveDialog(win, options)
  })

  ipcMain.handle('dialog:showMessage', async (_, options: Electron.MessageBoxOptions) => {
    return dialog.showMessageBox(win, options)
  })

  // ── Theme ────────────────────────────────────────────────────
  ipcMain.handle('theme:set', (_, theme: 'dark' | 'light' | 'system') => {
    setConfig('theme', theme)
    win.webContents.send('theme:changed', theme)
    return true
  })

  ipcMain.handle('theme:get', () => getConfig('theme') ?? 'dark')

  logger.info('IPC handlers registered successfully')
}
