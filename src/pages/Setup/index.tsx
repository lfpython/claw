import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent } from '../../components/ui/card'
import { getDomesticProviders, PROVIDERS } from '../../lib/providers'
import { useSettingsStore } from '../../stores/settings'
import { useProvidersStore } from '../../stores/providers'
import { toast } from 'sonner'
import { CheckCircle2, ExternalLink, ChevronRight, Globe } from 'lucide-react'
import { cn } from '../../lib/utils'

type Step = 'welcome' | 'provider' | 'apikey' | 'done'

export default function SetupPage() {
  const navigate = useNavigate()
  const { setSetupCompleted, save } = useSettingsStore()
  const { setDefault } = useProvidersStore()

  const [step, setStep] = useState<Step>('welcome')
  const [selectedProviderId, setSelectedProviderId] = useState('zhipu')
  const [apiKey, setApiKey] = useState('')
  const [saving, setSaving] = useState(false)

  const selectedProvider = PROVIDERS.find(p => p.id === selectedProviderId)!
  const domestic = getDomesticProviders()

  const handleFinish = async () => {
    setSaving(true)
    try {
      if (apiKey && !selectedProvider.isLocal) {
        await window.clawwin.secure.setApiKey(selectedProviderId, apiKey)
      }
      setDefault(selectedProviderId, selectedProvider.models[0].id)
      setSetupCompleted(true)
      await save()
      setStep('done')
    } catch (e) {
      toast.error('保存失败: ' + String(e))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#0f0f0f] p-8">
      {step === 'welcome' && (
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl font-bold text-white">C</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">欢迎使用 ClawWin</h1>
          <p className="text-white/50 mb-8">基于 OpenClaw 的 Windows AI 桌面助手，让我们完成初始设置</p>
          <Button className="w-full" onClick={() => setStep('provider')}>
            开始配置 <ChevronRight size={16} />
          </Button>
        </div>
      )}

      {step === 'provider' && (
        <div className="w-full max-w-lg">
          <h2 className="text-xl font-semibold text-white mb-1">选择 AI 提供商</h2>
          <p className="text-white/40 text-sm mb-6">国内模型无需代理，直接使用</p>
          <div className="grid grid-cols-2 gap-2 mb-6">
            {domestic.map(p => (
              <Card
                key={p.id}
                className={cn('cursor-pointer transition-all', selectedProviderId === p.id ? 'border-blue-500 bg-blue-600/10' : 'hover:border-white/20')}
                onClick={() => setSelectedProviderId(p.id)}
              >
                <CardContent className="p-3">
                  <div className="font-medium text-sm text-white">{p.name}</div>
                  <div className="text-xs text-white/40 mt-0.5">{p.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep('welcome')}>上一步</Button>
            <Button className="flex-1" onClick={() => setStep('apikey')}>下一步 <ChevronRight size={16} /></Button>
          </div>
        </div>
      )}

      {step === 'apikey' && (
        <div className="w-full max-w-md">
          <h2 className="text-xl font-semibold text-white mb-1">输入 API Key</h2>
          <p className="text-white/40 text-sm mb-6">已选择：{selectedProvider.name}</p>
          <div className="space-y-4 mb-6">
            <div>
              <Label>API Key</Label>
              <Input
                className="mt-1.5"
                type="password"
                placeholder={selectedProvider.isLocal ? '本地模型无需 API Key' : '请输入您的 API Key'}
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                disabled={selectedProvider.isLocal}
              />
            </div>
            {!selectedProvider.isLocal && (
              <button
                className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300"
                onClick={() => window.clawwin.app.openExternal(selectedProvider.apiKeyUrl)}
              >
                <ExternalLink size={12} />
                去 {selectedProvider.name} 获取 API Key
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep('provider')}>上一步</Button>
            <Button className="flex-1" onClick={handleFinish} disabled={saving}>
              {saving ? '保存中...' : '完成设置'}
            </Button>
          </div>
        </div>
      )}

      {step === 'done' && (
        <div className="text-center max-w-md">
          <CheckCircle2 size={56} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">设置完成！</h2>
          <p className="text-white/50 mb-8">ClawWin 已准备好，开始使用吧</p>
          <Button className="w-full" onClick={() => navigate('/')}>进入主界面</Button>
        </div>
      )}
    </div>
  )
}
