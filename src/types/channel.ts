export type ChannelType =
  | 'feishu'
  | 'telegram'
  | 'discord'
  | 'wechat'
  | 'dingtalk'
  | 'slack'
  | 'webhook'

export type ChannelStatus = 'connected' | 'disconnected' | 'error' | 'disabled'

export interface Channel {
  id: string
  name: string
  type: ChannelType
  enabled: boolean
  status: ChannelStatus
  config: Record<string, string>
  createdAt: number
  updatedAt: number
  errorMessage?: string
}

export interface ChannelConfig {
  feishu: {
    appId: string
    appSecret: string
    verificationToken?: string
    encryptKey?: string
  }
  telegram: {
    botToken: string
    chatId?: string
    webhookUrl?: string
  }
  discord: {
    token: string
    channelId?: string
    guildId?: string
  }
  wechat: {
    appId: string
    appSecret: string
    token: string
    aesKey?: string
  }
  dingtalk: {
    appKey: string
    appSecret: string
    agentId?: string
  }
  slack: {
    botToken: string
    signingSecret: string
    channelId?: string
  }
  webhook: {
    url: string
    secret?: string
    headers?: Record<string, string>
  }
}

export const CHANNEL_TYPE_NAMES: Record<ChannelType, string> = {
  feishu: '飞书',
  telegram: 'Telegram',
  discord: 'Discord',
  wechat: '微信',
  dingtalk: '钉钉',
  slack: 'Slack',
  webhook: 'Webhook',
}
