import React, { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { StatusBadge } from '../../components/common/StatusBadge'
import { useGatewayStore } from '../../stores/gateway'
import { formatDuration } from '../../lib/utils'
import { Play, Square, RotateCcw, MessageSquare, Radio, Zap, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function DashboardPage() {
  const { status, port, pid, connectedAt, start, stop, restart } = useGatewayStore()
  const navigate = useNavigate()
  const uptime = connectedAt ? formatDuration(Date.now() - connectedAt) : '-'

  useEffect(() => {
    const unsub = window.clawwin?.gateway.onStatus((s) => {
      useGatewayStore.getState().setStatus({ status: s.status, port: s.port, pid: s.pid, error: s.error, connectedAt: s.connectedAt })
    })
    window.clawwin?.gateway.getStatus().then((s) => {
      useGatewayStore.getState().setStatus({ status: s.status, port: s.port, pid: s.pid, connectedAt: s.connectedAt })
    })
    return unsub
  }, [])

  const quickActions = [
    { label: '聊天', icon: MessageSquare, to: '/chat' },
    { label: '渠道', icon: Radio, to: '/channels' },
    { label: '技能', icon: Zap, to: '/skills' },
    { label: '定时任务', icon: Clock, to: '/cron' },
  ]

  return (
    <div className="h-full overflow-y-auto p-6">
      <h1 className="text-lg font-semibold text-white mb-6">仪表盘</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        {/* Gateway status */}
        <Card className="col-span-full lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Gateway 状态</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <StatusBadge status={status === 'running' ? 'running' : status === 'starting' ? 'starting' : status === 'error' ? 'error' : 'stopped'} />
              <div className="flex gap-2">
                {status === 'stopped' || status === 'error' ? (
                  <Button size="sm" onClick={start}><Play size={13} /> 启动</Button>
                ) : (
                  <>
                    <Button size="sm" variant="outline" onClick={restart}><RotateCcw size={13} /> 重启</Button>
                    <Button size="sm" variant="destructive" onClick={stop}><Square size={13} /> 停止</Button>
                  </>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-white/40 mb-0.5">端口</div>
                <div className="text-white font-mono">{port}</div>
              </div>
              <div>
                <div className="text-white/40 mb-0.5">进程 PID</div>
                <div className="text-white font-mono">{pid ?? '-'}</div>
              </div>
              <div>
                <div className="text-white/40 mb-0.5">运行时长</div>
                <div className="text-white">{status === 'running' ? uptime : '-'}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick links */}
        <Card>
          <CardHeader><CardTitle className="text-base">快捷操作</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map(({ label, icon: Icon, to }) => (
                <button
                  key={to}
                  onClick={() => navigate(to)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <Icon size={18} className="text-blue-400" />
                  <span className="text-xs text-white/70">{label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
