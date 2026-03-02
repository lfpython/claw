import { autoUpdater } from 'electron-updater'
import { BrowserWindow, dialog } from 'electron'
import { logger } from '../utils/logger'
import { getMainWindow } from './window'

export function setupAutoUpdater(): void {
  // Configure updater
  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = true
  autoUpdater.logger = {
    info: (msg: string) => logger.info(`[Updater] ${msg}`),
    warn: (msg: string) => logger.warn(`[Updater] ${msg}`),
    error: (msg: string) => logger.error(`[Updater] ${msg}`),
    debug: (msg: string) => logger.debug(`[Updater] ${msg}`),
  }

  // Events
  autoUpdater.on('checking-for-update', () => {
    logger.info('Checking for updates...')
    sendUpdateStatus({ event: 'checking' })
  })

  autoUpdater.on('update-available', (info) => {
    logger.info(`Update available: ${info.version}`)
    sendUpdateStatus({
      event: 'available',
      version: info.version,
      releaseNotes: info.releaseNotes as string,
      releaseDate: info.releaseDate,
    })

    // Ask user if they want to download
    const win = getMainWindow()
    if (win) {
      dialog.showMessageBox(win, {
        type: 'info',
        title: '发现新版本',
        message: `发现新版本 v${info.version}`,
        detail: '是否立即下载更新？',
        buttons: ['立即下载', '稍后提醒'],
        defaultId: 0,
        cancelId: 1,
      }).then(({ response }) => {
        if (response === 0) {
          autoUpdater.downloadUpdate()
        }
      })
    }
  })

  autoUpdater.on('update-not-available', () => {
    logger.info('No updates available')
    sendUpdateStatus({ event: 'not-available' })
  })

  autoUpdater.on('download-progress', (progress) => {
    logger.info(`Download progress: ${progress.percent.toFixed(1)}%`)
    sendUpdateStatus({
      event: 'progress',
      percent: progress.percent,
      transferred: progress.transferred,
      total: progress.total,
      bytesPerSecond: progress.bytesPerSecond,
    })
  })

  autoUpdater.on('update-downloaded', (info) => {
    logger.info(`Update downloaded: ${info.version}`)
    sendUpdateStatus({
      event: 'downloaded',
      version: info.version,
    })

    // Ask user to install
    const win = getMainWindow()
    if (win) {
      dialog.showMessageBox(win, {
        type: 'info',
        title: '更新已下载',
        message: `版本 v${info.version} 已下载完成`,
        detail: '点击"立即安装"重启应用并安装更新。',
        buttons: ['立即安装', '下次启动时安装'],
        defaultId: 0,
        cancelId: 1,
      }).then(({ response }) => {
        if (response === 0) {
          autoUpdater.quitAndInstall(false, true)
        }
      })
    }
  })

  autoUpdater.on('error', (error) => {
    logger.error('Updater error:', error)
    sendUpdateStatus({
      event: 'error',
      message: error.message,
    })
  })

  // Check for updates after 10 seconds (don't check immediately)
  setTimeout(() => {
    autoUpdater.checkForUpdates().catch((err) => {
      logger.warn('Update check failed (non-critical):', err.message)
    })
  }, 10000)
}

export function checkForUpdates(): void {
  autoUpdater.checkForUpdates().catch((err) => {
    logger.error('Manual update check failed:', err)
  })
}

export function downloadUpdate(): void {
  autoUpdater.downloadUpdate()
}

export function installUpdate(): void {
  autoUpdater.quitAndInstall(false, true)
}

function sendUpdateStatus(status: Record<string, unknown>): void {
  const win = getMainWindow()
  if (win && !win.isDestroyed()) {
    win.webContents.send('update:status', status)
  }
}
