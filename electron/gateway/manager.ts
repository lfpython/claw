import { EventEmitter } from 'events'
import { ChildProcess, spawn } from 'child_process'
import { GatewayClient } from './client'
import { logger } from '../utils/logger'
import { getConfig } from '../utils/config'
import { getOpenClawPath } from '../utils/paths'

export type GatewayStatus = 'stopped' | 'starting' | 'running' | 'stopping' | 'error'

export interface GatewayStatusInfo {
  status: GatewayStatus
  port: number
  pid?: number
  error?: string
  connectedAt?: number
}

export class GatewayManager extends EventEmitter {
  private process: ChildProcess | null = null
  private client: GatewayClient | null = null
  private status: GatewayStatus = 'stopped'
  private port: number
  private restartAttempts = 0
  private maxRestartAttempts = 3
  private restartTimer: ReturnType<typeof setTimeout> | null = null

  constructor() {
    super()
    this.port = getConfig('gatewayPort') as number ?? 18789
  }

  async start(): Promise<void> {
    if (this.status === 'running' || this.status === 'starting') {
      logger.info('Gateway already running or starting')
      return
    }

    this.setStatus('starting')

    try {
      // Try to connect to existing gateway first
      const connected = await this.tryConnect()
      if (connected) {
        logger.info('Connected to existing OpenClaw Gateway')
        this.setStatus('running')
        return
      }

      // Start gateway process
      await this.startProcess()

      // Wait for it to be ready
      await this.waitForReady()

      this.setStatus('running')
      this.restartAttempts = 0
      logger.info(`Gateway started on port ${this.port}`)
    } catch (error) {
      logger.error('Failed to start gateway:', error)
      this.setStatus('error')
      throw error
    }
  }

  async stop(): Promise<void> {
    if (this.status === 'stopped') return

    this.setStatus('stopping')

    // Disconnect client
    if (this.client) {
      this.client.disconnect()
      this.client = null
    }

    // Kill process
    if (this.process) {
      this.process.kill('SIGTERM')

      // Force kill after timeout
      setTimeout(() => {
        if (this.process) {
          this.process.kill('SIGKILL')
          this.process = null
        }
      }, 5000)
    }

    this.setStatus('stopped')
    logger.info('Gateway stopped')
  }

  async restart(): Promise<void> {
    await this.stop()
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await this.start()
  }

  getStatus(): GatewayStatusInfo {
    return {
      status: this.status,
      port: this.port,
      pid: this.process?.pid,
      connectedAt: this.client?.connectedAt,
    }
  }

  async send(message: unknown): Promise<boolean> {
    if (!this.client) return false
    return this.client.send(message)
  }

  private async tryConnect(): Promise<boolean> {
    try {
      const client = new GatewayClient(`ws://localhost:${this.port}/ws`)
      await client.connect()
      this.setupClient(client)
      return true
    } catch {
      return false
    }
  }

  private async startProcess(): Promise<void> {
    const clawPath = getOpenClawPath()

    return new Promise((resolve, reject) => {
      const proc = spawn(clawPath, ['gateway', 'start', '--port', String(this.port)], {
        detached: false,
        stdio: ['ignore', 'pipe', 'pipe'],
        windowsHide: true,
      })

      this.process = proc

      proc.stdout?.on('data', (data: Buffer) => {
        const line = data.toString().trim()
        logger.debug(`[Gateway stdout] ${line}`)
        if (line.includes('Gateway started') || line.includes('Listening')) {
          resolve()
        }
      })

      proc.stderr?.on('data', (data: Buffer) => {
        logger.warn(`[Gateway stderr] ${data.toString().trim()}`)
      })

      proc.on('error', (error) => {
        logger.error('Gateway process error:', error)
        reject(error)
      })

      proc.on('exit', (code, signal) => {
        logger.info(`Gateway process exited: code=${code}, signal=${signal}`)
        this.process = null
        if (this.status === 'running') {
          this.handleUnexpectedExit()
        }
      })

      // Timeout if gateway doesn't start within 10 seconds
      setTimeout(() => resolve(), 10000)
    })
  }

  private async waitForReady(maxAttempts = 20): Promise<void> {
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((r) => setTimeout(r, 500))
      const connected = await this.tryConnect()
      if (connected) return
    }
    throw new Error('Gateway failed to start in time')
  }

  private setupClient(client: GatewayClient): void {
    this.client = client

    client.on('message', (msg) => {
      this.emit('message', msg)
    })

    client.on('close', () => {
      logger.info('Gateway client disconnected')
      if (this.status === 'running') {
        this.setStatus('error')
        this.handleUnexpectedExit()
      }
    })

    client.on('error', (error) => {
      logger.error('Gateway client error:', error)
      this.emit('error', error)
    })
  }

  private handleUnexpectedExit(): void {
    if (this.restartAttempts < this.maxRestartAttempts) {
      this.restartAttempts++
      const delay = Math.min(1000 * Math.pow(2, this.restartAttempts), 30000)
      logger.info(`Restarting gateway in ${delay}ms (attempt ${this.restartAttempts}/${this.maxRestartAttempts})`)

      this.restartTimer = setTimeout(async () => {
        try {
          await this.start()
        } catch (error) {
          logger.error('Gateway restart failed:', error)
        }
      }, delay)
    } else {
      logger.error('Gateway restart attempts exhausted')
      this.setStatus('error')
      this.emit('error', new Error('Gateway restart attempts exhausted'))
    }
  }

  private setStatus(status: GatewayStatus): void {
    this.status = status
    this.emit('status-change', this.getStatus())
  }
}
