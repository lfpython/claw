import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TitleBar } from './TitleBar'
import { Toaster } from '../ui/toast'

export function MainLayout() {
  return (
    <div className="flex flex-col h-screen bg-[#0f0f0f] text-white overflow-hidden">
      <TitleBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
      <Toaster position="bottom-right" theme="dark" />
    </div>
  )
}
