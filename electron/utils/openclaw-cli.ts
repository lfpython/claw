import { spawn } from 'child_process'
import { getOpenClawPath } from './paths'
import { logger } from './logger'

export interface CliResult {
  success: boolean
  stdout: string
  stderr: string
  exitCode: number | null
}

/**
 * Run the OpenClaw CLI with the given arguments
 */
export async function runOpenClawCli(args: string[]): Promise<CliResult> {
  return new Promise((resolve) => {
    const cliPath = getOpenClawPath()
    logger.debug(`Running CLI: ${cliPath} ${args.join(' ')}`)

    const proc = spawn(cliPath, args, {
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    })

    let stdout = ''
    let stderr = ''

    proc.stdout?.on('data', (data: Buffer) => {
      stdout += data.toString()
    })

    proc.stderr?.on('data', (data: Buffer) => {
      stderr += data.toString()
    })

    proc.on('close', (exitCode) => {
      const success = exitCode === 0
      logger.debug(`CLI exited: ${exitCode}`)
      if (!success) {
        logger.warn(`CLI error output: ${stderr}`)
      }
      resolve({ success, stdout, stderr, exitCode })
    })

    proc.on('error', (error) => {
      logger.error('CLI spawn error:', error)
      resolve({
        success: false,
        stdout: '',
        stderr: error.message,
        exitCode: -1,
      })
    })
  })
}

/**
 * Get OpenClaw version
 */
export async function getOpenClawVersion(): Promise<string | null> {
  const result = await runOpenClawCli(['--version'])
  if (result.success) {
    return result.stdout.trim()
  }
  return null
}

/**
 * Check if OpenClaw is installed and accessible
 */
export async function isOpenClawAvailable(): Promise<boolean> {
  const result = await runOpenClawCli(['--version'])
  return result.success
}

/**
 * Start gateway via CLI
 */
export async function startGateway(port: number = 18789): Promise<CliResult> {
  return runOpenClawCli(['gateway', 'start', '--port', String(port), '--background'])
}

/**
 * Stop gateway via CLI
 */
export async function stopGateway(): Promise<CliResult> {
  return runOpenClawCli(['gateway', 'stop'])
}

/**
 * Get gateway status via CLI
 */
export async function getGatewayStatus(): Promise<CliResult> {
  return runOpenClawCli(['gateway', 'status'])
}
