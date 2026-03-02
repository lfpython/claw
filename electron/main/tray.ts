import { Tray, Menu, app, nativeImage, BrowserWindow } from 'electron'
import { join } from 'path'
import { showWindow } from './window'
import { logger } from '../utils/logger'

let tray: Tray | null = null

export function createTray(win: BrowserWindow): void {
  try {
    const iconPath = getTrayIconPath()
    const icon = nativeImage.createFromPath(iconPath)

    tray = new Tray(icon.isEmpty() ? nativeImage.createEmpty() : icon)
    tray.setToolTip('ClawWin - AI 桌面助手')
    tray.setTitle('ClawWin')

    updateTrayMenu(win)

    // Double click to show window
    tray.on('double-click', () => {
      showWindow()
    })

    // Single click on Windows shows window
    if (process.platform === 'win32') {
      tray.on('click', () => {
        showWindow()
      })
    }

    logger.info('Tray created successfully')
  } catch (error) {
    logger.error('Failed to create tray:', error)
  }
}

export function updateTrayMenu(win: BrowserWindow): void {
  if (!tray) return

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示 ClawWin',
      type: 'normal',
      click: () => showWindow(),
    },
    { type: 'separator' },
    {
      label: '聊天',
      type: 'normal',
      click: () => {
        showWindow()
        win.webContents.send('navigate', '/chat')
      },
    },
    {
      label: '仪表盘',
      type: 'normal',
      click: () => {
        showWindow()
        win.webContents.send('navigate', '/dashboard')
      },
    },
    {
      label: '设置',
      type: 'normal',
      click: () => {
        showWindow()
        win.webContents.send('navigate', '/settings')
      },
    },
    { type: 'separator' },
    {
      label: 'Gateway 状态',
      submenu: [
        {
          label: '启动 Gateway',
          click: () => {
            win.webContents.send('gateway:action', 'start')
          },
        },
        {
          label: '停止 Gateway',
          click: () => {
            win.webContents.send('gateway:action', 'stop')
          },
        },
        {
          label: '重启 Gateway',
          click: () => {
            win.webContents.send('gateway:action', 'restart')
          },
        },
      ],
    },
    { type: 'separator' },
    {
      label: `版本 v${app.getVersion()}`,
      enabled: false,
    },
    { type: 'separator' },
    {
      label: '退出 ClawWin',
      type: 'normal',
      click: () => {
        app.exit(0)
      },
    },
  ])

  tray.setContextMenu(contextMenu)
}

export function setTrayStatus(status: 'connected' | 'disconnected' | 'connecting'): void {
  if (!tray) return

  const tooltips: Record<string, string> = {
    connected: 'ClawWin - Gateway 已连接 ✓',
    disconnected: 'ClawWin - Gateway 未连接',
    connecting: 'ClawWin - Gateway 连接中...',
  }

  tray.setToolTip(tooltips[status] || 'ClawWin')
}

export function destroyTray(): void {
  if (tray) {
    tray.destroy()
    tray = null
    logger.info('Tray destroyed')
  }
}

function getTrayIconPath(): string {
  if (process.platform === 'win32') {
    return join(__dirname, '../../resources/icons/tray.ico')
  } else if (process.platform === 'darwin') {
    return join(__dirname, '../../resources/icons/trayTemplate.png')
  }
  return join(__dirname, '../../resources/icons/tray.png')
}
