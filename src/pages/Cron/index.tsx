import React, { useEffect } from 'react'
import { useCronStore } from '../../stores/cron'
import { Card, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { RefreshCw, Clock } from 'lucide-react'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'

export default function CronPage() {
  const { jobs, loading, refresh } = useCronStore()

  useEffect(() => { refresh() }, [])

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-white">定时任务</h1>
        <Button size="sm" variant="outline" onClick={refresh} disabled={loading}>
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> 刷新
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><LoadingSpinner /></div>
      ) : jobs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-white/40">
            <Clock size={32} className="mb-3 opacity-50" />
            <p className="text-sm">暂无定时任务</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {jobs.map((job: any) => (
            <Card key={job.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm text-white">{job.name ?? job.id}</div>
                    <div className="text-xs text-white/40 mt-0.5">{job.schedule}</div>
                  </div>
                  <div className={`px-2 py-0.5 rounded text-xs ${job.enabled ? 'bg-green-600/20 text-green-400' : 'bg-white/10 text-white/40'}`}>
                    {job.enabled ? '启用' : '禁用'}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
