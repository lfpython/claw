import React, { useState, useRef, useEffect } from 'react'
import { useChatStore } from '../../stores/chat'
import { Textarea } from '../../components/ui/textarea'
import { Button } from '../../components/ui/button'
import { Send, Trash2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '../../lib/utils'

export default function ChatPage() {
  const { messages, isLoading, addMessage, clearMessages, setLoading } = useChatStore()
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const unsub = window.clawwin?.gateway.onMessage((msg: any) => {
      if (msg?.content) {
        addMessage({ role: 'assistant', content: String(msg.content) })
        setLoading(false)
      }
    })
    return unsub
  }, [])

  const send = async () => {
    if (!input.trim() || isLoading) return
    const text = input.trim()
    setInput('')
    addMessage({ role: 'user', content: text })
    setLoading(true)
    try {
      await window.clawwin.gateway.send({ type: 'chat', content: text })
    } catch {
      addMessage({ role: 'system', content: '发送失败，请检查 Gateway 是否运行' })
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <span className="text-sm font-medium text-white">聊天</span>
        <Button size="icon" variant="ghost" onClick={clearMessages} title="清空">
          <Trash2 size={14} />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-white/30">
            <p className="text-sm">发送消息开始对话</p>
          </div>
        )}
        {messages.map(msg => (
          <div key={msg.id} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div className={cn(
              'max-w-[80%] rounded-xl px-4 py-2.5 text-sm',
              msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/90',
              msg.role === 'system' ? 'bg-red-600/20 text-red-300 text-xs' : ''
            )}>
              {msg.role === 'user' ? (
                <p className="whitespace-pre-wrap">{msg.content}</p>
              ) : (
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/10 rounded-xl px-4 py-2.5">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/5">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息... (Enter 发送，Shift+Enter 换行)"
            className="min-h-[44px] max-h-[200px] resize-none flex-1"
            rows={1}
          />
          <Button size="icon" onClick={send} disabled={!input.trim() || isLoading}>
            <Send size={15} />
          </Button>
        </div>
      </div>
    </div>
  )
}
