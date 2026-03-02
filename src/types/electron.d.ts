// window.clawwin API type definitions
// Exposed via Electron contextBridge in preload/index.ts

export {}

declare global {
  interface Window {
    clawwin: ClawWinAPI
  }
}

interface ClawWinAPI {
  window: {
    minimize(): Promise<void>
    maximize(): Promise<void>
    close(): Promise<void>
    hide(): Promise<void>
    isMaximized(): Promise<boolean>
    onMaximizeChange(callback: (isMax: boolean) => void): () => void
  }

  app: {
    getVersion(): Promise<string>
    getName(): Promise<string>
    getPath(name: string): Promise<string>
    openExternal(url: string): Promise<void>
    showItemInFolder(path: string): Promise<void>
  }

  config: {
    get(key: string): Promise<unknown>
    set(key: string, value: unknown): Promise<void>
    getAll(): Promise<Record<string, unknown>>
    reset(): Promise<boolean>
  }

  secure: {
    setApiKey(provider: string, key: string): Promise<boolean>
    getApiKey(provider: string): Promise<string | null>
    deleteApiKey(provider: string): Promise<boolean>
    hasApiKey(provider: string): Promise<boolean>
  }

  gateway: {
    start(): Promise<{ success: boolean; error?: string }>
    stop(): Promise<{ success: boolean; error?: string }>
    restart(): Promise<{ success: boolean; error?: string }>
    getStatus(): Promise<GatewayStatus>
    send(message: unknown): Promise<boolean>
    onStatus(callback: (status: GatewayStatus) => void): () => void
    onMessage(callback: (msg: unknown) => void): () => void
    onError(callback: (error: unknown) => void): () => void
    onAction(callback: (action: string) => void): () => void
  }

  providers: {
    getAll(): Promise<ProviderInfo[]>
  }

  cli: {
    run(args: string[]): Promise<CliResult>
  }

  dialog: {
    showOpen(options: OpenDialogOptions): Promise<{ canceled: boolean; filePaths: string[] }>
    showSave(options: SaveDialogOptions): Promise<{ canceled: boolean; filePath?: string }>
    showMessage(options: MessageBoxOptions): Promise<{ response: number; checkboxChecked?: boolean }>
  }

  theme: {
    set(theme: 'dark' | 'light' | 'system'): Promise<boolean>
    get(): Promise<'dark' | 'light' | 'system'>
    onChange(callback: (theme: string) => void): () => void
  }

  navigation: {
    onNavigate(callback: (path: string) => void): () => void
  }

  update: {
    onStatus(callback: (status: UpdateStatus) => void): () => void
  }
}

interface GatewayStatus {
  status: 'stopped' | 'starting' | 'running' | 'stopping' | 'error'
  port: number
  pid?: number
  error?: string
  connectedAt?: number
}

interface ProviderInfo {
  id: string
  name: string
  nameEn: string
  baseUrl: string
  apiKeyUrl: string
  models: ModelInfo[]
  requiresProxy: boolean
  isLocal: boolean
  description: string
  descriptionEn: string
}

interface ModelInfo {
  id: string
  name: string
  contextLength: number
  capabilities: string[]
}

interface CliResult {
  success: boolean
  stdout: string
  stderr: string
  exitCode: number | null
}

interface OpenDialogOptions {
  title?: string
  defaultPath?: string
  filters?: Array<{ name: string; extensions: string[] }>
  properties?: Array<'openFile' | 'openDirectory' | 'multiSelections'>
}

interface SaveDialogOptions {
  title?: string
  defaultPath?: string
  filters?: Array<{ name: string; extensions: string[] }>
}

interface MessageBoxOptions {
  type?: 'none' | 'info' | 'error' | 'question' | 'warning'
  title?: string
  message: string
  detail?: string
  buttons?: string[]
  defaultId?: number
  cancelId?: number
}

interface UpdateStatus {
  event: 'checking' | 'available' | 'not-available' | 'progress' | 'downloaded' | 'error'
  version?: string
  releaseNotes?: string
  releaseDate?: string
  percent?: number
  transferred?: number
  total?: number
  bytesPerSecond?: number
  message?: string
}
