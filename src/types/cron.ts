export type CronStatus = 'active' | 'paused' | 'error' | 'running'

export interface CronJob {
  id: string
  name: string
  description?: string
  expression: string  // Cron expression
  skillId?: string
  prompt?: string
  enabled: boolean
  status: CronStatus
  lastRunAt?: number
  lastRunResult?: 'success' | 'failed'
  nextRunAt?: number
  runCount: number
  errorMessage?: string
  createdAt: number
  updatedAt: number
  timezone?: string
}

export interface CronRunLog {
  id: string
  jobId: string
  startedAt: number
  finishedAt?: number
  success: boolean
  output?: string
  error?: string
  duration?: number
}

export const CRON_PRESETS = [
  { label: '每分钟', value: '* * * * *' },
  { label: '每5分钟', value: '*/5 * * * *' },
  { label: '每15分钟', value: '*/15 * * * *' },
  { label: '每30分钟', value: '*/30 * * * *' },
  { label: '每小时', value: '0 * * * *' },
  { label: '每天早上9点', value: '0 9 * * *' },
  { label: '每天中午12点', value: '0 12 * * *' },
  { label: '每天晚上6点', value: '0 18 * * *' },
  { label: '每周一早上9点', value: '0 9 * * 1' },
  { label: '每月1号', value: '0 9 1 * *' },
] as const
