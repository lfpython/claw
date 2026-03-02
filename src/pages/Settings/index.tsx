import React, { useEffect, useState } from 'react'
import { useSettingsStore } from '../../stores/settings'
import { useProvidersStore } from '../../stores/providers'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Separator } from '../../components/ui/separator'
import { PROVIDERS } from '../../lib/providers'
import { toast } from 'sonner'
import { ExternalLink, Eye, EyeOff } from 'lucide-react'

export default function SettingsPage() {
  const settings = useSettingsStore()
  const { checkApiKeys, hasApiKey } = useProvidersStore()
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({})
  const [showKey, setShowKey] = useState<Record<string, boolean>>({})

  useEffect(() => { checkApiKeys() }, [])

  const handleSaveApiKey = async (providerId: string) => {
    const key = apiKeys[providerId]?.trim()
    if (!key) return
    try {
      await window.clawwin.secure.setApiKey(providerId, key)
      toast.success('API Key 已保存')
      await checkApiKeys()
    } catch (e) {
      toast.error('保存失败: ' + String(e))
    }
  }

  const handleSaveSettings = async () => {
    await settings.save()
    toast.success('设置已保存')
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <h1 className="text-lg font-semibold text-white mb-6">设置</h1>

      {/* General */}
      <Card className="mb-4">
        <CardHeader><CardTitle className="text-base">通用</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>语言</Label>
            <div className="flex gap-2">
              {(['zh', 'en'] as const).map(lang => (
                <Button
                  key={lang}
                  size="sm"
                  variant={settings.language === lang ? 'default' : 'outline'}
                  onClick={() => settings.setLanguage(lang)}
                >
                  {lang === 'zh' ? '中文' : 'English'}
                </Button>
              ))}
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Label>主题</Label>
            <div className="flex gap-2">
              {(['dark', 'light', 'system'] as const).map(t => (
                <Button
                  key={t}
                  size="sm"
                  variant={settings.theme === t ? 'default' : 'outline'}
                  onClick={() => { settings.setTheme(t); window.clawwin?.theme.set(t) }}
                >
                  {t === 'dark' ? '深色' : t === 'light' ? '浅色' : '跟随系统'}
                </Button>
              ))}
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Gateway 端口</Label>
              <p className="text-xs text-white/40 mt-0.5">默认 18789</p>
            </div>
            <Input
              type="number"
              className="w-24 text-right"
              value={settings.gatewayPort}
              onChange={e => settings.setGatewayPort(Number(e.target.value))}
            />
          </div>
          <div className="flex justify-end">
            <Button size="sm" onClick={handleSaveSettings}>保存设置</Button>
          </div>
        </CardContent>
      </Card>

      {/* API Keys */}
      <Card>
        <CardHeader><CardTitle className="text-base">AI 提供商 API Key</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {PROVIDERS.filter(p => !p.isLocal).map(p => (
            <div key={p.id}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Label>{p.name}</Label>
                  {hasApiKey[p.id] && <span className="text-xs text-green-400">✓ 已配置</span>}
                  {p.requiresProxy && <span className="text-xs text-yellow-400">需代理</span>}
                </div>
                <button
                  className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                  onClick={() => window.clawwin.app.openExternal(p.apiKeyUrl)}
                >
                  <ExternalLink size={11} /> 获取
                </button>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showKey[p.id] ? 'text' : 'password'}
                    placeholder={hasApiKey[p.id] ? '已保存（输入新值可覆盖）' : '输入 API Key'}
                    value={apiKeys[p.id] ?? ''}
                    onChange={e => setApiKeys(prev => ({ ...prev, [p.id]: e.target.value }))}
                  />
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                    onClick={() => setShowKey(prev => ({ ...prev, [p.id]: !prev[p.id] }))}
                  >
                    {showKey[p.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <Button size="sm" onClick={() => handleSaveApiKey(p.id)} disabled={!apiKeys[p.id]?.trim()}>
                  保存
                </Button>
              </div>
              <Separator className="mt-4" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
