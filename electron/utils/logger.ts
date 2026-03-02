import { app } from 'electron'
import { join } from 'path'
import { mkdirSync, appendFileSync } from 'fs'

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

class Logger {
  private logDir: string
  private logFile: string
  private level: LogLevel

  constructor() {
    this.level = process.env.NODE_ENV === 'development' ? 'debug' : 'info'

    try {
      this.logDir = join(app.getPath('userData'), 'logs')
      mkdirSync(this.logDir, { recursive: true })
    } catch {
      this.logDir = join(process.cwd(), 'logs')
      mkdirSync(this.logDir, { recursive: true })
    }

    const date = new Date().toISOString().split('T')[0]
    this.logFile = join(this.logDir, `clawwin-${date}.log`)
  }

  private format(level: LogLevel, message: string, ...args: unknown[]): string {
    const timestamp = new Date().toISOString()
    const levelStr = level.toUpperCase().padEnd(5)
    const argsStr = args.length > 0
      ? ' ' + args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ')
      : ''
    return `[${timestamp}] [${levelStr}] ${message}${argsStr}`
  }

  private write(level: LogLevel, message: string, ...args: unknown[]): void {
    if (LOG_LEVELS[level] < LOG_LEVELS[this.level]) return

    const formatted = this.format(level, message, ...args)

    // Console output with colors
    const colors: Record<LogLevel, string> = {
      debug: '\x1b[90m',
      info: '\x1b[36m',
      warn: '\x1b[33m',
      error: '\x1b[31m',
    }
    const reset = '\x1b[0m'
    console.log(`${colors[level]}${formatted}${reset}`)

    // File output
    try {
      appendFileSync(this.logFile, formatted + '\n')
    } catch {
      // Ignore file write errors
    }
  }

  debug(message: string, ...args: unknown[]): void {
    this.write('debug', message, ...args)
  }

  info(message: string, ...args: unknown[]): void {
    this.write('info', message, ...args)
  }

  warn(message: string, ...args: unknown[]): void {
    this.write('warn', message, ...args)
  }

  error(message: string, ...args: unknown[]): void {
    this.write('error', message, ...args)
  }

  getLogDir(): string {
    return this.logDir
  }

  getLogFile(): string {
    return this.logFile
  }
}

export const logger = new Logger()
