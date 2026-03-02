import React, { useEffect } from 'react'
import { useSkillsStore } from '../../stores/skills'
import { Card, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { RefreshCw, Zap } from 'lucide-react'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'

export default function SkillsPage() {
  const { skills, loading, refresh } = useSkillsStore()

  useEffect(() => { refresh() }, [])

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-white">技能管理</h1>
        <Button size="sm" variant="outline" onClick={refresh} disabled={loading}>
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> 刷新
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><LoadingSpinner /></div>
      ) : skills.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-white/40">
            <Zap size={32} className="mb-3 opacity-50" />
            <p className="text-sm">暂无已安装的技能</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {skills.map((sk: any) => (
            <Card key={sk.name}>
              <CardContent className="p-4">
                <div className="font-medium text-sm text-white">{sk.name}</div>
                <div className="text-xs text-white/40 mt-0.5">{sk.description ?? '无描述'}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
