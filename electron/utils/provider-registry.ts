// AI Provider Registry - China-first ordering

export interface ProviderInfo {
  id: string
  name: string
  nameEn: string
  baseUrl: string
  apiKeyUrl: string
  models: ModelInfo[]
  requiresProxy: boolean
  isLocal: boolean
  logo?: string
  description: string
  descriptionEn: string
}

export interface ModelInfo {
  id: string
  name: string
  contextLength: number
  pricing?: {
    input: number  // per 1K tokens in CNY or USD
    output: number
  }
  capabilities: string[]
}

const providers: ProviderInfo[] = [
  {
    id: 'zhipu',
    name: '智谱 Z.AI',
    nameEn: 'Zhipu Z.AI',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    apiKeyUrl: 'https://open.bigmodel.cn/usercenter/apikeys',
    requiresProxy: false,
    isLocal: false,
    description: '智谱 AI 的 GLM 系列模型，支持长上下文，对中文理解优秀',
    descriptionEn: 'Zhipu AI GLM series, excellent Chinese understanding',
    models: [
      {
        id: 'glm-4',
        name: 'GLM-4',
        contextLength: 128000,
        capabilities: ['chat', 'reasoning', 'code'],
      },
      {
        id: 'glm-4-flash',
        name: 'GLM-4-Flash',
        contextLength: 128000,
        capabilities: ['chat', 'fast'],
      },
      {
        id: 'glm-4-air',
        name: 'GLM-4-Air',
        contextLength: 128000,
        capabilities: ['chat', 'balanced'],
      },
      {
        id: 'glm-4-long',
        name: 'GLM-4-Long',
        contextLength: 1000000,
        capabilities: ['chat', 'long-context'],
      },
    ],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    nameEn: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    apiKeyUrl: 'https://platform.deepseek.com/api_keys',
    requiresProxy: false,
    isLocal: false,
    description: 'DeepSeek 高性能推理模型，代码能力强，性价比极高',
    descriptionEn: 'High-performance reasoning model, excellent at coding',
    models: [
      {
        id: 'deepseek-chat',
        name: 'DeepSeek Chat',
        contextLength: 64000,
        capabilities: ['chat', 'reasoning'],
      },
      {
        id: 'deepseek-coder',
        name: 'DeepSeek Coder',
        contextLength: 64000,
        capabilities: ['chat', 'code'],
      },
      {
        id: 'deepseek-reasoner',
        name: 'DeepSeek R1',
        contextLength: 64000,
        capabilities: ['chat', 'reasoning', 'thinking'],
      },
    ],
  },
  {
    id: 'qwen',
    name: '通义千问',
    nameEn: 'Qwen (Alibaba)',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    apiKeyUrl: 'https://bailian.console.aliyun.com/',
    requiresProxy: false,
    isLocal: false,
    description: '阿里云通义千问系列，支持多模态，生态丰富',
    descriptionEn: 'Alibaba Cloud Qwen series, multimodal support',
    models: [
      {
        id: 'qwen-max',
        name: 'Qwen Max',
        contextLength: 32000,
        capabilities: ['chat', 'reasoning', 'code'],
      },
      {
        id: 'qwen-plus',
        name: 'Qwen Plus',
        contextLength: 131072,
        capabilities: ['chat', 'balanced'],
      },
      {
        id: 'qwen-turbo',
        name: 'Qwen Turbo',
        contextLength: 131072,
        capabilities: ['chat', 'fast'],
      },
      {
        id: 'qwen-long',
        name: 'Qwen Long',
        contextLength: 10000000,
        capabilities: ['chat', 'long-context'],
      },
    ],
  },
  {
    id: 'minimax',
    name: 'MiniMax',
    nameEn: 'MiniMax',
    baseUrl: 'https://api.minimax.chat/v1',
    apiKeyUrl: 'https://platform.minimaxi.com/user-center/basic-information/interface-key',
    requiresProxy: false,
    isLocal: false,
    description: 'MiniMax 自研大模型，擅长创意写作和角色扮演',
    descriptionEn: 'MiniMax proprietary model, excellent at creative writing',
    models: [
      {
        id: 'abab6.5s-chat',
        name: 'ABAB 6.5s',
        contextLength: 245760,
        capabilities: ['chat', 'creative'],
      },
      {
        id: 'abab6.5g-chat',
        name: 'ABAB 6.5g',
        contextLength: 8192,
        capabilities: ['chat', 'fast'],
      },
    ],
  },
  {
    id: 'moonshot',
    name: 'Moonshot / Kimi',
    nameEn: 'Moonshot / Kimi',
    baseUrl: 'https://api.moonshot.cn/v1',
    apiKeyUrl: 'https://platform.moonshot.cn/console/api-keys',
    requiresProxy: false,
    isLocal: false,
    description: 'Moonshot Kimi，超长上下文，擅长文档分析',
    descriptionEn: 'Moonshot Kimi, ultra-long context, great for document analysis',
    models: [
      {
        id: 'moonshot-v1-8k',
        name: 'Moonshot v1 8K',
        contextLength: 8192,
        capabilities: ['chat'],
      },
      {
        id: 'moonshot-v1-32k',
        name: 'Moonshot v1 32K',
        contextLength: 32768,
        capabilities: ['chat', 'long-context'],
      },
      {
        id: 'moonshot-v1-128k',
        name: 'Moonshot v1 128K',
        contextLength: 131072,
        capabilities: ['chat', 'long-context'],
      },
    ],
  },
  {
    id: 'siliconflow',
    name: '硅基流动',
    nameEn: 'SiliconFlow',
    baseUrl: 'https://api.siliconflow.cn/v1',
    apiKeyUrl: 'https://cloud.siliconflow.cn/account/ak',
    requiresProxy: false,
    isLocal: false,
    description: '硅基流动平台，聚合多种开源大模型，价格实惠',
    descriptionEn: 'SiliconFlow platform, aggregates open-source models at great prices',
    models: [
      {
        id: 'Qwen/Qwen2.5-72B-Instruct',
        name: 'Qwen2.5 72B',
        contextLength: 32768,
        capabilities: ['chat', 'reasoning', 'code'],
      },
      {
        id: 'deepseek-ai/DeepSeek-V2.5',
        name: 'DeepSeek V2.5',
        contextLength: 8192,
        capabilities: ['chat', 'code'],
      },
      {
        id: 'meta-llama/Meta-Llama-3.1-70B-Instruct',
        name: 'Llama 3.1 70B',
        contextLength: 131072,
        capabilities: ['chat', 'reasoning'],
      },
    ],
  },
  {
    id: 'openai',
    name: 'OpenAI',
    nameEn: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    apiKeyUrl: 'https://platform.openai.com/api-keys',
    requiresProxy: true,
    isLocal: false,
    description: 'OpenAI GPT 系列（需要代理）',
    descriptionEn: 'OpenAI GPT series (requires proxy)',
    models: [
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        contextLength: 128000,
        capabilities: ['chat', 'vision', 'code', 'reasoning'],
      },
      {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        contextLength: 128000,
        capabilities: ['chat', 'vision', 'code'],
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        contextLength: 16385,
        capabilities: ['chat', 'fast'],
      },
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    nameEn: 'Anthropic',
    baseUrl: 'https://api.anthropic.com',
    apiKeyUrl: 'https://console.anthropic.com/settings/keys',
    requiresProxy: true,
    isLocal: false,
    description: 'Anthropic Claude 系列（需要代理）',
    descriptionEn: 'Anthropic Claude series (requires proxy)',
    models: [
      {
        id: 'claude-3-5-sonnet-20241022',
        name: 'Claude 3.5 Sonnet',
        contextLength: 200000,
        capabilities: ['chat', 'vision', 'code', 'reasoning'],
      },
      {
        id: 'claude-3-5-haiku-20241022',
        name: 'Claude 3.5 Haiku',
        contextLength: 200000,
        capabilities: ['chat', 'fast'],
      },
    ],
  },
  {
    id: 'google',
    name: 'Google',
    nameEn: 'Google',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    apiKeyUrl: 'https://aistudio.google.com/app/apikey',
    requiresProxy: true,
    isLocal: false,
    description: 'Google Gemini 系列（需要代理）',
    descriptionEn: 'Google Gemini series (requires proxy)',
    models: [
      {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        contextLength: 2097152,
        capabilities: ['chat', 'vision', 'code'],
      },
      {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        contextLength: 1048576,
        capabilities: ['chat', 'fast'],
      },
    ],
  },
  {
    id: 'ollama',
    name: 'Ollama (本地)',
    nameEn: 'Ollama (Local)',
    baseUrl: 'http://localhost:11434/api',
    apiKeyUrl: 'https://ollama.ai',
    requiresProxy: false,
    isLocal: true,
    description: 'Ollama 本地运行，无需 API Key，支持多种开源模型',
    descriptionEn: 'Run models locally with Ollama, no API key needed',
    models: [
      {
        id: 'llama3.2',
        name: 'Llama 3.2',
        contextLength: 128000,
        capabilities: ['chat'],
      },
      {
        id: 'qwen2.5',
        name: 'Qwen 2.5',
        contextLength: 32768,
        capabilities: ['chat', 'code'],
      },
      {
        id: 'deepseek-r1',
        name: 'DeepSeek R1',
        contextLength: 32768,
        capabilities: ['chat', 'reasoning'],
      },
    ],
  },
]

export function getProviders(): ProviderInfo[] {
  return providers
}

export function getProvider(id: string): ProviderInfo | undefined {
  return providers.find((p) => p.id === id)
}

export function getDomesticProviders(): ProviderInfo[] {
  return providers.filter((p) => !p.requiresProxy && !p.isLocal)
}

export function getLocalProviders(): ProviderInfo[] {
  return providers.filter((p) => p.isLocal)
}
