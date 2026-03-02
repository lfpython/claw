import { EventEmitter } from 'events'
import WebSocket from 'ws'
import { logger } from '../utils/logger'
import type { GatewayMessage } from './protocol'

export class GatewayClient extends EventEmitter {
  private ws: WebSocket | null = null
  private url: string
  private reconnecting = false
  public connectedAt: number | undefined

  constructor(url: string) {
    super()
    this.url = url
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Connection timeout'))
      }, 5000)

      try {
        this.ws = new WebSocket(this.url)

        this.ws.on('open', () => {
          clearTimeout(timeout)
          this.connectedAt = Date.now()
          logger.info(`Connected to gateway: ${this.url}`)
          this.emit('open')
          resolve()
        })

        this.ws.on('message', (data: WebSocket.RawData) => {
          try {
            const text = data.toString('utf-8')
            const msg = JSON.parse(text) as GatewayMessage
            this.emit('message', msg)
          } catch (error) {
            logger.warn('Failed to parse gateway message:', error)
          }
        })

        this.ws.on('close', (code, reason) => {
          this.connectedAt = undefined
          logger.info(`Gateway connection closed: ${code} ${reason}`)
          this.emit('close', code, reason)
        })

        this.ws.on('error', (error) => {
          clearTimeout(timeout)
          logger.error('Gateway WebSocket error:', error)
          this.emit('error', error)
          reject(error)
        })

        this.ws.on('ping', () => {
          this.ws?.pong()
        })
      } catch (error) {
        clearTimeout(timeout)
        reject(error)
      }
    })
  }

  send(message: unknown): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return false
    }

    try {
      this.ws.send(JSON.stringify(message))
      return true
    } catch (error) {
      logger.error('Failed to send message:', error)
      return false
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.removeAllListeners()
      if (
        this.ws.readyState === WebSocket.OPEN ||
        this.ws.readyState === WebSocket.CONNECTING
      ) {
        this.ws.close(1000, 'Client disconnecting')
      }
      this.ws = null
    }
    this.connectedAt = undefined
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }

  get readyState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED
  }

  ping(): void {
    this.ws?.ping()
  }
}
