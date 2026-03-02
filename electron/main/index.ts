import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { join } from 'path'
import { createWindow, getMainWindow } from './window'
import { createTray, destroyTray } from './tray'
import { registerIpcHandlers } from './ipc-handlers'
import { setupAutoUpdater } from './updater'
import { GatewayManager } from '../gateway/manager'
import { initStore } from '../utils/store'
import { logger } from '../utils/logger'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit()
}

// Single instance lock
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    const win = getMainWindow()
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })
}

// Global gateway manager
let gatewayManager: GatewayManager | null = null

async function initialize() {
  try {
    // Initialize store first
    await initStore()
    logger.info('Store initialized')

    // Create main window
    const win = await createWindow()
    logger.info('Main window created')

    // Create system tray
    createTray(win)
    logger.info('Tray created')

    // Initialize gateway manager
    gatewayManager = new GatewayManager()
    logger.info('Gateway manager initialized')

    // Register IPC handlers
    registerIpcHandlers(win, gatewayManager)
    logger.info('IPC handlers registered')

    // Setup auto updater
    setupAutoUpdater()
    logger.info('Auto updater setup complete')

    return win
  } catch (error) {
    logger.error('Initialization failed:', error)
    throw error
  }
}

// App ready
app.whenReady().then(async () => {
  logger.info(`ClawWin starting... v${app.getVersion()}`)
  logger.info(`Platform: ${process.platform} ${process.arch}`)
  logger.info(`Electron: ${process.versions.electron}`)

  await initialize()

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow()
    }
  })
})

// Quit when all windows are closed (except macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Cleanup on quit
app.on('before-quit', async () => {
  logger.info('Application quitting...')
  destroyTray()
  if (gatewayManager) {
    await gatewayManager.stop()
  }
})

// Handle external URLs
app.on('web-contents-created', (_, contents) => {
  contents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
})

// Security: prevent navigation to external URLs
app.on('web-contents-created', (_, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl)
    if (parsedUrl.origin !== 'http://localhost:5173' && !navigationUrl.startsWith('file://')) {
      event.preventDefault()
    }
  })
})
