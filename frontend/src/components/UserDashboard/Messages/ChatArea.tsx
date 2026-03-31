import React from 'react';
import Image from 'next/image';
import { Info, AlignLeft, Italic, Bold, Paperclip } from 'lucide-react';
import MessageBubble, { ChatMessage } from './MessageBubble';
import { Conversation } from './ConversationItem';

interface ChatAreaProps {
  conversation: Conversation;
  messages: ChatMessage[];
}

export default function ChatArea({ conversation, messages }: ChatAreaProps) {
  return (
    <div className="bg-[#f6f4f1] flex flex-col h-screen flex-1 relative min-w-0 overflow-hidden">
      {/* Header */}
      <div className="bg-[#faf8f5] border-b border-[#e4ded2] h-[68px] px-[24px] flex justify-between items-center shrink-0 w-full z-10 relative">
        <div className="flex items-center gap-[12px]">
          <div className="flex flex-col items-start overflow-hidden relative rounded-full shrink-0 w-[40px] h-[40px] border border-[#e4ded2] bg-[#f95c4b]/10 shadow-sm">
            <Image src={conversation.avatar} alt={conversation.name} fill className="object-cover" />
          </div>
          <div className="flex flex-col gap-[4px] items-start">
            <p className="font-[family-name:var(--font-fjalla)] text-[18px] text-[#1a1a1a] leading-none">
              {conversation.name}
            </p>
            <div className="flex items-center gap-[7px]">
              <div className="bg-[#289e11] rounded-full size-[8px]" />
              <p className="font-[family-name:var(--font-figtree)] text-[12px] text-[#5a5a5a]">
                Active
              </p>
            </div>
          </div>
        </div>
        <button className="w-[36px] h-[36px] rounded-full border border-[#e4ded2] bg-white text-[#5a5a5a] hover:text-[#f95c4b] hover:bg-[#faf8f5] flex items-center justify-center transition-colors shadow-sm">
          <Info className="w-[18px] h-[18px]" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-[24px] py-[20px] flex flex-col gap-[16px] z-0">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>

      {/* Input Area */}
      <div className="absolute bottom-[16px] left-[16px] right-[16px] bg-white border border-[#e4ded2] rounded-2xl shadow-sm z-20 flex flex-col justify-between px-[16px] pt-[12px] pb-[10px]">
        <textarea 
          placeholder="Write your message here"
          className="w-full resize-none outline-none font-[family-name:var(--font-figtree)] text-[15px] text-[#1a1a1a] placeholder:text-[#aaa] bg-transparent min-h-[52px] max-h-[140px]"
        />
        <div className="flex items-center justify-between mt-[8px]">
          <div className="flex items-center gap-[16px] text-[#aaa]">
            <button className="hover:text-[#5a5a5a] transition-colors"><AlignLeft className="w-[16px] h-[16px]" /></button>
            <button className="hover:text-[#5a5a5a] transition-colors"><Italic className="w-[16px] h-[16px]" /></button>
            <button className="hover:text-[#5a5a5a] transition-colors"><Bold className="w-[16px] h-[16px]" /></button>
            <button className="hover:text-[#5a5a5a] transition-colors"><Paperclip className="w-[16px] h-[16px]" /></button>
          </div>
          <button className="bg-[#f95c4b] hover:bg-[#ff6a5a] transition-colors rounded-full px-[24px] py-[8px] text-white font-[family-name:var(--font-figtree)] font-medium text-[14px] active:scale-95">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
