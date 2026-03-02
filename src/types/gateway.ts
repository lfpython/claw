export type GatewayStatus = 'stopped' | 'starting' | 'running' | 'stopping' | 'error'

export interface GatewayStatusInfo {
  status: GatewayStatus
  port: number
  pid?: number
  error?: string
  connectedAt?: number
  version?: string
  uptime?: number
  messageCount?: number
  connectedClients?: number
}

export interface GatewayMessage {
  type: string
  id?: string
  timestamp?: number
  payload?: unknown
}

export interface ChatRequest {
  conversationId: string
  message: string
  provider?: string
  model?: string
  temperature?: number
  maxTokens?: number
  stream?: boolean
  systemPrompt?: string
}

export interface ChatResponse {
  conversationId: string
  content?: string
  delta?: string
  done?: boolean
  usage?: TokenUsage
  error?: string
  model?: string
  provider?: string
}

export interface TokenUsage {
  promptTokens: number
  completionTokens: number
  totalTokens: number
}
