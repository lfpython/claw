import { BrowserWindow, shell, screen } from 'electron'
import { join } from 'path'
import { getStore } from '../utils/store'
import { logger } from '../utils/logger'

let mainWindow: BrowserWindow | null = null

export function getMainWindow(): BrowserWindow | null {
  return mainWindow
}

export async function createWindow(): Promise<BrowserWindow> {
  const store = getStore()
  const savedBounds = store.get('windowBounds') as { width: number; height: number; x?: number; y?: number } | undefined

  // Get primary display info
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize

  const defaultWidth = Math.min(1280, screenWidth * 0.85)
  const defaultHeight = Math.min(800, screenHeight * 0.85)

  mainWindow = new BrowserWindow({
    width: savedBounds?.width ?? defaultWidth,
    height: savedBounds?.height ?? defaultHeight,
    x: savedBounds?.x,
    y: savedBounds?.y,
    minWidth: 900,
    minHeight: 600,
    frame: false,           // Frameless for custom title bar
    transparent: false,
    backgroundColor: '#1a1a2e',
    titleBarStyle: 'hidden',
    titleBarOverlay: false,
    trafficLightPosition: { x: 12, y: 16 },
    show: false,            // Don't show until ready
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      webSecurity: true,
      allowRunningInsecureContent: false,
    },
    icon: getIconPath(),
  })

  // Windows-specific: set rounded corners and vibrancy
  if (process.platform === 'win32') {
    // Windows 11 rounded corners are automatic with DWM
    mainWindow.setBackgroundColor('#1a1a2e')
  }

  // Load the app
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../../dist/index.html'))
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()

    // Check if first run
    const isFirstRun = store.get('isFirstRun', true)
    if (isFirstRun) {
      logger.info('First run detected, showing setup wizard')
    }
  })

  // Save window bounds on resize/move
  const saveBounds = () => {
    if (!mainWindow || mainWindow.isMaximized() || mainWindow.isMinimized()) return
    const bounds = mainWindow.getBounds()
    store.set('windowBounds', bounds)
  }

  mainWindow.on('resize', saveBounds)
  mainWindow.on('move', saveBounds)

  // Handle window close
  mainWindow.on('close', (event) => {
    const minimizeToTray = store.get('minimizeToTray', true)
    if (minimizeToTray) {
      event.preventDefault()
      mainWindow?.hide()
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  return mainWindow
}

function getIconPath(): string {
  if (process.platform === 'win32') {
    return join(__dirname, '../../resources/icons/icon.ico')
  } else if (process.platform === 'darwin') {
    return join(__dirname, '../../resources/icons/icon.icns')
  }
  return join(__dirname, '../../resources/icons/icon.png')
}

export function showWindow(): void {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.show()
    mainWindow.focus()
  }
}

export function hideWindow(): void {
  mainWindow?.hide()
}

export function minimizeWindow(): void {
  mainWindow?.minimize()
}

export function maximizeWindow(): void {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow?.maximize()
  }
}

export function closeWindow(): void {
  mainWindow?.close()
}

export function isWindowMaximized(): boolean {
  return mainWindow?.isMaximized() ?? false
}
