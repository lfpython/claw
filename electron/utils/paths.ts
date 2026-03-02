import { app } from 'electron'
import { join } from 'path'
import { existsSync } from 'fs'

/**
 * Get the user data directory for ClawWin
 */
export function getUserDataPath(): string {
  return app.getPath('userData')
}

/**
 * Get the logs directory
 */
export function getLogsPath(): string {
  return join(getUserDataPath(), 'logs')
}

/**
 * Get the config file path
 */
export function getConfigPath(): string {
  return join(getUserDataPath(), 'config.json')
}

/**
 * Get the path to the openclaw CLI binary
 */
export function getOpenClawPath(): string {
  // Check for bundled binary first
  const bundledPaths = [
    join(process.resourcesPath, 'bin', 'openclaw.exe'),
    join(process.resourcesPath, 'bin', 'openclaw'),
    join(__dirname, '../../../resources/bin/openclaw.exe'),
    join(__dirname, '../../../resources/bin/openclaw'),
  ]

  for (const p of bundledPaths) {
    if (existsSync(p)) {
      return p
    }
  }

  // Fall back to system PATH
  return process.platform === 'win32' ? 'openclaw.exe' : 'openclaw'
}

/**
 * Get the gateway socket/port path
 */
export function getGatewaySocketPath(): string {
  if (process.platform === 'win32') {
    return '\\\\.\\pipe\\openclaw-gateway'
  }
  return join(getUserDataPath(), 'gateway.sock')
}

/**
 * Get resources directory
 */
export function getResourcesPath(): string {
  if (app.isPackaged) {
    return process.resourcesPath
  }
  return join(process.cwd(), 'resources')
}

/**
 * Get icons directory
 */
export function getIconsPath(): string {
  return join(getResourcesPath(), 'icons')
}

/**
 * Get the temp directory for ClawWin
 */
export function getTempPath(): string {
  return join(app.getPath('temp'), 'clawwin')
}
