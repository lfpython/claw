import React, { useEffect } from 'react'
import { useChannelsStore } from '../../stores/channels'
import { Card, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { RefreshCw, Radio } from 'lucide-react'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'

const CHANNEL_NAMES: Record<string, string> = {
  feishu: '飞书', telegram: 'Telegram', discord: 'Discord',
  dingtalk: '钉钉', wecom: '企业微信', slack: 'Slack',
  whatsapp: 'WhatsApp', signal: 'Signal',
}

export default function ChannelsPage() {
  const { channels, loading, refresh } = useChannelsStore()

  useEffect(() => { refresh() }, [])

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-white">渠道管理</h1>
        <Button size="sm" variant="outline" onClick={refresh} disabled={loading}>
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> 刷新
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><LoadingSpinner /></div>
      ) : channels.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-white/40">
            <Radio size={32} className="mb-3 opacity-50" />
            <p className="text-sm">暂无已配置的渠道</p>
            <p className="text-xs mt-1">在设置中配置飞书、Telegram 等渠道</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {channels.map((ch: any) => (
            <Card key={ch.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <div className="font-medium text-sm text-white">{CHANNEL_NAMES[ch.id] ?? ch.id}</div>
                  <div className="text-xs text-white/40 mt-0.5">{ch.status ?? '未知状态'}</div>
                </div>
                <div className={`w-2 h-2 rounded-full ${ch.connected ? 'bg-green-500' : 'bg-white/20'}`} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
