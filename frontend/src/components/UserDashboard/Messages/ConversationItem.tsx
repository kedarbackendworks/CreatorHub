import React from 'react';
import Image from 'next/image';

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  isUnread?: boolean;
}

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

export default function ConversationItem({ conversation, isActive, onClick }: ConversationItemProps) {
  return (
    <div 
      onClick={onClick}
      className={`flex gap-[12px] items-center px-[16px] py-[12px] relative shrink-0 w-full cursor-pointer transition-colors border-b border-[#e4ded2]/60 ${isActive ? 'bg-white border-l-4 border-l-[#f95c4b]' : 'hover:bg-[#faf8f5]'}`}
    >
      <div className="flex flex-col items-start overflow-hidden relative rounded-full shrink-0 w-[44px] h-[44px] border border-[#e4ded2] bg-[#f95c4b]/10 shadow-sm">
        <Image 
          src={conversation.avatar} 
          alt={conversation.name} 
          fill 
          className="object-cover"
        />
      </div>
      <div className="flex flex-[1_0_0] flex-col items-start min-w-0 relative">
        <div className="flex items-center justify-between relative shrink-0 w-full">
          <p className={`font-[family-name:var(--font-figtree)] ${conversation.isUnread ? 'font-semibold text-[#1a1a1a]' : 'font-semibold text-[#1a1a1a]'} relative shrink-0 text-[15px] truncate`}>
            {conversation.name}
          </p>
          {conversation.isUnread && (
            <div className="w-[8px] h-[8px] rounded-full bg-[#f95c4b] shrink-0" />
          )}
        </div>
        <div className="flex items-center relative shrink-0 w-full">
          <p className={`font-[family-name:var(--font-figtree)] font-normal leading-[1.35] relative shrink-0 ${conversation.isUnread ? 'text-[#3a3a3a]' : 'text-[#5a5a5a]'} text-[13px] truncate max-w-[90%]`}>
            {conversation.lastMessage}
          </p>
        </div>
      </div>
    </div>
  );
}
