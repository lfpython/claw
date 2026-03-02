import React, { useEffect, useState } from 'react'
import { Minus, Square, X, Maximize2 } from 'lucide-react'
import { cn } from '../../lib/utils'

export function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false)

  useEffect(() => {
    window.clawwin?.window.isMaximized().then(setIsMaximized)
    const unsub = window.clawwin?.window.onMaximizeChange(setIsMaximized)
    return unsub
  }, [])

  return (
    <div className="flex items-center h-9 bg-black/30 border-b border-white/5 select-none" style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}>
      <div className="flex-1 px-4">
        <span className="text-xs text-white/40">ClawWin</span>
      </div>
      {/* Window controls */}
      <div className="flex" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <button
          onClick={() => window.clawwin?.window.minimize()}
          className="w-11 h-9 flex items-center justify-center text-white/40 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Minus size={12} />
        </button>
        <button
          onClick={() => window.clawwin?.window.maximize()}
          className="w-11 h-9 flex items-center justify-center text-white/40 hover:bg-white/10 hover:text-white transition-colors"
        >
          {isMaximized ? <Square size={11} /> : <Maximize2 size={11} />}
        </button>
        <button
          onClick={() => window.clawwin?.window.close()}
          className="w-11 h-9 flex items-center justify-center text-white/40 hover:bg-red-600 hover:text-white transition-colors"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  )
}
