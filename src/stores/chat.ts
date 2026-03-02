import { create } from 'zustand'

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  streaming?: boolean
}

interface ChatState {
  messages: Message[]
  isLoading: boolean
  sessionKey: string
  addMessage: (msg: Omit<Message, 'id' | 'timestamp'>) => string
  updateMessage: (id: string, update: Partial<Message>) => void
  clearMessages: () => void
  setLoading: (v: boolean) => void
  setSession: (key: string) => void
}

let idCounter = 0
const genId = () => `msg-${Date.now()}-${++idCounter}`

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  sessionKey: 'agent:main:main',

  addMessage: (msg) => {
    const id = genId()
    set(state => ({
      messages: [...state.messages, { ...msg, id, timestamp: Date.now() }]
    }))
    return id
  },

  updateMessage: (id, update) => {
    set(state => ({
      messages: state.messages.map(m => m.id === id ? { ...m, ...update } : m)
    }))
  },

  clearMessages: () => set({ messages: [] }),
  setLoading: (v) => set({ isLoading: v }),
  setSession: (key) => set({ sessionKey: key }),
}))
