// Gateway protocol type definitions

export type MessageType =
  | 'ping'
  | 'pong'
  | 'auth'
  | 'auth_response'
  | 'chat'
  | 'chat_response'
  | 'chat_stream'
  | 'chat_stream_end'
  | 'channel_list'
  | 'channel_action'
  | 'skill_list'
  | 'skill_run'
  | 'skill_result'
  | 'cron_list'
  | 'cron_add'
  | 'cron_remove'
  | 'status'
  | 'error'
  | 'event'

export interface GatewayMessage {
  type: MessageType
  id?: string
  timestamp?: number
  payload?: unknown
}

export interface AuthMessage extends GatewayMessage {
  type: 'auth'
  payload: {
    token?: string
    clientId: string
    clientName: string
    version: string
  }
}

export interface AuthResponseMessage extends GatewayMessage {
  type: 'auth_response'
  payload: {
    success: boolean
    sessionId?: string
    error?: string
    gatewayVersion?: string
    features?: string[]
  }
}

export interface ChatMessage extends GatewayMessage {
  type: 'chat'
  payload: {
    conversationId: string
    message: string
    provider?: string
    model?: string
    temperature?: number
    maxTokens?: number
    stream?: boolean
    systemPrompt?: string
  }
}

export interface ChatResponseMessage extends GatewayMessage {
  type: 'chat_response' | 'chat_stream' | 'chat_stream_end'
  payload: {
    conversationId: string
    content?: string
    delta?: string
    done?: boolean
    usage?: {
      promptTokens: number
      completionTokens: number
      totalTokens: number
    }
    error?: string
    model?: string
    provider?: string
  }
}

export interface ChannelListMessage extends GatewayMessage {
  type: 'channel_list'
  payload: {
    channels: ChannelInfo[]
  }
}

export interface ChannelInfo {
  id: string
  name: string
  type: string
  enabled: boolean
  status: 'connected' | 'disconnected' | 'error'
  config?: Record<string, unknown>
}

export interface SkillListMessage extends GatewayMessage {
  type: 'skill_list'
  payload: {
    skills: SkillInfo[]
  }
}

export interface SkillInfo {
  id: string
  name: string
  description: string
  version: string
  enabled: boolean
  author?: string
  config?: Record<string, unknown>
}

export interface StatusMessage extends GatewayMessage {
  type: 'status'
  payload: {
    gatewayVersion: string
    uptime: number
    connectedClients: number
    activeChannels: number
    activeSkills: number
    messageCount: number
    providers: Record<string, boolean>
  }
}

export interface ErrorMessage extends GatewayMessage {
  type: 'error'
  payload: {
    code: string
    message: string
    requestId?: string
  }
}

export interface EventMessage extends GatewayMessage {
  type: 'event'
  payload: {
    name: string
    source: string
    data: unknown
  }
}
