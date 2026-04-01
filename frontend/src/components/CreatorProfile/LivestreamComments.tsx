'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, Smile, MessageSquare } from 'lucide-react'
import type { ChatMessage } from '@/src/hooks/useLiveChat'

interface LivestreamCommentsProps {
  messages: ChatMessage[]
  onSendMessage: (text: string) => void
  streamEnded?: boolean
}

export default function LivestreamComments({
  messages,
  onSendMessage,
  streamEnded = false,
}: LivestreamCommentsProps) {
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (!input.trim() || streamEnded) return
    onSendMessage(input.trim())
    setInput('')
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black text-[#1c1917] flex items-center gap-3 tracking-tight">
        <MessageSquare className="w-6 h-6" /> Live Chat
        <span className="text-sm font-bold text-slate-400">({messages.length})</span>
      </h3>

      {/* Chat messages */}
      <div
        ref={scrollRef}
        className="space-y-5 max-h-[400px] overflow-y-auto pr-2 scroll-smooth"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#e2e8f0 transparent',
        }}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-7 h-7 text-slate-400" />
            </div>
            <p className="text-slate-500 font-bold text-sm">
              {streamEnded
                ? 'No messages were sent during this stream.'
                : 'No messages yet. Be the first to say something!'}
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className="flex items-start gap-3 group">
              <img
                src={msg.avatar || `https://i.pravatar.cc/150?u=${msg.userId}`}
                className="w-9 h-9 rounded-full border border-slate-200 shadow-sm shrink-0 mt-0.5"
                alt={msg.userName}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2.5 mb-0.5">
                  <p className="text-[14px] font-black text-[#111827] truncate">{msg.userName}</p>
                  <p className="text-[11px] font-bold text-slate-400 shrink-0">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <p className="text-[13px] font-medium text-slate-600 leading-relaxed break-words">
                  {msg.text}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Chat input */}
      {!streamEnded ? (
        <div className="bg-white border border-slate-200/80 rounded-full p-3 pl-6 flex items-center gap-4 shadow-lg">
          <Smile className="w-5 h-5 text-slate-400 cursor-pointer hover:text-rose-500 transition-colors shrink-0" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Send a message..."
            className="flex-1 bg-transparent text-sm font-bold text-[#111827] outline-none placeholder:text-slate-400"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-[#f87171] hover:bg-[#ef4444] disabled:bg-slate-200 disabled:text-slate-400 text-white px-6 py-2.5 rounded-full text-sm font-black shadow-md transition-all active:scale-95 shrink-0 flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
      ) : (
        <div className="bg-slate-100 rounded-full p-4 text-center">
          <p className="text-slate-500 font-bold text-sm">Chat is closed — this stream has ended.</p>
        </div>
      )}
    </div>
  )
}
