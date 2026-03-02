import React from 'react'
import { cn } from '../../lib/utils'

type Status = 'running' | 'stopped' | 'starting' | 'error' | 'connected' | 'disconnected'

const labels: Record<Status, string> = {
  running: '运行中', stopped: '已停止', starting: '启动中', error: '错误',
  connected: '已连接', disconnected: '未连接',
}

const colors: Record<Status, string> = {
  running: 'bg-green-500', stopped: 'bg-white/20', starting: 'bg-yellow-500 animate-pulse',
  error: 'bg-red-500', connected: 'bg-green-500', disconnected: 'bg-white/20',
}

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-white/60">
      <span className={cn('w-1.5 h-1.5 rounded-full', colors[status])} />
      {labels[status]}
    </span>
  )
}
