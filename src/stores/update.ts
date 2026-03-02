import { create } from 'zustand'

type UpdateEvent = 'checking' | 'available' | 'not-available' | 'progress' | 'downloaded' | 'error'

interface UpdateState {
  event?: UpdateEvent
  version?: string
  percent?: number
  message?: string
  setStatus: (status: { event: UpdateEvent; version?: string; percent?: number; message?: string }) => void
}

export const useUpdateStore = create<UpdateState>((set) => ({
  setStatus: (status) => set(status),
}))
