import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import { useSettingsStore } from './stores/settings'
import SetupPage from './pages/Setup/index'
import DashboardPage from './pages/Dashboard/index'
import ChatPage from './pages/Chat/index'
import ChannelsPage from './pages/Channels/index'
import SkillsPage from './pages/Skills/index'
import CronPage from './pages/Cron/index'
import SettingsPage from './pages/Settings/index'

export default function App() {
  const { setupCompleted, load } = useSettingsStore()
  const [loading, setLoading] = React.useState(true)

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0f0f0f]">
        <div className="w-6 h-6 border-2 border-white/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!setupCompleted) {
    return (
      <div className="h-screen bg-[#0f0f0f]">
        <SetupPage />
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/channels" element={<ChannelsPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/cron" element={<CronPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/setup" element={<SetupPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  )
}
