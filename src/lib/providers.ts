export interface Provider {
  id: string
  name: string
  nameEn: string
  baseUrl: string
  apiKeyUrl: string
  models: Model[]
  requiresProxy: boolean
  isLocal: boolean
  description: string
}

export interface Model {
  id: string
  name: string
  contextLength: number
  capabilities: string[]
}

export const PROVIDERS: Provider[] = [
  {
    id: 'zhipu',
    name: '智谱 Z.AI',
    nameEn: 'Zhipu Z.AI',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    apiKeyUrl: 'https://open.bigmodel.cn/usercenter/apikeys',
    requiresProxy: false,
    isLocal: false,
    description: '国内直连，GLM 系列模型',
    models: [
      { id: 'glm-4-plus', name: 'GLM-4 Plus', contextLength: 128000, capabilities: ['chat', 'vision'] },
      { id: 'glm-4-flash', name: 'GLM-4 Flash（免费）', contextLength: 128000, capabilities: ['chat'] },
      { id: 'glm-z1-flash', name: 'GLM-Z1 Flash（推理·免费）', contextLength: 32000, capabilities: ['chat', 'reasoning'] },
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
    description: '国内直连，性价比极高',
    models: [
      { id: 'deepseek-chat', name: 'DeepSeek V3', contextLength: 64000, capabilities: ['chat'] },
      { id: 'deepseek-reasoner', name: 'DeepSeek R1（推理）', contextLength: 64000, capabilities: ['chat', 'reasoning'] },
    ],
  },
  {
    id: 'qwen',
    name: '通义千问',
    nameEn: 'Qwen (Alibaba)',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    apiKeyUrl: 'https://dashscope.console.aliyun.com/apiKey',
    requiresProxy: false,
    isLocal: false,
    description: '国内直连，阿里云',
    models: [
      { id: 'qwen-max', name: 'Qwen Max', contextLength: 32000, capabilities: ['chat', 'vision'] },
      { id: 'qwen-plus', name: 'Qwen Plus', contextLength: 131072, capabilities: ['chat'] },
      { id: 'qwen-turbo', name: 'Qwen Turbo（快速）', contextLength: 131072, capabilities: ['chat'] },
      { id: 'qwq-32b', name: 'QwQ-32B（推理）', contextLength: 32000, capabilities: ['chat', 'reasoning'] },
    ],
  },
  {
    id: 'minimax',
    name: 'MiniMax',
    nameEn: 'MiniMax',
    baseUrl: 'https://api.minimax.chat/v1',
    apiKeyUrl: 'https://platform.minimax.chat/user-center/basic-information/interface-key',
    requiresProxy: false,
    isLocal: false,
    description: '国内直连',
    models: [
      { id: 'MiniMax-Text-01', name: 'MiniMax Text-01', contextLength: 1000000, capabilities: ['chat'] },
      { id: 'abab6.5s-chat', name: 'ABAB 6.5S', contextLength: 245760, capabilities: ['chat'] },
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
    description: '国内直连，长上下文',
    models: [
      { id: 'moonshot-v1-128k', name: 'Kimi 128K', contextLength: 128000, capabilities: ['chat', 'vision'] },
      { id: 'moonshot-v1-32k', name: 'Kimi 32K', contextLength: 32000, capabilities: ['chat'] },
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
    description: '国内直连，多模型聚合',
    models: [
      { id: 'deepseek-ai/DeepSeek-V3', name: 'DeepSeek V3', contextLength: 64000, capabilities: ['chat'] },
      { id: 'deepseek-ai/DeepSeek-R1', name: 'DeepSeek R1（推理）', contextLength: 64000, capabilities: ['chat', 'reasoning'] },
      { id: 'Qwen/Qwen2.5-72B-Instruct', name: 'Qwen2.5-72B', contextLength: 32000, capabilities: ['chat'] },
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
    description: '需要科学上网',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o', contextLength: 128000, capabilities: ['chat', 'vision'] },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', contextLength: 128000, capabilities: ['chat'] },
      { id: 'o1-mini', name: 'o1 Mini（推理）', contextLength: 65536, capabilities: ['chat', 'reasoning'] },
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    nameEn: 'Anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    apiKeyUrl: 'https://console.anthropic.com/settings/keys',
    requiresProxy: true,
    isLocal: false,
    description: '需要科学上网，Claude 系列',
    models: [
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', contextLength: 200000, capabilities: ['chat', 'vision'] },
      { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', contextLength: 200000, capabilities: ['chat'] },
    ],
  },
  {
    id: 'ollama',
    name: 'Ollama（本地）',
    nameEn: 'Ollama (Local)',
    baseUrl: 'http://localhost:11434/v1',
    apiKeyUrl: 'https://ollama.com',
    requiresProxy: false,
    isLocal: true,
    description: '本地运行，无需联网，无需 API Key',
    models: [
      { id: 'llama3.2', name: 'Llama 3.2', contextLength: 128000, capabilities: ['chat'] },
      { id: 'qwen2.5', name: 'Qwen 2.5', contextLength: 32000, capabilities: ['chat'] },
      { id: 'deepseek-r1', name: 'DeepSeek R1（推理）', contextLength: 32000, capabilities: ['chat', 'reasoning'] },
    ],
  },
]

export function getProvider(id: string): Provider | undefined {
  return PROVIDERS.find(p => p.id === id)
}

export function getDomesticProviders(): Provider[] {
  return PROVIDERS.filter(p => !p.requiresProxy && !p.isLocal)
}

export function getDefaultProvider(): Provider {
  return PROVIDERS[0]
}
