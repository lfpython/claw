import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { cn } from '../../lib/utils'
import {
  LayoutDashboard, MessageSquare, Radio, Zap, Clock, Settings, ChevronLeft, ChevronRight
} from 'lucide-react'
import { useGatewayStore } from '../../stores/gateway'
import { useState } from 'react'

const nav = [
  { to: '/', label: '仪表盘', icon: LayoutDashboard },
  { to: '/chat', label: '聊天', icon: MessageSquare },
  { to: '/channels', label: '渠道', icon: Radio },
  { to: '/skills', label: '技能', icon: Zap },
  { to: '/cron', label: '定时任务', icon: Clock },
  { to: '/settings', label: '设置', icon: Settings },
]

export function Sidebar() {
  const { status } = useGatewayStore()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={cn('flex flex-col h-full bg-black/20 border-r border-white/5 transition-all duration-200', collapsed ? 'w-14' : 'w-52')}>
      {/* Logo */}
      <div className="flex items-center gap-2 px-3 py-4 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">C</span>
        </div>
        {!collapsed && <span className="font-semibold text-white text-sm">ClawWin</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-0.5">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm transition-colors',
              isActive
                ? 'bg-blue-600/20 text-blue-400'
                : 'text-white/50 hover:bg-white/5 hover:text-white'
            )}
          >
            <Icon size={16} className="shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Gateway status */}
      {!collapsed && (
        <div className="px-3 py-3 border-t border-white/5">
          <div className="flex items-center gap-2">
            <div className={cn('w-1.5 h-1.5 rounded-full', status === 'running' ? 'bg-green-500' : status === 'starting' ? 'bg-yellow-500 animate-pulse' : 'bg-white/20')} />
            <span className="text-xs text-white/40">
              {status === 'running' ? 'Gateway 运行中' : status === 'starting' ? '启动中...' : 'Gateway 未运行'}
            </span>
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-8 border-t border-white/5 text-white/30 hover:text-white/60 transition-colors"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </div>
  )
}
