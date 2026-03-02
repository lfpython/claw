export type SkillStatus = 'enabled' | 'disabled' | 'error' | 'updating'

export interface Skill {
  id: string
  name: string
  description: string
  version: string
  author?: string
  homepage?: string
  enabled: boolean
  status: SkillStatus
  config?: Record<string, unknown>
  permissions?: string[]
  tags?: string[]
  installedAt?: number
  updatedAt?: number
  errorMessage?: string
}

export interface SkillRunInput {
  skillId: string
  input: string
  config?: Record<string, unknown>
}

export interface SkillRunResult {
  success: boolean
  output?: string
  error?: string
  duration?: number
  metadata?: Record<string, unknown>
}

export interface SkillMarketItem {
  id: string
  name: string
  description: string
  version: string
  author: string
  downloads: number
  rating: number
  tags: string[]
  isInstalled: boolean
  thumbnailUrl?: string
}
